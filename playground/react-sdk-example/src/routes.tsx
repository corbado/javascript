import {createBrowserRouter, RouterProvider} from "react-router-dom";
import InitiateSignupPage from "./pages/InitiateSignupPage";
import SelectSignupMethodPage from "./pages/SelectSignupMethodPage.tsx";

const RouteProvider = () => {
    const routes = [
        {
            path: '/',
            element: <InitiateSignupPage />
        },
        {
            path: '/signUpInit',
            element: <InitiateSignupPage />
        },
        {
            path: '/signUpSelectMethod',
            element: <SelectSignupMethodPage />
        }
    ];

    return <RouterProvider router={createBrowserRouter(routes)} />
}

export default RouteProvider
