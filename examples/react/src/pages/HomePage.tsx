import { Header } from '../components/Header';
import { UserDetails } from '../components/userDetails';

const HomePage = () => {
  return (
    <div className='font-eloquent text-black bg-white min-h-screen flex flex-col'>
      <Header />
      <UserDetails />
    </div>
  );
};

export default HomePage;
