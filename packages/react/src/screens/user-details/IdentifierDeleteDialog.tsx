import type { Identifier } from '@corbado/types';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Text } from '../../components';
import Alert from '../../components/user-details/Alert';
import { useCorbado } from '../../hooks/useCorbado';
import { useCorbadoUserDetails } from '../../hooks/useCorbadoUserDetails';
import { getErrorCode } from '../../util';

interface Props {
  identifier: Identifier;
  onCancel: () => void;
}

const IdentifierDeleteDialog: FC<Props> = ({ identifier, onCancel }) => {
  const { t } = useTranslation('translation');
  const { deleteIdentifier } = useCorbado();
  const { getCurrentUser } = useCorbadoUserDetails();
  const [errorMessage, setErrorMessage] = useState<string>();

  const removeEmail = async () => {
    const res = await deleteIdentifier(identifier.id);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        if (code === 'no_remaining_verified_identifier' || code === 'no_remaining_identifier') {
          setErrorMessage(t('user-details.no_remaining_verified_identifier'));
        }
        console.error(t(`errors.${code}`));
      }
      return;
    }
    void getCurrentUser();
    onCancel();
  };

  const getHeading = () => {
    switch (identifier.type) {
      case 'email':
        return t('user-details.email_delete.header');
      case 'phone':
        return t('user-details.phone_delete.header');
      default:
        return '';
    }
  };

  const getBody = () => {
    switch (identifier.type) {
      case 'email':
        return t('user-details.email_delete.body');
      case 'phone':
        return t('user-details.phone_delete.body');
      default:
        return '';
    }
  };

  const getAlert = () => {
    switch (identifier.type) {
      case 'email':
        return t('user-details.email_delete.alert');
      case 'phone':
        return t('user-details.phone_delete.alert');
      default:
        return '';
    }
  };

  return (
    <div className='cb-user-details-deletion-dialog'>
      {errorMessage ? (
        <>
          <Alert
            text={t('user-details.no_remaining_verified_identifier')}
            variant='error'
          />
          <Button
            className='cb-primary-button cb-user-details-deletion-dialog-secondary-button'
            onClick={() => onCancel()}
          >
            {t('user-details.cancel')}
          </Button>
        </>
      ) : (
        <>
          <Text
            level='3'
            fontWeight='bold'
          >
            {getHeading()}
          </Text>
          <Text className='cb-text-2'>{getBody()}</Text>

          <Alert
            text={getAlert()}
            variant='info'
          ></Alert>

          <div className='cb-user-details-deletion-dialog-cta'>
            <Button
              className='cb-primary-button cb-user-details-deletion-dialog-primary-button'
              onClick={() => void removeEmail()}
            >
              {t('user-details.remove')}
            </Button>
            <Button
              className='cb-primary-button cb-user-details-deletion-dialog-secondary-button'
              onClick={onCancel}
            >
              {t('user-details.cancel')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default IdentifierDeleteDialog;
