<img width="1070" alt="GitHub Repo Cover" src="https://github.com/corbado/corbado-php/assets/18458907/aa4f9df6-980b-4b24-bb2f-d71c0f480971">

# @corbado/react-sdk

[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/corbado/javascript/tree/readme_documentation?tab=License-1-ov-file)
[![Documentation](https://img.shields.io/badge/documentation-available-brightgreen)](https://docs.corbado.com/overview/welcome)
[![Slack](https://img.shields.io/badge/slack-community-blueviolet)](https://join.slack.com/t/corbado/shared_invite/zt-1b7867yz8-V~Xr~ngmSGbt7IA~g16ZsQ)
[![npm version](https://img.shields.io/npm/v/@corbado/react)](https://www.npmjs.com/package/@corbado/react)

---

## Table of Contents

- [Overview](#overview)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Setting up the package](#setting-up-the-package)
- [📌 Usage](#-usage)
  - [Accessing Authentication State](#accessing-authentication-state)
  - [Implementing Custom Authentication Flows](#implementing-custom-authentication-flows)
    - [Login with Passkey](#login-with-passkey)
    - [Signup with Passkey](#signup-with-passkey)
    - [Signup with Email OTP](#signup-with-email-otp)
    - [Conditional UI Login](#conditional-ui-login)
  - [Handling Authentication Errors](#handling-authentication-errors)
- [💡 Example Application](#-example-application)
- [📄 Documentation & Support](#-documentation--support)
- [🔒 License](#-license)

---

## Overview

The `@corbado/react-sdk` package is tailored for React applications that require more control over authentication flows, providing a flexible and robust solution for managing authentication states without prebuilt UI components.

---

## 🚀 Getting Started

### Prerequisites

- React v18+
- Node.js `>=18.17.0` or later

### Installation

```bash
npm install @corbado/react-sdk
```

### Setting up the package

Initialize `CorbadoProvider` at the root of your application:

```tsx
import { CorbadoProvider } from '@corbado/react-sdk';

function App() {
  return (
    <CorbadoProvider projectId='pro-XXXXXXXXXXXXXXXXXXXX'>
      {/* Your routes and other components go here */}
    </CorbadoProvider>
  );
}

export default App;
```

---

## 📌 Usage

### Accessing Authentication State

Utilize the `useCorbado` hook to access authentication states like `user` and `shortSession`:

```tsx
import { useCorbado } from '@corbado/react-sdk';

const HomePage = () => {
  const { user, shortSession, logout } = useCorbado();
  // Additional implementation
};

export default HomePage;
```

### Implementing Custom Authentication Flows

The `@corbado/react-sdk` allows for the implementation of custom authentication flows, including login, signup, and conditional UI logic.

#### Login with Passkey

To implement a login flow using a passkey, use the `loginWithPasskey` method:

```tsx
import { useCorbado } from '@corbado/react-sdk';

const LoginPage = () => {
  const { loginWithPasskey } = useCorbado();

  const handleLogin = async (email: string) => {
    const result = await loginWithPasskey(email);
    if (!result.err) {
      // Handle successful login
    } else {
      // Handle login error
    }
  };

  // Render your login form here
};
```

#### Signup with Passkey

For signing up users with a passkey, use the `signUpWithPasskey` method:

```tsx
import { useCorbado } from '@corbado/react-sdk';

const SignupPage = () => {
  const { signUpWithPasskey } = useCorbado();

  const handleSignup = async (email: string, username: string) => {
    const result = await signUpWithPasskey(email, username);
    if (!result.err) {
      // Handle successful signup
    } else {
      // Handle signup error
    }
  };

  // Render your signup form here
};
```

#### Signup with Email OTP

For signing up users with a email OTP, use the `initSignUpWithEmailOTP` & `completeSignUpWithEmailOTP` method:

```tsx
import { useCorbado } from '@corbado/react-sdk';

const CompleteEmailOtpSignup = () => {
  const { initSignUpWithEmailOTP, completeSignUpWithEmailOTP } = useCorbado();

  const handleInitSignup = async (email: string, username: string) => {
    const result = await initSignUpWithEmailOTP(email, username);
    // Handle init response
  };

  const handleCompleteSignup = async (otpCode: string) => {
    const result = await completeSignUpWithEmailOTP(otpCode);
    // Handle completion response
  };

  // Render form to input OTP
};
```

#### Conditional UI Login

Conditional UI logic can be used to streamline the login process. For instance, you might want to automatically prompt the user to use a passkey if available. The `loginWithConditionalUI` method can be utilized for this purpose:

```tsx
import { useCorbado, PasskeyChallengeCancelledError } from '@corbado/react-sdk';

const ConditionalLoginPage = () => {
  const { loginWithConditionalUI } = useCorbado();

  const handleConditionalLogin = async () => {
    const response = await loginWithConditionalUI();
    if (!response.err) {
      // Handle successful login
    } else if (response.val instanceof PasskeyChallengeCancelledError) {
      // Handle scenario where passkey challenge was cancelled
    } else {
      // Handle other errors
    }
  };

  // Optionally, render a button to initiate conditional login
};
```

In each of these examples, you're calling different authentication methods provided by `@corbado/react-sdk`. These methods return a result object that indicates whether the operation was successful (`err` property) and provides additional details or error information (`val` property).

Remember to replace the example logic with real implementations that fit the specific needs of your application. The rendering of forms and the handling of form inputs are not covered here, as they can vary greatly depending on your UI library or custom components.

### Handling Authentication Errors

Manage authentication errors by interpreting the error objects returned by SDK methods:

```tsx
import { useCorbado, InvalidPasskeyError } from '@corbado/react-sdk';

const ErrorHandlingComponent = () => {
  const { globalError } = useCorbado();

  // Handle global errors
  if (globalError instanceof InvalidPasskeyError) {
    // Specific error handling
  }
  // Additional error handling logic
};

export default ErrorHandlingComponent;
```

---

## 💡 Example Application

- For a detailed example using the `@corbado/react-sdk` package checkout the [example application](react-sdk-example.korbado.com) and its [source code](https://github.com/corbado/javascript/tree/main/examples/react-sdk)

---

## 📄 Documentation & Support

For support and questions please visit our [Slack channel](https://join.slack.com/t/corbado/shared_invite/zt-1b7867yz8-V~Xr~ngmSGbt7IA~g16ZsQ).
For more detailed information and advanced configuration options, please visit our [Documentation Page](https://docs.corbado.com/overview/welcome).

---

## 🔒 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/corbado/javascript/tree/readme_documentation?tab=License-1-ov-file) file for details.
