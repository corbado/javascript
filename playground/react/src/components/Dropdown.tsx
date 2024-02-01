import { useNavigate, useParams } from 'react-router-dom';

const Dropdown = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const dropdownItems = [
    { id: 'pro-503401103218055321', label: 'Email OTP' },
    { id: 'pro-423122463392265807', label: 'Email Link' },
  ];

  const handleItemClick = (id: string) => {
    if (projectId === id) return;

    navigate(`/auth/${id}`);
  };

  return (
    <div className='dropdown'>
      <button className='dropbtn'>Change Verification Method</button>
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
    </div>
  );
};

export default Dropdown;
