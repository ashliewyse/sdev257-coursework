import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

// DSS image of the star field around M83, hosted by NASA Science (credit in README).
const IMAGE_URI = 'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/releases/2009/11/STScI-01EVT5CN2R8S6WGXG1QJD9XN62.tif?w=800';

export default function LazyHeaderImage({ active }) {
  const [laidOut, setLaidOut] = useState(false);
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState('idle');
  const [attempt, setAttempt] = useState(0);
  const currentAttempt = useRef(0);

  useEffect(() => {
    if (active && laidOut && !started) {
      setStatus('loading');
      setStarted(true);
    }
  }, [active, laidOut, started]);

  function finish(nextStatus) {
    // A late native event from an earlier failed request must not finish Retry.
    if (attempt !== currentAttempt.current) return;
    setStatus(current => current === 'loading' ? nextStatus : current);
  }

  function retry() {
    currentAttempt.current += 1;
    setAttempt(currentAttempt.current);
    setStatus('loading');
  }

  return (
    <View style={styles.frame} onLayout={({ nativeEvent: { layout } }) => {
      setLaidOut(layout.width > 0 && layout.height > 0);
    }}>
      {/* No Image or URI is mounted until this screen is focused and laid out. */}
      {started && status !== 'error' && (
        <Image key={attempt} source={{ uri: IMAGE_URI }} resizeMode="cover"
          style={[styles.image, { opacity: status === 'loaded' ? 1 : 0 }]}
          accessibilityLabel="Star field surrounding the spiral galaxy M83"
          onLoad={() => finish('loaded')} onError={() => finish('error')} />
      )}
      {status === 'loading' && (
        <View style={styles.status}>
          <ActivityIndicator color={colors.accent} accessibilityLabel="Loading space banner" />
        </View>
      )}
      {status === 'error' && (
        <View style={styles.status}>
          <Pressable onPress={retry} accessibilityRole="button"
            accessibilityLabel="Retry header image" style={styles.retry}>
            <Text style={styles.retryText}>Retry image</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
    backgroundColor: colors.surface },
  image: { width: '100%', height: '100%' },
  status: { position: 'absolute', right: 12, bottom: 10 },
  retry: { minHeight: 44, paddingHorizontal: 12, justifyContent: 'center',
    borderRadius: 8, backgroundColor: colors.accent },
  retryText: { color: colors.background, fontSize: 12, fontWeight: '700' },
});
