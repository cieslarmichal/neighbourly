import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RegisterUserFormSchemaValues, registerUserFormSchema } from './schema/registerUserFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserApiError } from '../../../../api/user/errors/userApiError';
import { useRegisterUserMutation } from '../../../../api/user/mutations/registerUserMutation/registerUserMutation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { PasswordEyeIcon } from '../../../../components/icons/passwordEyeIcon/passwordEyeIcon';
import { AddressFormSchemaValues, addressFormSchema } from './schema/addressFormSchema';
import { useCreateAddressMutation } from '../../../../api/address/mutations/createAddressMutation';

interface RegisterUserFormProps {
  onSuccess: (result: { email: string; success: boolean }) => void;
  onError?: (error: UserApiError) => void;
}

type RegisterStage = 'basicData' | 'address';

export const RegisterUserForm: FC<RegisterUserFormProps> = ({ onSuccess, onError }: RegisterUserFormProps) => {
  const basicDataForm = useForm<RegisterUserFormSchemaValues>({
    resolver: zodResolver(registerUserFormSchema),
    defaultValues: {
      firstName: '',
      email: '',
      password: '',
      repeatedPassword: '',
    },
    mode: 'onTouched',
  });

  const addressForm = useForm<AddressFormSchemaValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      street: '',
      city: '',
      postalCode: '',
    },
  });

  const [firstStepValues, setFirstStepValues] = useState<RegisterUserFormSchemaValues>();

  const [responseErrorMessage, setResponseErrorMessage] = useState<string | null>(null);

  const [step, setStep] = useState<RegisterStage>('basicData');

  const registerUserMutation = useRegisterUserMutation({});

  const createAddressMutation = useCreateAddressMutation({});

  const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

  const [repeatedPasswordType, setRepeatedPasswordType] = useState<'text' | 'password'>('password');

  const [coords, setCoords] = useState<GeolocationCoordinates>();

  const onFirstStepSubmit = async (values: RegisterUserFormSchemaValues) => {
    setFirstStepValues(values);

    setStep('address');

    const getPositionPromise = new Promise<GeolocationPosition>((res, rej) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          res(position);
        },
        (error) => {
          rej(error);
        },
      );
    });

    const position = await getPositionPromise;

    setCoords(position.coords);
  };

  const onSecondStepSubmit = async (values: AddressFormSchemaValues) => {
    if (!firstStepValues) {
      return;
    }

    let userId: string;

    try {
      const result = await registerUserMutation.mutateAsync({
        email: firstStepValues?.email,
        password: firstStepValues.password,
        name: firstStepValues.firstName,
      });

      userId = result;

      onSuccess({
        email: firstStepValues.email,
        success: result ? true : false,
      });
    } catch (error) {
      setResponseErrorMessage((error as Error)?.message);
      if (onError) {
        onError(error as UserApiError);
      }

      return;
    }

    try {
      await createAddressMutation.mutateAsync({
        ...values,
        latitude: coords?.altitude as number,
        longitude: coords?.longitude as number,
        userId,
      });
    } catch (error) {
      setResponseErrorMessage((error as Error)?.message);
      if (onError) {
        onError(error as UserApiError);
      }
    }
  };

  return (
    <>
      {step === 'basicData' && (
        <Form {...basicDataForm}>
          <form
            onSubmit={basicDataForm.handleSubmit(onFirstStepSubmit)}
            className="space-y-8"
          >
            <FormField
              control={basicDataForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="h-[5.5rem]">
                  <FormLabel>Imię</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Imię"
                      maxLength={64}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={basicDataForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="h-[5.5rem]">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      maxLength={320}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={basicDataForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="h-[5.5rem]">
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Hasło"
                      type={passwordType}
                      includeQuill={false}
                      otherIcon={
                        <PasswordEyeIcon
                          onClick={() => setPasswordType(passwordType === 'password' ? 'text' : 'password')}
                          passwordType={passwordType}
                        />
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={basicDataForm.control}
              name="repeatedPassword"
              render={({ field }) => (
                <FormItem className="h-[5.5rem]">
                  <FormLabel>Powtórz hasło</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Hasło"
                      type={repeatedPasswordType}
                      includeQuill={false}
                      otherIcon={
                        <PasswordEyeIcon
                          onClick={() =>
                            setRepeatedPasswordType(repeatedPasswordType === 'password' ? 'text' : 'password')
                          }
                          passwordType={repeatedPasswordType}
                        />
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-60 sm:w-96 border-primary border"
              disabled={!basicDataForm.formState.isValid}
            >
              Następny krok
            </Button>
            {responseErrorMessage && <FormMessage>{responseErrorMessage}</FormMessage>}
          </form>
        </Form>
      )}
      {step === 'address' && (
        <Form {...addressForm}>
          <form
            onSubmit={addressForm.handleSubmit(onSecondStepSubmit)}
            className="space-y-8"
          >
            <FormField
              control={addressForm.control}
              name="street"
              render={({ field }) => (
                <FormItem className="h-[5.5rem]">
                  <FormLabel>Ulica</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ulica"
                      maxLength={64}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addressForm.control}
              name="city"
              render={({ field }) => (
                <FormItem className="h-[5.5rem]">
                  <FormLabel>Miasto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Miasto"
                      maxLength={64}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addressForm.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem className="h-[5.5rem]">
                  <FormLabel>Kod pocztowy</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kod pocztowy"
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-60 sm:w-96 border-primary border"
              disabled={!addressForm.formState.isValid}
            >
              Zarejestruj się
            </Button>
            {responseErrorMessage && <FormMessage>{responseErrorMessage}</FormMessage>}
          </form>
        </Form>
      )}
    </>
  );
};
