import React, { useCallback, useMemo, useState } from 'react';

export const AuthContext = React.createContext({
  user: null,
  token: null,
  isLoggedIn: false,
  setAuth: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  const setAuth = useCallback((newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
  });

  return (
    <AuthContext.Provider
      value={useMemo(() => ({
        user,
        token,
        setAuth,
        isLoggedIn: user && token,
      }))}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
