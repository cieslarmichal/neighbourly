import { FC, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { LoginUserFormValues, loginUserFormSchema } from './schema/loginUserFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { type LoginUserResponseBody } from '@common/contracts';
import { useLoginUserMutation } from '../../../../api/user/mutations/loginUserMutation/loginUserMutation';
import { UserApiError } from '../../../../api/user/errors/userApiError';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';
import { PasswordEyeIcon } from '../../../../components/icons/passwordEyeIcon/passwordEyeIcon';

interface LoginUserFormProps {
  onSuccess: (loginUserResponseBody: LoginUserResponseBody) => void;
  onError?: (error: UserApiError) => void;
}

export const LoginUserForm: FC<LoginUserFormProps> = ({ onSuccess, onError }: LoginUserFormProps) => {
  const loginUserMutation = useLoginUserMutation({});

  const [passwordInputType, setPasswordInputType] = useState<'text' | 'password'>('password');

  const form = useForm<LoginUserFormValues>({
    resolver: zodResolver(loginUserFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    reValidateMode: 'onChange',
    mode: 'onTouched',
  });

  const [responseErrorMessage, setResponseErrorMessage] = useState<null | string>(null);

  const onSubmit = async (values: LoginUserFormValues) => {
    loginUserMutation.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: (loginUserResponseBody) => onSuccess(loginUserResponseBody),
        onError: (error) => {
          setResponseErrorMessage(error.context.message);
          console.log(error);

          if (onError) {
            onError(error);
          }
        },
      },
    );
  };

  const setInputFieldErrorState = (
    field:
      | ControllerRenderProps<{
          email: string;
        }>
      | ControllerRenderProps<{
          password: string;
        }>,
  ) => {
    if (form.formState.errors[field.name]) {
      return 'border-red-500';
    }

    return '';
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
            name="email"
            render={({ field }) => (
              <FormItem className="h-[5.5rem]">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    maxLength={254}
                    containerClassName={cn('focus:border-input', setInputFieldErrorState(field))}
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
                    type={passwordInputType}
                    maxLength={64}
                    includeQuill={false}
                    otherIcon={
                      <PasswordEyeIcon
                        onClick={() => setPasswordInputType(passwordInputType === 'password' ? 'text' : 'password')}
                        passwordType={passwordInputType}
                      />
                    }
                    {...field}
                    containerClassName={cn('focus:border-input', setInputFieldErrorState(field))}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="w-60 sm:w-96 border-primary border-[1.25px]"
            >
              Wejdź do biblioteki
            </Button>
            <div className="text-xs text-center w-60 sm:w-96 pt-[4px]">
              <Link
                to="/reset-password"
                className="text-primary"
              >
                Nie pamiętasz hasła?{' '}
              </Link>
            </div>
          </div>
          {responseErrorMessage && <FormMessage>{responseErrorMessage}</FormMessage>}
          <p className="font-light">
            Nie masz konta?{' '}
            <Link
              to="/register"
              className="text-primary font-semibold"
            >
              Zarejestruj się :)
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};
