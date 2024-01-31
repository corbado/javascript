import { useContext } from 'react';
import { ProjectIdContext, ProjectIdTypeEnum } from '../contexts/ProjectIdContext';

const Dropdown = () => {
  const { updateProjectId, projectIdType } = useContext(ProjectIdContext);

  const dropdownItems = [
    { id: ProjectIdTypeEnum.PasskeyWithEmailOtpFallback, label: 'Passkey With Email Otp Fallback' },
    { id: ProjectIdTypeEnum.PasskeyWithEmailLinkFallback, label: 'Passkey With Email Link Fallback' },
    { id: ProjectIdTypeEnum.EmailOtpWithPasskeyAppend, label: 'Email Otp With Passkey Append' },
    { id: ProjectIdTypeEnum.EmailLinkWithPasskeyAppend, label: 'Email Link With Passkey Append' },
  ];

  const handleItemClick = (type: ProjectIdTypeEnum) => {
    updateProjectId(type);
  };

  return (
    <div className='dropdown'>
      <button className='dropbtn'>Change Auth Flow</button>
      <div className='dropdown-content'>
        {dropdownItems.map(item => (
          <span
            key={item.id}
            className={`dropdown-item ${projectIdType === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item.id)}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
