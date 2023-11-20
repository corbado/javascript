import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import InitiateSignupPage from './pages/InitiateSignupPage';
import SelectSignupMethodPage from './pages/SelectSignupMethodPage.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import CompleteEmailOTP from './pages/CompleteEmailOTP.tsx';

const RouteProvider = () => {
  const routes = [
    {
      path: '/',
      element: <InitiateSignupPage />,
    },
    {
      path: '/signUpInit',
      element: <InitiateSignupPage />,
    },
    {
      path: '/signUpSelectMethod',
      element: <SelectSignupMethodPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/home',
      element: <HomePage />,
    },
    {
      path: '/completeEmailOTP',
      element: <CompleteEmailOTP />,
    },
  ];

  return <RouterProvider router={createBrowserRouter(routes)} />;
};

export default RouteProvider;
