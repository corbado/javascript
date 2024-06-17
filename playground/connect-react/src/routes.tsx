import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
const RouteProvider = () => {
  const routes = [
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/home',
      element: <HomePage />,
    },
    {
      path: '/signup',
      element: <SignupPage />,
    },
  ];

  return <RouterProvider router={createBrowserRouter(routes)} />;
};

export default RouteProvider;
