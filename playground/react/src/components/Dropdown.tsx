import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const dropdownItems = [
  { id: process.env.REACT_APP_CORBADO_PROJECT_ID_EmailOtp!, label: 'Email OTP' },
  { id: process.env.REACT_APP_CORBADO_PROJECT_ID_EmailLink!, label: 'Email Link' },
];

const Dropdown = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
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
    if (projectId === id) return;

    navigate(`/${id}/auth`);
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
