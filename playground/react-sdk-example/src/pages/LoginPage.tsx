import {useState} from "react";
import FilledButton from "../components/buttons/FilledButton.tsx";
import RoundedTextInput from "../components/inputs/RoundedTextInput.tsx";
import {useNavigate} from "react-router-dom";
import {useCorbado} from "@corbado/react-sdk";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const {loginWithPasskey} = useCorbado();

    const submit = async () => {
        try {
            await loginWithPasskey(email);
            navigate('/home');
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <p className='font-bold text-2xl pb-2'>Welcome back!</p>
            <p className='font-bold text-lg pb-2'>Don’t have an account yet? <a href="">Create account</a></p>
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
