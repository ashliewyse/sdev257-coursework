import { StyleSheet, Text, View } from 'react-native';

// Reusable task row from the Part 1 lesson: the parent supplies the text.
// The blue shapes are decorative in Part 1; interaction is added in Part 2.
export default function Task({ text }) {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View accessible={false} style={styles.square} />
        <Text style={styles.itemText}>{text}</Text>
      </View>
      <View accessible={false} style={styles.circular} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  square: {
    width: 24,
    height: 24,
    flexShrink: 0,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: { flexShrink: 1, fontSize: 14, color: '#111111' },
  circular: {
    width: 12,
    height: 12,
    flexShrink: 0,
    marginLeft: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
});
