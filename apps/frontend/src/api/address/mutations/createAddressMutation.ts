import { CreateAddressBody, CreateAddressCreatedResponseDTO } from '@common/contracts';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { ApiError } from '../../../common/errors/apiError';
import { HttpService } from '../../../core/services/httpService/httpService';

export const useCreateAddressMutation = (
  options: UseMutationOptions<CreateAddressCreatedResponseDTO, ApiError, CreateAddressBody>,
) => {
  const createAddress = async (values: CreateAddressBody) => {
    const response = await HttpService.post<CreateAddressCreatedResponseDTO>({
      url: '/address',
      body: values as unknown as Record<string, unknown>,
    });

    if (response.success === false) {
      throw new ApiError('AddressApiError', {
        apiResponseError: response.body.context,
        message: response.body.message,
        statusCode: response.statusCode,
      });
    }

    return response.body;
  };

  return useMutation({
    mutationFn: createAddress,
    ...options,
  });
};
