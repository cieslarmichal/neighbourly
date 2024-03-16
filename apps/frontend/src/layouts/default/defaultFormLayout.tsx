import { FC } from 'react';
import { DefaultLayout } from './defaultLayout';

interface DefaultFormLayoutProps {
  children: React.ReactNode;
}

export const DefaultFormLayout: FC<DefaultFormLayoutProps> = ({ children }: DefaultFormLayoutProps) => {
  return (
    <DefaultLayout innerContainerClassName='flex-col-reverse sm:flex-row sm:p-0 py-16'>
      <div className="flex-1 flex flex-col items-start sm:items-baseline px-8 max-w-[30rem]">{children}</div>
    </DefaultLayout>
  );
};
