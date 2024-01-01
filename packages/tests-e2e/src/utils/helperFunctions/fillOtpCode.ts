import type { Page } from '@playwright/test';

import { EMAIL_OTP_CODE } from '../constants';

export async function fillOtpCode(page: Page) {
  for (let i = 0; i < EMAIL_OTP_CODE.length; i++) {
    await page.locator(`#otp-${i}`).fill(EMAIL_OTP_CODE[i]);
  }
}
