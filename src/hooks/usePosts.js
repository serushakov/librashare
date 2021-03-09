import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { fetchMediaByTag } from '../api/media';
import { appIdentifier } from '../utils';

const usePosts = () => {
  const { data = [], isLoading, isError } = useQuery(
    'posts',
    () => fetchMediaByTag(appIdentifier),
    {
      refetchOnMount: true,
    },
  );

  return {
    data: useMemo(
      () =>
        data?.map((item) => ({
          ...item,
          ...JSON.parse(item.description),
        })),
      [data],
    ),
    isLoading,
    isError,
  };
};

export default usePosts;
