import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SignUpForm from './components_temp/SignUpFrom';

const RouteProvider = () => {
  const routes = [
    {
      path: 'testing',
      element: <SignUpForm />,
    },
    {
      path: '/:projectId/auth',
      element: <AuthPage />,
    },
    {
      path: '/:projectId/signup',
      element: <SignUpPage />,
    },
    {
      path: '/:projectId/login',
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
