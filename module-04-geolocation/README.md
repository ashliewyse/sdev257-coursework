# Module 04 Assignment - Geo-location

Ashlie Wyse - SDEV257

A new Expo SDK 54 app that displays the device's current GPS location and highlights one nearby restaurant. Open the iOS or Android simulator in Snack, or open the project in Expo Go on a phone. Web displays instructions because react-native-maps uses native map views.

## Use

1. Press **Find my location** and allow foreground location access.
2. The blue map marker shows the position reported by the device. Within 15 km of Michigan City's **Tacos on 20**, the app highlights this user-chosen restaurant at 429 US-20. Elsewhere, it selects one mapped restaurant within 3 km from the OpenStreetMap lookup. The restaurant marker is orange.
3. Tap the restaurant pin for its name and distance. The card also identifies the restaurant. Distances are straight-line, not route lengths.
4. **Refresh my location** takes a new reading. If restaurant lookup fails, **Retry restaurant search** repeats only the search and preserves the known location.

The app never substitutes a demonstration location for actual GPS. An emulator reports its configured simulated location. A physical phone reports its own location. If access is denied, services are disabled, or GPS fails, the app explains the problem. No restaurant result and network failure are reported separately from location failure.

## Design

- `App.js`: presentation, actions, and status messages.
- `useNearby.js`: foreground permission, GPS, retry, and cancellation state.
- `nearby.js`: bounded restaurant lookup, geometry validation, and distance selection.
- `LocationMap.js`: native MapView and two annotated Marker components.
- `LocationMap.web.js`: web launch guidance, avoiding unsupported native imports.
- `package.json`: Snack dependencies. Expo/React/React Native are supplied by Snack; this is not a standalone Expo CLI project.

This follows Chapter 21's expo-location and MapView/Marker concepts with current SDK 54 APIs and a high-accuracy GPS request. The chosen restaurant's public map coordinates are 41.6806535, -86.9031008. The local selection does not need a restaurant API request. It is only used within 15 km, so a grader elsewhere will not see a distant restaurant falsely described as nearby.

Automatic search uses the documented North America Overpass instance at https://ovp.dresel.systems/api-na/interpreter. It searches 3 km and chooses the closest valid returned restaurant. Automatic data coverage is North America; coverage and public service availability can vary. Each request identifies this coursework app. Queries run only on a user action, with timeouts; this is a small classroom demonstration, not a production restaurant-search service.

## Location data

Before the first action, the app explains that automatic searches send coordinates to the Overpass service at dresel.systems and that Apple Maps or Google Maps supplies the map. Only foreground location is requested. The app does not save or publish location history. No home address or personal coordinates are embedded in the project.

## References

- Assignment: https://ivylearn.ivytech.edu/courses/1412233/assignments/24945644
- Chapter 21 examples: https://github.com/PacktPublishing/React-and-React-Native-4th-Edition/tree/main/Chapter21
- Expo Location: https://docs.expo.dev/versions/latest/sdk/location/
- Expo React Native Maps: https://docs.expo.dev/versions/latest/sdk/map-view/
- SDK 54 dependency versions: https://github.com/expo/expo/blob/sdk-54/packages/expo/bundledNativeModules.json
- Overpass API: https://dev.overpass-api.de/overpass-doc/en/
- Restaurant data copyright: https://www.openstreetmap.org/copyright
- Documented Overpass servers: https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances
- Chosen restaurant location: https://www.google.com/maps/place/TACOS+ON+20/@41.6806535,-86.9031008,569m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8811a7a92ad569bf:0xfb32afb065f696ab!8m2!3d41.6806535!4d-86.9031008!16s%2Fg%2F11smf1vd4v

## Validation

- 17 automated checks pass: coordinates, distance, closest valid restaurant, malformed responses, HTTP failures, request identification, Tacos on 20 local selection without a network request, distant-location fallback, permission denial, disabled services, GPS errors, high accuracy, successful location/search, retry, empty results, and cancellation.
- Native and web bundles compile. Snack reports no errors.
- iPhone 16 Pro and Pixel 9 Pro simulators: foreground permission, GPS location marker, one restaurant marker, and name/distance callout verified. Both displayed Moretti's Ristorante & Pizzeria near their configured simulated location. iOS refresh and Android landscape controls also verified.
- Android permission-denial feedback and retry verified. The web preview shows the native-app launch instructions.
- Downloaded Snack source matches the final JavaScript files; the exported dependency list includes the specified SDK 54 packages.

These checks used simulator locations. Physical-phone testing has not been performed. The Tacos on 20 selection was verified with an automated test using public coordinates; no personal location is included in the source or test evidence.

## Submission links

- GitHub: https://github.com/ashliewyse/sdev257-coursework/tree/main/module-04-geolocation
- Expo Snack: https://snack.expo.dev/@justmeashlie/sdev257-geolocation---ashlie-wyse

In Snack, choose iOS or Android and Launch Snack, or use Expo Go on a phone. The public GitHub folder contains the Snack source files. The separate verification folder in the downloadable assignment ZIP contains the test harness; run `npm ci` and `npm test` from that folder.
