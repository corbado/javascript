import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CopyIcon } from '../icons/CopyIcon';
import { TickIcon } from '../icons/TickIcon';
import { Text } from '../typography';

interface Props {
  text: string | undefined;
}

const RESET_TIMEOUT = 4 * 1000;

const CopyButton: FC<Props> = ({ text }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const reset = () => {
      setCopied(false);
    };

    if (copied) {
      const timeout = setTimeout(reset, RESET_TIMEOUT);

      return () => clearTimeout(timeout);
    }

    return;
  }, [copied]);

  const onClick = async () => {
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    }
  };

  if (copied) {
    return (
      <div className='cb-tooltip-container'>
        <TickIcon className='cb-user-details-body-row-icon' />
        <div className='cb-tooltip'>
          <Text level='1'>{t('user-details.copied')}</Text>
        </div>
      </div>
    );
  }

  return (
    <CopyIcon
      className='cb-user-details-body-row-icon'
      color='secondary'
      onClick={() => void onClick()}
    />
  );
};

export default CopyButton;
