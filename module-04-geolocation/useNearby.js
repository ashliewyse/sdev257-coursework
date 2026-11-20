import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { findRestaurant, validCoordinate } from './nearby';

async function currentPosition() {
  let timeout;
  try {
    return await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error('GPS took too long. Try again outdoors or check your simulator location.')), 20000);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}

export default function useNearby() {
  const [position, setPosition] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [error, setError] = useState('');
  const mounted = useRef(true);
  const busy = useRef(false);
  const sequence = useRef(0);
  const controller = useRef(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      sequence.current += 1;
      controller.current?.abort();
    };
  }, []);

  const active = (id) => mounted.current && sequence.current === id;

  async function search(point, id) {
    if (!active(id)) return;
    setPhase('searching');
    controller.current?.abort();
    controller.current = new AbortController();
    try {
      const result = await findRestaurant(point, controller.current.signal);
      if (!active(id)) return;
      setRestaurant(result);
      setError(result ? '' : 'No mapped restaurant was found within 3 km. Your location is still shown.');
      setPhase('ready');
    } catch {
      if (!active(id)) return;
      setError('The restaurant search is unavailable. Check your connection and retry the search. Your location is still shown.');
      setPhase('error');
    }
  }

  async function findLocation() {
    if (busy.current || !mounted.current) return;
    busy.current = true;
    const id = ++sequence.current;
    setError('');
    setRestaurant(null);
    setPosition(null);
    setPhase('locating');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!active(id)) return;
      if (permission.status !== 'granted') {
        throw new Error(permission.canAskAgain === false
          ? 'Location permission is off. Enable location for Expo Go in your device settings, then try again.'
          : 'Location permission was denied. Tap Find my location to try again.');
      }
      if (!await Location.hasServicesEnabledAsync()) {
        throw new Error('Location services are off. Enable location services on your device, then try again.');
      }
      if (!active(id)) return;
      const result = await currentPosition();
      if (!active(id)) return;
      if (!validCoordinate(result?.coords)) throw new Error('GPS did not return a valid location. Please try again.');
      const point = { latitude: result.coords.latitude, longitude: result.coords.longitude };
      setPosition(point);
      await search(point, id);
    } catch (failure) {
      if (active(id)) {
        setError(failure?.message || 'Unable to get your GPS location. Please try again.');
        setPhase('error');
      }
    } finally {
      if (active(id)) busy.current = false;
    }
  }

  async function retrySearch() {
    if (busy.current || !position || !mounted.current) return;
    busy.current = true;
    const id = ++sequence.current;
    setError('');
    try {
      await search(position, id);
    } finally {
      if (active(id)) busy.current = false;
    }
  }

  return { position, restaurant, phase, error, findLocation, retrySearch };
}
