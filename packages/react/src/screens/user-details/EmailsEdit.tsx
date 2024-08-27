import { LoginIdentifierType } from '@corbado/shared-ui';
import type { Identifier } from '@corbado/types';
import { t } from 'i18next';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button, InputField, Text } from '../../components';
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

const EmailsEdit = () => {
  const { createIdentifier, makePrimary } = useCorbado();
  const { emails = [], getCurrentUser, emailEnabled } = useCorbadoUserDetails();

  const initialEmails = useRef<Identifier[]>();

  const [loading, setLoading] = useState<boolean>(false);
  const [verifyingEmails, setVerifyingEmails] = useState<Identifier[]>([]);
  const [addingEmail, setAddingEmail] = useState<boolean>(false);
  const [deletingEmail, setDeletingEmail] = useState<Identifier>();
  const [newEmail, setNewEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>();

  const headerEmail = useMemo(() => t('user-details.email'), [t]);

  const badgePrimary = useMemo(() => t('user-details.primary'), [t]);
  const badgeVerified = useMemo(() => t('user-details.verified'), [t]);
  const badgePending = useMemo(() => t('user-details.pending'), [t]);

  const warningEmail = useMemo(() => t('user-details.warning_invalid_email'), [t]);

  const buttonSave = useMemo(() => t('user-details.save'), [t]);
  const buttonCancel = useMemo(() => t('user-details.cancel'), [t]);
  const buttonCopy = useMemo(() => t('user-details.copy'), [t]);
  const buttonAddEmail = useMemo(() => t('user-details.add_email'), [t]);
  const buttonPrimary = useMemo(() => t('user-details.make_primary'), [t]);
  const buttonVerify = useMemo(() => t('user-details.verify'), [t]);
  const buttonRemove = useMemo(() => t('user-details.remove'), [t]);

  useEffect(() => {
    if (initialEmails.current === undefined && emails.length > 0) {
      initialEmails.current = emails;

      return;
    }

    emails.forEach(email => {
      if (initialEmails.current?.every(e => e.id !== email.id)) {
        setVerifyingEmails(prev => [...prev, email]);
      }
    });

    initialEmails.current = undefined;
  }, [emails]);

  const addEmail = async () => {
    if (loading) {
      return;
    }

    if (!newEmail) {
      setErrorMessage(warningEmail);
      return;
    }

    setLoading(true);

    const res = await createIdentifier(LoginIdentifierType.Email, newEmail);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        if (code === 'identifier_already_in_use') {
          setErrorMessage(t('user-details.email_unique'));
        }

        if (code === 'identifier_invalid_format') {
          setErrorMessage(t('errors.identifier_invalid_format.email'));
        }

        console.error(t(`errors.${code}`));
      }
      setLoading(false);
      return;
    }

    void getCurrentUser()
      .then(() => {
        setNewEmail('');
        setAddingEmail(false);
        setErrorMessage(undefined);
      })
      .finally(() => setLoading(false));
  };

  const makeEmailPrimary = async (email: Identifier) => {
    setLoading(true);

    const res = await makePrimary(email.id, LoginIdentifierType.Email);
    if (res.err) {
      console.error(res.val.message);
    }

    void getCurrentUser()
      .then(() => setLoading(false));
  }

  const startEmailVerification = (email: Identifier) => {
    setVerifyingEmails(prev => [...prev, email]);
  };

  const onFinishEmailVerification = (email: Identifier) => {
    setVerifyingEmails(prev => prev.filter(v => v.id !== email.id));
  };

  if (!emailEnabled) {
    return null;
  }

  const getBadges = (email: Identifier) => {
    const badges = [];
    
    if (email.status === 'verified') {
      badges.push({ text: badgeVerified, icon: <VerifiedIcon className='cb-user-details-header-badge-icon' /> });
    } else {
      badges.push({ text: badgePending, icon: <PendingIcon className='cb-user-details-header-badge-icon' /> });
    }
    
    if (email.primary) {
      badges.push({ text: badgePrimary, icon: <PrimaryIcon className='cb-user-details-header-badge-icon' /> });
    }

    return badges
  };

  const copyEmail = async (email: string) => {
    await navigator.clipboard.writeText(email);
  };

  const getMenuItems = (email: Identifier) => {
    const items = [buttonCopy];

    if (email.status === 'verified') {
      if (!email.primary) {
        items.push(buttonPrimary);
      }
    } else {
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
          {verifyingEmails.some(verifyingEmail => verifyingEmail.id === email.id) ? (
            <IdentifierVerifyDialog
              identifier={email}
              onCancel={() => onFinishEmailVerification(email)}
            />
          ) : (
            <>
              <div className='cb-user-details-body-row'>
                <div className='cb-user-details-header-badge-section'>
                  <Text className='cb-user-details-text'>{email.value}</Text>
                  {getBadges(email).map(badge => (
                    <div className='cb-user-details-header-badge'>
                      {badge.icon}
                      <Text className='cb-user-details-badge-text'>{badge.text}</Text>
                    </div>
                  ))}
                </div>
                <DropdownMenu
                  items={getMenuItems(email)}
                  onItemClick={item => {
                    if (item === buttonPrimary) {
                      void makeEmailPrimary(email);
                    } else if (item === buttonVerify) {
                      void startEmailVerification(email);
                    } else if (item === buttonRemove) {
                      setDeletingEmail(email);
                    } else {
                      void copyEmail(email.value);
                    }
                  }}
                  getItemClassName={item => (item === buttonRemove ? 'cb-error-text-color' : '')}
                />
              </div>
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
        <form
          onSubmit={e => e.preventDefault()}
          className='cb-user-details-identifier-container'
        >
          <InputField
            className='cb-user-details-input'
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            errorMessage={errorMessage}
          />
          <Button
            type='submit'
            className='cb-user-details-body-button-primary'
            spinnerClassName='cb-user-details-button-spinner'
            isLoading={loading}
            onClick={() => void addEmail()}
          >
            <Text className='cb-user-details-subheader'>{buttonSave}</Text>
          </Button>
          <Button
            type='button'
            className='cb-user-details-body-button-secondary'
            onClick={() => {
              setAddingEmail(false);
              setErrorMessage(undefined);
            }}
          >
            <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
          </Button>
        </form>
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
