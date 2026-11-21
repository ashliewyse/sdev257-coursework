const {test,before,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const React=require('react');
const {create,act}=require('react-test-renderer');
const {buildSync}=require('esbuild');
global.IS_REACT_ACT_ENVIRONMENT=true;
let SearchDialog,renderer;
before(()=>{
  buildSync({entryPoints:[path.resolve(__dirname,'../components/SearchDialog.js')],outfile:path.join(__dirname,'compiled-search.cjs'),bundle:true,format:'cjs',platform:'node',loader:{'.js':'jsx'},jsx:'automatic',external:['react','react/jsx-runtime'],alias:{'react-native':path.join(__dirname,'native-mock.cjs')}});
  SearchDialog=require('./compiled-search.cjs').default;
});
afterEach(async()=>{if(renderer)await act(async()=>renderer.unmount());renderer=null;});
async function mount(name='Planets') {await act(async()=>{renderer=create(React.createElement(SearchDialog,{screenName:name}));});}
function input(){const nodes=renderer.root.findAllByType('TextInput');assert.equal(nodes.length,1,'A search input must be available');return nodes[0];}
function modal(){return renderer.root.findByType('Modal');}
function button(label){const node=renderer.root.findAllByType('Pressable').find(n=>n.props.accessibilityLabel===label);assert.ok(node,`Missing ${label} button`);return node;}
async function type(text){await act(async()=>input().props.onChangeText(text));}
async function submit(){await act(async()=>button('Search').props.onPress());}
function shownText(){return modal().findAllByType('Text').map(n=>n.children.join(''));}

test('typing updates the controlled input without opening a dialog',async()=>{
  await mount();assert.equal(input().props.value,'');await type('Luke');
  assert.equal(input().props.value,'Luke');assert.equal(modal().props.visible,false);
});
test('Search displays the exact submitted term without starting a network search',async()=>{
  let requests=0;global.fetch=async()=>{requests++;throw Error('Search must not fetch');};
  await mount();await type('  R2-D2 & C-3PO  ');await submit();
  assert.equal(modal().props.visible,true);assert.ok(shownText().includes('  R2-D2 & C-3PO  '));assert.equal(requests,0);
});
test('keyboard submission opens the same text preview',async()=>{
  await mount('Films');await type('A New Hope');await act(async()=>input().props.onSubmitEditing({nativeEvent:{text:'A New Hope'}}));
  assert.equal(modal().props.visible,true);assert.ok(shownText().includes('A New Hope'));
});
test('blank input is disabled and keyboard whitespace submission stays closed',async()=>{
  await mount();input();assert.equal(button('Search').props.disabled,true);
  await type('   ');await act(async()=>input().props.onSubmitEditing({nativeEvent:{text:'   '}}));assert.equal(modal().props.visible,false);
  await type('Tatooine');assert.equal(button('Search').props.disabled,false);
});
test('Close preserves editable input and a second submission replaces the old text',async()=>{
  await mount();await type('Luke');await submit();await act(async()=>button('Close search preview').props.onPress());
  assert.equal(modal().props.visible,false);assert.equal(input().props.value,'Luke');
  await type('Leia');await submit();assert.ok(shownText().includes('Leia'));assert.ok(!shownText().includes('Luke'));
});
test('Android Back closes the dialog',async()=>{
  await mount();await type('Falcon');await submit();await act(async()=>modal().props.onRequestClose());
  assert.equal(modal().props.visible,false);
});
test('keyboard submit uses the final native value even before state catches up',async()=>{
  await mount();
  await act(async()=>input().props.onSubmitEditing({nativeEvent:{text:'Luke Skywalker'}}));
  assert.equal(modal().props.visible,true);assert.ok(shownText().includes('Luke Skywalker'));
  await act(async()=>button('Close search preview').props.onPress());
  assert.equal(input().props.value,'Luke Skywalker');
});
test('long Unicode and HTML-like input is displayed unchanged as text',async()=>{
  const value='<script>船 🚀 & "Jedi"</script> '+ 'A'.repeat(1500);
  await mount();await type(value);await submit();assert.ok(shownText().includes(value));
  assert.ok(button('Close search preview'));
});
test('mounted screen instances keep independent search terms',async()=>{
  await act(async()=>{renderer=create(React.createElement(React.Fragment,null,
    React.createElement(SearchDialog,{screenName:'Planets'}),React.createElement(SearchDialog,{screenName:'Films'})));});
  let fields=renderer.root.findAllByType('TextInput');assert.equal(fields.length,2);
  await act(async()=>fields[0].props.onChangeText('Naboo'));
  fields=renderer.root.findAllByType('TextInput');assert.equal(fields[0].props.value,'Naboo');assert.equal(fields[1].props.value,'');
});
