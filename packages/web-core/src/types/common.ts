export type CookiesDefinition = {
  name: string;
  value: string;
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'Strict' | 'lax' | 'Lax' | 'none' | 'None';
};
