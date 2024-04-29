# Changelog

## Version 2.0

### Major Features and Updates

#### UI Improvements
- **New UI Design**: Enhanced layout with more customizable CSS variables and classes, making it easier to modify the appearance and feel of the application.
- **Typography Customization**: Users can now change typography settings more easily using CSS variables.
- **Hash URL Navigation**: Introduced hash-based URL navigation to better manage the signup flow state, ensuring that refreshing the page does not lose the user's current progress.
- **Enhanced Authentication Options**:
  - Added phone number signup/login with OTP verification.
  - Improved email link authentication with added support for cross-device verification.
  - Introduced social login capabilities using OAuth services.

#### Signup Flow Enhancements
- **Flexible Identifier Editing**: Users can now edit their email, phone number, or username midway through the signup process without needing to restart.
- **Streamlined Passkey Screens**: Removed the passkey benefits screen; instead, passkey creation and append screens have been made more descriptive to reduce the need for multiple navigations.
- **Quick Login Feature**: Added a login state button, similar to Gmail, allowing quicker re-authentication with a passkey for previously authenticated accounts.

### UI Enhancements

#### Dark Mode Support
- **Dark Mode Icons**: Improved support for icons in dark mode, enhancing visibility and user experience in low-light environments.

### Functional Improvements

#### Authentication Enhancements
- **Direct Access to Initial Screens**: Removed the separate Login and Signup components, enabling direct navigation to `login-init` and `signup-init` screens for quicker access to authentication.
- **Asynchronous Logout**: Transitioned the logout method to be asynchronous, improving performance and user experience.

#### Error Handling
- **Enhanced Error Display**: In production mode, errors are now displayed on top of the component rather than replacing it entirely, maintaining the user interface continuity even when errors occur.

### Deprecated Features
- **Removed Passkey Benefits Screen**: This screen has been deprecated in favor of more descriptive passkey screens.
- **Deprecated Component-Based Navigation**: Removed support for the old Login and Signup components, transitioning to a more streamlined initial screen approach.

### Data Management
- **State Preservation**: If an authentication process is interrupted, the initial screens will now be pre-filled with the last entered data, reducing the need for users to re-enter information.
