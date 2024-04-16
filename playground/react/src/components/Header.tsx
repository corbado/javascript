import { useContext, useState } from 'react';
import Dropdown from './Dropdown';
import SettingsContext from '../contexts/SettingsContext';

const Header = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(SettingsContext);
  const darkModeButtonTitle = darkMode ? 'Light Mode' : 'Dark Mode';

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
            <button
              className='dropbtn'
              onClick={toggleDarkMode}
            >
              {darkModeButtonTitle}
            </button>
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
          <button
            className='dropbtn'
            onClick={toggleDarkMode}
          >
            {darkModeButtonTitle}
          </button>
          <Dropdown />
        </aside>
      )}
    </>
  );
};

export default Header;
