import { RouteObject } from 'react-router-dom';
import App from './App';
import ErrorPage from './pages/error';
import SignUp from './pages/signup';
import Login from './pages/login';
import SignUpStart from './package/screens/signup/Start';
import Passkey from './package/screens/signup/Passkey';
import EmailOtp from './package/screens/signup/EmailOTP';
import PasskeyBenefits from './package/screens/signup/PasskeyBenefits';
import PasskeyError from './package/screens/signup/PasskeyError';
import PasskeySuccess from './package/screens/signup/PasskeySuccess';

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
            element: <SignUpStart />,
          },
          {
            path: '/passkey',
            element: <Passkey />,
          },
          {
            path: '/email-otp',
            element: <EmailOtp />,
          },
          {
            path: '/passkey-benefits',
            element: <PasskeyBenefits />,
          },
          {
            path: '/passkey-success',
            element: <PasskeySuccess />,
          },
          {
            path: '/passkey-error',
            element: <PasskeyError />,
          },
          {
            path: '/passkey-prompt',
            element: <div>Passkey Prompt</div>,
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
