### Prerequisite

- Node.js v14+
- Lerna CLI v7+

### Required First step

- Clone the repository.
- In the root directory and run `npm install --global lerna` in the terminal if you don't have Lerna installed already.
- Then run `npm i` to install packages dependencies.
- Run `lerna run build` to build all packages.
- Go to one of the examples (e.g. `cd playground/react`) and run `npm install` to install the example dependencies.
- For examples that use the Vite bundler (e.g. `examples/react`), add an `.env.local` file specifying the appropriate `VITE_CORBADO_PROJECT_ID`
- Now start the example app by running `npm start` (or `npm run dev` depending on the example app) and visit `http://localhost:3000` to view the sample app (the url might be different depending on the example app you are running).
