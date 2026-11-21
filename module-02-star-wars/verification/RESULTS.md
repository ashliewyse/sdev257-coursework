# Module 05 Image verification

Verified November 21, 2026 using the final SDK 54 Snack source. Assignment 3 adds a themed, lazy-loaded header image to Planets, Films, and Spaceships, preserving the previous scroll, search, swipe, and animated item-dialog features.

## Automated checks

`npm test` in verification: **34 passed, 0 failed**. This includes the previous 30 API/pagination/search/swipe/animation tests and four new image lifecycle tests.

The four new tests first failed against the baseline, then passed with the implementation. They verify:

- An unfocused screen does not mount an Image, even after layout; focusing starts it.
- A focused screen waits for a positive-width, positive-height layout before mounting the remote image.
- Successful loading removes the busy indicator; blur/refocus preserves the mounted image and loaded status.
- Failure removes the busy state and exposes Retry. Retry mounts a new image attempt, and stale callbacks cannot finish that new attempt.

These tests control the native Image event boundary in Node. They do not capture real network requests, decode images, or prove native cache behavior. React Test Renderer emits its upstream deprecation notice.

An independent review found that a fixed-height header could clip enlarged text. It was changed to a minimum height so the content can grow. The complete 34-test suite passed after this final change.

## Live preview checks

- Web/Chrome: Planets, Films, and Spaceships each displayed the space banner with readable titles. Read-only DOM checks found the image complete with naturalWidth 800 on each screen. Spaceships scrolled to Rebel transport; swiping opened the matching item dialog.
- iPhone 16 Pro simulator/Expo Go: all three screens displayed the banner, heading, search, and list. With the preview's XXXL font-scaling setting selected, Planets and Spaceships headings remained fully visible. The font setting was restored afterward.
- Pixel 9 Pro emulator/Expo Go: Planets, Films, and Spaceships displayed the image; drawer navigation continued to work.
- Snack reported no errors. LazyHeaderImage.js was copied back through the editor and matched the local source. Explicit Save completed with Saved / All changes saved.
- The NASA-hosted image endpoint returned HTTP 200, image/jpeg, 147149 bytes at the selected 800-pixel width. Image credit and source links are in README.md.

Physical-device testing and live offline/error injection were not performed. Retry and stale-event behavior were checked with controlled events. The image host, internet connection, and SWAPI remain external dependencies. Image caching depends on the platform and host; the app does not prefetch banners.

## Retained prior coverage

The automated suite retains the preceding assignments' API/pagination/search/swipe and animated-dialog coverage. Assignment 2 additionally checked actual web fade/scale values and native dialog opening; Assignment 1 checked scrolling and left/right swipes on all three platforms. Those earlier live checks were not all repeated for this image-only change. A live OS Reduce Motion toggle remains untested; its branches have controlled automated coverage.

## Run locally

Open this verification directory, run `npm ci`, then `npm test`. The tests build the neighboring source components. Generated compiled-*.cjs files and node_modules are excluded from the deliverable.
