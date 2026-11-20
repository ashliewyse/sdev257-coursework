import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function LocationMap({ position, restaurant }) {
  const other = restaurant?.coordinate ?? position;
  // Use the short longitude span, including when crossing the date line.
  const longitudeSpan = ((other.longitude - position.longitude + 540) % 360) - 180;
  const region = {
    latitude: (position.latitude + other.latitude) / 2,
    longitude: ((position.longitude + longitudeSpan / 2 + 540) % 360) - 180,
    latitudeDelta: Math.max(Math.abs(position.latitude - other.latitude) * 2.8, 0.008),
    longitudeDelta: Math.max(Math.abs(longitudeSpan) * 2.8, 0.008),
  };
  return (
    <MapView
      key={`${position.latitude},${position.longitude},${restaurant?.id ?? 'locating'}`}
      style={styles.map}
      initialRegion={region}
      showsPointsOfInterest={false}
      toolbarEnabled={false}
      accessibilityLabel={restaurant ? 'Map showing your current location and one nearby restaurant' : 'Map showing your current location'}>
      <Marker
        identifier="current-location"
        coordinate={position}
        title="Your location"
        description="Current location reported by your device"
        pinColor="#2878b5"
      />
      {restaurant && (
        <Marker
          identifier="nearby-restaurant"
          coordinate={restaurant.coordinate}
          title={restaurant.name}
          description={`${Math.round(restaurant.distance)} m away in a straight line`}
          pinColor="#d15b3b"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({ map: { flex: 1, width: '100%' } });
