import {createBrowserRouter, RouterProvider} from "react-router-dom";
import CorbadoAuthUI from "@corbado/react";
import HomePage from "./pages/HomePage";

const RouteProvider = () => {
    const routes = [
        {
            path: '/auth',
            element: <CorbadoAuthUI projectId='pro-1743528526530787479'/>
        },
        {
            path: '/home',
            element: <HomePage />
        }
    ];

    return <RouterProvider router={createBrowserRouter(routes)} />
}

export default RouteProvider
