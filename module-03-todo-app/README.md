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

- GitHub: https://github.com/ashliewyse/sdev257-coursework/tree/main/module-03-todo-app
- Expo Snack: https://snack.expo.dev/@justmeashlie/sdev257-todo-app-part-2---ashlie-wyse

Submit both links in Canvas.

## Validation

- Eight component behavior checks pass: initial state, add/reset/dismiss, blank input, correct middle removal, duplicate labels, keyboard submission, long lists, and keyboard-avoidance configuration.
- Expo Snack Web: adding, completing, duplicate labels, blank input, keyboard submission, and scrolling to the final task verified. Snack reports no errors.
- iPhone 16 Pro simulator: app launch, task entry, input above the software keyboard, addition/input reset, and tap-to-complete verified.
- Pixel 9 Pro Android emulator: app launch, task entry, input above the software keyboard, addition/input reset/keyboard dismissal, and tap-to-complete verified.

Component tests run the actual React component and hooks with native UI primitives mocked; native behavior is checked separately in Snack. The test runner reports its own React test-renderer deprecation warning. No physical-device testing has been performed.

## References

- Assigned Canvas tutorial: Made With Matt, "Build your first React Native app - Todo List Tutorial Part 2".
- React Native KeyboardAvoidingView: https://reactnative.dev/docs/keyboardavoidingview
- React Native TextInput: https://reactnative.dev/docs/textinput
