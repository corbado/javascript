import type { Paging } from './common';

/**
 * Type representing the different methods a user can use to authenticate.
 * @typedef {('email' | 'phone_number' | 'webauthn' | 'password')} AuthMethod
 */
export type AuthMethod = 'email' | 'phone_number' | 'webauthn' | 'password';

export type UserIdentifier = 'email' | 'phone_number';

/**
 * Interface representing the authentication methods a user has selected and can possibly use.
 * @interface UserAuthMethods
 * @property {Array<AuthMethod>} selectedMethods - An array of methods the user has selected for authentication.
 * @property {Array<AuthMethod>} possibleMethods - An array of methods the user can possibly use for authentication.
 */
export interface UserAuthMethods {
  selectedMethods: Array<AuthMethod>;
  possibleMethods: Array<AuthMethod>;
}

/**
 * Type representing the status of a PassKeyItem.
 * @typedef {('pending' | 'active')} PassKeyItemStatus
 */
export type PassKeyItemStatus = 'pending' | 'active';

/**
 * Represents a pass key item.
 * @interface PassKeyItem
 * @property {string} id - The ID of the pass key item.
 * @property {string} aaguid - The aaguid of the pass key item.
 * @property {string} userAgent - The user agent of the pass key item.
 * @property {string} attestationType - The attestation type of the pass key item.
 * @property {Array<string>} transport - The transport methods of the pass key item.
 * @property {boolean} backupEligible - Indicates if the pass key item is eligible for backup.
 * @property {boolean} backupState - The backup state of the pass key item.
 * @property {PassKeyItemStatus} status - The status of the pass key item.
 * @property {string} created - The creation date of the pass key item.
 */
export interface PassKeyItem {
  id: string;
  aaguid: string;
  userAgent: string;
  attestationType: string;
  transport: Array<string>;
  backupEligible: boolean;
  backupState: boolean;
  status: PassKeyItemStatus;
  created: string;
  lastUsed?: string;
}

/**
 * Represents a list of pass key items.
 * @interface PassKeyList
 * @property {Array<PassKeyItem>} passkeys - The pass key items in the list.
 * @property {Paging} paging - The paging information of the list.
 */
export interface PassKeyList {
  passkeys: Array<PassKeyItem>;
  paging?: Paging;
}
