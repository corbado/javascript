import { useCorbado } from '@corbado/react';
import { AuthDetails } from '../components/AuthDetails';
import { AuthButtons } from '../components/AuthButtons';

const HomePage = () => {
  const { isAuthenticated } = useCorbado();

  return isAuthenticated ? <AuthDetails /> : <AuthButtons />;
};

export default HomePage;
