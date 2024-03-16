import { FC } from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
}

export const Logo: FC<LogoProps> = ({ className }: LogoProps) => {
  return (
    <div className={cn('flex-1 sm:max-h-[700px] sm:max-w-[700px] flex justify-center', className)}>
      <img
        src="/book_square.jpg"
        alt="neighbourly's logo"
        className="object-fit aspect-square"
      />
    </div>
  );
};
