import { insertDemoComponent } from './demoComponent.js';
import { insertDarkModeOptions } from './darkModeOptions.js';
import { insertThemeOptions } from './themeOptions.js';
import { insertTranslationOptions } from './translationOptions.js';
import defaultEnglishTranslations from '../translations/enDefault.js';
import customEnglishTranslations from '../translations/enCustomized.js';

const demoHtml = `
<div id="demo" class='flex gap-2 justify-items-center flex-col px-2'></div>
`;

export async function insertDemo(initialCorbadoApp) {
  let corbadoApp = initialCorbadoApp;
  let darkMode = localStorage.getItem('darkMode') || 'auto';
  let theme = localStorage.getItem('theme') || '';
  const useCustomTranslations = localStorage.getItem('translations') === 'custom';
  let translations = useCustomTranslations ? customEnglishTranslations : defaultEnglishTranslations;
  document.getElementById('right-section').innerHTML = demoHtml;

  const initializeCorbado = async () => {
    const projectID = window.location.href.includes('localhost') ? 'pro-1743528526530787479' : 'pro-523751808285927805';

    await Corbado.load({
      projectId: projectID,
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
    darkMode = value;
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
