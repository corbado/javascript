import { Config, SDK } from '@corbado/node-sdk';
import { cookies } from 'next/headers';
import { CheckCircleIcon, XCircleIcon, UserCircleIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default async function CurrentUser() {
  const cookieStore = cookies();
  const session = cookieStore.get('cbo_short_session');
  const projectID = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!;
  const apiSecret = process.env.CORBADO_API_SECRET!;

  const config = new Config(projectID, apiSecret);
  const sdk = new SDK(config);

  const users = await sdk.sessions().getCurrentUser(session?.value ?? '');

  return (
    <>
      <h1 className='text-2xl font-bold'>Hi {users.getName()},</h1>
      <div className='mb-3 mt-3'>
        <p>These are your user details:</p>
        <ul className='m-3 flex flex-col gap-3'>
          <li className='flex'>
            <EnvelopeIcon className='w-6 mr-2' /> Email: {users.getEmail()}
          </li>
          <li className='flex'>
            <UserCircleIcon className='w-6 mr-2' /> Name: {users.getName()}
          </li>
          <li className='flex'>
            <PhoneIcon className='w-6 mr-2' /> Phone Number: {users.getPhoneNumber()}
          </li>
          <li className='flex gap-2'>
            Is Authenticated:{' '}
            {users.isAuthenticated() ? <CheckCircleIcon className='w-6' /> : <XCircleIcon className='w-6' />}
          </li>
        </ul>
      </div>
    </>
  );
}
