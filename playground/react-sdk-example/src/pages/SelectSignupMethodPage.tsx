import FilledButton from "../components/buttons/FilledButton.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useCorbadoAuth} from "@corbado/react-sdk";

interface Props {
    username: string,
    email: string
}

const SelectSignupMethodPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state.email;
    const {passkeyRegister} = useCorbadoAuth();

    const registerWithPasskey = async () => {
        try {
            await passkeyRegister();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <p className='font-bold text-2xl pb-2'>Let's get you set up with Passkeys</p>
            <p className='font-bold text-lg'>We'll create an account for</p>
            <p>{email}</p>
            <form className='w-1/2 mt-2'>
                <div className="grid gap-2">
                    <FilledButton content='Create your account' onClick={registerWithPasskey}/>
                    <FilledButton content='Send email one time code' onClick={() => {}}/>
                    <p className='text-center cursor-pointer' onClick={() => navigate(-1)}>Back</p>
                </div>
            </form>
        </div>
    )
}

export default SelectSignupMethodPage
