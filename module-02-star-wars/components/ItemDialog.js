import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function ItemDialog({ item, onClose }) {
  return (
    <Modal visible={item !== null} transparent animationType="fade" onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}>
      <View style={styles.overlay}>
        <View style={styles.dialog} accessibilityViewIsModal>
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
        </View>
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
