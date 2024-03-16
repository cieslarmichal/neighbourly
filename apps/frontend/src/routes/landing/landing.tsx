/* eslint-disable react-refresh/only-export-components */
import { createRoute, useNavigate } from '@tanstack/react-router';
import { rootRoute } from '../root';
import { FC } from 'react';
import { Button } from '../../components/ui/button';
import { Logo } from '../../components/logo/logo';
import { RequireNonAuthComponent } from '../../core/components/requireNonAuth/requireNonAuthComponent';

export const LandingPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center justify-center h-screen">
        <div className={'flex flex-col-reverse sm:flex-row items-center justify-center px-4 h-[800px]'}>
          <div className="flex-1 items-center justify-start text-center py-8 sm:py-24 max-w-[28rem]">
            <div className="flex flex-col items-baseline">
              <div>
                <p className="text-6xl sm:text-8xl font-semibold text-start ml-[-0.25rem] sm:ml-[-0.45rem]">neighbourly</p>
              </div>
              <p className="text-xl sm:text-2xl text-start mt-3">Twoja prywatna biblioteka</p>
              <Button
                className="w-60 sm:w-96 py-6 px-6 mt-8 sm:mt-16 text-sm sm:text-xl"
                onClick={() =>
                  navigate({
                    to: '/login',
                  })
                }
              >
                Odkryj jej możliwości
              </Button>
            </div>
          </div>
          <Logo />
        </div>
      </div>
    </div>
  );
};

export const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    return (
      <RequireNonAuthComponent>
        <LandingPage />
      </RequireNonAuthComponent>
    );
  },
});
