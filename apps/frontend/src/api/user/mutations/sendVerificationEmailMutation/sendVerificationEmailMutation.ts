import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { UserApiError } from '../../errors/userApiError';
import { HttpService } from '../../../../core/services/httpService/httpService';

export const useSendVerificationEmailMutation = (
  options: UseMutationOptions<
    void,
    UserApiError,
    {
      email: string;
    }
  >,
) => {
  const sendVerificationEmail = async (values: { email: string }) => {
    const { email } = values;

    const sendVerificationEmailResponse = await HttpService.post({
      url: '/users/send-verification-email',
      body: {
        email,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (sendVerificationEmailResponse.success === false) {
      throw new UserApiError({
        message: sendVerificationEmailResponse.body.message,
        apiResponseError: sendVerificationEmailResponse.body.context,
        statusCode: sendVerificationEmailResponse.statusCode,
      });
    }

    return;
  };

  return useMutation({
    mutationFn: sendVerificationEmail,
    ...options,
  });
};
