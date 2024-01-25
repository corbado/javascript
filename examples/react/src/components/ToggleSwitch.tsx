import React from 'react';

interface Props {
  onClick: () => void;
  text: string;
}

const ToggleSwitch: React.FC<Props> = ({ text, onClick }) => {
  return (
    <label className='flex items-center cursor-pointer'>
      <div className='relative'>
        <input
          type='checkbox'
          className='sr-only'
          onClick={onClick}
        />
        <div className='block bg-gray-600 w-14 h-8 rounded-full'></div>
        <div className='dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition'></div>
      </div>
      <div className='ml-3 text-gray-700 font-medium'>{text}</div>
    </label>
  );
};

export default ToggleSwitch;
