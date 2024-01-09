import type { Page } from '@playwright/test';

import { EMAIL_OTP_CODE } from '../constants';

export async function fillOtpCode(page: Page, incomplete: boolean = false, incorrect: boolean = false) {
  let otpCode = EMAIL_OTP_CODE;

  if (incomplete) {
    otpCode = otpCode.slice(0, otpCode.length - 1);
  } else if (incorrect) {
    otpCode = (parseInt(otpCode) + 1).toString();
    if (otpCode.length > EMAIL_OTP_CODE.length) {
      otpCode = otpCode.slice(1);
    }
  }

  for (let i = 0; i < otpCode.length; i++) {
    await page.locator(`#otp-${i}`).fill(otpCode[i]);
  }
}
