import React, { FC } from 'react';
import { cn } from '../../lib/utils';
import { Link } from '@tanstack/react-router';
import { Toaster } from '../../components/ui/toaster';

export interface Props {
  children: React.ReactNode;
  innerContainerClassName?: string;
}

export const DefaultLayout: FC<Props> = ({ children, innerContainerClassName }) => {
  return (
    <div>
      <div className="p-8 top-0 left-0 absolute w-[100%] text-4xl sm:text-7xl font-logo-bold">
        <Link to="/">neighbourly</Link>
      </div>
      <div className="flex items-center justify-center h-screen pt-[24rem] sm:pt-[5rem]">
        <div className={cn('flex items-center justify-center px-4 h-[800px]', innerContainerClassName)}>{children}</div>
      </div>
      <Toaster />
    </div>
  );
};
