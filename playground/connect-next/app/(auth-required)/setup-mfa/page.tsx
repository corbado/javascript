'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  confirmUserAttribute,
  sendUserAttributeVerificationCode,
  setUpTOTP,
  updateMFAPreference,
  verifyTOTPSetup,
  updateUserAttribute,
} from 'aws-amplify/auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import ConfirmOTP from '@/components/ConfirmOTP';
import { QRCodeSVG } from 'qrcode.react';
import { CognitoUserInfo, getCognitoUserInfo } from '@/lib/utils';

enum State {
  Select,
  ConfirmSMS,
  SetupTOTP,
  ConfirmTOTP,
  EditPhone,
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState<CognitoUserInfo | undefined>();
  const [state, setState] = useState<State>(State.Select);
  const [otpAuthUri, setOtpAuthUri] = useState('');
  const [sharedKey, setSharedKey] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPhoneError, setEditPhoneError] = useState<string | undefined>();

  const isPostSignup = !!searchParams.get('post-signup');
  const showGoBack = !isPostSignup;

  useEffect(() => {
    void loadUser();
  }, []);

  async function loadUser() {
    try {
      const userInfo = await getCognitoUserInfo();
      setUserInfo(userInfo);
      setEditPhone('');
    } catch (err) {
      console.error('Failed to load user info:', err);
    }
  }

  const startSMS = async () => {
    const res = await sendUserAttributeVerificationCode({
      userAttributeKey: 'phone_number',
    });

    console.log(res);

    setState(State.ConfirmSMS);
  };

  const startTOTP = async () => {
    const setupRes = await setUpTOTP();
    const setupUri = setupRes.getSetupUri('Corbado Connect', userInfo?.email);

    setSharedKey(setupRes.sharedSecret);
    setOtpAuthUri(setupUri.href);
    setState(State.SetupTOTP);
  };

  const confirmTOTP = async (code: string): Promise<string | undefined> => {
    try {
      await verifyTOTPSetup({ code });
      await updateMFAPreference({
        totp: 'PREFERRED',
      });

      navigateForward();
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return 'Failed to confirm TOTP';
    }
  };

  const cancelConfirm = () => {
    setEditPhone('');
    setState(State.Select);
  };

  const confirmSMS = async (code: string): Promise<string | undefined> => {
    try {
      await confirmUserAttribute({
        userAttributeKey: 'phone_number',
        confirmationCode: code,
      });

      const res = await updateMFAPreference({
        sms: 'PREFERRED',
      });

      console.log(res);

      navigateForward();
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return 'Failed to confirm phone number';
    }
  };

  const navigateForward = () => {
    const searchParams = new URLSearchParams(window.location.search);
    router.push('/profile');
  };

  const updatePhoneNumber = async () => {
    setEditPhoneError(undefined);
    if (!editPhone) {
      setEditPhoneError('Phone number cannot be empty');
      return;
    }
    try {
      await updateUserAttribute({
        userAttribute: { attributeKey: 'phone_number', value: editPhone },
      });

      setState(State.ConfirmSMS);
    } catch (error) {
      if (error instanceof Error) {
        setEditPhoneError(error.message);
      } else {
        setEditPhoneError('Failed to update phone number');
      }
    }
  };

  if (!userInfo) {
    return <div></div>;
  }

  let headline, sub: string;
  let content: React.ReactNode;
  switch (state) {
    case State.Select:
      headline = 'Protect your account';
      sub = 'To better protect your account you can either use SMS or TOTP.';
      content = (
        <div className='flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16'>
          <Button onClick={startSMS}>Send code to {userInfo.phoneNumber}</Button>
          <Button
            variant='outline'
            onClick={() => {
              setEditPhone(userInfo?.phoneNumber || '');
              setEditPhoneError(undefined);
              setState(State.EditPhone);
            }}
          >
            Edit phone number
          </Button>
          <Separator />
          <Button onClick={startTOTP}>Use Authenticator instead</Button>
        </div>
      );
      break;
    case State.ConfirmSMS:
      headline = 'Confirm your phone number';
      sub = `We have sent a 6 digit code to ${editPhone || userInfo.phoneNumber}`;
      content = (
        <div className='flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16'>
          <ConfirmOTP
            onSubmit={confirmSMS}
            onCancel={cancelConfirm}
          />
        </div>
      );
      break;

    case State.SetupTOTP:
      headline = 'Scan the QR code';
      sub = 'Use your favourite authenticator app (e.g. Google authenticator)';
      content = (
        <div className='flex flex-col items-center space-y-4 bg-gray-50 px-4 py-8 sm:px-16'>
          <QRCodeSVG
            value={otpAuthUri}
            aria-label={sharedKey}
          />
          <Button
            className='w-40'
            onClick={() => setState(State.ConfirmTOTP)}
          >
            Continue
          </Button>
          <Button
            variant='ghost'
            className='w-40'
            onClick={() => setState(State.Select)}
          >
            Back
          </Button>
        </div>
      );
      break;

    case State.ConfirmTOTP:
      headline = 'Enter your TOTP';
      sub = 'Enter the code from the authenticator you have just set up.';
      content = (
        <div className='flex flex-col items-center space-y-4 bg-gray-50 px-4 py-8 sm:px-16'>
          <ConfirmOTP
            onSubmit={confirmTOTP}
            onCancel={cancelConfirm}
          />
        </div>
      );

      break;

    case State.EditPhone:
      headline = 'Edit your phone number';
      sub = 'Update your phone number for SMS verification.';
      content = (
        <form
          className='flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16'
          onSubmit={e => {
            e.preventDefault();
            updatePhoneNumber();
          }}
        >
          <input
            type='tel'
            autoComplete='tel'
            inputMode='tel'
            className='border rounded px-3 py-2'
            value={editPhone}
            onChange={e => setEditPhone(e.target.value)}
            placeholder='Enter new phone number'
          />
          {editPhoneError && <div className='text-red-500 text-sm'>{editPhoneError}</div>}
          <div className='flex space-x-2'>
            <Button
              type='submit'
              className='w-32'
            >
              Save
            </Button>
            <Button
              type='button'
              variant='ghost'
              className='w-32'
              onClick={() => {
                setState(State.Select);
                setEditPhone('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      );
      break;
  }

  return (
    <div className='flex h-screen flex-1 items-center justify-center bg-gray-50'>
      <div className='z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 shadow-xl'>
        <div className='flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16'>
          <h3 className='text-xl font-semibold'>{headline}</h3>
          <p className='text-sm text-gray-500'>{sub}</p>
        </div>
        {content}
        {showGoBack && (
          <div className='flex justify-center px-4 pb-4 pt-2'>
            <Button
              variant='destructive'
              onClick={() => router.push('/profile')}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
