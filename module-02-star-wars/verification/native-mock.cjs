const React = require('react');
for (const name of ['View','Text','TouchableOpacity','ActivityIndicator','TextInput','Pressable','Modal','ScrollView']) exports[name] = name;
exports.Keyboard = { dismiss() {} };
exports.StyleSheet = { create: styles => styles };
exports.Platform = { OS: 'ios' };
const motion = exports.__motion = {
  jobs: [], listeners: new Set(), preference: false, query: null,
  change(value) { for (const listener of this.listeners) listener(value); },
  finish() { for (const job of this.jobs) if (!job.stopped) job.value.setValue(job.config.toValue); },
  reset() { this.jobs = []; this.listeners.clear(); this.preference = false; this.query = null; },
};
class AnimatedValue {
  constructor(value) { this.value = value; }
  setValue(value) { this.value = value; }
  interpolate(config) { return { source: this, config }; }
}
exports.Animated = {
  View: 'AnimatedView', Value: AnimatedValue,
  timing(value, config) {
    const job = { value, config, stopped: false,
      start() { motion.jobs.push(job); }, stop() { job.stopped = true; } };
    return job;
  },
};
exports.Easing = { cubic: t => t * t * t, out: easing => t => 1 - easing(1 - t) };
exports.AccessibilityInfo = {
  isReduceMotionEnabled: () => motion.query ?? Promise.resolve(motion.preference),
  addEventListener(name, listener) {
    if (name !== 'reduceMotionChanged') throw new Error('Unexpected accessibility event');
    motion.listeners.add(listener);
    return { remove() { motion.listeners.delete(listener); } };
  },
};
exports.FlatList = function FlatList(props) {
  const rows = props.data.map((item, index) => React.createElement(React.Fragment,
    { key: props.keyExtractor(item) }, props.renderItem({ item, index })));
  return React.createElement('FlatList', props,
    props.ListHeaderComponent,
    rows.length ? rows : props.ListEmptyComponent,
    props.ListFooterComponent);
};
