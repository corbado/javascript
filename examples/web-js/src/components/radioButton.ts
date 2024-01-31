export function insertRadioButton(
  inputId: string,
  target: HTMLElement,
  onClick: () => void,
  text: string,
  checked: boolean = false,
) {
  const radioButton = document.createElement('label');
  radioButton.setAttribute('id', 'label-' + text);
  radioButton.setAttribute('class', 'inline-flex items-center');
  radioButton.innerHTML = `
    <input
      type='radio'
      class='form-radio'
      id="${inputId}"
      name="${text}"
      ${checked ? 'checked' : ''}
    />
    <span class='ml-2'>${text}</span>
  `;
  target.appendChild(radioButton);
  radioButton.addEventListener('click', onClick);

  return radioButton;
}
