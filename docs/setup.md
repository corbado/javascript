<p align="center">
  <a href="https://www.corbado.com/" target="_blank" rel="noopener noreferrer">
    <img src="https://uploads-ssl.webflow.com/626a572dd59ab59d107b26c6/6285290cdc476312ea882af9_Corbado%20Wort-Bildmarke.svg" height="64">
  </a>
  <br />
</p>

# Corbado JavaScript SDKs

This repository contains all the Corbado JavaScript SDKs under the `@corbado/`namespace.

## Packages

For package specific details on installation, architecture and usage usage, you can refer to the package's README file.

- [`@corbado/web-core`](./packages/web-core) Corbado Web core package.
- [`@corbado/react-sdk`](./packages/react-sdk) Corbado React SDK package developers can use to develop their own custom React UI.
- [`@corbado/react`](./packages/react) Corbado React UI package ready for plug and play.

## Documentation and Usage

To get started, you can refer to the corbado [documentation](https://docs.corbado.com/overview/welcome) page.

You can add an SDK to your project by either

```sh
npm install @corbado/{package}
```

or

```sh
yarn add @corbado/{package}
```

## Test

### Prerequisite

- Node.js v14+
- Lerna CLI v7+

### Required First step

- Clone the repository.
- In the root directory and run `npm install --global lerna` in the terminal if you don't have Lerna installed already.
- Then run `npm i` to install packages dependencies.
- Run `lerna run build` to build all packages.

### React UI Example

- Go to `react-example` under the playground directory by running `cd playground/react-example` in the terminal.
- Run `npx yalc add @corbado/react`
- Run `npm install` to install react-example app dependencies
- Run `npm start` to start the react-example app which should run on port `3000`
- In your browser, visit `http://localhost:3000` to view the sample app.

### React SDK UI Exxample

- Go to the `react-sdk` directory and run `npx publish @corbado/react-sdk` to publish the package locally.
- Go to `react-custom-ui` under the playground directory by running `cd playground/react-custom-ui` in the terminal.
- Run `npx yalc add @corbado/react-sdk`
- Run `npm install` to install react-custom-ui app dependencies
- Run `npm start` to start the react-custom-ui app which should run on port `3000`
- In your browser, visit `http://localhost:3000` to view the sample app.
