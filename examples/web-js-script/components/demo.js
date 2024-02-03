import { insertDemoComponent } from './demoComponent.js';
import { insertDarkModeOptions } from './darkModeOptions.js';
import { insertThemeOptions } from './themeOptions.js';
import { insertTranslationOptions } from './translationOptions.js';
import defaultEnglishTranslations from '../translations/enDefault.js';
import customEnglishTranslations from '../translations/enCustomized.js';

const demoHtml = `
<div id="demo" class='flex gap-2 justify-items-center flex-col px-2'></div>
`;

export function insertDemo(initialCorbadoApp) {
  let corbadoApp = initialCorbadoApp;
  let darkMode = 'auto';
  let theme = '';
  let translations = defaultEnglishTranslations;
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

  insertDemoComponent(corbadoApp);

  insertDarkModeOptions(async value => {
    darkMode = value;
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
