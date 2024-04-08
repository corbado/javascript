import Corbado from '@corbado/web-js';
import { insertDemoComponent } from './demoComponent';
import { insertDarkModeOptions } from './darkModeOptions';
import { insertThemeOptions } from './themeOptions';
import { insertTranslationOptions } from './translationOptions';
import defaultEnglishTranslations from '../translations/enDefault';
import customEnglishTranslations from '../translations/enCustomized';

const demoHtml = `
<div id="demo" class='flex gap-2 justify-items-center flex-col px-2'></div>
`;

export async function insertDemo(initialCorbadoApp: typeof Corbado) {
  let corbadoApp = initialCorbadoApp;
  let darkMode: 'auto' | 'on' | 'off' = (localStorage.getItem('darkMode') as 'auto' | 'on' | 'off') || 'auto';
  let theme = localStorage.getItem('theme') || '';
  const useCustomTranslations = localStorage.getItem('translations') === 'custom';
  let translations: Record<string, object> = useCustomTranslations
    ? customEnglishTranslations
    : defaultEnglishTranslations;
  document.getElementById('right-section')!.innerHTML = demoHtml;

  const initializeCorbado = async () => {
    await Corbado.load({
      projectId: import.meta.env.VITE_CORBADO_PROJECT_ID,
      darkMode,
      theme,
      customTranslations: {
        en: translations,
      },
    });
    insertDemoComponent(corbadoApp);
  };

  await initializeCorbado();

  insertDarkModeOptions(darkMode, async value => {
    darkMode = value as 'auto' | 'on' | 'off';
    localStorage.setItem('darkMode', darkMode);
    await initializeCorbado();
  });

  insertThemeOptions(theme, async value => {
    theme = value;
    localStorage.setItem('theme', theme);
    await initializeCorbado();
  });

  insertTranslationOptions(useCustomTranslations, async state => {
    translations = state ? customEnglishTranslations : defaultEnglishTranslations;
    localStorage.setItem('translations', state ? 'custom' : 'default');
    await initializeCorbado();
  });
}
