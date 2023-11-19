import {createBrowserRouter, RouterProvider, useNavigate} from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";

const RouteProvider = () => {
  const routes = [
    {
      path: '/auth',
      element: <AuthPage/>
    },
    {
      path: '/home',
      element: <HomePage/>
    }
  ];

  return <RouterProvider router={createBrowserRouter(routes)}/>
}

export default RouteProvider
