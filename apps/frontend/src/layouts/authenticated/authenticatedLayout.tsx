import { FC } from 'react';
import { Navbar } from '../../components/navbar/navbar';
import { Toaster } from '../../components/ui/toaster';

export interface Props {
  children: React.ReactNode;
}

export const AuthenticatedLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className='pt-24 sm:pt-40'>
        {children}
      </div>
      <Toaster />
    </>
  );
};
