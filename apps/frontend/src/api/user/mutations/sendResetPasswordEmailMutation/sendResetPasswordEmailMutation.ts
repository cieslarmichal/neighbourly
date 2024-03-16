import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { type LoginUserResponseBody } from '@common/contracts';

import { UserApiError } from '../../errors/userApiError';
import { HttpService } from '../../../../core/services/httpService/httpService';

// TODO: add body type
export const useSendResetPasswordEmailMutation = (
  options: UseMutationOptions<LoginUserResponseBody, UserApiError, { email: string }>,
) => {
  const sendResetPasswordEmail = async (values: { email: string }) => {
    const sendResetPasswordEmailResponse = await HttpService.post<LoginUserResponseBody>({
      url: '/users/reset-password',
      body: {
        email: values.email,
      },
    });

    if (sendResetPasswordEmailResponse.success === false) {
      throw new UserApiError({
        message: mapStatusCodeToErrorMessage(sendResetPasswordEmailResponse.statusCode),
        apiResponseError: sendResetPasswordEmailResponse.body.context,
        statusCode: sendResetPasswordEmailResponse.statusCode,
      });
    }

    return sendResetPasswordEmailResponse.body;
  };

  return useMutation({
    mutationFn: sendResetPasswordEmail,
    ...options,
  });
};

const mapStatusCodeToErrorMessage = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      // return 'Failed to send the email.';
      return 'Nie udało się wysłać wiadomości. Spróbuj ponownie.'
    case 500:
      return 'Internal server error';
    default:
      return 'Unknown error';
  }
};
