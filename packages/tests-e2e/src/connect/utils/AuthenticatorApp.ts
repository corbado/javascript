// A lightweight TOTP helper mirroring the Android AuthenticatorApp behavior
// - addBySecret(secret): registers a secret and returns the current code
// - getCode(secret): waits until next 30s boundary if needed, then returns next code

import { generateToken } from 'node-2fa';

type WrappedTOTP = {
  secret: string;
  nextBoundary: number; // ms timestamp of next 30s boundary
};

export class AuthenticatorApp {
  #existing = new Map<string, WrappedTOTP>();

  async addBySecret(secret: string): Promise<string | null> {
    try {
      const now = Date.now();
      const result = generateToken(secret);
      if (!result) return null;

      const boundary = this.#calculateNextBoundary(now, 30_000);
      this.#existing.set(secret, { secret, nextBoundary: boundary });
      return result.token;
    } catch {
      return null;
    }
  }

  async getCode(secret: string): Promise<string | null> {
    const wrapped = this.#existing.get(secret);
    if (!wrapped) return null;

    const safetyMargin = 2_000;
    let now = Date.now();

    // If the stored boundary is already in the past, recalculate from now
    if (now >= wrapped.nextBoundary) {
      wrapped.nextBoundary = this.#calculateNextBoundary(now, 30_000);
    }

    await new Promise(resolve => setTimeout(resolve, wrapped.nextBoundary - now + safetyMargin));

    const then = Date.now();
    const result = generateToken(secret);
    if (!result) return null;

    wrapped.nextBoundary = this.#calculateNextBoundary(then, 30_000);
    this.#existing.set(secret, wrapped);
    return result.token;
  }

  clear() {
    this.#existing.clear();
  }

  #calculateNextBoundary(timeMillis: number, periodMillis: number): number {
    const periods = Math.floor(timeMillis / periodMillis);
    return (periods + 1) * periodMillis;
  }
}
