# Module 05 Animation verification

Verified November 21, 2026 on the final SDK 54 Snack source. Assignment 2 adds an explicit fade-and-zoom entrance to the existing item-details card.

## Automated checks

`npm test` in verification: 30 passed, 0 failed. This includes the previous 26 API/pagination/search/swipe tests and 4 new animation lifecycle/accessibility tests.

The new tests cover cancellation during an entrance, reopening a new item, preparing opacity before native presentation (first and repeated opens), Reduce Motion immediate visibility, a delayed initial preference query losing to a newer event, and stopping/revealing the card when Reduce Motion becomes enabled. Native rendering and animation boundaries are adapted in Node; these tests do not verify native frame timing. React Test Renderer emits its upstream deprecation notice.

The four new tests failed against the baseline. A separate review identified a possible flash before onShow; a new assertion reproduced it, the value was reset while hidden, and the complete 30-test suite then passed.

## Live preview checks

- Web/Chrome: all three screens opened the correct item content. Read-only DOM observations captured the actual Animated styles during entrance: Tatooine opacity 0.479958 / scale 0.958397, then opacity 1 / scale 1. Reopening it captured opacity 0.358381 / scale 0.94867. Films (A New Hope) and Spaceships (CR90 corvette) also showed intermediate opacity/scale values and correct text. Close and Escape worked.
- iPhone 16 Pro simulator/Expo Go: the Tatooine card was observed partly faded and then fully visible. Close returned to the list; swiping Alderaan opened a fresh, fully visible dialog with the correct name.
- Pixel 9 Pro emulator/Expo Go: tapping Tatooine displayed its dialog, Android Back returned to the list, and swiping Alderaan reopened the correct dialog. Native preview showed the entrance progressing to a fully visible card.
- Snack reported no errors. ItemDialog.js was copied back through the editor and matched the local source. Explicit Save finished with Saved / All changes saved.

Physical-device testing and a live OS Reduce Motion toggle were not performed. Reduce Motion branches were tested through the controlled native API boundary. Internet and SWAPI availability remain external dependencies.

## Prior Assignment 1 behavior

The preceding Scroll assignment tested vertical scrolling and left/right swipe selection on Planets, Films, and Spaceships in Web, iPhone, and Android, including Android pagination/new-row swiping, movie metadata, Close and Back. Its source, list components, search components, dependency versions, and navigation are unchanged in this assignment; its automated coverage remains in the 30-test suite.

## Run locally

Open this verification directory, run `npm ci`, then `npm test`. The tests build the neighboring source components. Generated compiled-*.cjs files and node_modules are excluded from the deliverable.