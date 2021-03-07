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

      try {
        const response = await postLogin(username, password);

        const { token, user } = response.data;

        if (token && user) {
          setAuth(user, token);

          await AsyncStorage.setItem('userToken', token);
        }
      } catch (requestError) {
        setError(requestError.message);
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
