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
      // const credentialAddedPromise = new Promise<void>((resolve) => {
      //   this.#cdpClient?.on('WebAuthn.credentialAdded', payload => {
      //     console.log(payload);
      //     resolve();
      //   });
      // });
      await setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, true);
      // await credentialAddedPromise;
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
      await this.page.getByRole('textbox', { name: 'username'}).click();
      await this.page.getByRole('textbox', { name: 'username'}).fill(username.replace('+', '-'));
      await expect(this.page.getByRole('textbox', { name: 'username'})).toHaveValue(username.replace('+', '-'));
    }
    if (fillEmail) {
      email = `${username}@corbado.com`;

      await this.page.getByRole('textbox', { name: 'email'}).click();
      await this.page.getByRole('textbox', { name: 'email'}).fill(email);
      await expect(this.page.getByRole('textbox', { name: 'email'})).toHaveValue(email);
    }
    if (fillPhone) {
      phone = username.split('+')[1];

      await this.page.getByRole('textbox', { name: 'phone'}).click();
      await this.page.getByRole('textbox', { name: 'phone'}).fill(phone);
      await expect(this.page.getByRole('textbox', { name: 'phone'})).toHaveValue(phone);
    }

    return [username, email, phone];
  }

  // helper function for checking duplicate identifiers in InitSignup screen robustness tests
  // assumes config for B1.3, passkey unsupported device
  async createAccount() {
    const [username, email, phone] = await this.fillIdentifiers(true, true, true);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    
    await this.checkLandedOnScreen(ScreenNames.EmailOtp, email);
    await this.fillOTP();
    await this.checkLandedOnScreen(ScreenNames.PhoneOtp, undefined, phone);
    await this.fillOTP();

    await this.checkLandedOnScreen(ScreenNames.End);

    await this.page.getByRole('button', { name: 'Logout' }).click();
    await this.checkLandedOnScreen(ScreenNames.InitSignup);

    return [username ?? '', email ?? '', phone ?? ''];
  }

  // helper function for robustness tests in PasskeyAppendScreen-robustness.spec.ts
  // assumes config for B1.3, passkey supported device
  async navigateToPasskeyAppendScreen() {
    const [username, email, phone] = await this.fillIdentifiers(true, true, true);
    await this.page.getByRole('button', { name: 'Continue' }).click();

    await this.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    return [username, email, phone];
  }

  // helper function for robustness tests in PasskeyBenefitsScreen-robustness.spec.ts
  // assumes config for B1.3, passkey supported device
  async navigateToPasskeyBenefitsScreen() {
    const [username, email, phone] = await this.navigateToPasskeyAppendScreen();

    await this.page.getByText('Passkeys').click();
    await this.checkLandedOnScreen(ScreenNames.PasskeyBenefits);

    return [username, email, phone];
  }

  // helper function for robustness tests in PasskeyError-robustness.spec.ts
  // assumes config for B1.3, passkey supported device
  // assumes userVerified set to false
  async navigateToPasskeyErrorScreen() {
    const [username, email, phone] = await this.navigateToPasskeyAppendScreen();

    await this.page.getByRole('button', { name: 'Create your account' }).click();
    await this.inputPasskey(async () => {
      await this.checkLandedOnScreen(ScreenNames.PasskeyError);
    });

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
      case ScreenNames.InitLogin:
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toHaveText('Welcome back!');
        break;
      case ScreenNames.PasskeyAppend:
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toContainText("Let's get you set up with");
        break;
      case ScreenNames.PasskeyAppended:
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toContainText('Welcome!');
        break;
      case ScreenNames.PasskeyError:
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toHaveText('Something went wrong...');
        break;
      case ScreenNames.PasskeyBenefits:
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toHaveText('Passkeys');
        break;
      case ScreenNames.EmailOtp:
        if (!email) {
          throw new Error('checkLandedOnScreen: Email is required');
        }
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toContainText('Enter one-time passcode to');
        await expect(this.page.getByText(email)).toHaveText(email);
        break;
      case ScreenNames.PhoneOtp:
        if (!phone) {
          throw new Error('checkLandedOnScreen: Phone is required');
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
