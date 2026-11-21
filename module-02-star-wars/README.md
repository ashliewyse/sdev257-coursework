# Star Wars App - Module 05 Animation

Ashlie Wyse - SDEV257

This updates the existing Star Wars app with scrollable lists and swipe-to-modal interactions on Planets, Films, and Spaceships. It preserves API fetching, pagination, search preview, and platform navigation.

## Open the app

- Expo Snack: https://snack.expo.dev/@justmeashlie/sdev257-star-wars---ashlie-wyse
- GitHub: https://github.com/ashliewyse/sdev257-coursework/tree/main/module-02-star-wars

## Module 05 Assignment 2: Animation

Opening an item-details dialog on Planets, Films, or Spaceships fades the card from transparent to opaque while gently scaling it from 92% to 100% over 240 ms. It works after either a row swipe or an accessible tap. This draws attention to the chosen item without moving the list or delaying Close/Back.

`components/ItemDialog.js` uses core React Native `Animated.Value`, `Animated.timing`, `Animated.View`, and ease-out cubic easing. The native driver handles iOS/Android opacity and transform updates; Web uses the JavaScript driver. The starting value is prepared while hidden and timing starts in `Modal.onShow` so the animation is visible after presentation. Closing cancels an unfinished entrance; reopening replays it.

`AccessibilityInfo` honors Reduce Motion. Unknown settings initially use a still presentation, a live enabled preference immediately reveals the whole card, and stale initial query results cannot override a newer setting event. No new dependencies were installed. The existing Modal fade is replaced by this explicit Animated entrance; the backdrop stays still.

To see the animation, open any screen and swipe or tap a row. Close it and open another row to replay.

## Module 05 Assignment 1

1. Open Planets, Films, or Spaceships. Each screen fetches live SWAPI data.
2. Scroll vertically to see items below the screen.
3. Swipe a row left or right. Completing the swipe opens a native modal displaying that item's text. Films also show their episode, release date, and director.
4. Close the modal to return to the same list position. The row resets so it can be swiped again. Android Back and Web Escape also dismiss the dialog.
5. Use **Load more** on Planets or Spaceships to append the next page; those rows can also be swiped.

Each row is also a labeled button, providing a tap, keyboard, or screen-reader alternative. Long modal content scrolls separately from Close.

## Earlier features

Each screen's search input still displays the submitted term in its own modal. Button and keyboard submission work, blank terms are blocked, and each screen keeps its own query. As specified in Module 04, this preview does not filter the list or make a search request.

Android uses a drawer opened from the hamburger button. iOS and Web use bottom tabs.

## Live data

| Screen | Endpoint | Text displayed |
| --- | --- | --- |
| Planets | https://www.swapi.tech/api/planets | Planet names |
| Films | https://www.swapi.tech/api/films | Titles, episode numbers, release dates, directors |
| Spaceships | https://www.swapi.tech/api/starships | Starship names |

ResourceList uses useEffect, fetch, and useState. It reads results for planets/starships and result/properties for films. Load more follows the API's next URL and deduplicates stable IDs. Loading, empty, and error states are preserved; Retry repeats the failed request without discarding earlier pages. Requests are cancelled on unmount and time out after 20 seconds. Internet access and SWAPI availability are required. No sample records are shipped as application data.

## Files

- App.js: platform navigation and shared screen layout.
- components/ResourceList.js: fetching, pagination, bounded ScrollView, and selected item.
- components/SwipeableResourceRow.js: Swipeable, both swipe directions, row reset, and accessible tap alternative.
- components/ItemDialog.js: animated item-text modal, motion preference handling, scrollable content, and Close.
- components/SearchDialog.js: the existing Module 04 search preview.
- theme.js: the shared navy and yellow palette.
- verification/: regression tests and their independent package manifest.

## Run and test

Open the saved Snack with SDK 54 and select Web, iOS, or Android. Expo supplies React and React Native. The root package.json is a Snack dependency manifest, not a standalone Expo CLI project.

This assignment uses the Swipeable export from the existing Gesture Handler 2.28 package. Its API is deprecated in favor of ReanimatedSwipeable in newer projects, but the root export is used here for SDK 54 Snack compatibility: importing the newer component as a separate Snack dependency caused duplicate native-view registration in Expo Go. No dependency versions were upgraded.

To run automated checks locally, open the verification folder, run npm ci, then npm test.

All 30 tests pass: ten API/pagination tests, nine existing search tests, seven swipe-selection/modal tests, and four animation lifecycle/accessibility tests. These cover each resource type, film metadata, appended-row selection, Close/native Back callbacks, repeated selection, long Unicode text, and the accessible tap alternative. The renderer emits a deprecation notice. Tests use controlled network responses and native rendering adapters; they do not simulate the native gesture engine.

Physical-device testing has not been performed. See the included verification record for the live preview checks.

## References

- Module 05 Animation assignment: https://ivylearn.ivytech.edu/courses/1412233/assignments/24945662
- React Native Animated: https://reactnative.dev/docs/0.81/animated
- React Native AccessibilityInfo: https://reactnative.dev/docs/0.81/accessibilityinfo

- Module 05 assignment: https://ivylearn.ivytech.edu/courses/1412233/assignments/24945657
- Course text: Chapters 23 and 24 (modals, scrolling, and swipeable controls).
- React Native ScrollView: https://reactnative.dev/docs/0.81/scrollview
- React Native Modal: https://reactnative.dev/docs/0.81/modal
- Gesture Handler 2.28 source: https://github.com/software-mansion/react-native-gesture-handler/blob/2.28.0/packages/react-native-gesture-handler/src/components/Swipeable.tsx
- SWAPI documentation: https://swapi.tech/documentation
