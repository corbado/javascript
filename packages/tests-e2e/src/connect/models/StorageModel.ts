import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ScreenNames } from '../utils/Constants';
import { expectScreen } from '../utils/ExpectScreen';

export class StorageModel {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loadInvitationToken() {
    await this.page.goto('/login?invitationToken=inv-token-correct');
    await expectScreen(this.page, ScreenNames.InitLogin);
  }

  async checkInvitationToken() {
    const cboConnectInvitationRaw = await this.page.evaluate(k => localStorage.getItem(k), 'cbo_connect_invitation');
    if (!cboConnectInvitationRaw) {
      throw new Error('cbo_connect_invitation not found in local storage');
    }
    const cboConnectInvitation = JSON.parse(cboConnectInvitationRaw);
    expect(cboConnectInvitation.token).toEqual('inv-token-correct');
  }

  deleteInvitationToken() {
    return this.page.evaluate(k => localStorage.removeItem(k), 'cbo_connect_invitation');
  }

  async getProcessID(): Promise<string> {
    const key = `cbo_connect_process-${process.env.PLAYWRIGHT_CONNECT_PROJECT_ID}`;
    const cboConnectProcessRaw = await this.page.evaluate(k => localStorage.getItem(k), key);
    if (!cboConnectProcessRaw) {
      throw new Error('cbo_connect_process not found in local storage');
    }
    const cboConnectProcess = JSON.parse(cboConnectProcessRaw);
    expect(cboConnectProcess.id).not.toBeNull();

    return cboConnectProcess.id;
  }

  async checkProcessID(expectedID: string) {
    expect(await this.getProcessID()).toEqual(expectedID);
  }

  async getLoginLifetime(): Promise<number> {
    const key = `cbo_connect_process-${process.env.PLAYWRIGHT_CONNECT_PROJECT_ID}`;
    const cboConnectProcessRaw = await this.page.evaluate(k => localStorage.getItem(k), key);
    if (!cboConnectProcessRaw) {
      throw new Error('cbo_connect_process not found in local storage');
    }
    const cboConnectProcess = JSON.parse(cboConnectProcessRaw);
    return cboConnectProcess.loginData.expiresAt;
  }

  async setLoginLifetime(newLifetime: number) {
    const key = `cbo_connect_process-${process.env.PLAYWRIGHT_CONNECT_PROJECT_ID}`;
    const cboConnectProcessRaw = await this.page.evaluate(k => localStorage.getItem(k), key);
    if (!cboConnectProcessRaw) {
      throw new Error('cbo_connect_process not found in local storage');
    }
    const cboConnectProcess = JSON.parse(cboConnectProcessRaw);
    cboConnectProcess.loginData.expiresAt = newLifetime;
    await this.page.evaluate(({ k, p }) => localStorage.setItem(k, JSON.stringify(p)), { k: key, p: cboConnectProcess });
  }

  async getAppendLifetime(): Promise<number> {
    const key = `cbo_connect_process-${process.env.PLAYWRIGHT_CONNECT_PROJECT_ID}`;
    const cboConnectProcessRaw = await this.page.evaluate(k => localStorage.getItem(k), key);
    if (!cboConnectProcessRaw) {
      throw new Error('cbo_connect_process not found in local storage');
    }
    const cboConnectProcess = JSON.parse(cboConnectProcessRaw);
    return cboConnectProcess.appendData.expiresAt;
  }

  async setAppendLifetime(newLifetime: number) {
    const key = `cbo_connect_process-${process.env.PLAYWRIGHT_CONNECT_PROJECT_ID}`;
    const cboConnectProcessRaw = await this.page.evaluate(k => localStorage.getItem(k), key);
    if (!cboConnectProcessRaw) {
      throw new Error('cbo_connect_process not found in local storage');
    }
    const cboConnectProcess = JSON.parse(cboConnectProcessRaw);
    cboConnectProcess.appendData.expiresAt = newLifetime;
    await this.page.evaluate(({ k, p }) => localStorage.setItem(k, JSON.stringify(p)), { k: key, p: cboConnectProcess });
  }

  async getManageLifetime(): Promise<number> {
    const key = `cbo_connect_process-${process.env.PLAYWRIGHT_CONNECT_PROJECT_ID}`;
    const cboConnectProcessRaw = await this.page.evaluate(k => localStorage.getItem(k), key);
    if (!cboConnectProcessRaw) {
      throw new Error('cbo_connect_process not found in local storage');
    }
    const cboConnectProcess = JSON.parse(cboConnectProcessRaw);
    return cboConnectProcess.manageData.expiresAt;
  }

  async setManageLifetime(newLifetime: number) {
    const key = `cbo_connect_process-${process.env.PLAYWRIGHT_CONNECT_PROJECT_ID}`;
    const cboConnectProcessRaw = await this.page.evaluate(k => localStorage.getItem(k), key);
    if (!cboConnectProcessRaw) {
      throw new Error('cbo_connect_process not found in local storage');
    }
    const cboConnectProcess = JSON.parse(cboConnectProcessRaw);
    cboConnectProcess.manageData.expiresAt = newLifetime;
    await this.page.evaluate(({ k, p }) => localStorage.setItem(k, JSON.stringify(p)), { k: key, p: cboConnectProcess });
  }

  async checkLoginDataDeleted() {
    const key = `cbo_connect_process-${process.env.PLAYWRIGHT_CONNECT_PROJECT_ID}`;
    const cboConnectProcessRaw = await this.page.evaluate(k => localStorage.getItem(k), key);
    if (!cboConnectProcessRaw) {
      throw new Error('cbo_connect_process not found in local storage');
    }
    const cboConnectProcess = JSON.parse(cboConnectProcessRaw);
    expect(cboConnectProcess.loginData).toBeNull();
  }

  async clearLocalStorageAndCookies() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.context().clearCookies();
  }
}
