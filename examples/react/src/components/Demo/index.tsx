import { DarkModeOptions } from './DarkModeOptions';
import { ThemeOptions } from './ThemeOptions';
import { TranslationsOptions } from './TranslationOptions';
import { CorbadoComponent } from './CorbadoComponent';

export const Demo = () => {
  return (
    <div className='flex gap-2 justify-items-center flex-col'>
      <CorbadoComponent />
      <DarkModeOptions />
      <ThemeOptions />
      <TranslationsOptions />
    </div>
  );
};
