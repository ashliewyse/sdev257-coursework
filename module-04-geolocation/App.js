import { ActivityIndicator, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LocationMap from './LocationMap';
import useNearby from './useNearby';

function NearbyScreen() {
  const { position, restaurant, phase, error, findLocation, retrySearch } = useNearby();
  const busy = phase === 'locating' || phase === 'searching';
  const isWeb = Platform.OS === 'web';
  const compact = useWindowDimensions().height < 500;
  const distance = restaurant && (restaurant.distance < 1000
    ? `${Math.round(restaurant.distance)} m` : `${(restaurant.distance / 1000).toFixed(1)} km`);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, compact && styles.compactHeader]}>
        {!compact && <Text style={styles.eyebrow}>MODULE 04 · GEOLOCATION</Text>}
        <Text style={[styles.title, compact && styles.compactTitle]}>Nearby</Text>
        {!compact && <Text style={styles.subtitle}>Your location. One nearby restaurant.</Text>}
      </View>

      <View style={[styles.mapFrame, compact && styles.compactMap]}>
        {position ? <LocationMap position={position} restaurant={restaurant} /> : (
          <View style={styles.placeholder}>
            <View style={styles.locationBadge}><Text style={styles.locationSymbol}>◎</Text></View>
            <Text style={styles.placeholderTitle}>{isWeb ? 'Open the native map' : 'Start with your location'}</Text>
            <Text style={styles.placeholderText}>
              {isWeb
                ? 'Select iOS or Android above, then Launch Snack. On your phone, open this project in Expo Go.'
                : 'See Tacos on 20 when you are nearby in Michigan City, or find a restaurant within 3 km elsewhere. Tap a pin for details.'}
            </Text>
          </View>
        )}
      </View>

      <ScrollView style={[styles.panel, compact && styles.compactPanel]} contentContainerStyle={styles.panelContent}>
        {position && (
          <View style={styles.legend}>
            <Text style={styles.legendText}><Text style={styles.blue}>● </Text>Your location</Text>
            {restaurant && <Text style={styles.legendText}><Text style={styles.orange}>● </Text>Restaurant</Text>}
          </View>
        )}
        {restaurant && (
          <View style={styles.restaurantCard}>
            <Text style={styles.eyebrow}>{restaurant.isChosen ? 'YOUR LOCAL PICK' : 'NEARBY RESTAURANT'}</Text>
            <Text accessibilityRole="header" style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.subtitle}>{distance} away · straight-line distance</Text>
            {!!restaurant.address && <Text style={styles.cuisine}>{restaurant.address}</Text>}
            {!!restaurant.cuisine && <Text style={styles.cuisine}>{restaurant.cuisine}</Text>}
          </View>
        )}
        {busy && (
          <View style={styles.loading} accessibilityLiveRegion="polite">
            <ActivityIndicator color="#184e43" />
            <Text style={styles.loadingText}>{phase === 'locating' ? 'Getting your GPS location…' : 'Looking for a nearby restaurant…'}</Text>
          </View>
        )}
        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        {!isWeb && (
          <>
            {!!error && !!position && (
              <Pressable accessibilityRole="button" onPress={retrySearch} disabled={busy} style={styles.secondaryButton}>
                <Text style={styles.secondaryText}>Retry restaurant search</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: busy }}
              onPress={findLocation}
              disabled={busy}
              style={[styles.button, busy && styles.buttonDisabled]}>
              <Text style={styles.buttonText}>{busy ? 'Please wait…' : position ? 'Refresh my location' : 'Find my location'}</Text>
            </Pressable>
            <Text style={styles.privacy}>
              Uses GPS with your permission. If an automatic search is needed, coordinates go to the Overpass service at dresel.systems. Apple or Google provides the map. This app does not save your location.
            </Text>
          </>
        )}
        {isWeb && <Text style={styles.webNote}>This assignment uses native phone GPS and map views. The Web preview is a launch guide; use iOS, Android, or Expo Go for the working map.</Text>}
        <Text style={styles.credit}>Restaurant data © OpenStreetMap contributors · availability may vary</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return <SafeAreaProvider><NearbyScreen /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f6f3' },
  header: { paddingHorizontal: 22, paddingTop: 14, paddingBottom: 16 },
  compactHeader: { paddingTop: 4, paddingBottom: 4 },
  compactTitle: { fontSize: 22, marginVertical: 0 },
  compactMap: { minHeight: 80 },
  compactPanel: { maxHeight: '60%' },
  eyebrow: { color: '#3a6e60', fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },
  title: { fontSize: 32, fontWeight: '800', color: '#143b34', marginVertical: 4 },
  subtitle: { color: '#51655e', fontSize: 13, lineHeight: 19 },
  mapFrame: { flex: 1, minHeight: 200, marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', backgroundColor: '#e3ece5', borderColor: '#d5e1d8', borderWidth: 1 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  locationBadge: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#c9dfd1', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  locationSymbol: { color: '#184e43', fontSize: 44, lineHeight: 54 },
  placeholderTitle: { color: '#143b34', fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 9 },
  placeholderText: { color: '#51655e', fontSize: 14, lineHeight: 21, textAlign: 'center', maxWidth: 420 },
  panel: { flexGrow: 0, maxHeight: '43%' },
  panelContent: { padding: 18, paddingTop: 14 },
  legend: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  legendText: { fontSize: 12, color: '#51655e' },
  blue: { color: '#2878b5' },
  orange: { color: '#d15b3b' },
  restaurantCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12 },
  restaurantName: { color: '#143b34', fontSize: 20, fontWeight: '700', marginTop: 5, marginBottom: 3 },
  cuisine: { color: '#51655e', fontSize: 12, marginTop: 4 },
  loading: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  loadingText: { flex: 1, color: '#184e43', marginLeft: 10, fontSize: 13 },
  error: { color: '#9d3326', fontSize: 13, lineHeight: 19, marginBottom: 12 },
  button: { backgroundColor: '#184e43', borderRadius: 12, minHeight: 48, alignItems: 'center', justifyContent: 'center', padding: 14 },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: { borderWidth: 1, borderColor: '#184e43', borderRadius: 12, minHeight: 46, justifyContent: 'center', alignItems: 'center', padding: 10, marginBottom: 10 },
  secondaryText: { color: '#184e43', fontWeight: '700', fontSize: 14 },
  privacy: { fontSize: 11, lineHeight: 16, color: '#617269', marginTop: 10 },
  webNote: { fontSize: 13, lineHeight: 20, color: '#51655e' },
  credit: { fontSize: 10, lineHeight: 15, color: '#617269', marginTop: 9 },
});
