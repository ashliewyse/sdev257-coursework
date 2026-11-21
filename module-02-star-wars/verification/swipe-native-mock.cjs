// Node has no native gesture recognizer. Tests drive its documented open callback;
// actual touch recognition and vertical scrolling are checked in Expo previews.
const React = require('react');
exports.Swipeable = React.forwardRef(function NativeSwipeable(props, ref) {
  React.useImperativeHandle(ref, () => ({ reset() {}, close() {} }));
  return React.createElement('NativeSwipeable', props, props.children);
});
