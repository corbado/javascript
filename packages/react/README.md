<img width="1070" alt="GitHub Repo Cover" src="https://github.com/corbado/corbado-php/assets/18458907/aa4f9df6-980b-4b24-bb2f-d71c0f480971">

# @corbado/react

[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/corbado/javascript/tree/readme_documentation?tab=License-1-ov-file)
[![Documentation](https://img.shields.io/badge/documentation-available-brightgreen)](https://docs.corbado.com/overview/welcome)
[![Slack](https://img.shields.io/badge/slack-community-blueviolet)](https://join.slack.com/t/corbado/shared_invite/zt-1b7867yz8-V~Xr~ngmSGbt7IA~g16ZsQ)
[![npm version](https://img.shields.io/npm/v/@corbado/react)](https://www.npmjs.com/package/@corbado/react)

---

## Table of Contents

- [Overview](#overview)
- [🚀 Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Setting up the package](#setting-up-the-package)
- [📌 Usage](#usage)
  - [Accessing Authentication State](#accessing-authentication-state)
  - [Using PasskeyList Component](#using-passkeylist-component)
  - [Integrating CorbadoAuth for Authentication](#integrating-corbadoauth-for-authentication)
  - [Logging Out](#logging-out)
- [💡 Example Application](#example-application)
- [📄 Documentation and Support](#documentation-and-support)
- [🔒 License](#license)

---

## Overview

The `@corbado/react` package provides a comprehensive solution for integrating passkey-based authentication in React applications. It simplifies the process of managing authentication states and user sessions with easy-to-use hooks and components.

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

### Accessing Authentication State

You can access authentication states such as `shortSession` and `user` using the `useCorbado` hook:

```tsx
import { useCorbado } from '@corbado/react';

const HomePage = () => {
  const { user, logout } = useCorbado();

  // Render your components based on authentication state
};

export default HomePage;
```

### Using PasskeyList Component

Corbado provides a convenient built-in UI component to display a list of all passkeys the current user has registered, using the `PasskeyList` component:

```tsx
import { PasskeyList } from '@corbado/react';

const PasskeysView = () => {
  // Additional logic or styling

  return (
    <div>
      {/* Render PasskeyList here */}
      <PasskeyList />
    </div>
  );
};

export default PasskeysView;
```

### Integrating CorbadoAuth for Authentication

Adding SignUp/Login screens are very simple with `@corbado/react`. Just use the `CorbadoAuth` component for handling user authentication:

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

### Logging Out

Implement logout functionality easily with the `logout` method from the `useCorbado` hook:

```tsx
const handleLogout = () => {
  logout();
  // Redirect or perform additional actions after logout
};
```

---

## 💡 Example Application

- For a detailed example using the `@corbado/react` package checkout the [example application](react-example.korbado.com) and its [source code](https://github.com/corbado/javascript/tree/main/examples/react)

---

## 📄 Documentation and Support

For support and questions please visit our [Slack channel](https://join.slack.com/t/corbado/shared_invite/zt-1b7867yz8-V~Xr~ngmSGbt7IA~g16ZsQ).
For more detailed information and advanced configuration options, please visit our [Documentation Page](https://docs.corbado.com/overview/welcome).

---

## 🔒 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/corbado/javascript/tree/readme_documentation?tab=License-1-ov-file) file for details.
