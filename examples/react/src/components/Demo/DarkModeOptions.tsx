import { useContext } from 'react';
import RadioButton from '../RadioButton';
import { CustomizationsContext } from '../../contexts/CustomizationsContext';

export const DarkModeOptions = () => {
  const { darkMode, setDarkMode } = useContext(CustomizationsContext);

  const handleDarkModeChange = (value: string) => {
    setDarkMode(value as 'on' | 'off' | 'auto');
  };

  return (
    <div className='flex mt-8 flex-col gap-2'>
      <label
        className='subheading'
        htmlFor='dark-mode'
      >
        Change Dark Mode
      </label>
      <div className='flex gap-2 font-bold'>
        <RadioButton
          text='Auto'
          value='auto'
          currentValue={darkMode}
          onClick={handleDarkModeChange}
        />
        <RadioButton
          text='On'
          value={'on'}
          currentValue={darkMode}
          onClick={() => setDarkMode('on')}
        />
        <RadioButton
          text='Off'
          value={'off'}
          currentValue={darkMode}
          onClick={() => setDarkMode('off')}
        />
      </div>
    </div>
  );
};
