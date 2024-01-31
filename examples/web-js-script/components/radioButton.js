export function insertRadioButton(inputId, target, onClick, text, checked = false) {
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
