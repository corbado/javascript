import { CorbadoAuth, CorbadoThemes, PasskeyList, useCorbado } from '@corbado/react';
import { useContext } from 'react';
import { CustomizationsContext } from '../contexts/CustomizationsContext';
import RadioButton from './RadioButton';

export const Demo = () => {
  const { isAuthenticated } = useCorbado();
  const { darkMode, customTheme, customTranslation, setCustomTheme, setCustomTranslation, setDarkMode } =
    useContext(CustomizationsContext);

  const handleTranslationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event);
    //setCustomTranslation(event.target.value ? JSON.parse(event.target.value) : null);
  };

  const handleDarkModeChange = (value: string) => {
    setDarkMode(value as 'on' | 'off' | 'auto');
  };

  return (
    <div className='flex gap-2 justify-items-center flex-col'>
      {isAuthenticated ? <PasskeyList /> : <CorbadoAuth onLoggedIn={() => void 0} />}
      <div className='flex mt-8 flex-col gap-2'>
        <label
          className='subheading'
          htmlFor='theme'
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
      <div className='flex mt-8 flex-col gap-2'>
        <label
          className='subheading'
          htmlFor='theme'
        >
          Change Theme
        </label>
        <div className='flex gap-2 font-bold'>
          <RadioButton
            text='Default'
            value={''}
            currentValue={customTheme}
            onClick={setCustomTheme}
          />
          <RadioButton
            text='Emerald Funk'
            value={CorbadoThemes.EmeraldFunk}
            currentValue={customTheme}
            onClick={setCustomTheme}
          />
          <RadioButton
            text='Customized Theme'
            value={'corbado-custom-theme'}
            currentValue={customTheme}
            onClick={setCustomTheme}
          />
        </div>
        <p className='paragraph'>
          Documentation for customizing themes are{' '}
          <a
            href='https://docs.corbado.com/frontend-integration/ui-components/less-than-corbadoprovider-greater-than#custom-themes'
            target='_blank'
            className='text-blue-600'
          >
            here
          </a>
        </p>
      </div>
    </div>
  );
};
