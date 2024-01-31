import { insertRadioButton } from './radioButton';

const themeOptionsHtml = `
<div class='flex flex-col gap-2'>
    <label class='subheading' htmlFor='theme'>Change Theme</label>
    <div id="theme-options" class='flex gap-2 font-bold'></div>
    <p class='paragraph'>
      Documentation for customizing themes are
      <a
        href='https://docs.corbado.com/frontend-integration/ui-components/less-than-corbadoprovider-greater-than#custom-themes'
        target='_blank'
        class='text-blue-600'
      >
        here
      </a>
    </p>
</div>`;

const updateRadioButtons = (value: string) => {
  const basicTheme = document.getElementById('basic-theme') as HTMLInputElement;
  const emeraldFunkTheme = document.getElementById('cb-emerald-funk-theme') as HTMLInputElement;
  const corbadoCustomTheme = document.getElementById('corbado-custom-theme') as HTMLInputElement;

  if (document.body.classList.contains('cb-emerald-funk-theme')) {
    document.body.classList.remove('cb-emerald-funk-theme');
  } else if (document.body.classList.contains('corbado-custom-theme')) {
    document.body.classList.remove('corbado-custom-theme');
  }

  switch (value) {
    case '':
      basicTheme.checked = true;
      emeraldFunkTheme.checked = false;
      corbadoCustomTheme.checked = false;
      break;
    case 'cb-emerald-funk-theme':
      basicTheme.checked = false;
      emeraldFunkTheme.checked = true;
      corbadoCustomTheme.checked = false;
      break;
    case 'corbado-custom-theme':
      basicTheme.checked = false;
      emeraldFunkTheme.checked = false;
      corbadoCustomTheme.checked = true;
      break;
  }
};

export function insertThemeOptions(onThemeChange: (value: string) => void) {
  const demoComponent = document.getElementById('demo');
  const optionsElement = demoComponent!.appendChild(document.createElement('div'));
  optionsElement.setAttribute('class', 'flex mt-8 flex-col gap-2');
  optionsElement.innerHTML = themeOptionsHtml;

  const options = document.getElementById('theme-options');

  insertRadioButton(
    'basic-theme',
    options!,
    () => {
      updateRadioButtons('');
      onThemeChange('');
    },
    'Basic',
    true,
  );

  insertRadioButton(
    'cb-emerald-funk-theme',
    options!,
    () => {
      updateRadioButtons('cb-emerald-funk-theme');
      onThemeChange('cb-emerald-funk-theme');
    },
    'Emerald Funk',
  );

  insertRadioButton(
    'corbado-custom-theme',
    options!,
    () => {
      updateRadioButtons('corbado-custom-theme');
      onThemeChange('corbado-custom-theme');
    },
    'Customized Theme',
  );
}
