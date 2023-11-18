import {useState} from "react";
import FilledButton from "../components/buttons/FilledButton.tsx";
import RoundedTextInput from "../components/inputs/RoundedTextInput.tsx";
import {useNavigate} from "react-router-dom";
import {useCorbado} from "@corbado/react-sdk";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const {loginWithPasskey, initLoginWithEmailOTP} = useCorbado();

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

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <p className='font-bold text-2xl pb-2'>Welcome back!</p>
            <p className='font-bold text-lg pb-2'>
                Don’t have an account yet? <span className='cursor-pointer' onClick={() => navigate('/signUpInit')}>Create account</span>
            </p>
            <div className='w-1/2'>
                <div className="grid gap-2">
                    <RoundedTextInput placeholder='Email address' onChange={setEmail}/>
                    <FilledButton content='Continue with email' onClick={submit}/>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
