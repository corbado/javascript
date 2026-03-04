'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import SettingsContext from '../contexts/SettingsContext';

const dropdownItems = [
  {
    id: process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID || 'pro-1',
    label: 'Manual Testing',
  },
  {
    id: process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID_LocalDevelopment || 'pro-1',
    label: 'Local Development',
  },
].filter((item, index, all) => item.id && all.findIndex(x => x.id === item.id) === index);

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
    <div
      className='dropdown'
      ref={dropdownRef}
    >
      <button
        className='dropbtn'
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
