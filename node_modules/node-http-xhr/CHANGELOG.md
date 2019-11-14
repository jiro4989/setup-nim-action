# 1.3.4

- On timeout, `readyState` is set to `DONE`
- Writing an unsupported value to `responseType` now fails silently
- Add more tests

# 1.3.3

- Refactor `EventTarget` and `XMLHttpRequestEventTarget` into their own classes
- Fix https bug
- Add more tests

# 1.3.2

- Fix timeouts
- Header names should be case-insensitive
- Add more tests

# 1.3.1

- `on${event}` properties correctly update handler
  - Sets property to `null` when assigned something that isn't a function
  - Removes old listener if assigned something that isn't a function
- Refactored/added more unit tests
- `istanbul` test coverage

# 1.3.0

- Added `withCredentials` instance property to more closely match XHR API.
- Fixed bug with one-shot event listeners
- Added more unit tests for `EventTarget` API and instance properties.

# 1.2.1

- Fixed browser files not being included in package.

# 1.2.0

- Added support for browser environments.

# 1.1.0

- Added support for `node.js >= 0.10.x`.

# 1.0.0

- Added initial implementation.

