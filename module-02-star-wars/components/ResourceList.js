import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme';
import SwipeableResourceRow from './SwipeableResourceRow';
import ItemDialog from './ItemDialog';

const BASE_URL = 'https://www.swapi.tech/api/';

// Films use result/properties; planets and starships use results/name.
function readPage(data) {
  const results = data.results ?? data.result;
  if (data.message !== 'ok' || !Array.isArray(results)) {
    throw new Error('Unexpected API response');
  }

  const items = results.map((entry) => {
    const properties = entry.properties ?? entry;
    const name = properties.title ?? properties.name;
    if (entry.uid == null || typeof name !== 'string' || !name.trim()) {
      throw new Error('An API item is missing its ID or name');
    }
    return {
      id: String(entry.uid),
      name,
      episode: properties.episode_id,
      releaseDate: properties.release_date,
      director: properties.director,
    };
  });

  return {
    items,
    next: typeof data.next === 'string' ? data.next : null,
    total: Number.isInteger(data.total_records) ? data.total_records : items.length,
  };
}

export default function ResourceList({ resource }) {
  const [items, setItems] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [request, setRequest] = useState({
    url: `${BASE_URL}${resource}`,
    append: false,
  });

  useEffect(() => {
    let active = true;
    let timedOut = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 20000);

    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(request.url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const page = readPage(await response.json());
        if (!active) return;

        setItems((current) => {
          const combined = request.append ? [...current, ...page.items] : page.items;
          // Stable API IDs prevent duplicate rows if pages overlap.
          return [...new Map(combined.map((item) => [item.id, item])).values()];
        });
        setNextUrl(page.next);
        setTotal(page.total);
      } catch {
        if (active) {
          setError(timedOut
            ? 'Could not load the list in time. Please try again.'
            : 'Could not load the list. Check your connection and try again.');
        }
      } finally {
        clearTimeout(timeout);
        if (active) setLoading(false);
      }
    }

    load();
    // Ignore a late response after leaving or replacing this list.
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [request]);

  function retry() {
    setRequest((current) => ({ ...current }));
  }

  function loadMore() {
    if (!loading && nextUrl) setRequest({ url: nextUrl, append: true });
  }

  function showItem(item) {
    Keyboard.dismiss();
    setSelectedItem(item);
  }

  return (
    <>
    <ScrollView
      style={styles.list}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag">
        <Text style={styles.summary} accessibilityLiveRegion="polite">
          {loading && items.length === 0
            ? 'Loading from SWAPI...'
            : total === null ? 'Live data from SWAPI' : `${items.length} of ${total} loaded`}
        </Text>
        {items.length > 0 && <Text style={styles.hint}>Swipe left or right, or tap an item to view details.</Text>}
        {items.map((item) => (
          <SwipeableResourceRow key={item.id} item={item} onSelect={showItem} />
        ))}
      {items.length === 0 && !loading && !error ? (
        <Text style={styles.message}>No items were returned.</Text>
      ) : null}
        <View style={styles.footer}>
          {loading && <ActivityIndicator color={colors.accent} accessibilityLabel="Loading list" />}
          {!!error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
          {!loading && (error || nextUrl) ? (
            <TouchableOpacity
              style={styles.button}
              accessibilityRole="button"
              accessibilityLabel={error ? 'Retry' : 'Load more'}
              onPress={error ? retry : loadMore}>
              <Text style={styles.buttonText}>{error ? 'Retry' : 'Load more'}</Text>
            </TouchableOpacity>
          ) : null}
          {!loading && !error && !nextUrl && items.length > 0 && (
            <Text style={styles.message}>All items loaded</Text>
          )}
        </View>
    </ScrollView>
    <ItemDialog item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: { paddingHorizontal: 24, paddingBottom: 24 },
  summary: { color: colors.muted, fontSize: 13, marginTop: 8, marginBottom: 20 },
  hint: { color: colors.muted, fontSize: 13, lineHeight: 20, marginBottom: 14 },
  footer: { paddingTop: 8, paddingBottom: 12, alignItems: 'center' },
  message: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  error: { color: '#ffb4b4', fontSize: 14, lineHeight: 22, marginBottom: 12, textAlign: 'center' },
  button: { backgroundColor: colors.accent, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 8, minHeight: 48 },
  buttonText: { color: colors.background, fontSize: 15, fontWeight: '700' },
});
