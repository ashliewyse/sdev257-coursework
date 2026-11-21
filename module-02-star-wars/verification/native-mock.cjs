const React = require('react');
for (const name of ['View','Text','TouchableOpacity','ActivityIndicator','TextInput','Pressable','Modal','ScrollView']) exports[name] = name;
exports.Keyboard = { dismiss() {} };
exports.StyleSheet = { create: styles => styles };
exports.FlatList = function FlatList(props) {
  const rows = props.data.map((item, index) => React.createElement(React.Fragment,
    { key: props.keyExtractor(item) }, props.renderItem({ item, index })));
  return React.createElement('FlatList', props,
    props.ListHeaderComponent,
    rows.length ? rows : props.ListEmptyComponent,
    props.ListFooterComponent);
};
