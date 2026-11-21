# Module 05 verification

Verified November 21, 2026 using the final SDK 54 Snack implementation.

## Automated checks

`npm test` in this folder: 26 passed, 0 failed.

- 10 API/list/pagination regression tests.
- 9 existing search-input and search-modal tests.
- 7 swipe-selection/item-modal tests covering all three resource types, film metadata, appended rows, repeated selection, close/back callbacks, long Unicode text, and accessible tapping.

Tests use controlled fetch responses and native rendering adapters. They exercise state and callback behavior, not the native gesture engine. React Test Renderer reports its upstream deprecation notice.

## Live preview checks

| Environment | Observed results |
| --- | --- |
| Web in Chrome | Swiping Tatooine left opened its item dialog; Escape dismissed it. Films scrolled to Revenge of the Sith; swiping right showed the title, episode 3, 2005-05-19, and George Lucas. Spaceships scrolled to Rebel transport; swiping left opened the correct dialog. Close returned to the list. |
| iPhone 16 Pro simulator in Expo Go | All three tabs loaded live data and scrolled vertically. Tatooine opened from both left and right swipes, including reopening the same row after Close. Scrolled film and spaceship rows opened the correct Revenge of the Sith and Rebel transport dialogs. Film metadata was visible. Close preserved the list position. |
| Pixel 9 Pro emulator in Expo Go | Drawer navigation opened all three screens with live data. All three lists scrolled vertically. Tatooine, Revenge of the Sith, and Rebel transport opened the correct dialogs from horizontal swipes. Android Back and Close dismissed dialogs. Load more appended planets, and the newly loaded Geonosis row opened correctly from a right swipe. |

No app error was displayed in these final previews. Physical-device testing was not performed. SWAPI and internet availability remain external dependencies.

## Compatibility decision

The app uses the root `Swipeable` export from the existing Gesture Handler 2.28 dependency. Importing ReanimatedSwipeable as a separate Snack dependency caused duplicate native-view registration in Expo Go. Removing that subpath dependency and using the root export fixed the native launch; the tests and live checks above were performed after that change. The root Swipeable API is deprecated, so a future SDK or tooling migration should reassess it.

## Run locally

From this verification directory, run `npm ci`, then `npm test`. Tests build the neighboring application components automatically. Generated `compiled-*.cjs` files and node_modules are intentionally excluded from the submission archive and GitHub source.
