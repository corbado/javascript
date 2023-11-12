# Corbado React SDK example

This project demonstrates how to use Corbado's react-sdk package.
It allows users to:
- sign up with passkeys or email OTP
- sign in with passkeys or email OTP
- view the short session token (token is automatically refreshed)

It resembles the "Signup with OTP" and "Login with OTP" flows from [Figma](https://www.figma.com/file/t68RCXKUvpdg7ljj2X0zGb/Corbado-Developer-Panel?type=design&node-id=1272-96&mode=design&t=ATURw9BEwrTdGxNn-0)

## How to run locally
```
cd packages/web-core && npm i && npx yalc publish && cd ../..
cd packages/react-sdk && npm i && npx yalc publish && cd ../..
cd playground/react-custom-ui && yalc add @corbado/react-sdk && npm i && npm start
```
