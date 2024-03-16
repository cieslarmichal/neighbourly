import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { UserApiError } from '../../errors/userApiError';
import { HttpService } from '../../../../core/services/httpService/httpService';
import { RegisterUserResponseBody } from '@common/contracts';

export const useRegisterUserMutation = (
  options: UseMutationOptions<string, UserApiError, { email: string; password: string; name: string }>,
) => {
  const registerUser = async (values: { email: string; password: string; name: string }) => {
    const registerUserResponse = await HttpService.post<RegisterUserResponseBody>({
      url: '/users/register',
      body: {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (registerUserResponse.success === false) {
      throw new UserApiError({
        message: mapStatusCodeToErrorMessage(registerUserResponse.statusCode),
        apiResponseError: registerUserResponse.body.context,
        statusCode: registerUserResponse.statusCode,
      });
    }

    return registerUserResponse.body.id;
  };

  return useMutation({
    mutationFn: registerUser,
    ...options,
  });
};

const mapStatusCodeToErrorMessage = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      // return 'Email or password are invalid.';
      return 'Email lub hasło niepoprawne.'
    case 404:
      return 'Not found';
    case 409:
      return 'Użytkownik z tym adresem email już istnieje.';
      // return 'User with this email address already exists.';
    case 422:
      return 'Użytkownik z tym adresem email już istnieje.';
      // return 'User with this email address already exists.';
    case 500:
      return 'Internal server error';
    default:
      return 'Unknown error';
  }
};
