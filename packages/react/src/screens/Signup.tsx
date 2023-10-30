import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Text from '../components/Text';
import LabelledInput from '../components/LabelledInput';
import Button from '../components/Button';
import Link from '../components/Link';

interface SignupForm {
    name: string;
    username: string;
}

const Signup = () => {
    const { t } = useTranslation();

    const [signupData, setSignupData] = React.useState<SignupForm>({ name: '', username: '' });

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        (event.target as HTMLInputElement).name;
        const { value, name } = event.target;
        setSignupData(prevData => ({ ...prevData, [name]: value }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | MouseEvent) => {
        e.preventDefault();

        console.log({ signupData });
    }

    return (
        <>
            <Text variant="header">{t('signup.header')}</Text>
            <Text variant="sub-header">
                {/* "text" is a placeholder value for translations */}
                <Trans i18nKey="signup.sub-header">
                    text <Link route='' className="text-secondary-font-color">text</Link> text
                </Trans>
            </Text>
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    <LabelledInput name='name' label={t('generic.name')} onChange={onChange} value={signupData.name} />
                    <LabelledInput name='username' label={t('generic.email')} onChange={onChange} value={signupData.username} type='email' />
                    <Button variant='primary'>{t('signup.continue_email')}</Button>
                </form>
            </div>
        </>
    )
}

export default Signup;