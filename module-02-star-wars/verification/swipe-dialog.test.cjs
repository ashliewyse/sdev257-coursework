const { test, before, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const React = require('react');
const { create, act } = require('react-test-renderer');
const { buildSync } = require('esbuild');

global.IS_REACT_ACT_ENVIRONMENT = true;
let ResourceList, renderer;
const page = (items, next = null) => ({ message: 'ok', results: items, next, total_records: 2 });
const response = json => ({ ok: true, json: async () => json });
before(() => {
  buildSync({ entryPoints: [path.resolve(__dirname, '../components/ResourceList.js')],
    outfile: path.join(__dirname, 'compiled-swipe.cjs'), bundle: true, format: 'cjs', platform: 'node',
    loader: { '.js': 'jsx' }, jsx: 'automatic', external: ['react', 'react/jsx-runtime'],
    alias: { 'react-native': path.join(__dirname, 'native-mock.cjs'),
      'react-native-gesture-handler': path.join(__dirname, 'swipe-native-mock.cjs') } });
  ResourceList = require('./compiled-swipe.cjs').default;
});
afterEach(async () => { if (renderer) await act(async () => renderer.unmount()); renderer = null; });
async function render(resource, fetcher) {
  global.fetch = fetcher;
  await act(async () => { renderer = create(React.createElement(ResourceList, { resource })); });
}
function modal() { return renderer.root.findByType('Modal'); }
function modalText() { return modal().findAllByType('Text').map(n => n.children.join('')).join('\n'); }
function rows() { return renderer.root.findAllByType('NativeSwipeable'); }
async function swipe(index, direction = 'left') {
  assert.ok(rows()[index], 'Every returned item must have a swipe action');
  await act(async () => rows()[index].props.onSwipeableOpen(direction));
}
async function close() {
  await act(async () => renderer.root.findAllByType('Pressable')
    .find(n => n.props.accessibilityLabel === 'Close item details').props.onPress());
}

for (const [resource, payload, expected] of [
  ['planets', page([{ uid: '1', name: 'Tatooine' }, { uid: '2', name: 'Alderaan' }]), 'Alderaan'],
  ['starships', page([{ uid: '9', name: 'Death Star' }, { uid: '10', name: 'Millennium Falcon' }]), 'Millennium Falcon'],
  ['films', { message: 'ok', result: [
    { uid: '1', properties: { title: 'A New Hope', episode_id: 4, release_date: '1977-05-25', director: 'George Lucas' } },
    { uid: '2', properties: { title: 'The Empire Strikes Back', episode_id: 5, release_date: '1980-05-17', director: 'Irvin Kershner' } }
  ] }, 'The Empire Strikes Back'],
]) {
  test(`${resource}: completing a swipe displays the selected item's text`, async () => {
    await render(resource, async () => response(payload));
    assert.equal(rows().length, 2, 'Each API row must be swipeable');
    await swipe(1);
    assert.equal(modal().props.visible, true);
    assert.match(modalText(), new RegExp(expected));
    if (resource === 'films') {
      assert.match(modalText(), /Episode 5 · 1980-05-17/);
      assert.match(modalText(), /Directed by Irvin Kershner/);
      assert.doesNotMatch(modalText(), /George Lucas/);
    }
  });
}

test('items stay inside the list ScrollView and appended items open the correct content', async () => {
  const next = 'https://www.swapi.tech/api/planets?page=2&limit=10';
  await render('planets', async url => response(url === next
    ? page([{ uid: '2', name: 'Alderaan' }]) : page([{ uid: '1', name: 'Tatooine' }], next)));
  const scroll = renderer.root.findAllByType('ScrollView').find(n => n.findAllByType('NativeSwipeable').length);
  assert.ok(scroll, 'Fetched items must be inside a ScrollView');
  await act(async () => renderer.root.findAllByType('TouchableOpacity')
    .find(n => n.props.accessibilityLabel === 'Load more').props.onPress());
  await swipe(1, 'right');
  assert.match(modalText(), /Alderaan/);
  assert.doesNotMatch(modalText(), /Tatooine/);
});

test('Close and native Back dismiss; another swipe reopens with fresh selection', async () => {
  await render('planets', async () => response(page([{ uid: '1', name: 'Tatooine' }, { uid: '2', name: 'Alderaan' }])));
  await swipe(0); await close(); assert.equal(modal().props.visible, false);
  await swipe(0, 'right'); assert.match(modalText(), /Tatooine/);
  await act(async () => modal().props.onRequestClose()); assert.equal(modal().props.visible, false);
  await swipe(1); assert.match(modalText(), /Alderaan/); assert.doesNotMatch(modalText(), /Tatooine/);
  assert.equal(rows().length, 2, 'Opening and closing never removes API rows');
});

test('long Unicode item text remains unchanged and scrolls separately from Close', async () => {
  const name = '<ship>船 🚀 & "Jedi"</ship> ' + 'A'.repeat(1600);
  await render('starships', async () => response(page([{ uid: '9', name }])));
  await swipe(0);
  assert.ok(modal().findAllByType('Text').some(n => n.children.join('') === name));
  const scroll = modal().findByType('ScrollView');
  assert.ok(scroll.findAllByType('Text').some(n => n.children.join('') === name));
  assert.equal(scroll.findAllByType('Pressable').length, 0, 'Close must not scroll away with the content');
  await close(); assert.equal(modal().props.visible, false);
});

test('the accessible tap alternative opens the same item dialog without a gesture', async () => {
  await render('planets', async () => response(page([{ uid: '1', name: 'Tatooine' }])));
  const target = renderer.root.findAllByType('Pressable').find(n => n.props.accessibilityLabel === 'View Tatooine');
  assert.ok(target, 'A labeled tap/keyboard alternative must be available');
  await act(async () => target.props.onPress());
  assert.equal(modal().props.visible, true); assert.match(modalText(), /Tatooine/);
});
