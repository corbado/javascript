# `web-core`

This package contains core functionalities which are exported by all the SDKs and UI packages of our JavaScript library.

## Note: Package is for internal use only.

> TODO: Add more details about the package here.

> TODO: Publish the package to npm.

## Noticeable concepts
- SessionService should not be exposed to other packages (it should be encapsulated by AuthService)
- LongSession should be completely encapsulated by SessionService
- Functions should be pure if possible
- Functions should not be influenced by UI problems (UI problems should be solved in UI packages) => the only place that deals with UI problems is the FlowHandlerService
