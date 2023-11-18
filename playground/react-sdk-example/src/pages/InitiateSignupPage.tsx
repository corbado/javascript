import {useState} from "react";
import FilledButton from "../components/buttons/FilledButton.tsx";
import RoundedTextInput from "../components/inputs/RoundedTextInput.tsx";
import {useNavigate} from "react-router-dom";

const InitiateSignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const submit = () => {
        navigate('/signUpSelectMethod', {state: {email: email, username: username}});
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <p className='font-bold text-2xl pb-2'>Create your account</p>
            <p className='font-bold text-lg pb-2'>
                You already have an account? <span className='cursor-pointer' onClick={() => navigate('/login')}>Log in</span>
            </p>
            <div className='w-1/2'>
                <div className="grid gap-2">
                    <RoundedTextInput placeholder='Email' onChange={setEmail}/>
                    <RoundedTextInput placeholder='Username' onChange={setUsername}/>
                    <FilledButton content='Continue' onClick={submit}/>
                </div>
            </div>
        </div>
    )
}

export default InitiateSignupPage
