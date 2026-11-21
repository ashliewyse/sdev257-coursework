import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, Modal, Platform, Pressable,
  ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function ItemDialog({ item, onClose }) {
  const progress = useRef(new Animated.Value(1)).current;
  const entrance = useRef(null);
  // Keep content still until the device preference is known.
  const reduceMotion = useRef(true);
  const visible = useRef(false);
  visible.current = item !== null;

  useEffect(() => {
    let active = true;
    let preferenceChanged = false;
    function applyPreference(enabled) {
      reduceMotion.current = enabled;
      if (enabled) {
        entrance.current?.stop();
        progress.setValue(1);
      } else if (!visible.current) {
        progress.setValue(0);
      }
    }
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', enabled => {
      preferenceChanged = true;
      applyPreference(enabled);
    });
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      if (active && !preferenceChanged) applyPreference(enabled);
    }).catch(() => {}); // If the setting cannot be read, keep the still presentation.
    return () => {
      active = false;
      subscription.remove();
      entrance.current?.stop();
    };
  }, [progress]);

  useEffect(() => {
    // Reset while hidden, before the next native presentation, to avoid a flash.
    if (item === null) progress.setValue(reduceMotion.current ? 1 : 0);
    return () => entrance.current?.stop();
  }, [item, progress]);

  function showEntrance() {
    if (!item) return;
    entrance.current?.stop();
    progress.setValue(reduceMotion.current ? 1 : 0);
    if (reduceMotion.current) return;
    // Module 05: fade and gently zoom the selected item's card into focus.
    // onShow starts this only after the native modal is ready to display it.
    entrance.current = Animated.timing(progress, {
      toValue: 1, duration: 240, easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    entrance.current.start();
  }

  return (
    <Modal visible={item !== null} transparent animationType="none" onRequestClose={onClose}
      onShow={showEntrance}
      supportedOrientations={['portrait', 'landscape']}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.dialog, { opacity: progress,
          transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }]}
          accessibilityViewIsModal>
          <Text style={styles.title} accessibilityRole="header">Item details</Text>
          {/* Content can scroll independently; the Close button stays visible. */}
          <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
            <Text selectable style={styles.name}>{item?.name ?? ''}</Text>
            {item?.episode != null && (
              <Text selectable style={styles.detail}>Episode {item.episode} · {item.releaseDate}</Text>
            )}
            {item?.director && <Text selectable style={styles.detail}>Directed by {item.director}</Text>}
          </ScrollView>
          <Pressable accessibilityRole="button" accessibilityLabel="Close item details"
            onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.72)' },
  dialog: { width: '100%', maxWidth: 460, maxHeight: '85%', padding: 24,
    backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 16 },
  content: { flexGrow: 0, flexShrink: 1 },
  contentPadding: { paddingBottom: 4 },
  name: { color: colors.accent, fontSize: 20, lineHeight: 28 },
  detail: { color: colors.text, fontSize: 15, lineHeight: 23, marginTop: 10 },
  button: { minHeight: 48, marginTop: 24, backgroundColor: colors.accent, borderRadius: 8,
    paddingHorizontal: 18, paddingVertical: 13, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: colors.background, fontSize: 15, fontWeight: '700' },
});
