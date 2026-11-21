import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
// Use the existing root package so Snack does not bundle Gesture Handler twice.
import { Swipeable } from 'react-native-gesture-handler';
import { colors } from '../theme';

export default function SwipeableResourceRow({ item, onSelect }) {
  const row = useRef(null);

  function openItem() {
    // Return the row to its resting position so it can be swiped again after Close.
    row.current?.reset();
    onSelect(item);
  }

  function renderAction() {
    return <View style={styles.action}><Text style={styles.actionText}>View</Text></View>;
  }

  return (
    <Swipeable ref={row} containerStyle={styles.container}
      renderLeftActions={renderAction} renderRightActions={renderAction}
      leftThreshold={48} rightThreshold={48} friction={1}
      overshootLeft={false} overshootRight={false}
      enableTrackpadTwoFingerGesture onSwipeableOpen={openItem}>
      <Pressable onPress={openItem} accessibilityRole="button"
        accessibilityLabel={`View ${item.name}`}
        accessibilityHint="Opens this item's details. You can also swipe left or right."
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <Text style={styles.name}>{item.name}</Text>
        {item.episode != null && (
          <Text style={styles.detail}>Episode {item.episode} · {item.releaseDate}</Text>
        )}
        {item.director && <Text style={styles.detail}>Directed by {item.director}</Text>}
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12, borderRadius: 10, overflow: 'hidden' },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderLeftWidth: 3, borderLeftColor: colors.accent, borderRadius: 10, padding: 18, minHeight: 60 },
  pressed: { opacity: 0.8 },
  name: { color: colors.text, fontSize: 17, fontWeight: '600', lineHeight: 24 },
  detail: { color: colors.muted, fontSize: 13, marginTop: 6, lineHeight: 20 },
  action: { width: 96, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: colors.background, fontSize: 15, fontWeight: '700' },
});
