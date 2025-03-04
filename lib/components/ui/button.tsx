import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 cursor-pointer disabled:cursor-not-allowed select-none touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-blue-100 text-blue-700 shadow shadow-blue-400 hover:bg-blue-50 border border-blue-200 inset-shadow-sm inset-shadow-white",
        secondary:
          "bg-blue-200 text-blue-700 shadow shadow-blue-400 hover:bg-blue-100 border border-blue-200 inset-shadow-sm inset-shadow-blue-50",
        ghost: "bg-transparent text-blue-900 hover:bg-blue-100",
      },
      size: {
        sm: "h-7 px-2 text-sm [&_svg]:size-4 rounded-xl",
        default: "h-12 px-4 py-2",
        lg: "h-14 px-8",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "ref">,
    VariantProps<typeof buttonVariants> {
  ref?: React.Ref<HTMLButtonElement>;
}

function Button({ className, variant, size, ref, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
}

export { Button, buttonVariants };
