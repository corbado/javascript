import { fetchAuthSession } from 'aws-amplify/auth';
import { getConnectToken } from './actions';
import { CorbadoConnectPasskeyList } from '@corbado/connect-react';

export const PasskeySection = () => {
  return (
    <div className='mb-2 w-full'>
      <CorbadoConnectPasskeyList
        connectTokenProvider={async (connectTokenType: string) => {
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken?.toString();

          return await getConnectToken(connectTokenType, idToken);
        }}
      />
    </div>
  );
};

export default PasskeySection;
