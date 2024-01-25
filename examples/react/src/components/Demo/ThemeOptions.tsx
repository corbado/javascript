import { useContext } from 'react';
import RadioButton from '../RadioButton';
import { CustomizationsContext } from '../../contexts/CustomizationsContext';
import { CorbadoThemes } from '@corbado/react';

export const ThemeOptions = () => {
  const { customTheme, setCustomTheme } = useContext(CustomizationsContext);
  return (
    <div className='flex mt-8 flex-col gap-2'>
      <label
        className='subheading'
        htmlFor='theme'
      >
        Change Theme
      </label>
      <div className='flex gap-2 font-bold'>
        <RadioButton
          text='Basic'
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
  );
};
