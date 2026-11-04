# Module 02 Assignment 2 - Star Wars

Ashlie Wyse - SDEV257

This is the navigation foundation required for Module 02. Each screen displays its name: Planets, Films, or Spaceships. API lookups and lists are added in later assignments.

## Open the project

- Expo Snack: https://snack.expo.dev/@justmeashlie/sdev257-star-wars---ashlie-wyse
- GitHub: https://github.com/ashliewyse/sdev257-coursework/tree/main/module-02-star-wars

## Navigation

- Android: open the hamburger menu in the header to choose a screen.
- iOS: use the bottom tabs to choose a screen.
- Web preview: use the bottom tabs.

The app uses React Navigation, a shared Flexbox screen layout, safe-area handling, and a gesture-handler root for Android drawer gestures. Platform.OS automatically selects the appropriate navigator.

## Run

Open App.js and package.json in Expo Snack with SDK 54. Snack supplies Expo, React, and React Native. This dependency file is for Snack, not a standalone Expo CLI project.

## Validation

- Web: visited Planets, Films, Spaceships, and returned to Planets.
- iPhone 16 Pro simulator: the bottom tabs opened all three screens; content was below the status bar.
- Pixel 9 Pro emulator: the drawer opened and all three screens displayed correctly; content was below the status bar.
- Snack reported no compile errors. Physical-device testing was not performed.

## References

- Assignment: https://ivylearn.ivytech.edu/courses/1412233/assignments/24945620
- React Navigation: https://reactnavigation.org/docs/getting-started/
- Bottom tabs: https://reactnavigation.org/docs/bottom-tab-navigator/
- Drawer navigation: https://reactnavigation.org/docs/drawer-navigator/
