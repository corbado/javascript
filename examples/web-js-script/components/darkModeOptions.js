import { insertRadioButton } from './radioButton.js';

const darkModeOptionsHtml = `
<div class='flex flex-col gap-2'>
    <label class='subheading' htmlFor='dark-mode'>Change Dark Mode</label>
    <div id="dark-mode-options" class='flex gap-2 font-bold'></div>
</div>`;

const updateRadioButtons = value => {
  const autoDarkMode = document.getElementById('auto-dark-mode');
  const lightMode = document.getElementById('on-dark-mode');
  const darkMode = document.getElementById('off-dark-mode');

  switch (value) {
    case 'auto':
      autoDarkMode.checked = true;
      lightMode.checked = false;
      darkMode.checked = false;
      break;
    case 'on':
      autoDarkMode.checked = false;
      lightMode.checked = true;
      darkMode.checked = false;
      break;
    case 'off':
      autoDarkMode.checked = false;
      lightMode.checked = false;
      darkMode.checked = true;
      break;
  }
};

export function insertDarkModeOptions(onDarkModeChange) {
  const demoComponent = document.getElementById('demo');
  const optionsElement = demoComponent.appendChild(document.createElement('div'));
  optionsElement.setAttribute('class', 'flex mt-8 flex-col gap-2');
  optionsElement.innerHTML = darkModeOptionsHtml;

  const options = document.getElementById('dark-mode-options');

  insertRadioButton(
    'auto-dark-mode',
    options,
    () => {
      onDarkModeChange('auto');
      updateRadioButtons('auto');
    },
    'Auto',
    true,
  );

  insertRadioButton(
    'on-dark-mode',
    options,
    () => {
      onDarkModeChange('on');
      updateRadioButtons('on');
    },
    'On',
  );

  insertRadioButton(
    'off-dark-mode',
    options,
    () => {
      onDarkModeChange('off');
      updateRadioButtons('off');
    },
    'Off',
  );
}
