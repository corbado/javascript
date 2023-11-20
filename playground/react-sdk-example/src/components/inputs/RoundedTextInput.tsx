import { ChangeEvent } from 'react';

interface Props {
  placeholder: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
}

const RoundedTextInput = ({ placeholder, onChange, onFocus }: Props) => {
  const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const onFocusClick = () => {
    console.log('onFocusClick', onFocus);

    if (!onFocus) {
      return;
    }

    onFocus();
  };

  return (
    <input
      type='text'
      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
      placeholder={placeholder}
      onChange={onValueChange}
      onFocus={onFocusClick}
      required
    />
  );
};

export default RoundedTextInput;
