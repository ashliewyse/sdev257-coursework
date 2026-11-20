# Module 03 Assignment 1 - Todo App Part 2

Ashlie Wyse - SDEV257

Continuation of the Module 2 Todo app, following the assigned Made With Matt tutorial, Part 2.

## How to use

1. Type a task in the "Write a task" field.
2. Tap **+**, or use the keyboard's Done/Enter key, to add it.
3. Tap a task to complete it and remove it from the list.

The input clears and the keyboard dismisses after a task is added. Blank entries are ignored. Duplicate task names are supported. Long lists scroll and long task names wrap.

Tasks are held in React state for the current session. Reloading the app clears the list, matching the tutorial's scope.

## Files and concepts

- `App.js`: controlled input, `useState` task array, add/complete handlers, keyboard avoidance, safe areas, and scrolling.
- `components/Task.js`: reusable task card from Part 1; receives its text through a prop.
- `package.json`: the safe-area dependency used by Expo Snack. Snack supplies Expo, React, and React Native.

Stable task IDs and functional state updates keep deletion correct when task names repeat. The gray background, white rounded cards, and blue details continue the Part 1 design.

## Run

Import this folder into Expo Snack using SDK 54. Select Web, Android, or iOS, or scan Snack's QR code with a compatible Expo Go app.

## Submission

Submit the public GitHub folder link and the saved Expo Snack link in Canvas.

## Validation

Validation results and the final Snack URL will be recorded after testing.
