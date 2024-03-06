import * as React from 'react';
import {cva, VariantProps} from 'class-variance-authority';
import {cn} from '@/utils/classnames';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        ghost:
          'peer block w-full border-0 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, type, variant = 'default', ...props}, ref) => {
    return (
      <div className="relative flex-1">
        <input
          type={type}
          className={cn(inputVariants({variant}), className)}
          ref={ref}
          {...props}
        />
        {variant === 'ghost' && (
          <div
            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary"
            aria-hidden="true"
          />
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export {Input};
