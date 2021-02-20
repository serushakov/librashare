import AsyncStorage from '@react-native-community/async-storage';
import { useCallback, useContext, useState } from 'react';

import { postLogin } from '../../api/auth';
import { AuthContext } from '../../contexts/AuthContext';

const useHandleLogin = () => {
  const { setAuth } = useContext(AuthContext);
  const [error, setError] = useState();

  const doLogin = useCallback(
    async (username, password) => {
      setError(null);

      const response = await postLogin(username, password);

      const { token, user, message } = await response.json();

      if (response.status !== 200) {
        setError(message);
      }

      if (token && user) {
        setAuth(user, token);

        await AsyncStorage.setItem('userToken', token);
      }
    },
    [setAuth],
  );

  return {
    error,
    doLogin,
  };
};

export default useHandleLogin;
