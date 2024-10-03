import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ScreenNames } from '../../utils/constants';

const expectationByScreenName = {
  [ScreenNames.InitSignup]: { selector: '.cb-header', expected: 'Create your account' },
  [ScreenNames.InitLogin]: { selector: '.cb-header', expected: 'Log in' },
  [ScreenNames.PasskeyAppend1]: { selector: '.cb-pk-append-header', expected: 'Create account with passkeys' },
  [ScreenNames.PasskeyAppend2]: { selector: '.cb-pk-append-header', expected: 'Set up passkey for easier login' },
  [ScreenNames.PasskeyAppended]: { selector: '.cb-header', expected: 'Success!' },
  [ScreenNames.PasskeyError]: { selector: '.cb-header', expected: 'Something went wrong...' },
  [ScreenNames.EmailOtpSignup]: { selector: '.cb-header', expected: 'Enter code to create account' },
  [ScreenNames.EmailOtpLogin]: { selector: '.cb-header', expected: 'Enter code to log in' },
  [ScreenNames.EmailOtpPostLogin]: { selector: '.cb-header', expected: 'Your email is not verified yet' },
  [ScreenNames.EmailLinkSentSignup]: {
    selector: '.cb-header',
    expected: 'Check your inbox to create your account',
  },
  [ScreenNames.EmailLinkSentLogin]: { selector: '.cb-header', expected: 'Check your inbox to log in' },
  [ScreenNames.EmailLinkSentPostLogin]: { selector: '.cb-header', expected: 'Your email is not verified yet' },
  [ScreenNames.EmailLinkSuccessSignup]: { selector: '.cb-header', expected: 'Successful email verification' },
  [ScreenNames.EmailLinkSuccessLogin]: { selector: '.cb-header', expected: 'Successful email login' },
  [ScreenNames.EmailEdit]: { selector: '.cb-header', expected: 'Type new email address' },
  [ScreenNames.PhoneOtpSignup]: { selector: '.cb-header', expected: 'Enter code to create account' },
  [ScreenNames.PhoneOtpLogin]: { selector: '.cb-header', expected: 'Enter code to log in' },
  [ScreenNames.PhoneOtpLoginPostLogin]: {
    selector: '.cb-header',
    expected: 'Your phone number is not verified yet',
  },
  [ScreenNames.PhoneEdit]: { selector: '.cb-header', expected: 'Type new phone number' },
  [ScreenNames.PasskeyBackground]: { selector: '.cb-header', expected: 'Passkey login in process...' },
  [ScreenNames.End]: { selector: '.cb-user-details-section-header', expected: 'Your Account' },
};

export const expectScreen = async (page: Page, screenName: ScreenNames) => {
  const { selector, expected } = expectationByScreenName[screenName];

  await expect(page.locator(selector)).toHaveText(expected);
};
