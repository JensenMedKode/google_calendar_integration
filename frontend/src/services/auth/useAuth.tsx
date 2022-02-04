import { FC, useContext, createContext } from "react";
import { useAuthContextValue } from "./useAuthContextValue";

const AuthContext = createContext<ReturnType<typeof useAuthContextValue>>(null);

export const AuthContextProvider: FC<{ authSkip?: boolean }> = ({ children, authSkip }) => {
  const value = useAuthContextValue(authSkip);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
