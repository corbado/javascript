export type PreconditionType =
  | 'confirmed_user_with_pk'
  | 'confirmed_user_with_server_deleted_pk'
  | 'confirmed_user_with_social_google_ok'
  | 'confirmed_user_with_social_google_cancel'
  | 'confirmed_user_with_social_google_back'
  | 'confirmed_user_without_pk'
  | 'unconfirmed_user_without_pk';

export type MockOidcBehavior = 'success' | 'error' | 'cancel' | 'navigate_back';

export interface ToolCredential {
  id: string;
  credentialID: string;
  aaguid?: string;
  status?: string;
}

export interface ToolUser {
  userID: string;
  email: string;
  status: string;
  credentials: ToolCredential[];
}

export interface MockOidcUser {
  id: string;
  devSessionId: string;
  email: string;
  behavior: MockOidcBehavior;
}

export interface MockBehavior {
  operation: 'get' | 'create';
  mediation: 'required' | 'conditional';
  action: 'complete' | 'cancel' | 'error' | 'not-started';
  credentialId?: string | null;
}
