import {Amplify} from 'aws-amplify';

export const configureAmplify = () => {
    Amplify.configure({
        Auth: {
            Cognito: {
                userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
                userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID!,
            }
        }
    }, {ssr: true});
}
