import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { type LoginUserResponseBody } from '@common/contracts';

import { UserApiError } from '../../errors/userApiError';
import { HttpService } from '../../../../core/services/httpService/httpService';

export const useSetNewPasswordMutation = (
  options: UseMutationOptions<LoginUserResponseBody, UserApiError, { token: string; password: string }>,
) => {
  const setNewPassword = async (values: { password: string; token: string }) => {
    const setNewPasswordResponse = await HttpService.post<LoginUserResponseBody>({
      url: '/users/change-password',
      body: {
        password: values.password,
        token: values.token,
      },
    });

    if (setNewPasswordResponse.success === false) {
      throw new UserApiError({
        message: mapStatusCodeToErrorMessage(setNewPasswordResponse.statusCode),
        apiResponseError: setNewPasswordResponse.body.context,
        statusCode: setNewPasswordResponse.statusCode,
      });
    }

    return setNewPasswordResponse.body;
  };

  return useMutation({
    mutationFn: setNewPassword,
    ...options,
  });
};

const mapStatusCodeToErrorMessage = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      // return 'Failed to set the new password.';
      return 'Nie udało się ustawić nowego hasła. Spróbuj ponownie.'
    case 500:
      return 'Internal server error';
    default:
      return 'Unknown error';
  }
};
