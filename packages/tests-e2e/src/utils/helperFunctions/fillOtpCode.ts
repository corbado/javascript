import type { Page } from '@playwright/test';

import type { OtpType } from '../constants';

export async function fillOtpCode(page: Page, otpType: OtpType) {
  for (let i = 0; i < otpType.length; i++) {
    await page.locator(`#otp-${i}`).fill(otpType[i]);
  }
}
