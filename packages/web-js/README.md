<img width="1070" alt="GitHub Repo Cover" src="https://github.com/corbado/corbado-php/assets/18458907/aa4f9df6-980b-4b24-bb2f-d71c0f480971">

# @corbado/web-js

[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/corbado/javascript/tree/readme_documentation?tab=License-1-ov-file)
[![Documentation](https://img.shields.io/badge/documentation-available-brightgreen)](https://docs.corbado.com/overview/welcome)
[![Slack](https://img.shields.io/badge/slack-community-blueviolet)](https://join.slack.com/t/corbado/shared_invite/zt-1b7867yz8-V~Xr~ngmSGbt7IA~g16ZsQ)
[![npm version](https://img.shields.io/npm/v/@corbado/web-js)](https://www.npmjs.com/package/@corbado/web-js)

---

## Table of Contents

- [Overview](#overview)
- [🚀 Getting Started](#getting-started)
  - [Option 1: Using NPM](#option-1-using-npm)
  - [Option 2: Using Script and Style Tags](#option-2-using-script-and-style-tags)
- [📌 Usage](#usage)
  - [Using with NPM](#using-with-npm)
  - [Using in HTML with Script and Style Tags](#using-in-html-with-script-and-style-tags)
- [💡 Example Applications](#example-applications)
- [📄 Documentation & Support](#documentation--support)
- [🔒 License](#license)

---

## Overview

The `@corbado/web-js` package enables easy integration of Corbado's authentication functionalities into web projects. It can be used either by installing the package from NPM or by directly including it in your HTML files through script and style tags.

---

## 🚀 Getting Started

### Option 1: Using NPM

Install the package via NPM:

```bash
npm install @corbado/web-js
```

### Option 2: Using Script and Style Tags

Include the script and style directly in your HTML:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@corbado/web-js@version/dist/bundle/index.css"
/>
<script src="https://unpkg.com/@corbado/web-js@version/dist/bundle/index.js"></script>
```

Replace `@version` with the specific version number you intend to use.

---

## 📌 Usage

### Using with NPM

1. **Initialization**:

   Import and initialize Corbado in your main JavaScript or TypeScript file:

   ```typescript
   import Corbado from '@corbado/web-js';

   Corbado.load({
     projectId: 'pro-XXXXXXXXXXXXXXXXXXXX',
     customTranslations: {
       /* your translations */
     },
   });
   ```

2. **Authentication UI**:

   Mount the authentication UI and passkey list UI:

   ```typescript
   // In your authentication file
   Corbado.mountAuthUI(document.getElementById('auth-element'), {
     onLoggedIn: () => {
       /* handle login */
     },
   });

   // In your main app file
   if (Corbado.user) {
     Corbado.mountPasskeyListUI(document.getElementById('passkey-list'));
   }
   ```

### Using in HTML with Script and Style Tags

1. **Initialization**:

   Initialize Corbado in a `<script>` tag within your HTML:

   ```html
   <script type="module">
     Corbado.load({
       projectId: 'pro-XXXXXXXXXXXXXXXXXXXX',
     });

     // Additional JavaScript to manage UI
   </script>
   ```

2. **Handling User Authentication State**:

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

---

## 💡 Example Applications

- For a detailed example using the package from NPM checkout the [example application](web-js-example.korbado.com) and its [source code](https://github.com/corbado/javascript/tree/main/examples/web-js)
- For an example using script and style tags directly in HTML checkout the [example application](web-js-sdk-example.korbado.com) and its [source code](https://github.com/corbado/javascript/tree/main/examples/web-js-script)

---

## 📄 Documentation & Support

For support and questions please visit our [Slack channel](https://join.slack.com/t/corbado/shared_invite/zt-1b7867yz8-V~Xr~ngmSGbt7IA~g16ZsQ).
For more detailed information and advanced configuration options, please visit our [Documentation Page](https://docs.corbado.com/overview/welcome).

---

## 🔒 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/corbado/javascript/tree/readme_documentation?tab=License-1-ov-file) file for details.
