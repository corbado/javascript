import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import { useCorbado } from '@corbado/react-sdk';
import { useEffect } from 'react';
import { AuthUIProvider } from './contexts/AuthUIProvider.tsx';
import CorbadoAuthPage from './pages/CorbadoAuthPage.tsx';

const RouteProvider = () => {
  const { globalError } = useCorbado();
  useEffect(() => {
    if (globalError) {
      console.log(globalError);
    }
  }, [globalError]);

  const routes = [
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/auth',
      element: (
        <AuthUIProvider>
          <CorbadoAuthPage />
        </AuthUIProvider>
      ),
    },
    {
      path: '/home',
      element: <HomePage />,
    },
  ];

  return <RouterProvider router={createBrowserRouter(routes)} />;
};

export default RouteProvider;
