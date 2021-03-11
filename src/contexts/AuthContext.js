import React, { useCallback, useMemo, useState } from 'react';

export const AuthContext = React.createContext({
  user: null,
  token: null,
  isLoggedIn: false,
  setAuth: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  const setAuth = useCallback((newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
  });

  const logout = useCallback(() => {
    setUser(undefined);
    setToken(undefined);
  }, []);

  return (
    <AuthContext.Provider
      value={useMemo(() => ({
        user,
        token,
        setAuth,
        logout,
        isLoggedIn: user && token,
      }))}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
