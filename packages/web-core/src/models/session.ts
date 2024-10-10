import type { SessionUser } from '@corbado/types';
import {base64decode} from "../utils";

export class ShortSession {
  readonly #value: string;
  readonly #user: SessionUser;

  constructor(value: string) {
    this.#value = value;

    // this is a quick and easy way to parse JWT tokens without using a library
    const splits = value.split('.');
    this.#user = JSON.parse(base64decode(splits[1]));
  }

  get value() {
    return this.#value;
  }

  get user() {
    return this.#user;
  }

  isValidForXMoreSeconds(seconds: number): boolean {
    const now = new Date().getTime() / 1000;

    return this.#user.exp > now + seconds;
  }

  toString(): string {
    return this.#value;
  }
}
