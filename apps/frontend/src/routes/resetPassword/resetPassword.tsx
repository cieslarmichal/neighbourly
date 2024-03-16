/* eslint-disable react-refresh/only-export-components */
import { Link, createRoute, useNavigate } from '@tanstack/react-router';
import { rootRoute } from '../root';
import { FC, useState } from 'react';
import { SendResetPasswordEmailForm } from './components/sendResetPasswordEmailForm/sendResetPasswordEmailForm';
import { DefaultFormLayout } from '../../layouts/default/defaultFormLayout';
import { RequireNonAuthComponent } from '../../core/components/requireNonAuth/requireNonAuthComponent';
import { Button } from '../../components/ui/button';

export const SendResetPasswordEmailPage: FC = () => {
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);

  const [userEmail, setUserEmail] = useState<string>('');

  const onSuccess = async (email: string) => {
    setSuccess(true);

    setUserEmail(email);
  };

  return (
    <DefaultFormLayout>
      {!success ? (
        <>
          <div className="flex flex-col py-16 max-w-[25rem]">
            <SendResetPasswordEmailForm
              onSuccess={onSuccess}
              email={userEmail}
            />
            <p className="py-12">
              Pomyłka?{' '}
              <Link
                className="text-primary font-semibold"
                to={'/login'}
              >
                Przejdź do logowania.
              </Link>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="py-16 w-60 sm:w-96">
            <p className="text-xl mt-3 font-medium py-2">
              Wysłaliśmy <span className="text-primary font-semibold">wiadomość email.</span>
            </p>
            <p className="text-xl mt-3 font-medium py-2">
              Znajdziesz w niej link, który pozwoli Ci ustawić nowe hasło.
            </p>
            <p className="py-8 w-[100%]">
              <Button
                className="w-[100%]"
                onClick={() =>
                  navigate({
                    to: '/login',
                  })
                }
              >
                Przejdź do logowania
              </Button>
              <Link
                to="/login"
                className="text-primary font-semibold"
              ></Link>
            </p>
          </div>
        </>
      )}
    </DefaultFormLayout>
  );
};

export const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: () => {
    return (
      <RequireNonAuthComponent>
        <SendResetPasswordEmailPage />
      </RequireNonAuthComponent>
    );
  },
});
