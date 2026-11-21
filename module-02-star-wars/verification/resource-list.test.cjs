const { test, before, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const React = require('react');
const { create, act } = require('react-test-renderer');
const { buildSync } = require('esbuild');
global.IS_REACT_ACT_ENVIRONMENT = true;
let ResourceList;
let renderer;
const base = 'https://www.swapi.tech/api/';
const page = (items, next = null, total = items.length) => ({ message:'ok', results:items, next, total_records:total });
const planet = (uid, name) => ({ uid, name, url: `${base}planets/${uid}` });
const response = (json, ok=true) => ({ ok, status:ok ? 200 : 503, json:async()=>json });
const rows = () => renderer.root.findAllByType('Pressable')
  .filter(n => n.props.accessibilityLabel?.startsWith('View '))
  .map(n => n.props.accessibilityLabel.slice(5));
const buttons = () => renderer.root.findAllByType('TouchableOpacity');
const button = label => buttons().find(node => node.props.accessibilityLabel === label);
const texts = () => renderer.root.findAllByType('Text').map(node => node.children.join('')).join(' ');
async function render(resource, fetcher) {
  global.fetch = fetcher;
  await act(async()=>{renderer=create(React.createElement(ResourceList,{resource}));});
}
async function press(label) {
  const target=button(label);
  assert.ok(target, `Expected a ${label} button`);
  await act(async()=>target.props.onPress());
}
before(()=>{
  buildSync({entryPoints:[path.resolve(__dirname,'../components/ResourceList.js')],
    outfile:path.join(__dirname,'compiled-list.cjs'),bundle:true,format:'cjs',platform:'node',
    loader:{'.js':'jsx'},jsx:'automatic',external:['react','react/jsx-runtime'],
    alias:{'react-native':path.join(__dirname,'native-mock.cjs'),
      'react-native-gesture-handler':path.join(__dirname,'swipe-native-mock.cjs')}});
  ResourceList=require('./compiled-list.cjs').default;
});
afterEach(async()=>{if(renderer) await act(async()=>renderer.unmount());renderer=null;});

test('loads the assigned planets endpoint and displays live response names', async()=>{
  const urls=[];
  await render('planets',async url=>{urls.push(url);return response(page([planet('1','Tatooine'),planet('2','Alderaan')],null,2));});
  assert.deepEqual(urls,[`${base}planets`]);
  assert.deepEqual(rows(),['Tatooine','Alderaan']);
  assert.match(texts(),/2 of 2/);
});
test('loads the starships endpoint without substituting a different resource', async()=>{
  const urls=[];
  await render('starships',async url=>{urls.push(url);return response(page([{uid:'9',name:'Death Star'}]));});
  assert.deepEqual(urls,[`${base}starships`]);
  assert.deepEqual(rows(),['Death Star']);
});
test('reads films from result and properties.title, including episode information', async()=>{
  await render('films',async()=>response({message:'ok',result:[{uid:'1',properties:{title:'A New Hope',episode_id:4,release_date:'1977-05-25',director:'George Lucas'}}]}));
  assert.deepEqual(rows(),['A New Hope']);
  assert.match(texts(),/Episode 4/);
  assert.match(texts(),/George Lucas/);
  assert.equal(button('Load more'),undefined);
});
test('shows a loading indicator while the initial network request is pending', async()=>{
  let finish;
  await render('planets',()=>new Promise(resolve=>{finish=resolve;}));
  assert.equal(renderer.root.findAllByType('ActivityIndicator').length,1);
  await act(async()=>finish(response(page([planet('1','Tatooine')]))));
  assert.equal(renderer.root.findAllByType('ActivityIndicator').length,0);
});
test('reports an initial HTTP failure and Retry loads the same endpoint', async()=>{
  let calls=0;
  await render('planets',async()=>++calls===1?response({},false):response(page([planet('1','Tatooine')])));
  assert.match(texts(),/Could not load/);
  assert.doesNotMatch(texts(),/0 of 0 loaded/);
  await press('Retry');
  assert.equal(calls,2);
  assert.deepEqual(rows(),['Tatooine']);
});
test('an empty valid response displays the empty state',async()=>{
  await render('films',async()=>response({message:'ok',result:[]}));
  assert.deepEqual(rows(),[]);
  assert.match(texts(),/No items/);
});
test('Load more appends the next page and deduplicates stable API IDs',async()=>{
  const next=`${base}planets?page=2&limit=10`;
  const urls=[];
  await render('planets',async url=>{urls.push(url);return response(url===next?page([planet('1','Tatooine'),planet('2','Alderaan')],null,2):page([planet('1','Tatooine')],next,2));});
  await press('Load more');
  assert.deepEqual(urls,[`${base}planets`,next]);
  assert.deepEqual(rows(),['Tatooine','Alderaan']);
  assert.equal(button('Load more'),undefined);
});
test('a failed next page preserves existing rows and retries that page',async()=>{
  const next=`${base}planets?page=2&limit=10`;let calls=0;
  await render('planets',async url=>{calls++;if(calls===2)throw Error('offline');return response(url===next?page([planet('2','Alderaan')],null,2):page([planet('1','Tatooine')],next,2));});
  await press('Load more');
  assert.deepEqual(rows(),['Tatooine']);
  await press('Retry');
  assert.deepEqual(rows(),['Tatooine','Alderaan']);
  assert.equal(calls,3);
});
test('malformed server data shows an error rather than a false empty list',async()=>{
  await render('films',async()=>response({message:'ok',result:{unexpected:true}}));
  assert.match(texts(),/Could not load/);
  assert.ok(button('Retry'));
});
test('unmount aborts the active request',async()=>{
  let signal;
  await render('planets',(_url,options)=>{signal=options.signal;return new Promise(()=>{});});
  assert.equal(signal.aborted,false);
  await act(async()=>renderer.unmount());renderer=null;
  assert.equal(signal.aborted,true);
});
