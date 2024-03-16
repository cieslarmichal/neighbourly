import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { UserApiError } from '../../errors/userApiError';
import { HttpService } from '../../../../core/services/httpService/httpService';

export const useVerifyUserEmailMutation = (
  options: UseMutationOptions<
    boolean,
    UserApiError,
    {
      token: string;
    }
  >,
) => {
  const verifyUserEmail = async (values: { token: string }) => {
    const { token } = values;

    const verifyEmailResponse = await HttpService.post({
      url: '/users/verify-email',
      body: {
        token,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (verifyEmailResponse.success === false) {
      throw new UserApiError({
        message: verifyEmailResponse.body.message,
        apiResponseError: verifyEmailResponse.body.context,
        statusCode: verifyEmailResponse.statusCode,
      });
    }

    return true;
  };

  return useMutation({
    mutationFn: verifyUserEmail,
    ...options,
  });
};
