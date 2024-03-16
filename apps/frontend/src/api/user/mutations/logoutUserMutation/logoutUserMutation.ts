import { LogoutUserPathParams, LogoutUserRequestBody } from '@common/contracts';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { UserApiError } from '../../errors/userApiError';
import { HttpService } from '../../../../core/services/httpService/httpService';

type Payload = LogoutUserPathParams & LogoutUserRequestBody;

export const useLogoutUserMutation = (options: UseMutationOptions<void, UserApiError, Payload>) => {
  const logoutUser = async (values: Payload) => {
    const { accessToken, id, refreshToken } = values;

    const logoutUserResponse = await HttpService.post<void>({
      url: `/users/${id}/logout`,
      body: {
        refreshToken,
        accessToken,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (logoutUserResponse.success === false) {
      throw new UserApiError({
        message: mapStatusCodeToErrorMessage(logoutUserResponse.statusCode),
        apiResponseError: logoutUserResponse.body.context,
        statusCode: logoutUserResponse.statusCode,
      });
    }

    return;
  };

  return useMutation({
    mutationFn: logoutUser,
    ...options,
  });
};

const mapStatusCodeToErrorMessage = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      return 'Niepoprawne dane';
    // return 'Invalid data';
    case 401:
      return 'Niepoprawne dane';
    // return 'Invalid data';
    case 500:
      return 'Wewnętrzny błąd serwera';
    // return 'Internal server error';
    default:
      return 'Unknown error';
  }
};
