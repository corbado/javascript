import { useCorbadoSession } from '@corbado/react';

export const WelcomeMessage = () => {
  const { user, isAuthenticated } = useCorbadoSession();
  return isAuthenticated ? (
    <div className='font-eloquent text-black bg-white'>
      <h1 className='text-darkBrown'>Hi {user?.orig},</h1>
      <p className='text-lightBrown'>Welcome to Corbado React's test application</p>
    </div>
  ) : null;
};
