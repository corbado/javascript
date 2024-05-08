<img width="1070" alt="GitHub Repo Cover" src="https://github.com/corbado/corbado-php/assets/18458907/aa4f9df6-980b-4b24-bb2f-d71c0f480971">

# @corbado/web-js

[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/corbado/javascript/blob/main/LICENSE)
[![Documentation](https://img.shields.io/badge/documentation-available-brightgreen)](https://docs.corbado.com/frontend-integration/vanilla-js)
[![Slack](https://img.shields.io/badge/slack-community-blueviolet)](https://join.slack.com/t/corbado/shared_invite/zt-1b7867yz8-V~Xr~ngmSGbt7IA~g16ZsQ)
[![npm version](https://img.shields.io/npm/v/@corbado/web-js)](https://www.npmjs.com/package/@corbado/web-js)

---

## Table of Contents

- [Overview](#overview)
- [🚀 Getting Started](#-getting-started)
  - [Option 1: Using NPM](#option-1-using-npm)
  - [Option 2: Using script and style Tags](#option-2-using-script-and-style-tags)
- [📌 Usage](#-usage)
  - [Usage with NPM](#usage-with-npm)
    - [Initialization](#initialization)
    - [Authentication UI](#authentication-ui)
    - [Handling Passkey List UI](#handling-passkey-list-ui)
    - [Handling Logout](#handling-logout)
  - [Usage in HTML with script and style Tags](#usage-in-html-with-script-and-style-tags)
    - [Initialization](#initialization-1)
    - [Handling User Authentication State](#handling-user-authentication-state)
- [💡 Example Applications](#-example-applications)
- [📄 Documentation & Support](#-documentation--support)
- [ 🚢 Release Notes](#-release-notes)
- [🔒 License](#-license)

---

## Overview

The `@corbado/web-js` package enables easy integration of Corbado's authentication functionalities into web projects.
It can be used either by installing the package from NPM or by directly including it in your HTML files through script and style tags.

---

## 🚀 Getting Started

### Option 1: Using NPM

Install the package via NPM:

```bash
npm install @corbado/web-js
```

### Option 2: Using script and style Tags

Include the script and styles directly in your HTML:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@corbado/web-js@latest/dist/bundle/index.css"
/>
<script src="https://unpkg.com/@corbado/web-js@latest/dist/bundle/index.js"></script>
```

Replace `@latest` with the specific version number you intend to use.

---

## 📌 Usage

### Usage with NPM

#### Initialization:

Import and initialize Corbado in your main JavaScript or TypeScript file:

```typescript
import Corbado from '@corbado/web-js';

await Corbado.load({
  projectId: 'pro-XXXXXXXXXXXXXXXXXXXX',
});
```

**Note**: It's important to initialize Corbado before using any of its functionalities.

#### Authentication UI

Mount the authentication UI to your HTML element:

```html
<script>
  const authElement = document.getElementById('corbado-auth');

  // In your JavaScript or TypeScript file after initializing Corbado
  Corbado.mountAuthUI(authElement, {
    onLoggedIn: () => {
      window.location.href = '/';
    },
  });
</script>

<div id="corbado-auth"></div>
```

#### Handling Passkey List UI:

Use the `Corbado.isAuthenticated` boolean to check if the user is logged in and to mount the passkey list UI:

```html
// In your JavaScript or TypeScript file after initializing Corbado if (Corbado.user) {
Corbado.mountPasskeyListUI(passkeyListHTMLElement); }

<script>
  const passkeyListElement = document.getElementById('passkey-list');

  // In your JavaScript or TypeScript file after initializing Corbado
  if (Corbado.isAuthenticated) {
    Corbado.mountPasskeyListUI(passkeyListElement);
  }
</script>

<div id="passkey-list"></div>
```

#### Handling Logout:

Use the `Corbado.isAuthenticated` boolean to check if the user is logged in and to handle logout:

```typescript
// In your JavaScript or TypeScript file after initializing Corbado
if (Corbado.isAuthenticated) {
  logoutButton.addEventListener('click', async () => {
    await Corbado.logout();
  });
}
```

### Usage in HTML with script and style Tags

#### Initialization:

Initialize Corbado in a `<script>` tag within your HTML:

```html
<script type="module">
  await Corbado.load({
    projectId: 'pro-XXXXXXXXXXXXXXXXXXXX',
  });

  // Additional JavaScript to manage UI
</script>
```

**Note**: It's important to initialize Corbado before using any of its functionalities.

#### Handling User Authentication State:

Use JavaScript to manage login/logout states and to mount the passkey list UI:

```html
<script type="module">
  if (!Corbado.user) {
    // Handle login state
  } else {
    // Handle logout state and mount passkey list
  }
</script>
```

**Note**:

- The use of the `type="module"` attribute is necessary to use ES6 modules in the browser. For more information, please refer to [this article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
- Use of Corbado with `<script>` tag is similar to using it with NPM, except that you don't need to import the package and you can use the `Corbado` object directly from the global scope.

---

## 💡 Example Applications

- For a detailed example using the package from NPM checkout the [example application](https://web-js.demo.corbado.io/src/pages/auth.html) and its [source code](https://github.com/corbado/javascript/tree/main/examples/web-js)
- For an example using script and style tags directly in HTML checkout the [example application](https://web-js-script.demo.corbado.io) and its [source code](https://github.com/corbado/javascript/tree/main/examples/web-js-script)

---

## 📄 Documentation & Support

For support and questions please visit our [Slack channel](https://join.slack.com/t/corbado/shared_invite/zt-1b7867yz8-V~Xr~ngmSGbt7IA~g16ZsQ).
For more detailed information and advanced configuration options, please visit our [Documentation Page](https://docs.corbado.com/frontend-integration/vanilla-js).

## 🚢 Release Notes

Find out what we've shipped! Check out the changelog files [here](../../docs/changelogs/web-js.md)

---

## 🔒 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/corbado/javascript/blob/main/LICENSE) file for details.
