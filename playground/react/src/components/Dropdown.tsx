import { useContext, useEffect, useRef, useState } from 'react';
import SettingsContext from '../contexts/SettingsContext';

const dropdownItems = [
  { id: process.env.REACT_APP_CORBADO_PROJECT_ID_ManualTesting!, label: 'Manual Testing' },
  { id: process.env.REACT_APP_CORBADO_PROJECT_ID_Tests!, label: 'Tests' },
  { id: process.env.REACT_APP_CORBADO_PROJECT_ID_LocalDevelopment!, label: 'Local Development' },
];

const Dropdown = () => {
  const { projectId } = useContext(SettingsContext);
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const handleItemClick = (id: string) => {
    localStorage.clear();
    window.location.pathname = `/${id}/auth`;
  };

  const toggleDropdown = () => setIsVisible(!isVisible);

  return (
    <div className='dropdown'>
      <button
        className='dropbtn'
        ref={el => el && dropdownRef}
        onClick={toggleDropdown}
      >
        Change Verification Method
      </button>
      {isVisible && (
        <div className='dropdown-content'>
          {dropdownItems.map(item => (
            <span
              key={item.id}
              className={`dropdown-item ${projectId === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
