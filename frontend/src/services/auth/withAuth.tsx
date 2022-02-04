import React, { ComponentType, FC, ReactNode } from "react";
import { AuthContextProvider, useAuth } from "./useAuth";
import { AuthStage } from "./useAuthContextValue";

const AuthGuard: FC<{ unAuth: ReactNode; loading: ReactNode }> = ({
  children,
  unAuth,
  loading
}) => {
  const { authStage } = useAuth();

  const component =
    authStage == AuthStage.UNAUTHENTICATED
      ? unAuth
      : authStage == AuthStage.CHECKING
      ? loading
      : children;

  return <>{component}</>;
};

type Settings = {
  /**
   * If the initial auth check should be disabled.
   */
  authSkip?: boolean;
  /**
   * What component to display if the user is unauthenticated.
   */
  unAuth?: ReactNode;
  /**
   * What component to display while authentication is checking.
   */
  loading?: ReactNode;
};

export const withAuth =
  (Component: ComponentType, { authSkip, unAuth, loading }: Settings = {}): FC =>
  // eslint-disable-next-line react/display-name
  ({ ...props }) => {
    const checkIfProvided = useAuth();

    const inner = authSkip ? (
      <Component {...props} />
    ) : (
      <AuthGuard
        loading={loading ?? <div>loading...</div>}
        unAuth={unAuth ?? <div>unauthenticated!</div>}>
        <Component {...props} />
      </AuthGuard>
    );

    return checkIfProvided ? (
      inner
    ) : (
      <AuthContextProvider authSkip={authSkip}>{inner} </AuthContextProvider>
    );
  };
