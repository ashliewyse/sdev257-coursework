const SEARCH_RADIUS = 3000;
const ENDPOINT = 'https://ovp.dresel.systems/api-na/interpreter';
// Public business coordinates verified on Google Maps; selected by Ashlie.
const CHOSEN_RESTAURANT = {
  id: 'chosen-tacos-on-20',
  name: 'Tacos on 20',
  coordinate: { latitude: 41.6806535, longitude: -86.9031008 },
  address: '429 US-20, Michigan City, IN 46360',
  cuisine: 'Mexican',
  isChosen: true,
};

export function validCoordinate(value) {
  return !!value && Number.isFinite(value.latitude) && Number.isFinite(value.longitude)
    && Math.abs(value.latitude) <= 90 && Math.abs(value.longitude) <= 180;
}

// Haversine distance is straight-line distance, not walking or driving distance.
export function distanceMeters(from, to) {
  const rad = (degrees) => degrees * Math.PI / 180;
  const lat = rad(to.latitude - from.latitude);
  const lon = rad(to.longitude - from.longitude);
  const a = Math.sin(lat / 2) ** 2
    + Math.cos(rad(from.latitude)) * Math.cos(rad(to.latitude)) * Math.sin(lon / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

export function selectRestaurant(data, position) {
  if (!validCoordinate(position) || !Array.isArray(data?.elements) || data.remark) {
    throw new Error('The restaurant service returned an incomplete response.');
  }
  const candidates = data.elements.flatMap((item) => {
    if (!item || item.tags?.amenity !== 'restaurant' || item.id == null) return [];
    // OSM points have lat/lon; areas and relations supply a center.
    const coordinate = {
      latitude: item.lat ?? item.center?.lat,
      longitude: item.lon ?? item.center?.lon,
    };
    if (!validCoordinate(coordinate)) return [];
    const distance = distanceMeters(position, coordinate);
    if (distance > SEARCH_RADIUS) return [];
    return [{
      id: `${item.type}/${item.id}`,
      name: typeof item.tags.name === 'string' && item.tags.name.trim()
        ? item.tags.name.trim() : 'Nearby restaurant',
      coordinate,
      distance,
      cuisine: typeof item.tags.cuisine === 'string' ? item.tags.cuisine.replace(/[_;]/g, ' ') : '',
    }];
  });
  candidates.sort((a, b) => a.distance - b.distance);
  return candidates[0] ?? null;
}

export async function findRestaurant(position, signal, timeoutMs = 25000) {
  if (!validCoordinate(position)) throw new Error('A valid GPS location is required.');
  if (signal?.aborted) throw new Error('Search cancelled.');
  const chosenDistance = distanceMeters(position, CHOSEN_RESTAURANT.coordinate);
  // Feature the chosen local restaurant only when it really is nearby.
  if (chosenDistance <= 15000) return { ...CHOSEN_RESTAURANT, distance: chosenDistance };
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, timeoutMs);
  try {
    // Only query on a user action, with a bounded radius and server timeout.
    const query = `[out:json][timeout:15];nwr["amenity"="restaurant"](around:${SEARCH_RADIUS},${position.latitude},${position.longitude});out center tags;`;
    const response = await fetch(`${ENDPOINT}?data=${encodeURIComponent(query)}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SDEV257-Geolocation-Coursework/1.0 (+https://snack.expo.dev/@justmeashlie/sdev257-geolocation---ashlie-wyse)',
      },
    });
    if (!response.ok) throw new Error(`Restaurant service HTTP ${response.status}`);
    return selectRestaurant(await response.json(), position);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
