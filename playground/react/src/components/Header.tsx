import Dropdown from './Dropdown';

const Header = () => {
  return (
    <header className='sticky-header'>
      <div className='header-content'>
        <div className='header-title'>Corbado React Playground</div>
        <Dropdown />
      </div>
    </header>
  );
};

export default Header;
