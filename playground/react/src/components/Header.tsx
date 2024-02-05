import { useState } from 'react';
import Dropdown from './Dropdown';

const Header = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <>
      <header className='sticky-header'>
        <div className='header-content'>
          <button
            className='menu-icon'
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          >
            ☰
          </button>
          <span className='desktop-header'>
            <div className='header-title'>Corbado React Playground</div>
            <Dropdown />
          </span>
        </div>
      </header>
      {isSidebarVisible && (
        <aside className='mobile-sidebar'>
          <div className='sidebar-header'>
            <div>Corbado React Playground</div>
            <button
              className='close-icon'
              onClick={() => setIsSidebarVisible(false)}
            >
              X
            </button>
          </div>
          <Dropdown />
        </aside>
      )}
    </>
  );
};

export default Header;
