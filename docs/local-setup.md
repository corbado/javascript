## Introduction
To support local development, this repository contains a playground directory.
For every package that we expose to customers (i.e. developers) we have a playground application that helps us to test the package.
So when you make changes to one or more packages, you can test them using these playground applications.

Additionally, these playground applications are automatically deployed to Vercel.
So after making a change or when reviewing a pull request you can also use these deployments to test the changes (this saves you from having to run all the playground applications locally).
Check out [vercel-deployments.md](./vercel-deployments.md) for more information.

### Local prerequisites

- Node.js v14+
- Lerna CLI v7+

### Initial setup

1. Install lerna by running `npm install --global lerna`.
2. Run `npm i` to install dependencies from the root of this repository.
3. Run `lerna run build` to build all packages locally.

### Running individual playground applications
To start one of the playground applications locally, first navigate to the respective directory (e.g. `cd playground/react`).
Then take a look at the table below and run the commands in the `steps` column.
Finally, open the url in the `url` column in your browser and test the application.

When you are developing locally and making changes to one or more packages, you can run `lerna run build` to build all packages again.
Take a look at the `apply changes` column to see if you need any additional commands to apply your changes.

| package                | steps                                                      | url                        | apply changes                 |
|------------------------|------------------------------------------------------------|----------------------------|-------------------------------|
| @corbado/react-sdk     | 1. npm i<br/>2. npm run dev                                | http://localhost:5173/     |                               |
| @corbado/react         | 1. npm i<br/>2. npm start                                  | http://localhost:3000/auth |                               |
| @corbado/web-js        | 1. npm i<br/>2. npm start                                  | http://localhost:9000/     |                               |
| @corbado/web-js-script | 1. npm i<br/>2. lerna run build:bundler:local<br/>3. serve | http://localhost:3000/     | lerna run build:bundler:local |
