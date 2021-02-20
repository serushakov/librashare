import { useQuery } from 'react-query';
import validate from 'validate.js';
import { getUsernameExists } from '../../api/auth';

validate.validators.uniqueUsername = async (value) => {
  const result = await getUsernameExists(value);

  return result.available ? null : 'is taken';
};

const checkUsername = async (username) => {
  try {
    await validate.async(
      { username },
      {
        username: {
          length: { minimum: 3 },
          uniqueUsername: true,
        },
      },
    );
  } catch (errors) {
    return errors;
  }
};

const useValidateUsername = (username) => {
  const { isLoading, data } = useQuery(
    ['username', username],
    () => checkUsername(username),
    {
      staleTime: 1,
    },
  );

  return { isLoading, error: data?.username };
};

export default useValidateUsername;
