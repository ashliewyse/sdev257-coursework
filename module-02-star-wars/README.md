# Star Wars App - Module 04 Search Preview

Ashlie Wyse - SDEV257

This extends the existing Module 02 Star Wars app, including its Module 03 live SWAPI lists. The same Planets, Films, and Spaceships screens now each include a search input and submitted-text modal. The existing app is updated in place.

## Open the project

- Expo Snack: https://snack.expo.dev/@justmeashlie/sdev257-star-wars---ashlie-wyse
- GitHub: https://github.com/ashliewyse/sdev257-coursework/tree/main/module-02-star-wars

## Search preview (Module 04 Assignment 2)

1. Open Planets, Films, or Spaceships.
2. Enter a term in the search input above the list.
3. Tap **Search** or the keyboard's Search/Enter key. A modal displays exactly what was submitted.
4. Tap **Close** to return and edit the term. Android Back and Web Escape also dismiss the modal.

Blank or whitespace-only terms do not open a modal. Each screen keeps its own input. Long text wraps in a scrollable area while Close stays accessible. Keyboard submission uses the final native event text so a last edit cannot be lost to a state-update timing race.

This assignment only previews the entered text: it does not filter the list or issue a search request. Actual searching is deferred to the later assignment, as instructed.

## Live data

| Screen | Endpoint | Displayed data |
| --- | --- | --- |
| Planets | https://www.swapi.tech/api/planets | Planet names |
| Films | https://www.swapi.tech/api/films | Titles, episode numbers, release dates, and directors |
| Spaceships | https://www.swapi.tech/api/starships | Starship names |

`ResourceList` uses `useEffect`, `fetch`, and `useState` to retrieve API data and a `FlatList` to render it. Planets and starships use the API's `results` array; films use `result` and each entry's `properties`. No sample records are shipped as application data.

Planets and starships load one page at a time. **Load more** follows the API's `next` URL and appends records while preventing duplicate IDs. The screen shows loading progress, the loaded count, an empty state, and a Retry button after a failure. A failed later page preserves existing rows and retries that same page. Requests are cancelled on unmount and time out after 20 seconds.

## Navigation and files

- Android: open the hamburger menu to select a screen.
- iOS and Web: use the bottom tabs.
- `App.js`: the existing navigators and shared screen layout.
- `components/SearchDialog.js`: controlled input, button/keyboard submission, and the native modal shared by all three screens.
- `components/ResourceList.js`: fetching, pagination, status messages, and list rows.
- `theme.js`: the original navy and yellow palette shared by the app and lists.
- `package.json`: the existing Snack dependencies, unchanged.

## Run

Open the saved Snack with SDK 54 and choose Web, iOS, or Android. Snack supplies Expo, React, and React Native; this dependency file is for Snack, not a standalone Expo CLI project. Internet access and SWAPI availability are required.

## Validation

- Nineteen automated tests pass: the original ten live-list behavior tests plus nine search tests covering controlled input, exact text, button and keyboard submission, blank input, reopening, native Back, long Unicode/plain text, independent screen state, and the final-keyboard-value regression.
- Web: all three screens displayed search inputs and live lists; each submitted term appeared in its modal. Blank input stayed disabled, long text scrolled with Close visible, and Escape dismissed the modal. Snack reported no errors.
- iPhone 16 Pro simulator: all three tabs displayed their search input and live list. Submitted Luke (Planets), Hope (Films), and X-wing (Spaceships); each appeared correctly in its modal. Button and keyboard submission and Close worked.
- Pixel 9 Pro emulator: the drawer opened all three screens with search inputs and live lists. Submitted Naboo, Jedi, and Falcon on the corresponding screens; each appeared correctly. Android Back dismissed the dialog, and Close and keyboard/button submission worked.
- Automated tests use mocked network responses and native rendering primitives; live browser and simulator checks validate real network data. Physical-device testing was not performed.

## References

- Module 03 assignment: https://ivylearn.ivytech.edu/courses/1412233/assignments/24945639
- Module 04 assignment: https://ivylearn.ivytech.edu/courses/1412233/assignments/24945651
- SWAPI documentation: https://swapi.tech/documentation
- Course text, Chapter 19: Fetching list data.
- Course text, Chapters 22 and 23: input and modal concepts.
- React Native 0.81 TextInput: https://reactnative.dev/docs/0.81/textinput
- React Native 0.81 Modal: https://reactnative.dev/docs/0.81/modal

The existing GitHub folder and saved Snack are updated in place, preserving the Module 02 project's history.

The downloadable assignment ZIP also includes `star-wars-verification`. From that folder, run `npm ci` and `npm test` to run the 19 checks against the neighboring `star-wars-app` source folder. The renderer emits a deprecation notice; the suite has no failing tests.
