import {useEffect, useRef, useState} from "react";
import FilledButton from "../components/buttons/FilledButton.tsx";
import RoundedTextInput from "../components/inputs/RoundedTextInput.tsx";
import {useNavigate} from "react-router-dom";
import {useCorbado} from "@corbado/react-sdk";
import {LoginHandler} from "@corbado/web-core";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loginHandler, setLoginHandler] = useState<LoginHandler>();
  const navigate = useNavigate();
  const {loginWithPasskey, initLoginWithEmailOTP, initAutocompletedLoginWithPasskey} = useCorbado();
  const initialized = useRef(false)
  const conditionalUIStarted = useRef(false)

  useEffect(() => {
    if (initialized.current) {
      return
    }

    initialized.current = true

    initAutocompletedLoginWithPasskey().then(lh => setLoginHandler(lh))
  }, []);

  const submit = async () => {
    try {
      await loginWithPasskey(email);
      navigate('/home');
    } catch (e) {
      console.log(e);
      await initLoginWithEmailOTP(email);
      navigate('/completeEmailOTP')
    }
  }

  const onFocusEmail = async () => {
    if (conditionalUIStarted.current) {
      return
    }

    conditionalUIStarted.current = true

    try {
      await loginHandler?.completionCallback()
      navigate('/home')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <p className='font-bold text-2xl pb-2'>Welcome back!</p>
      <p className='font-bold text-lg pb-2'>
        Don’t have an account yet? <span className='cursor-pointer' onClick={() => navigate('/signUpInit')}>Create account</span>
      </p>
      <div className='w-1/2'>
        <div className="grid gap-2">
          <RoundedTextInput placeholder='Email address' onChange={setEmail} onFocus={onFocusEmail}/>
          <FilledButton content='Continue with email' onClick={submit}/>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
