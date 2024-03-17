import { FindPostsPathParams, FindPostsResponseBody } from '@common/contracts';
import { useSelector } from 'react-redux';
import { userStateSelectors } from '../../../../core/store/states/userState/userStateSlice';
import { useQuery } from '@tanstack/react-query';
import { HttpService } from '../../../../core/services/httpService/httpService';
import { ApiError } from '../../../../common/errors/apiError';

export const useFindPostsQuery = (values: FindPostsPathParams) => {
  const accessToken = useSelector(userStateSelectors.selectAccessToken);

  const findPosts = async (values: FindPostsPathParams) => {
    const { groupId } = values;

    const response = await HttpService.get<FindPostsResponseBody>({
      url: `/groups/${groupId}/posts`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (response.success === false) {
      throw new ApiError('GroupApiError', {
        message: 'Failed to find posts.',
        apiResponseError: response.body.context,
        statusCode: response.statusCode,
      });
    }

    return response.body;
  };

  return useQuery({
    queryKey: ['findPosts', values],
    queryFn: (values) => findPosts(values.queryKey[1] as FindPostsPathParams),
    enabled: !!accessToken && !!values.groupId,
  });
};
