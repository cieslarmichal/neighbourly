import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { UserApiError } from '../../errors/userApiError';
import { type LoginUserResponseBody } from '@common/contracts';
import { HttpService } from '../../../../core/services/httpService/httpService';

export const useLoginUserMutation = (
  options: UseMutationOptions<LoginUserResponseBody, UserApiError, { email: string; password: string }>,
) => {
  const loginUser = async (values: { email: string; password: string }) => {
    const loginUserResponse = await HttpService.post<LoginUserResponseBody>({
      url: '/users/login',
      body: {
        email: values.email,
        password: values.password,
      },
    });

    if (loginUserResponse.success === false) {
      throw new UserApiError({
        message: mapStatusCodeToErrorMessage(loginUserResponse.statusCode),
        apiResponseError: loginUserResponse.body.context,
        statusCode: loginUserResponse.statusCode,
      });
    }

    return loginUserResponse.body;
  };

  return useMutation({
    mutationFn: loginUser,
    ...options,
  });
};

const mapStatusCodeToErrorMessage = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      return 'Email lub hasło niepoprawne.'
      // return 'Email or password are invalid.';
    case 401:
      return 'Email lub hasło niepoprawne.'
      // return 'Email or password are invalid.';
    case 500:
      return 'Wewnętrzny błąd serwera.'
      // return 'Internal server error';
    default:
      return 'Unknown error';
  }
};
