import { LoginIdentifierType } from '@corbado/shared-ui';
import type { Identifier } from '@corbado/types';
import { t } from 'i18next';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button, PhoneInputField, Text } from '../../components';
import { AddIcon } from '../../components/ui/icons/AddIcon';
import { PendingIcon } from '../../components/ui/icons/PendingIcon';
import { PrimaryIcon } from '../../components/ui/icons/PrimaryIcon';
import { VerifiedIcon } from '../../components/ui/icons/VerifiedIcon';
import DropdownMenu from '../../components/user-details/DropdownMenu';
import UserDetailsCard from '../../components/user-details/UserDetailsCard';
import { useCorbado } from '../../hooks/useCorbado';
import { useCorbadoUserDetails } from '../../hooks/useCorbadoUserDetails';
import { getErrorCode } from '../../util';
import IdentifierDeleteDialog from './IdentifierDeleteDialog';
import IdentifierVerifyDialog from './IdentifierVerifyDialog';

const PhonesEdit = () => {
  const { createIdentifier } = useCorbado();
  const { phones = [], getCurrentUser, phoneEnabled } = useCorbadoUserDetails();

  const initialPhones = useRef<Identifier[]>();

  const [verifyingPhones, setVerifyingPhones] = useState<Identifier[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [deletingPhone, setDeletingPhone] = useState<Identifier>();
  const [addingPhone, setAddingPhone] = useState<boolean>(false);
  const [newPhone, setNewPhone] = useState<string>('');

  const headerPhone = useMemo(() => t('user-details.phone'), [t]);

  const badgePrimary = useMemo(() => t('user-details.primary'), [t]);
  const badgeVerified = useMemo(() => t('user-details.verified'), [t]);
  const badgePending = useMemo(() => t('user-details.pending'), [t]);

  const buttonSave = useMemo(() => t('user-details.save'), [t]);
  const buttonCopy = useMemo(() => t('user-details.copy'), [t]);
  const buttonCancel = useMemo(() => t('user-details.cancel'), [t]);
  const buttonAddPhone = useMemo(() => t('user-details.add_phone'), [t]);
  const buttonVerify = useMemo(() => t('user-details.verify'), [t]);
  const buttonRemove = useMemo(() => t('user-details.remove'), [t]);

  useEffect(() => {
    if (initialPhones.current === undefined && phones.length > 0) {
      initialPhones.current = phones;

      return;
    }

    phones.forEach(phone => {
      if (initialPhones.current?.every(p => p.id !== phone.id)) {
        setVerifyingPhones(prev => [...prev, phone]);
      }
    });

    initialPhones.current = undefined;
  }, [phones]);

  const addPhone = async () => {
    if (!newPhone) {
      setErrorMessage(t('user-details.warning_invalid_phone'));
      return;
    }

    const res = await createIdentifier(LoginIdentifierType.Phone, newPhone);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        if (code === 'identifier_already_in_use') {
          setErrorMessage(t('user-details.phone_unique'));
        }

        console.error(t(`errors.${code}`));
      }
      return;
    }

    setNewPhone('');
    setAddingPhone(false);
    void getCurrentUser();
  };

  const startPhoneVerification = (phone: Identifier) => {
    setVerifyingPhones(prev => [...prev, phone]);
  };

  const onFinishPhoneVerification = (phone: Identifier) => {
    setVerifyingPhones(prev => prev.filter(v => v.id !== phone.id));
  };

  if (!phoneEnabled) {
    return null;
  }

  const getBadge = (phone: Identifier) => {
    switch (phone.status) {
      case 'primary':
        return { text: badgePrimary, icon: <PrimaryIcon className='cb-user-details-header-badge-icon' /> };

      case 'verified':
        return { text: badgeVerified, icon: <VerifiedIcon className='cb-user-details-header-badge-icon' /> };

      default:
        return { text: badgePending, icon: <PendingIcon className='cb-user-details-header-badge-icon' /> };
    }
  };

  const getMenuItems = (phone: Identifier) => {
    const items = [buttonCopy];

    if (phone.status !== 'verified') {
      items.push(buttonVerify);
    }

    items.push(buttonRemove);

    return items;
  };

  const copyPhone = async (phone: string) => {
    await navigator.clipboard.writeText(phone);
  };

  return (
    <UserDetailsCard header={headerPhone}>
      {phones.reverse().map((phone, index) => (
        <div
          className='cb-user-details-identifier-container'
          key={index}
        >
          {verifyingPhones.some(verifyingPhone => verifyingPhone.id === phone.id) ? (
            <IdentifierVerifyDialog
              identifier={phone}
              onCancel={() => onFinishPhoneVerification(phone)}
            />
          ) : (
            <>
              <div className='cb-user-details-body-row'>
                <div className='cb-user-details-header-badge-section'>
                  <Text className='cb-user-details-text'>{phone.value}</Text>
                  <div className='cb-user-details-header-badge'>
                    {getBadge(phone).icon}
                    <Text className='cb-user-details-badge-text'>{getBadge(phone).text}</Text>
                  </div>
                </div>
                <DropdownMenu
                  items={getMenuItems(phone)}
                  onItemClick={item => {
                    if (item === buttonVerify) {
                      void startPhoneVerification(phone);
                    } else if (item === buttonRemove) {
                      setDeletingPhone(phone);
                    } else {
                      void copyPhone(phone.value);
                    }
                  }}
                  getItemClassName={item => (item === buttonRemove ? 'cb-error-text-color' : '')}
                />
              </div>
              {deletingPhone === phone && (
                <IdentifierDeleteDialog
                  identifier={phone}
                  onCancel={() => setDeletingPhone(undefined)}
                />
              )}
            </>
          )}
        </div>
      ))}
      {addingPhone ? (
        <form
          onSubmit={e => e.preventDefault()}
          className='cb-user-details-identifier-container'
        >
          <PhoneInputField
            errorMessage={errorMessage}
            onChange={setNewPhone}
          />
          <Button
            type='submit'
            className='cb-user-details-body-button-primary'
            onClick={() => void addPhone()}
          >
            <Text className='cb-user-details-subheader'>{buttonSave}</Text>
          </Button>
          <Button
            type='button'
            className='cb-user-details-body-button-secondary'
            onClick={() => {
              setAddingPhone(false);
              setErrorMessage(undefined);
            }}
          >
            <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
          </Button>
        </form>
      ) : (
        <Button
          className='cb-user-details-body-button'
          onClick={() => setAddingPhone(true)}
        >
          <AddIcon
            color='secondary'
            className='cb-user-details-body-button-icon'
          />
          <Text className='cb-user-details-subheader'>{buttonAddPhone}</Text>
        </Button>
      )}
    </UserDetailsCard>
  );
};

export default PhonesEdit;
