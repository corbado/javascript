<img width="1070" alt="GitHub Repo Cover" src="https://github.com/corbado/corbado-php/assets/18458907/aa4f9df6-980b-4b24-bb2f-d71c0f480971">

# @corbado/react

[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/corbado/javascript/blob/main/LICENSE)
[![Documentation](https://img.shields.io/badge/documentation-available-brightgreen)](https://docs.corbado.com/frontend-integration/react)
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
  - [CorbadoAuth component](#corbadoauth-component)
  - [PasskeyList component](#passkeylist-component)
  - [Accessing Authentication State](#accessing-authentication-state)
  - [Logging Out](#logging-out)
- [💡 Example Application](#-example-application)
- [📄 Documentation & Support](#-documentation--support)
- [🔒 License](#-license)

---

## Overview

The `@corbado/react` package provides a comprehensive solution for integrating passkey-based authentication in React applications.
It simplifies the process of managing authentication states and user sessions with easy-to-use hooks and UI components.

---

## 🚀 Getting Started

### Prerequisites

- React v18+
- Node.js `>=18.17.0` or later

### Installation

```bash
npm install @corbado/react
```

### Setting up the package

Add `CorbadoProvider` to your main App component to wrap your application:

```tsx
import { CorbadoProvider } from '@corbado/react';

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

### CorbadoAuth component

Adding SignUp/Login screens is simple with `@corbado/react`.
The `CorbadoAuth` component allows your users to signUp and login with their passkeys.
Additionally, it provides fallback options like email one-time passcode for users who don't have a passkey yet.

```tsx
import { CorbadoAuth } from '@corbado/react';

const AuthPage = () => {
  const onLoggedIn = () => {
    // Navigate or perform actions after successful login
  };

  return <CorbadoAuth onLoggedIn={onLoggedIn} />;
};

export default AuthPage;
```

### PasskeyList component

Users that are logged in want to see a list of all their existing passkeys and they want to manage them.
You can make this possible by using the `PasskeyList` component.
It shows all passkeys of the currently logged in user and allows them to add and remove passkeys.

```tsx
import { PasskeyList } from '@corbado/react';

const PasskeysView = () => {
  // Additional logic or styling

  return (
    <div>
      <PasskeyList />
    </div>
  );
};

export default PasskeysView;
```

### Accessing Authentication State

If you want to know if the user is currently authenticated or not make use of the `useCorbado` hook.
Use `isAuthenticated` and `loading` to check the authentication state.

```tsx
import { useCorbado } from '@corbado/react';

const HomePage = () => {
  const { loading, isAuthenticated } = useCorbado();

  if (loading) {
    // Render loading state
  }

  if (isAuthenticated) {
    // Render authenticated state
  }
  
  // Additional implementation
};

export default HomePage;
```

If you need more information about the user (e.g. name, email, etc.) use the `useCorbadoSession` hook.
It also gives you access to the user's shortSession which you can use to make authenticated requests to your backend.

```tsx
import { useCorbadoSession } from '@corbado/react';

const HomePage = () => {
  const { loading, user } = useCorbadoSession();
  
  if (loading) {
    // Render loading state
  }
  
  if (user) {
    // Render authenticated state
  }
};

export default HomePage;
```


**Remember to check `loading` state of the hook before using authentication states.**

### Logging Out

Implement logout functionality easily with the `logout` method from the `useCorbado` hook:

```tsx
import { useCorbado } from '@corbado/react';

const LogoutButton = () => {
  const { logout } = useCorbado();

  const handleLogout = () => {
    logout();
    // Redirect or perform additional actions after logout
  };

  // UI logic and styling for logout button
};

export default LogoutButton;
```

---

## 💡 Example Application

- For a detailed example using the `@corbado/react` package checkout the [example application](https://react.demo.corbado.io) and its [source code](https://github.com/corbado/javascript/tree/main/examples/react)

---

## 📄 Documentation & Support

For support and questions please visit our [Slack channel](https://join.slack.com/t/corbado/shared_invite/zt-1b7867yz8-V~Xr~ngmSGbt7IA~g16ZsQ).
For more detailed information and advanced configuration options, please visit our [Documentation Page](https://docs.corbado.com/frontend-integration/react).

---

## 🔒 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/corbado/javascript/blob/main/LICENSE) file for details.
