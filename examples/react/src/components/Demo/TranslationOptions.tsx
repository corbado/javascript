import { useContext, useState } from 'react';
import RadioButton from '../RadioButton';
import { CustomizationsContext } from '../../contexts/CustomizationsContext';
import englishCustomizedTranslations from '../../translations/enCustomized';
import englishDefaultTranslations from '../../translations/enDefault';

export const TranslationsOptions = () => {
  const { customTranslation, setCustomTranslation } = useContext(CustomizationsContext);
  const [hasCustomTranslation, setHasCustomTranslation] = useState(customTranslation ? '1' : '');

  const handleCustomTranslationChange = (value: string) => {
    setHasCustomTranslation(value);
    setCustomTranslation({
      en: value ? englishCustomizedTranslations : englishDefaultTranslations,
    });
  };

  return (
    <div className='flex mt-8 flex-col gap-2'>
      <label
        className='subheading'
        htmlFor='translation'
      >
        Use Custom Translations
      </label>
      <div className='flex gap-2 font-bold'>
        <RadioButton
          text='Default'
          value={''}
          currentValue={hasCustomTranslation}
          onClick={handleCustomTranslationChange}
        />
        <RadioButton
          text='Custom Translation'
          value={'1'}
          currentValue={hasCustomTranslation}
          onClick={handleCustomTranslationChange}
        />
      </div>
      <p className='paragraph'>
        Documentation for customizing translations are{' '}
        <a
          href='https://docs.corbado.com/frontend-integration/ui-components/less-than-corbadoprovider-greater-than#custom-translations'
          target='_blank'
          className='text-blue-600'
        >
          here
        </a>
      </p>
    </div>
  );
};
