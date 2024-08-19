import { LoginIdentifierType } from '@corbado/shared-ui';
import { t } from 'i18next';
import React, { useMemo, useState } from 'react';

import { Button, InputField, Text } from '../../components';
import { AddIcon } from '../../components/ui/icons/AddIcon';
import { PendingIcon } from '../../components/ui/icons/PendingIcon';
import { PrimaryIcon } from '../../components/ui/icons/PrimaryIcon';
import { VerifiedIcon } from '../../components/ui/icons/VerifiedIcon';
import UserDetailsCard from '../../components/user-details/UserDetailsCard';
import { useCorbado } from '../../hooks/useCorbado';
import { useCorbadoUserDetails } from '../../hooks/useCorbadoUserDetails';
import { getErrorCode } from '../../util';
import { Identifier } from '@corbado/types';
import DropdownMenu from '../../components/user-details/DropdownMenu';
import IdentifierDeleteDialog from './IdentifierDeleteDialog';

const PhonesEdit = () => {
  const { createIdentifier, verifyIdentifierStart, verifyIdentifierFinish } = useCorbado();
  const { phones = [], getCurrentUser } = useCorbadoUserDetails();

  const [verifyingPhones, setVerifyingPhones] = useState<boolean[]>([]);
  const [phoneChallengeCodes, setPhoneChallengeCodes] = useState<string[]>([]);
  const [deletingPhone, setDeletingPhone] = useState<boolean>(false);
  const [addingPhone, setAddingPhone] = useState<boolean>(false);
  const [newPhone, setNewPhone] = useState<string>('');

  const headerPhone = useMemo(() => t('user-details.phone'), [t]);

  const badgePrimary = useMemo(() => t('user-details.primary'), [t]);
  const badgeVerified = useMemo(() => t('user-details.verified'), [t]);
  const badgePending = useMemo(() => t('user-details.pending'), [t]);

  const buttonSave = useMemo(() => t('user-details.save'), [t]);
  const buttonCancel = useMemo(() => t('user-details.cancel'), [t]);
  const buttonAddPhone = useMemo(() => t('user-details.add_phone'), [t]);
  const buttonVerify = useMemo(() => t('user-details.verify'), [t]);
  const buttonRemove = useMemo(() => t('user-details.remove'), [t]);

  const addPhone = async () => {
    if (!newPhone) {
      console.error('phone is empty');
      return;
    }
    const res = await createIdentifier(LoginIdentifierType.Phone, newPhone);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: unsupported_identifier_type (but the current UI flow should prevent this, because unsupported types are not shown)
        console.error(t(`errors.${code}`));
      }
      return;
    }
    setNewPhone('');
    setAddingPhone(false);
    void getCurrentUser();
  };

  const startPhoneVerification = async (index: number) => {
    const res = await verifyIdentifierStart(phones[index].id);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: wait_before_retry
        console.error(t(`errors.${code}`));
      }
      return;
    }
    setVerifyingPhones(verifyingPhones.map((v, i) => (i === index ? true : v)));
  };

  const finishPhoneVerification = async (index: number) => {
    const res = await verifyIdentifierFinish(phones[index].id, phoneChallengeCodes[index]);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: invalid_challenge_solution_phone-otp
        console.error(t(`errors.${code}`));
      }
      return;
    }
    void getCurrentUser();
  };

  // if (!phoneEnabled) {
  //   return null;
  // }

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

  return (
    <UserDetailsCard header={headerPhone}>
      {phones.map((phone, index) => (
        <div
          className='cb-user-details-identifier-container'
          key={index}
        >
          {verifyingPhones[index] ? (
            <div>
              <Text className='cb-user-details-text'>Enter OTP code for: {phone.value}</Text>
              <InputField
                className='cb-user-details-text'
                onChange={e =>
                  setPhoneChallengeCodes(phoneChallengeCodes.map((c, i) => (i === index ? e.target.value : c)))
                }
              />
              <Button
                className='cb-user-details-body-button-primary'
                onClick={() => void finishPhoneVerification(index)}
              >
                <Text className='cb-user-details-subheader'>Enter</Text>
              </Button>
              <Button
                className='cb-user-details-body-button-primary'
                onClick={() => setVerifyingPhones(verifyingPhones.map((v, i) => (i === index ? false : v)))}
              >
                <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
              </Button>
            </div>
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
                  items={[buttonVerify, buttonRemove]}
                  onItemClick={item => {
                    if (item === buttonVerify) {
                      void startPhoneVerification(index);
                    } else if (item === buttonRemove) {
                      setDeletingPhone(true);
                    }
                  }}
                  getItemClassName={item => (item === buttonRemove ? 'cb-error-text-color' : '')}
                />
              </div>
              {deletingPhone && (
                <IdentifierDeleteDialog
                  identifier={phone}
                  onCancel={() => setDeletingPhone(false)}
                />
              )}
            </>
          )}
        </div>
      ))}
      {addingPhone ? (
        <div className='cb-user-details-identifier-container'>
          <InputField
            className='cb-user-details-text'
            style={{ width: '100%' }}
            // key={`user-entry-${processUser.username}`}
            value={newPhone}
            onChange={e => setNewPhone(e.target.value)}
          />
          <Button
            className='cb-user-details-body-button-primary'
            onClick={() => void addPhone()}
          >
            <Text className='cb-user-details-subheader'>{buttonSave}</Text>
          </Button>
          <Button
            className='cb-user-details-body-button-secondary'
            onClick={() => {
              setAddingPhone(false);
            }}
          >
            <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
          </Button>
        </div>
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
