# Module 02 Assignment 3 - Todo App

Ashlie Wyse - SDEV257

Implementation of the assigned Made With Matt tutorial, Part 1. It displays Today's tasks and two sample task cards, using a separate Task component and text props. The light gray screen, white rounded cards, blue squares, and outlined blue circles follow the lesson.

## Scope

Part 1 ends with Task 1 and Task 2 displayed. Adding and deleting tasks is introduced in Part 2 and is not part of this submission. The shapes in each card are decorative at this stage.

## Files and concepts

- App.js: safe-area screen, scroll container, heading, and two Task instances.
- components/Task.js: reusable task card; receives its label through the text prop.
- package.json: Expo Snack SDK 54 dependency. Snack supplies Expo, React, and React Native.
- Flexbox rows align the square, task text, and circle. The text can shrink and wrap on smaller screens.

Saved Snack: https://snack.expo.dev/@justmeashlie/sdev257-todo-app-part-1---ashlie-wyse

GitHub: https://github.com/ashliewyse/sdev257-coursework/tree/main/module-02-todo-app

## Run

Open these files in Expo Snack with SDK 54 and select Web, Android, or iOS. In a separate full Expo CLI project, use npx expo start.

## Lesson

Made With Matt, "Build your first React Native app - Todo List Tutorial Part 1":
https://www.youtube.com/watch?v=0kL6nhutjQ8

The implementation follows the assigned video. Safe-area handling and a scroll container accommodate newer devices and smaller screens.

## Validation

Verified in Expo Snack Web, the Pixel 9 Pro Android emulator, and the iPhone 16 Pro simulator. Each displayed Today's tasks, Task 1, and Task 2, with the cards inside the screen and the heading below the status bar. Snack reported no compile errors. Physical-device testing was not performed.



