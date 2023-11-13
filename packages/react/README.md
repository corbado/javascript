<p align="center">
  <a href="https://www.corbado.com/" target="_blank" rel="noopener noreferrer">
    <img src="https://uploads-ssl.webflow.com/626a572dd59ab59d107b26c6/6285290cdc476312ea882af9_Corbado%20Wort-Bildmarke.svg" height="64">
  </a>
  <br />
</p>

# @corbado/react

## Overview

The @corbado/react JavaScript library empowers developers to build seamless passkey-first authentication into their applications. It facilitates user sign-up, login, and session management operations directly from your React app.

## Getting Started

### Prerequisites

- React v16+
- Node.js v14+

Please follow the steps in [Getting started](https://docs.corbado.com/overview/getting-started) to create and configure
a project in the [Corbado developer panel](https://app.corbado.com/signin#register).

### Installation

```sh
npm install @corbado/react
```

## Usage

```jsx
import { CorbadoAuth, Props } from '@corbado/react';

const authConfig: Props = {
    projectId: 'your-project-id',
};

function App() {
  return (
   <CorbadoAuth
        {...authConfig}
    />
  );
}
```

## Getting help

Have questions or need help? Here's how you can reach us:

- Join our [Slack community](https://join.slack.com/t/corbado/shared_invite/zt-1b7867yz8-V~Xr~ngmSGbt7IA~g16ZsQ)
- Visit our [Support page](https://www.corbado.com/contact) for more contact options


> TODO: Publish the package to npm.
