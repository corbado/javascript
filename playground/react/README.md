# React Vite App

This is a modern React application built with Vite, featuring Corbado authentication integration.

## Features

- Modern React setup with Vite
- TypeScript support
- Corbado authentication integration
- React Router for navigation
- Testing setup with Vitest
- Dark mode support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Corbado project ID:
   ```
   VITE_CORBADO_PROJECT_ID=your-project-id-here
   ```

## Development

To start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `build` directory.

## Testing

To run tests:

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── contexts/       # React contexts
  ├── pages/         # Page components
  ├── test/          # Test setup and utilities
  ├── App.tsx        # Main App component
  ├── main.tsx       # Application entry point
  └── routes.tsx     # Route definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
