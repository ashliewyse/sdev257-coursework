# Star Wars App - Module 03 API Extension

Ashlie Wyse - SDEV257

This extends the existing Module 02 Star Wars app. The original Planets, Films, and Spaceships screens and platform-specific navigation now display live lists from SWAPI.

## Open the project

- Expo Snack: https://snack.expo.dev/@justmeashlie/sdev257-star-wars---ashlie-wyse
- GitHub: https://github.com/ashliewyse/sdev257-coursework/tree/main/module-02-star-wars

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
- `components/ResourceList.js`: fetching, pagination, status messages, and list rows.
- `theme.js`: the original navy and yellow palette shared by the app and lists.
- `package.json`: the existing Snack dependencies, unchanged.

## Run

Open the saved Snack with SDK 54 and choose Web, iOS, or Android. Snack supplies Expo, React, and React Native; this dependency file is for Snack, not a standalone Expo CLI project. Internet access and SWAPI availability are required.

## Validation

- Ten automated tests exercise the real React list component: the three resource formats, loading, initial failure and retry, empty results, pagination with duplicate prevention, later-page failure and retry, malformed responses, and cancellation on unmount.
- Web: loaded all 60 planets, 36 starships, and 6 films; checked all screens and pagination. Snack reported no errors.
- iPhone 16 Pro simulator: all three bottom tabs displayed live data; list scrolling and loading a second page of spaceships worked.
- Pixel 9 Pro emulator: the drawer opened all three screens with live data; list scrolling and loading a second page of spaceships worked.
- Automated tests use mocked network responses and native rendering primitives; live browser and simulator checks validate real network data. Physical-device testing was not performed.

## References

- Module 03 assignment: https://ivylearn.ivytech.edu/courses/1412233/assignments/24945639
- SWAPI documentation: https://swapi.tech/documentation
- Course text, Chapter 19: Fetching list data.

The existing GitHub folder and saved Snack are updated in place, preserving the Module 02 project's history.
