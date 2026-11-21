const { test, before, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const React = require('react');
const { create, act } = require('react-test-renderer');
const { buildSync } = require('esbuild');
global.IS_REACT_ACT_ENVIRONMENT = true;
let LazyHeaderImage, renderer;
before(() => {
  buildSync({ entryPoints: [path.resolve(__dirname, '../components/LazyHeaderImage.js')],
    outfile: path.join(__dirname, 'compiled-image.cjs'), bundle: true, format: 'cjs', platform: 'node',
    loader: { '.js': 'jsx' }, jsx: 'automatic', external: ['react', 'react/jsx-runtime'],
    alias: { 'react-native': path.join(__dirname, 'native-mock.cjs') } });
  LazyHeaderImage = require('./compiled-image.cjs').default;
});
afterEach(async () => { if (renderer) await act(async () => renderer.unmount()); renderer = null; });
async function render(active) {
  await act(async () => { renderer = create(React.createElement(LazyHeaderImage, { active })); });
}
async function focus(active) {
  await act(async () => renderer.update(React.createElement(LazyHeaderImage, { active })));
}
async function layout(width = 320, height = 128) {
  const handler = renderer.root.findAllByType('View').find(n => n.props.onLayout)?.props.onLayout;
  if (handler) await act(async () => handler({ nativeEvent: { layout: { width, height } } }));
}
function images() { return renderer.root.findAllByType('Image'); }
function busy() { return renderer.root.findAllByType('ActivityIndicator').length; }
function retry() { return renderer.root.findAllByType('Pressable').find(n => n.props.accessibilityLabel === 'Retry header image'); }

// Break caught: providing a URI before focus or before the image has a visible layout.
test('an unfocused screen defers its image until focus and positive layout', async () => {
  await render(false); await layout(); assert.equal(images().length, 0);
  await focus(true); assert.equal(images().length, 1);
  assert.match(images()[0].props.source.uri, /^https:\/\//);
});
test('a focused screen still waits for nonzero layout before loading', async () => {
  await render(true); assert.equal(images().length, 0);
  await layout(0, 128); assert.equal(images().length, 0);
  await layout(); assert.equal(images().length, 1); assert.equal(busy(), 1);
});

// Break caught: refocusing reinitializes a successful image or leaves the loading indicator visible.
test('successful image remains available across screen revisits without restarting loading', async () => {
  await render(true); await layout(); assert.equal(images().length, 1);
  const first = images()[0];
  await act(async () => first.props.onLoad()); assert.equal(busy(), 0);
  await focus(false); await focus(true);
  assert.equal(images()[0], first); assert.equal(busy(), 0);
});

// Break caught: an error spins forever, retry is missing, or an old request completes the new attempt.
test('failed image offers Retry and ignores late callbacks from the failed attempt', async () => {
  await render(true); await layout(); assert.equal(images().length, 1);
  const old = images()[0].props;
  await act(async () => old.onError());
  assert.equal(busy(), 0); assert.ok(retry());
  await act(async () => retry().props.onPress());
  assert.equal(images().length, 1); assert.equal(busy(), 1);
  await act(async () => { old.onLoad(); old.onError(); });
  assert.equal(busy(), 1); assert.equal(retry(), undefined);
  await act(async () => images()[0].props.onLoad());
  assert.equal(busy(), 0); assert.equal(retry(), undefined);
});
