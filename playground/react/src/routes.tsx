import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

const RouteProvider = () => {
  const routes = [
    {
      path: '/auth/:projectId',
      element: <AuthPage />,
    },
    {
      path: '/signup/:projectId',
      element: <SignUpPage />,
    },
    {
      path: '/login/:projectId',
      element: <LoginPage />,
    },
    {
      path: '/:projectId',
      element: <HomePage />,
    },
    {
      path: '/',
      element: <HomePage />,
    },
  ];

  return <RouterProvider router={createBrowserRouter(routes)} />;
};

export default RouteProvider;
