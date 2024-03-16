import * as React from 'react';
import { ImQuill } from 'react-icons/im';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  includeQuill?: boolean;
  otherIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, type, includeQuill = true, otherIcon, ...props }, ref) => {
    return (
      <div className={cn(
        `flex
         flex-row
         has-[input:focus-visible]:ring-2
         has-[input:focus-visible]:ring-ring
         has-[input:focus-visible]:ring-offset-4
         bg-[#D1D5DB]/20
         rounded-md
         border
         border-input
         ring-offset-background
         w-60 sm:w-96`,
        containerClassName
      )}>
        <input
          type={type}
          className={cn(
            'w-[13rem] sm:w-[22rem] flex h-12 px-3 py-2 rounded-md text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-none bg-[unset] focus:border-none outline-none',
            className,
          )}
          ref={ref}
          {...props}
        />
        {includeQuill && (
          <div className="w-60 sm:w-96 absolute h-12 pointer-events-none flex items-center justify-end px-2">
            <ImQuill className="bg-[#D1D5DB]/20 text-primary opacity-65 text-3xl" />
          </div>
        )}
        {otherIcon && (
          <div className="w-60 sm:w-96 absolute h-12 pointer-events-none flex items-center justify-end px-2">
            {otherIcon}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
