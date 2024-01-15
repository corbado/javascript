import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

const RouteProvider = () => {
  const routes = [
    {
      path: '/auth',
      element: <AuthPage />,
    },
    {
      path: '/signup',
      element: <SignUpPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: <HomePage />,
    },
  ];

  return <RouterProvider router={createBrowserRouter(routes)} />;
};

export default RouteProvider;
