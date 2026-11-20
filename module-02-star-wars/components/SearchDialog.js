import { useState } from 'react';
import { Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';

// Each screen gets its own input and a snapshot of the last submitted text.
export default function SearchDialog({ screenName }) {
  const [query, setQuery] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [visible, setVisible] = useState(false);
  const blank = query.trim().length === 0;

  function submit(text) {
    if (!text.trim()) return;
    Keyboard.dismiss();
    setQuery(text);
    setSubmittedText(text);
    setVisible(true);
  }

  function close() {
    setVisible(false);
  }

  return (
    <View style={styles.search}>
      <Text style={styles.label}>Search {screenName}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          accessibilityLabel={`Search ${screenName}`}
          accessibilityHint="Enter a term, then submit to preview it."
          placeholder="Enter a search term"
          placeholderTextColor={colors.muted}
          selectionColor={colors.accent}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={({ nativeEvent }) => submit(nativeEvent.text)}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Search"
          accessibilityState={{ disabled: blank }} disabled={blank} onPress={() => submit(query)}
          style={[styles.button, blank && styles.disabled]}>
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={close}
        supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.overlay}>
          <View style={styles.dialog} accessibilityViewIsModal>
            <Text style={styles.label}>{screenName}</Text>
            <Text style={styles.title} accessibilityRole="header">Search term</Text>
            <ScrollView style={styles.termArea} contentContainerStyle={styles.termContent}>
              <Text selectable style={styles.term}>{submittedText}</Text>
            </ScrollView>
            <Text style={styles.note}>Preview only. This does not filter the list yet.</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close search preview"
              onPress={close} style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  search: { marginHorizontal: 24, marginTop: 18, marginBottom: 12 },
  label: { color: colors.muted, fontSize: 13, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: { flex: 1, minWidth: 0, minHeight: 48, borderWidth: 1, borderColor: colors.border,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, color: colors.text,
    backgroundColor: colors.surface, fontSize: 16 },
  button: { minHeight: 48, backgroundColor: colors.accent, borderRadius: 8,
    paddingHorizontal: 18, paddingVertical: 13, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: colors.background, fontSize: 15, fontWeight: '700' },
  disabled: { opacity: 0.45 },
  overlay: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.72)' },
  dialog: { width: '100%', maxWidth: 460, maxHeight: '85%', padding: 24,
    backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 16 },
  termArea: { flexGrow: 0, flexShrink: 1 },
  termContent: { paddingBottom: 4 },
  term: { color: colors.accent, fontSize: 20, lineHeight: 28 },
  note: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 16, marginBottom: 20 },
});
