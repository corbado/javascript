## 2.11.0

### Minor changes

- Consume hideBadge property.

## 2.10.0

### Minor changes

- Added loading spinner for conditional ui login.

## 2.9.0

### Minor changes

- Added support for `appendLocalPasskeyAfterCDA` setting: This can be configured from the developer panel, it asks users to create a local passkey after they performed a cross-device-authentication.
- Added device specific icons for passkey append screens.

## 2.8.0

### Minor changes

- Added support for `autoSubmit` setting: This can be configured from the developer panel, it speeds up the signup flow for the user.

## 2.7.0

### Minor changes

- Updated the `PasskeyList` component: Improvements to the UI and show more details about the passkeys.

### Patch changes

- Fixed a bug where the first passkey operation would through an error during login on iOS devices before iOS 17.4.

## 2.6.0

### Minor changes

- Added a login state button for quicker re-authentication with a passkey on previously authenticated accounts.
- Improved state management. The user can reset the authentication process by navigating to the initial URL where it started.
- Fixed icon alignment issues for smart email shortcut and social login buttons.
- Improved the user experience of passkey error screens.

## 2.5.4

### Major Changes

- Introduced social login capabilities using OAuth services (Google, Microsoft, and GitHub).
- Added support for authentication with phone numbers using sms otp.
- Added support for authentication with just the username which uses passkeys for signup and login.
- Improved email link authentication with added support for cross-device verification.
- Email and SMS resend timers are now synced with back-end so refreshing the page does not restart the timer during signup.
- Introduced hash-based URL navigation to better manage the signup flow state, ensuring that refreshing the page does not lose the user's current progress.
- Better back navigation support when going through different steps of signup flow.
- Added another option for `CorbadoAuth` component: `handleNavigationEvents` which can be use to enable and disable hash-based urls.
- Users can now edit their email, phone number, or username midway through the signup process without needing to restart signup flow.
- Removed the passkey benefits screen; instead, passkey creation and append screens have been made more descriptive to reduce the need for multiple navigations.
- In production mode, errors are now displayed on top of the component rather than replacing it entirely, maintaining the user interface continuity even when errors occur.
- Breaking change: Restructured translation files (see [docs](https://docs.corbado.com/frontend-integration/ui-components/customization#1-custom-translations))
- Breaking change: Restructured custom themes (see [docs](https://docs.corbado.com/frontend-integration/ui-components/customization#2-custom-styling))
- Breaking change: Enhanced layout of the Corbado component and introduced more customizable CSS variables and classes, making it easier to modify the appearance and feel of the application.
- Breaking change: Removed the separate Login and Signup components, enabling direct navigation to `login-init` and `signup-init` screens for quicker access to authentication.
- Breaking change: Transitioned the logout method to be asynchronous, improving performance and user experience.
- Breaking change: `useCobradoSession` is now merged with `useCobrado` for simplifying usage.

### Minor changes:

- Improved support for icons in dark mode, enhancing visibility and user experience in low-light environments
- Users can now change typography settings more easily using CSS variables.
- If an authentication process is interrupted, the initial screens will now be pre-filled with the last entered data, reducing the need for users to re-enter information.
- We now only see smart email shortcut button on email authentication screens of the mail client we are using (e.g. if we are using someemail@gmail.com then we only see Open in Gmail button).

## 1.x.x

- Introduced the `CorbadoProvider` component, making it possible to use the Corbado's authentication state state throughout the application.
- Created components: `Signup`, `Login`, and `CorbadoAuth` to enable user authentication.
- Added support for signup/login with email OTPs and email magic links.
- Added support for passkey-based authentication.
- Added support for custom stylings.
- Added support for custom translations.
- Introduced the `useCorbado` hook to access authentication state and the currently authenticated user's data.
- Created the `PasskeyList` component, which provides a ready-to-use interface for passkey management for logged-in users.
- Added error handling screens.
- Added option `setShortSessionCookie` to store user's session details as cookies for supporting full-stack applications (e.g., NextJS) and multi-page applications (e.g., PHP).
- Added support for auto language detection from the browser and default language selection in cases where we don't have the translation for that language.
- Added support for dark mode and auto dark mode detection from the browser.
- Added the pre-configured custom theme `corbado-funk`.
