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

interface RegisterUserFormProps {
  onSuccess: (result: { email: string; success: boolean }) => void;
  onError?: (error: UserApiError) => void;
}

export const RegisterUserForm: FC<RegisterUserFormProps> = ({ onSuccess, onError }: RegisterUserFormProps) => {
  const form = useForm<RegisterUserFormSchemaValues>({
    resolver: zodResolver(registerUserFormSchema),
    defaultValues: {
      firstName: '',
      email: '',
      password: '',
      repeatedPassword: '',
    },
    mode: 'onTouched',
  });

  const [responseErrorMessage, setResponseErrorMessage] = useState<string | null>(null);

  const registerUserMutation = useRegisterUserMutation({});

  const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

  const [repeatedPasswordType, setRepeatedPasswordType] = useState<'text' | 'password'>('password');

  const onSubmit = async (values: RegisterUserFormSchemaValues) => {
    registerUserMutation.mutate(
      {
        email: values.email,
        password: values.password,
        name: values.firstName,
      },
      {
        onSuccess: (result) =>
          onSuccess({
            email: values.email,
            success: result,
          }),
        onError: (error) => {
          setResponseErrorMessage(error.context?.message);

          if (onError) {
            onError(error);
          }
        },
      },
    );
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            disabled={!form.formState.isValid}
          >
            Zarejestruj się
          </Button>
          {responseErrorMessage && <FormMessage>{responseErrorMessage}</FormMessage>}
        </form>
      </Form>
    </>
  );
};
