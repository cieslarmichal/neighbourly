import { SearchGroupQueryParams, SearchGroupResponse } from '@common/contracts';
import { useSelector } from 'react-redux';
import { userStateSelectors } from '../../../../core/store/states/userState/userStateSlice';
import { HttpService } from '../../../../core/services/httpService/httpService';
import { ApiError } from '../../../../common/errors/apiError';
import { useQuery } from '@tanstack/react-query';

export const useFindGroupsWithinQuery = (values: SearchGroupQueryParams) => {
  const accessToken = useSelector(userStateSelectors.selectAccessToken);

  const findGroupsWithinRadius = async (values: SearchGroupQueryParams) => {
    const { latitude, longitude, radius } = values;

    const queryParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });

    const response = await HttpService.get<SearchGroupResponse>({
      url: `/groups/search?${queryParams.toString()}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.success === false) {
      throw new ApiError('GroupsApiError', {
        apiResponseError: response.body.context,
        message: response.body.message,
        statusCode: response.statusCode,
      });
    }

    return response.body;
  };

  return useQuery({
    queryKey: ['findGroupsWithin', values],
    queryFn: () => findGroupsWithinRadius(values),
  })
};
