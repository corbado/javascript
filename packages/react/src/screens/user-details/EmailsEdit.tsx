import { LoginIdentifierType } from '@corbado/shared-ui';
import type { Identifier } from '@corbado/types';
import { t } from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';

import { Button, InputField, Text } from '../../components';
import { AddIcon } from '../../components/ui/icons/AddIcon';
import { PendingIcon } from '../../components/ui/icons/PendingIcon';
import { PrimaryIcon } from '../../components/ui/icons/PrimaryIcon';
import { VerifiedIcon } from '../../components/ui/icons/VerifiedIcon';
import DropdownMenu from '../../components/user-details/DropdownMenu';
import UserDetailsCard from '../../components/user-details/UserDetailsCard';
import { useCorbado } from '../../hooks/useCorbado';
import { useCorbadoUserDetails } from '../../hooks/useCorbadoUserDetails';
import { getErrorCode, validateEmail } from '../../util';
import IdentifierDeleteDialog from './IdentifierDeleteDialog';
import IdentifierVerifyDialog from './IdentifierVerifyDialog';
import Alert from '../../components/user-details/Alert';

const EmailsEdit = () => {
  const { createIdentifier, verifyIdentifierStart } = useCorbado();
  const { emails = [], getCurrentUser, emailEnabled } = useCorbadoUserDetails();

  const [verifyingEmails, setVerifyingEmails] = useState<boolean[]>([]);
  const [addingEmail, setAddingEmail] = useState<boolean>(false);
  const [deletingEmail, setDeletingEmail] = useState<Identifier>();
  const [newEmail, setNewEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [verifyErrorMessage, setVerifyErrorMessage] = useState<{ message: string; index: number }>();

  const headerEmail = useMemo(() => t('user-details.email'), [t]);

  const badgePrimary = useMemo(() => t('user-details.primary'), [t]);
  const badgeVerified = useMemo(() => t('user-details.verified'), [t]);
  const badgePending = useMemo(() => t('user-details.pending'), [t]);

  const warningEmail = useMemo(() => t('user-details.warning_invalid_email'), [t]);

  const buttonSave = useMemo(() => t('user-details.save'), [t]);
  const buttonCancel = useMemo(() => t('user-details.cancel'), [t]);
  const buttonCopy = useMemo(() => t('user-details.copy'), [t]);
  const buttonAddEmail = useMemo(() => t('user-details.add_email'), [t]);
  const buttonVerify = useMemo(() => t('user-details.verify'), [t]);
  const buttonRemove = useMemo(() => t('user-details.remove'), [t]);

  useEffect(() => {
    setVerifyingEmails(new Array(emails.length).fill(false));
  }, [emails]);

  const addEmail = async () => {
    if (!newEmail || !validateEmail(newEmail)) {
      setErrorMessage(warningEmail);
      return;
    }
    const res = await createIdentifier(LoginIdentifierType.Email, newEmail);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        if (code === 'identifier_already_in_use') {
          setErrorMessage(t('user-details.email_unique'));
        }
        console.error(t(`errors.${code}`));
      }
      return;
    }
    setNewEmail('');
    setAddingEmail(false);
    void getCurrentUser();
  };

  const startEmailVerification = async (index: number) => {
    setVerifyErrorMessage(undefined);
    const res = await verifyIdentifierStart(emails[index].id);

    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        if (code === 'wait_before_retry') {
          setVerifyErrorMessage({ message: t('user-details.wait_before_retry'), index });
        }
        console.error(t(`errors.${code}`));
      }
      return;
    }

    setVerifyingEmails(prev => prev.map((v, i) => (i === index ? true : v)));
  };

  const onFinishEmailVerification = (index: number) => {
    setVerifyingEmails(prev => prev.map((v, i) => (i === index ? false : v)));
  };

  if (!emailEnabled) {
    return null;
  }

  const getBadge = (email: Identifier) => {
    switch (email.status) {
      case 'primary':
        return { text: badgePrimary, icon: <PrimaryIcon className='cb-user-details-header-badge-icon' /> };

      case 'verified':
        return { text: badgeVerified, icon: <VerifiedIcon className='cb-user-details-header-badge-icon' /> };

      default:
        return { text: badgePending, icon: <PendingIcon className='cb-user-details-header-badge-icon' /> };
    }
  };

  const copyEmail = async (email: string) => {
    await navigator.clipboard.writeText(email);
  };

  const getMenuItems = (email: Identifier) => {
    const items = [buttonCopy];

    if (email.status !== 'verified') {
      items.push(buttonVerify);
    }

    items.push(buttonRemove);

    return items;
  };

  return (
    <UserDetailsCard header={headerEmail}>
      {emails.map((email, index) => (
        <div
          className='cb-user-details-identifier-container'
          key={index}
        >
          {verifyingEmails[index] ? (
            <IdentifierVerifyDialog
              identifier={email}
              onCancel={() => onFinishEmailVerification(index)}
            />
          ) : (
            <>
              <div className='cb-user-details-body-row'>
                <div className='cb-user-details-header-badge-section'>
                  <Text className='cb-user-details-text'>{email.value}</Text>
                  <div className='cb-user-details-header-badge'>
                    {getBadge(email).icon}
                    <Text className='cb-user-details-badge-text'>{getBadge(email).text}</Text>
                  </div>
                </div>
                <DropdownMenu
                  items={getMenuItems(email)}
                  onItemClick={item => {
                    if (item === buttonVerify) {
                      void startEmailVerification(index);
                    } else if (item === buttonRemove) {
                      setDeletingEmail(email);
                    } else {
                      void copyEmail(email.value);
                    }
                  }}
                  getItemClassName={item => (item === buttonRemove ? 'cb-error-text-color' : '')}
                />
              </div>
              {verifyErrorMessage && verifyErrorMessage.index === index && (
                <Alert
                  variant='error'
                  text={verifyErrorMessage.message}
                />
              )}
              {deletingEmail === email && (
                <IdentifierDeleteDialog
                  identifier={email}
                  onCancel={() => setDeletingEmail(undefined)}
                />
              )}
            </>
          )}
        </div>
      ))}
      {addingEmail ? (
        <div className='cb-user-details-identifier-container'>
          <InputField
            className='cb-user-details-input'
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            errorMessage={errorMessage}
          />
          <Button
            className='cb-user-details-body-button-primary'
            onClick={() => void addEmail()}
          >
            <Text className='cb-user-details-subheader'>{buttonSave}</Text>
          </Button>
          <Button
            className='cb-user-details-body-button-secondary'
            onClick={() => {
              setAddingEmail(false);
              setErrorMessage(undefined);
            }}
          >
            <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
          </Button>
        </div>
      ) : (
        <Button
          className='cb-user-details-body-button'
          onClick={() => setAddingEmail(true)}
        >
          <AddIcon
            color='secondary'
            className='cb-user-details-body-button-icon'
          />
          <Text className='cb-user-details-subheader'>{buttonAddEmail}</Text>
        </Button>
      )}
    </UserDetailsCard>
  );
};

export default EmailsEdit;
