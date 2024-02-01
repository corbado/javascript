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

export function insertDemo(initialCorbadoApp: typeof Corbado) {
  let corbadoApp = initialCorbadoApp;
  let darkMode: 'auto' | 'on' | 'off' = 'auto';
  let theme = '';
  let translations: Record<string, object> = defaultEnglishTranslations;
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

  insertDemoComponent(corbadoApp);

  insertDarkModeOptions(async value => {
    darkMode = value as 'auto' | 'on' | 'off';
    await initializeCorbado();
  });

  insertThemeOptions(async value => {
    theme = value;
    await initializeCorbado();
  });

  insertTranslationOptions(async state => {
    translations = state ? customEnglishTranslations : defaultEnglishTranslations;
    await initializeCorbado();
  });
}
