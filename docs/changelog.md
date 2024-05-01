## 2.6.0
### Minor changes
- Added a login state button, similar to Gmail, allowing quicker re-authentication with a passkey for previously authenticated accounts.
- Improved state management when component is refreshed => allow the user to reset the authentication process by navigating to the initial URL where the process has started
- Fixed icon alignment issues for smail email shortcut buttons and social login buttons
- Changed in passkey error screens which have improved the user experience.

## 2.5.4
### Major Changes
- Introduced social login capabilities using OAuth services. For now we support Google, Microsoft and Github.
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

### Minor changes:
- Improved support for icons in dark mode, enhancing visibility and user experience in low-light environments
- Users can now change typography settings more easily using CSS variables.
- If an authentication process is interrupted, the initial screens will now be pre-filled with the last entered data, reducing the need for users to re-enter information.
- We now only see smart email shortcut button on email authentication screens of the mail client we are using (e.g. if we are using someemail@gmail.com then we only see Open in Gmail button).
- We can also ask for Name of the user during signup.

## 1.1.14
