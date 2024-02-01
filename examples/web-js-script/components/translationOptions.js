import { insertRadioButton } from './radioButton.js';

const translationsOptionsHtml = `
<div class='flex flex-col gap-2'>
    <label class='subheading' htmlFor='translations'>Change Dark Mode</label>
    <div id="translations-options" class='flex gap-2 font-bold'></div>
    <p class='paragraph'>
        Documentation for customizing translations are
        <a
            href='https://docs.corbado.com/frontend-integration/ui-components/less-than-corbadoprovider-greater-than#custom-translations'
            target='_blank'
            class='text-blue-600'
        >
            here
        </a>
    </p>
</div>`;

const updateRadioButtons = state => {
  const defaultTranslations = document.getElementById('default-translations');
  const customTranslations = document.getElementById('custom-translations');

  if (state) {
    defaultTranslations.checked = false;
    customTranslations.checked = true;
  } else {
    defaultTranslations.checked = true;
    customTranslations.checked = false;
  }
};

export function insertTranslationOptions(onTranslationChange) {
  const demoComponent = document.getElementById('demo');
  const optionsElement = demoComponent.appendChild(document.createElement('div'));
  optionsElement.setAttribute('class', 'flex mt-8 flex-col gap-2');
  optionsElement.innerHTML = translationsOptionsHtml;

  const options = document.getElementById('translations-options');

  insertRadioButton(
    'default-translations',
    options,
    () => {
      onTranslationChange(false);
      updateRadioButtons(false);
    },
    'Default',
    true,
  );

  insertRadioButton(
    'custom-translations',
    options,
    () => {
      onTranslationChange(true);
      updateRadioButtons(true);
    },
    'Custom Translation',
  );
}
