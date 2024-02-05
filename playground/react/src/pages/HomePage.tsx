import { useCorbado } from '@corbado/react';
import withCorbadoProvider from '../hoc/withCorbadoProvider';
import { AuthDetails } from '../components/AuthDetails';
import { AuthButtons } from '../components/AuthButtons';

const HomePage = () => {
  const { isAuthenticated } = useCorbado();

  return isAuthenticated ? <AuthDetails /> : <AuthButtons />;
};

export default withCorbadoProvider(HomePage);
