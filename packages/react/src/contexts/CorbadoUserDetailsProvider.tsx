import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CorbadoUserDetailsContext } from './CorbadoUserDetailsContext';
import { CorbadoUser, Identifier, LoginIdentifierConfigType, LoginIdentifierType } from '@corbado/types';
import { useCorbado } from '../hooks/useCorbado';

export const CorbadoUserDetailsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { corbadoApp, isAuthenticated, getFullUser, getIdentifierListConfig } = useCorbado();

  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CorbadoUser | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [username, setUsername] = useState<Identifier | undefined>();
  const [emails, setEmails] = useState<Identifier[] | undefined>();
  const [phones, setPhones] = useState<Identifier[] | undefined>();

  const [usernameEnabled, setUsernameEnabled] = useState<boolean>(false);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(false);
  const [phoneEnabled, setPhoneEnabled] = useState<boolean>(false);

  const [fullNameRequired, setFullNameRequired] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const abortController = new AbortController();
    void getCurrentUser(abortController);
    void getConfig(abortController);

    return () => {
      abortController.abort();
    };
  }, [isAuthenticated]);

  const processUser = useMemo(() => {
    if (!currentUser) {
      return {
        name: '',
        username: '',
        emails: [],
        phoneNumbers: [],
        socialAccounts: [],
      };
    }

    return {
      name: currentUser.fullName,
      username: currentUser.identifiers.find(id => id.type === 'username')?.value || '',
      emails: currentUser.identifiers.filter(id => id.type === 'email'),
      phoneNumbers: currentUser.identifiers.filter(id => id.type === 'phone'),
      socialAccounts: currentUser.socialAccounts,
    };
  }, [currentUser]);

  const getCurrentUser = useCallback(
    async (abortController?: AbortController) => {
      setLoading(true);
      const result = await getFullUser(abortController);
      if (result.err && result.val.ignore) {
        return;
      }

      if (!result || result?.err) {
        throw new Error(result?.val.name);
      }

      setCurrentUser(result.val);
      setName(result.val.fullName || '');
      const usernameIdentifier = result.val.identifiers.find(
        identifier => identifier.type == LoginIdentifierType.Username,
      );
      setUsername(usernameIdentifier);
      const emails = result.val.identifiers.filter(identifier => identifier.type == LoginIdentifierType.Email);
      setEmails(emails);
      const phones = result.val.identifiers.filter(identifier => identifier.type == LoginIdentifierType.Phone);
      setPhones(phones);
      setLoading(false);
    },
    [corbadoApp],
  );

  const getConfig = useCallback(
    async (abortController?: AbortController) => {
      setLoading(true);
      const result = await getIdentifierListConfig(abortController);
      if (result.err && result.val.ignore) {
        return;
      }

      if (!result || result?.err) {
        throw new Error(result?.val.name);
      }

      setFullNameRequired(result.val.fullNameRequired);
      for (const identifierConfig of result.val.identifiers) {
        if (identifierConfig.type === LoginIdentifierConfigType.Username) {
          setUsernameEnabled(true);
        } else if (identifierConfig.type === LoginIdentifierConfigType.Email) {
          setEmailEnabled(true);
        } else if (identifierConfig.type === LoginIdentifierConfigType.Phone) {
          setPhoneEnabled(true);
        }
      }
      setLoading(false);
    },
    [corbadoApp],
  );

  return (
    <CorbadoUserDetailsContext.Provider
      value={{
        loading,
        processUser,
        name,
        setName,
        username,
        setUsername,
        emails,
        setEmails,
        phones,
        setPhones,
        userNameEnabled: usernameEnabled,
        emailEnabled: emailEnabled,
        phoneEnabled: phoneEnabled,
        fullNameRequired: fullNameRequired,
        getCurrentUser,
        getConfig,
      }}
    >
      {children}
    </CorbadoUserDetailsContext.Provider>
  );
};
