const { test, before, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const React = require('react');
const { create, act } = require('react-test-renderer');
const { buildSync } = require('esbuild');
const nativePath = path.join(__dirname, 'native-mock.cjs');
const { __motion: motion } = require(nativePath);
global.IS_REACT_ACT_ENVIRONMENT = true;
let ItemDialog, renderer;
before(() => {
  buildSync({ entryPoints: [path.resolve(__dirname, '../components/ItemDialog.js')],
    outfile: path.join(__dirname, 'compiled-animation.cjs'), bundle: true,
    format: 'cjs', platform: 'node', loader: { '.js': 'jsx' }, jsx: 'automatic',
    external: ['react', 'react/jsx-runtime', nativePath], alias: { 'react-native': nativePath } });
  ItemDialog = require('./compiled-animation.cjs').default;
});
beforeEach(() => motion.reset());
afterEach(async () => { if (renderer) await act(async () => renderer.unmount()); renderer = null; });
async function render(item = null) {
  await act(async () => { renderer = create(React.createElement(ItemDialog, { item, onClose() {} })); });
}
async function update(item) {
  await act(async () => renderer.update(React.createElement(ItemDialog, { item, onClose() {} })));
}
async function show() {
  const modal = renderer.root.findByType('Modal');
  assert.equal(typeof modal.props.onShow, 'function', 'Entrance must wait for native presentation');
  await act(async () => modal.props.onShow());
}
function opacity() {
  const panel = renderer.root.findAllByType('AnimatedView').find(n => n.props.accessibilityViewIsModal);
  assert.ok(panel, 'Item content must have an animated presentation');
  return panel.props.style.flat().find(s => s.opacity !== undefined).opacity.value;
}

// Catches failing to cancel an old entrance or reset a repeated opening.
test('closing during entrance cancels stale animation and reopening reveals the new item', async () => {
  await render(); await update({ name: 'Tatooine' });
  assert.equal(opacity(), 0, 'Prepare the entrance before the modal is presented');
  await show();
  assert.equal(opacity(), 0);
  await update(null);
  assert.equal(renderer.root.findByType('Modal').props.visible, false);
  motion.finish();
  assert.equal(opacity(), 0, 'A cancelled animation must not change hidden content');
  await update({ name: 'Alderaan' }); await show(); motion.finish();
  assert.equal(opacity(), 1);
  const text = renderer.root.findAllByType('Text').map(n => n.children.join('')).join(' ');
  assert.match(text, /Alderaan/); assert.doesNotMatch(text, /Tatooine/);
  await update(null); await update({ name: 'Tatooine' });
  assert.equal(opacity(), 0, 'A completed entrance must reset before the next presentation');
  await show(); motion.finish(); assert.equal(opacity(), 1);
});

// Catches an invisible dialog when animation is skipped for accessibility.
test('Reduce Motion reveals content immediately without an animated entrance', async () => {
  motion.preference = true;
  await render({ name: 'A New Hope' }); await show();
  assert.equal(opacity(), 1);
  assert.equal(motion.jobs.length, 0);
});

// Catches a stale initial query overwriting a later accessibility change.
test('a newer Reduce Motion event wins over the delayed initial query', async () => {
  let resolvePreference;
  motion.query = new Promise(resolve => { resolvePreference = resolve; });
  await render();
  await act(async () => { motion.change(true); resolvePreference(false); });
  await update({ name: 'Death Star' }); await show();
  assert.equal(opacity(), 1); assert.equal(motion.jobs.length, 0);
});

// Catches a half-hidden card after a live accessibility change, and leaked listeners.
test('enabling Reduce Motion interrupts entrance and reveals the whole card', async () => {
  await render({ name: 'Rebel transport' }); await show();
  assert.equal(opacity(), 0);
  await act(async () => motion.change(true));
  assert.equal(opacity(), 1);
  await act(async () => renderer.unmount()); renderer = null;
  assert.equal(motion.listeners.size, 0);
});
