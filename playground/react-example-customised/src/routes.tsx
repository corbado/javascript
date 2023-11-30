import { RouteObject } from 'react-router-dom';
import App from './App';
import ErrorPage from './pages/error';
import SignUp from './pages/signup';
import Login from './pages/login';
import SignUpStart from './package/screens/signup/start';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <SignUp />,
        children: [
          {
            path: '',
            element: <h1>In Progress</h1>, //<SignUpStart />,
          },
        ],
      },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
];

export default routes;
