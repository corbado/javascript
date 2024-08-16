import { LoginIdentifierType } from '@corbado/shared-ui';
import { t } from 'i18next';
import React, { useMemo, useState } from 'react';

import { Button, InputField, Text } from '../../components';
import { AddIcon } from '../../components/ui/icons/AddIcon';
import { PendingIcon } from '../../components/ui/icons/PendingIcon';
import { PrimaryIcon } from '../../components/ui/icons/PrimaryIcon';
import { VerifiedIcon } from '../../components/ui/icons/VerifiedIcon';
import { useCorbado } from '../../hooks/useCorbado';
import { useCorbadoUserDetails } from '../../hooks/useCorbadoUserDetails';
import { getErrorCode } from '../../util';

const EmailsEdit = () => {
  const { createIdentifier, verifyIdentifierStart, verifyIdentifierFinish, deleteIdentifier } = useCorbado();
  const { emails = [], getCurrentUser, emailEnabled } = useCorbadoUserDetails();

  const [verifyingEmails, setVerifyingEmails] = useState<boolean[]>([]);
  const [emailChallengeCodes, setEmailChallengeCodes] = useState<string[]>([]);
  const [addingEmail, setAddingEmail] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>('');

  const headerEmail = useMemo(() => t('user-details.email'), [t]);

  const badgePrimary = useMemo(() => t('user-details.primary'), [t]);
  const badgeVerified = useMemo(() => t('user-details.verified'), [t]);
  const badgePending = useMemo(() => t('user-details.pending'), [t]);

  const buttonSave = useMemo(() => t('user-details.save'), [t]);
  const buttonCancel = useMemo(() => t('user-details.cancel'), [t]);
  const buttonAddEmail = useMemo(() => t('user-details.add_email'), [t]);
  const buttonVerify = useMemo(() => t('user-details.verify'), [t]);
  const buttonRemove = useMemo(() => t('user-details.remove'), [t]);

  const addEmail = async () => {
    if (!newEmail) {
      console.error('email is empty');
      return;
    }
    const res = await createIdentifier(LoginIdentifierType.Email, newEmail);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: unsupported_identifier_type (but the current UI flow should prevent this, because unsupported types are not shown)
        console.error(t(`errors.${code}`));
      }
      return;
    }
    setNewEmail('');
    setAddingEmail(false);
    void getCurrentUser();
  };

  const removeEmail = async (index: number) => {
    const res = await deleteIdentifier(emails[index].id);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible codes: no_remaining_identifier, no_remaining_verified_identifier
        console.error(t(`errors.${code}`));
      }
      return;
    }
    void getCurrentUser();
  };

  const startEmailVerification = async (index: number) => {
    const res = await verifyIdentifierStart(emails[index].id);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: wait_before_retry
        console.error(t(`errors.${code}`));
      }
      return;
    }
    setVerifyingEmails(verifyingEmails.map((v, i) => (i === index ? true : v)));
  };

  const finishEmailVerification = async (index: number) => {
    const res = await verifyIdentifierFinish(emails[index].id, emailChallengeCodes[index]);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: invalid_challenge_solution_email-otp
        console.error(t(`errors.${code}`));
      }
      return;
    }
    void getCurrentUser();
  };

  if (!emailEnabled) {return null;}

  return (
    <div className='cb-user-details-card'>
      <Text className='cb-user-details-header'>{headerEmail}</Text>
      <div className='cb-user-details-body'>
        {emails.map((email, index) => (
          <div className='cb-user-details-identifier-container'>
            {verifyingEmails[index] ? (
              <div>
                <Text className='cb-user-details-text'>Enter OTP code for: {email.value}</Text>
                <InputField
                  className='cb-user-details-text'
                  onChange={e =>
                    setEmailChallengeCodes(emailChallengeCodes.map((c, i) => (i === index ? e.target.value : c)))
                  }
                />
                <Button
                  className='cb-user-details-body-button-primary'
                  onClick={() => void finishEmailVerification(index)}
                >
                  <Text className='cb-user-details-subheader'>Enter</Text>
                </Button>
                <Button
                  className='cb-user-details-body-button-primary'
                  onClick={() => setVerifyingEmails(verifyingEmails.map((v, i) => (i === index ? false : v)))}
                >
                  <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
                </Button>
              </div>
            ) : (
              <div className='cb-user-details-body-row'>
                <Text className='cb-user-details-text'>{email.value}</Text>
                <div className='cb-user-details-header-badge-section'>
                  {email.status === 'primary' ? (
                    <div className='cb-user-details-header-badge'>
                      <PrimaryIcon className='cb-user-details-header-badge-icon' />
                      <Text className='cb-user-details-text-primary'>{badgePrimary}</Text>
                    </div>
                  ) : email.status === 'verified' ? (
                    <div className='cb-user-details-header-badge'>
                      <VerifiedIcon className='cb-user-details-header-badge-icon' />
                      <Text className='cb-user-details-text-primary'>{badgeVerified}</Text>
                    </div>
                  ) : (
                    <div className='cb-user-details-header-badge'>
                      <PendingIcon className='cb-user-details-header-badge-icon' />
                      <Text className='cb-user-details-text-primary'>{badgePending}</Text>
                    </div>
                  )}
                </div>
                {email.status === 'pending' && (
                  <Button
                    className='cb-user-details-body-button-primary'
                    onClick={() => void startEmailVerification(index)}
                  >
                    <Text className='cb-user-details-subheader'>{buttonVerify}</Text>
                  </Button>
                )}
                <Button
                  className='cb-user-details-body-button-secondary'
                  onClick={() => void removeEmail(index)}
                >
                  <Text className='cb-user-details-subheader'>{buttonRemove}</Text>
                </Button>
              </div>
            )}
          </div>
        ))}
        {addingEmail ? (
          <div className='cb-user-details-identifier-container'>
            <InputField
              className='cb-user-details-text'
              style={{ width: '100%' }}
              // key={`user-entry-${processUser.username}`}
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
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
      </div>
    </div>
  );
};

export default EmailsEdit;
