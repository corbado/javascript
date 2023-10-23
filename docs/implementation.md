# Corbado Authentication Library: Implementation Documentation

## Introduction

In an era where security and user experience intersect, Corbado aims to streamline the integration of robust authentication mechanisms for web developers across a multitude of frameworks. The modern web ecosystem is rich and diverse, with developers leveraging a range of platforms to build innovative applications. This document outlines the structure and purpose of the Corbado Authentication Library, a monorepo offering tailored solutions for a broad spectrum of web development frameworks.

## Monorepo Overview

Utilizing Lerna for task management, npm for package management, and the robustness of TypeScript, Corbado has established a modular and interconnected system. This monorepo structure facilitates the simultaneous development, testing, and distribution of multiple packages under a unified umbrella.

## Package Structure and Purpose

![img](assets/Corbado%20Frontend%20Design.png)

### 1. Core Functionality: Web-Core (core-js)

At the heart of the Corbado Authentication Library lies the Web-Core module. This module encapsulates the fundamental logic and operations crucial for user authentication. By centralizing core functionalities, Corbado ensures consistent, reliable, and secure authentication processes irrespective of the developer's chosen framework.

### 2. Headless Functionality Packages: SDKs

These packages act as bridges, ensuring that the core authentication functionality provided by the `Web-Core` module is seamlessly integrated and optimized for specific frontend frameworks. Each package not only facilitates authentication but also ensures that developers can utilize the idiomatic patterns and practices native to each framework.

#### JS SDK

##### Overview:

The JS SDK serves as a foundational layer in the Corbado Authentication Library. While the `Web-Core` module provides the core functionality and logic for authentication, the JS SDK translates this into a more consumable and generic JavaScript interface, suitable for integration across a broad range of applications, built with VanillaJS.

##### Features and Functionalities:

###### Universal API Interface:

- Offers a simplified, promise-based API for initiating, handling, and completing authentication flows.
- Enables developers to perform operations like `login()`, `register()`, `logout()`, `refreshToken()`, and more, regardless of the specific frontend or backend environment.

###### Session Management:

- Provides mechanisms to initiate, maintain, and terminate user sessions.
- Integrates with popular session storage solutions, including `localStorage`, `sessionStorage`, and `cookies`, ensuring flexibility based on the developer's requirements and the security considerations of each storage method.

###### Event-driven Architecture:

- Allows developers to hook into various authentication events, such as `onLoginSuccess`, `onLoginFailure`, `onLogout`, and more.
- Enables custom actions and feedback mechanisms based on the outcomes of these events, ensuring that applications can provide timely responses to user actions.

###### Middleware Support:

- Facilitates integration with various middleware for logging, monitoring, analytics, and more.
- Enables interceptors for requests and responses, allowing developers to handle or modify them as needed — for example, attaching additional headers, logging data, or handling specific error codes.

###### Extension and Plugin System:

- Offers an extensible architecture, allowing third-party plugins or extensions that can enhance or modify the SDK's functionality.
- This ensures that as the broader authentication ecosystem evolves, the SDK can adapt without requiring massive rewrites or migrations.

###### Token Handling and Renewal:

- Automated handling of authentication tokens (like JWTs) for secure and efficient authentication.
- Provides mechanisms for token renewal, ensuring that users remain authenticated even over extended sessions.

###### Error Handling and Feedback:

- Comprehensive error handling with detailed feedback, allowing developers to diagnose issues quickly and ensure that users are always informed about the authentication process's status.
- Customizable error messages and localization support, ensuring a tailored experience for diverse user bases.

In summary, the JS SDK is a critical component of the Corbado Authentication Library, bridging the gap between the core authentication logic and the specific requirements of various applications. It ensures a smooth, secure, and standardized authentication process across different platforms and technologies, providing developers with the tools and flexibility they need to implement robust authentication in their applications.

#### 1. React SDK

##### Overview:

The React SDK serves as an intermediary between the `Web-Core` functionality and React-based applications. React, known for its component-based architecture and declarative nature, requires a package that can encapsulate authentication logic within its ecosystem.

##### Features:

- React Hooks: The SDK provides custom hooks such as `useAuth()` or `useSignIn()` which allow developers to easily incorporate authentication logic within functional components.
- Context Providers: It includes authentication context providers that can wrap the application (or part of it) to offer centralized authentication state and methods.
- Higher-Order Components (HOCs): For class-based components, the SDK offers HOCs that inject authentication props into wrapped components.
- Error Handling: Leveraging React's error boundaries, the SDK offers components that catch and handle authentication-related errors gracefully.

#### 2. Angular SDK

##### Overview:

Angular, a comprehensive framework with a heavy emphasis on modularity and dependency injection, requires an SDK that integrates smoothly with its unique architecture.

##### Features:

- Angular Services: The SDK provides services like `AuthService` which can be injected into any component, directive, or pipe, making authentication-related methods and data accessible.
- Modules: It offers a dedicated `AuthModule` that encapsulates all authentication-related components, directives, and services. This ensures easy integration with Angular's modular architecture.
- Reactive Forms Integration: The SDK integrates with Angular's reactive forms, facilitating the creation of dynamic login and registration forms with validation.
- Route Guards: Leveraging Angular's routing system, the SDK offers guards to protect certain routes based on authentication state.

#### 3. Vue SDK

##### Overview:

Vue's progressive framework design, combined with its reactive data system, demands an SDK that feels like a natural extension of its ecosystem.

##### Features:

- Vue Mixins: The SDK offers mixins that encapsulate authentication methods and data, which can be easily incorporated into any component.
- Directives: Custom directives, such as `v-auth`, can be used within templates to easily bind authentication-related data or events.

### 3. Frontend Packages

These libraries are aimed at providing a consistent and user-friendly interface for authentication. The Libraries includes components for common authentication UI elements like login forms, logout buttons, and profile displays. These components can be easily customized and integrated.

#### Web Component

A component leveraging Web Component standards for VanillaJS developers. It ensures compatibility across a plethora of platforms, from static sites to complex SPAs.

#### React

A component library for React developers. It offers a range of components, from simple buttons to complex forms, that can be easily integrated into React applications.

#### Angular

A component library for Angular developers. It offers a range of components, from simple buttons to complex forms, that can be easily integrated into Angular applications.

#### Vue

A component library for Vue developers. It offers a range of components, from simple buttons to complex forms, that can be easily integrated into Vue applications.

### 4. SSR Packages

For applications that leverage Server-Side Rendering (SSR) for performance and SEO benefits, Corbado provides tailored solutions:

#### React (NextJS)

For Next.js applications, this package offers out-of-the-box support, integrating with its routing, data-fetching, and state management mechanisms.

#### Vue (Nuxt)

Designed for Nuxt.js, this package ensures that Vue applications benefit from both client-side interactivity and server-rendered optimizations.

## Interdependencies and Flow

The architecture emphasizes modularity while ensuring smooth inter-package communication. At its foundation, the `Web-Core` module handles essential authentication logic. SDKs act as intermediaries, interpreting and translating this logic for their respective frameworks. The UI libraries then offers a consistent user interface, which the SSR packages utilize to ensure optimal performance in server-rendered applications.
