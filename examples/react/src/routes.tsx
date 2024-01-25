import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';

const RouteProvider = () => {
  const routes = [
    {
      path: '/',
      element: <HomePage />,
    },
  ];

  return <RouterProvider router={createBrowserRouter(routes)} />;
};

export default RouteProvider;
