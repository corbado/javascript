import type { CDPSession, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { OtpType, ScreenNames } from '../utils/constants';
import { addWebAuthn, fillOtpCode, initializeCDPSession, removeWebAuthn } from '../utils/helperFunctions';
import { loadAuth } from '../utils/helperFunctions/loadAuth';
import { setWebAuthnAutomaticPresenceSimulation } from '../utils/helperFunctions/setWebAuthnAutomaticPresenceSimulation';
import { setWebAuthnUserVerified } from '../utils/helperFunctions/setWebAuthnUserVerified';
import UserManager from '../utils/UserManager';

export class UISignupFlow {
  readonly page: Page;
  #cdpClient: CDPSession | null = null;
  #authenticatorId = '';

  constructor(page: Page) {
    this.page = page;
  }

  // must be called after every update to WebAuthn
  // because Corbado checks for WebAuthn support on page load
  async loadAuth() {
    await loadAuth(this.page);
  }

  async initializeCDPSession() {
    this.#cdpClient = await initializeCDPSession(this.page);
  }

  async addWebAuthn(successful: boolean) {
    if (this.#cdpClient) {
      this.#authenticatorId = await addWebAuthn(this.#cdpClient, successful);
    }
  }

  async setWebAuthnUserVerified(successful: boolean) {
    if (this.#cdpClient) {
      await setWebAuthnUserVerified(this.#cdpClient, this.#authenticatorId, successful);
    }
  }

  async removeWebAuthn() {
    if (this.#cdpClient) {
      await removeWebAuthn(this.#cdpClient, this.#authenticatorId);
    }
  }

  async inputPasskey(check: () => Promise<void>) {
    if (this.#cdpClient) {
      await setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, true);
      await check();
      await setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, false);
    }
  }

  async fillOTP(otpType: OtpType = OtpType.Correct) {
    await fillOtpCode(this.page, otpType);
  }

  async fillIdentifiers(fillUsername: boolean, fillEmail: boolean, fillPhone: boolean) {
    const username = UserManager.getUserForSignup();
    let email,
      phone = undefined;
    if (fillUsername) {
      await this.page.getByPlaceholder('Username').click();
      await this.page.getByPlaceholder('Username').fill(username);
      await expect(this.page.getByPlaceholder('Name')).toHaveValue(username);
    }
    if (fillEmail) {
      email = `${username}@corbado.com`;

      await this.page.getByPlaceholder('Email address').click();
      await this.page.getByPlaceholder('Email address').fill(email);
      await expect(this.page.getByPlaceholder('Email address')).toHaveValue(email);
    }
    if (fillPhone) {
      phone = username.split('+')[1];

      await this.page.getByPlaceholder('Phone number').click();
      await this.page.getByPlaceholder('Phone number').fill(phone);
      await expect(this.page.getByPlaceholder('Phone number')).toHaveValue(phone);
    }

    return [username, email, phone];
  }

  // async navigateToPasskeySignupScreen() {
  //   const name = UserManager.getUserForSignup();
  //   const email = `${name}@corbado.com`;

  //   await this.page.getByPlaceholder('Name').click();
  //   await this.page.getByPlaceholder('Name').fill(name);
  //   await expect(this.page.getByPlaceholder('Name')).toHaveValue(name);

  //   await this.page.getByPlaceholder('Email address').click();
  //   await this.page.getByPlaceholder('Email address').fill(email);
  //   await expect(this.page.getByPlaceholder('Email address')).toHaveValue(email);

  //   await this.page.getByRole('button', { name: 'Continue' }).click();
  //   await this.checkLandedOnScreen(ScreenNames.PasskeyCreate);
  // }

  // async navigateToPasskeyBenefitsScreen() {
  //   await this.navigateToPasskeySignupScreen();

  //   await this.page.getByText('Passkeys').click();
  //   await this.checkLandedOnScreen(ScreenNames.PasskeyBenefits);
  // }

  // async navigateToEnterOtpScreen(passkeySupported: boolean) {
  //   if (passkeySupported) {
  //     await this.navigateToPasskeySignupScreen();

  //     await this.page.getByRole('button', { name: 'Send email one-time passcode' }).click();
  //     await this.checkLandedOnScreen(ScreenNames.EnterOtp);
  //   } else {
  //     const name = UserManager.getUserForSignup();
  //     const email = `${name}@corbado.com`;

  //     await this.page.getByPlaceholder('Name').click();
  //     await this.page.getByPlaceholder('Name').fill(name);
  //     await expect(this.page.getByPlaceholder('Name')).toHaveValue(name);

  //     await this.page.getByPlaceholder('Email address').click();
  //     await this.page.getByPlaceholder('Email address').fill(email);
  //     await expect(this.page.getByPlaceholder('Email address')).toHaveValue(email);

  //     await this.page.getByRole('button', { name: 'Continue' }).click();
  //     await this.checkLandedOnScreen(ScreenNames.EnterOtp);
  //   }
  // }

  // async navigateToPasskeyAppendScreen() {
  //   await this.navigateToPasskeySignupScreen();

  //   await this.page.getByRole('button', { name: 'Send email one-time passcode' }).click();
  //   await this.checkLandedOnScreen(ScreenNames.EnterOtp);

  //   await this.fillOTP();
  //   await this.checkLandedOnScreen(ScreenNames.PasskeyAppend);
  // }

  // async createAccount(): Promise<[name: string, email: string]> {
  //   const name = UserManager.getUserForSignup();
  //   const email = `${name}@corbado.com`;

  //   await this.page.getByPlaceholder('Name').click();
  //   await this.page.getByPlaceholder('Name').fill(name);
  //   await expect(this.page.getByPlaceholder('Name')).toHaveValue(name);

  //   await this.page.getByPlaceholder('Email address').click();
  //   await this.page.getByPlaceholder('Email address').fill(email);
  //   await expect(this.page.getByPlaceholder('Email address')).toHaveValue(email);

  //   await this.page.getByRole('button', { name: 'Continue' }).click();

  //   return [name, email];
  // }

  // async createDummyAccount(): Promise<[name: string, email: string]> {
  //   const [name, email] = await this.createAccount();
  //   await this.checkLandedOnScreen(ScreenNames.EnterOtp);

  //   // await this.page.getByRole('button', { name: 'Cancel' }).click();
  //   // await this.checkLandedOnScreen(ScreenNames.Start);

  //   await this.fillOTP();
  //   // assume passkey not supported
  //   await this.checkLandedOnScreen(ScreenNames.End);

  //   await this.page.getByRole('button', { name: 'Logout' }).click();
  //   await this.checkLandedOnScreen(ScreenNames.Start);

  //   return [name, email];
  // }

  async checkPasskeyRegistered() {
    await expect(this.page.locator('.cb-passkey-list-card')).toHaveCount(1);
  }

  async checkNoPasskeyRegistered() {
    // await expect(this.page.getByText("You don't have any passkeys yet.")).toHaveCount(1);
  }

  async checkLandedOnScreen(screenName: ScreenNames, email?: string, phone?: string) {
    switch (screenName) {
      case ScreenNames.InitSignup:
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toHaveText('Create your account');
        break;
      case ScreenNames.PasskeyAppend:
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toContainText("Let's get you set up with");
        break;
      case ScreenNames.PasskeyAppended:
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toContainText('Welcome!');
        break;
      case ScreenNames.EmailOtp:
        if (!email) {
          throw new Error('Email is required');
        }
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toContainText('Enter one-time passcode to');
        await expect(this.page.getByText(email)).toHaveText(email);
        break;
      case ScreenNames.PhoneOtp:
        if (!phone) {
          throw new Error('Phone is required');
        }
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toContainText('Enter one-time passcode to');
        await expect(this.page.getByText(phone)).toHaveText(phone);
        break;
      case ScreenNames.End:
        await expect(this.page).toHaveURL(/\/pro-[0-9]+$/);
        break;
    }
  }

  // async checkLandedOnScreen2(screenName: ScreenNames) {
  //   switch (screenName) {
  //     case ScreenNames.Start:
  //       await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Create your account');
  //       break;
  //     case ScreenNames.EnterOtp:
  //       await expect(this.page.getByRole('heading', { level: 1 })).toContainText('Enter one-time passcode to');
  //       break;
  //     case ScreenNames.PasskeyCreate:
  //       await expect(this.page.getByRole('heading', { level: 1 })).toContainText("Let's get you set up with");
  //       break;
  //     case ScreenNames.PasskeyBenefits:
  //       await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Passkeys');
  //       break;
  //     case ScreenNames.PasskeyAppend:
  //       await expect(this.page.getByRole('heading', { level: 1 })).toContainText('Log in even faster with');
  //       break;
  //     case ScreenNames.PasskeySuccess:
  //       await expect(this.page.getByRole('heading', { level: 1 }).first()).toContainText('Welcome!');
  //       break;
  //     case ScreenNames.End:
  //       await expect(this.page).toHaveURL(/\/pro-[0-9]+$/);
  //       break;
  //   }
  // }
}
