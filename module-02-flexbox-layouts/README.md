# Module 02 Assignment 1 - Flexbox layouts

Ashlie Wyse - SDEV257

Recreates Figure 17.11 from *React and React Native, Fourth Edition* using nested Flexbox rows and columns.

The visible row pairs are #1 / #3, #2 / #4, #5 / #7, #6 / #8, #9 / #11, and #10 / #12. Boxes have a light gray background, dashed dark slate gray borders, and centered bold labels on a ghost white screen.

## How the layout works

- The outer layout stacks three equal-height groups vertically.
- Each group uses flexDirection: 'row' for two equal-width columns.
- Each column contains two boxes distributed with justifyContent: 'space-around'.
- SafeAreaProvider and SafeAreaView reserve space for the status bar, notches, and home indicator on Android and iOS.
- onLayout measures the available safe content area. Squares are 100 points when space permits and shrink to fit shorter screens or landscape orientation.

## Run in Expo Snack

Use Expo SDK 54. Copy App.js and the dependency from package.json into a Snack. Snack supplies Expo, React, and React Native; this package file is intended for Snack, not a standalone Expo CLI project.

Open the saved [Expo Snack](https://snack.expo.dev/@justmeashlie/sdev257-flexbox-layouts---ashlie-wyse).

Select Web, Android, or iOS in the Snack preview. Physical device testing requires a matching Expo Go version.

## Source attribution

Adapted from the publisher's MIT-licensed [Chapter 17 flexible rows and columns example](https://github.com/PacktPublishing/React-and-React-Native-4th-Edition/tree/main/Chapter17/flexible-rows-and-columns). The [publisher's color figures](https://static.packt-cdn.com/downloads/9781803231280_ColorImages.pdf) provide the visual reference. See LICENSE for the original license.

This version replaces fixed platform-specific status-bar padding with safe-area handling and sizes the squares to fit the available screen.

## Validation status

Snack's Web preview renders all twelve boxes with no reported errors. Browser measurements passed at a 390 x 844 portrait viewport and a 1000 x 507 landscape preview: twelve square boxes, correct label positions, no overlaps, and all boxes inside the visible app area. Box sizes adjusted from 100 to 76.5 points.

Physical phone testing has not been completed because the phone has insufficient free storage. Android and iOS status-bar behavior uses the safe-area API but has not been verified on native devices or simulators.
