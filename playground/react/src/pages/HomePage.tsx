import { useCorbado } from '@corbado/react';
import withCorbadoProvider from '../hoc/withCorbadoProvider';
import { AuthDetails } from '../components/AuthDetails';
import { AuthButtons } from '../components/AuthButtons';
// import './temp.css';
// import Logo from '../assets/logo.svg';
// import SignUpForm from '../components_temp/SignUpFrom';

const HomePage = () => {
  const { isAuthenticated } = useCorbado();

  // return (
  //   <>
  //     <div className='cb-container'>
  //       <div className='cb-header'>Create your account</div>
  //       <div className='cb-subheader'>to continue to AppName</div>

  //       <div>
  //         <label className='cb-input-label'>Username</label>
  //         <input
  //           type='text'
  //           className='cb-input-field'
  //         />
  //       </div>

  //       <div className='cb-input-field'>
  //         <label className='cb-input-label'>Email address</label>
  //         <input type='email' />
  //       </div>

  //       <button className='cb-continue-button'>Continue</button>

  //       <div className='cb-login-link'>
  //         You already have an account?{' '}
  //         <a
  //           href='#'
  //           className='cb-login-link-text'
  //         >
  //           Log in
  //         </a>
  //       </div>
  //     </div>
  //   </>
  // );

  return isAuthenticated ? <AuthDetails /> : <AuthButtons />;
};

export default withCorbadoProvider(HomePage);
