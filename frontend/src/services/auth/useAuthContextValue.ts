/* istanbul ignore file */
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { client } from "services/backend/client";
import { AuthFetchClient } from "services/backend/client.generated";
import { useEffectAsync } from "../../hooks/useEffectAsync";

export enum AuthStage {
  CHECKING,
  AUTHENTICATED,
  UNAUTHENTICATED
}

type AuthHook<T> = {
  authStage: AuthStage;
  login: (s: string) => Promise<boolean>;
  logout: () => void;
  activeUser: T | null;
  checkAuth: () => Promise<void>;
};

type MyAuth = boolean; // TODO: set this to the User DTO you need.

export const useAuthContextValue = (authSkip: boolean = false): AuthHook<MyAuth> => {
  const [authStage, setAuthStage] = useState(AuthStage.CHECKING);
  const [authCounter, setAuthCounter] = useState(0);
  const [activeUser, setActiveUser] = useState<MyAuth>(null);

  const checkAuth = useCallback(async () => {
    if (authSkip) return;
    setAuthStage(AuthStage.CHECKING);

    const authClient: AuthFetchClient = await client(AuthFetchClient);
    const user: MyAuth = await authClient.auth_CheckAuth().catch(() => null);

    setActiveUser(user);
    setAuthStage(user ? AuthStage.AUTHENTICATED : AuthStage.UNAUTHENTICATED);
  }, [authSkip]);

  useEffectAsync(checkAuth, [authCounter, checkAuth]);

  const login = useCallback(async (token: string) => {
    setAuthToken(token);
    setAuthCounter(c => c + 1);
    return true;
  }, []);

  const logout = useCallback(() => {
    setAuthToken("");
    setAuthStage(AuthStage.UNAUTHENTICATED);
  }, []);

  return { authStage, login, logout, activeUser, checkAuth };
};

export const getAuthToken = (_context?: GetServerSidePropsContext): string => {
  if (process.browser) return localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_NAME);

  return null;
};

export const setAuthToken = (token: string, _context?: GetServerSidePropsContext): void => {
  if (process.browser) return localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_NAME, token);
};
