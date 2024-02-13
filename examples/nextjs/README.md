# Corbado with NextJS - Starter

## Welcome to Corbado + Acme

This is the starter template demonstrates how to combine the Corbado' React Package, `@corbado/react` and Corbado's NodeJS SDK, `@corbado/node` and integrate it with Next.js for a seamless user experience.

## Structure of the Application

These are the different pages that you will find in this application:

- `/` : Home page
- `/login` : login component page
- `/signup` : Signup component page
- `/dashboard` : The dashboard has three nested routes:
  - `/` : User Details page which uses `@corbado/node-sdk` to fetch complete details of the currently logged-in user.
  - `/session-details` : this page deserializes the short session and show cases the details stored in the short session.
  - `/passkey-list` : this page uses the `@corbado/react`'s `<PasskeyList/>` component to showcase its use

## Points to Note

- When you use a component from `@corbado/react` either a UI component or a Provider component you need to `use client` for client side rendering as the components make use of react contexts.
- For using `<CorbadoProvider />` with NextJS application we need to set `setShortSessionCookie` to true. It's important to set this since Corbado uses refresh tokens to keep the user logged in and by storing short session cookies, the user will be able to stay logged in even if the token is refreshed
