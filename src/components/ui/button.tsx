import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 disabled:pointer-events-none disabled:opacity-45 outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-fg hover:opacity-90",
        secondary:
          "bg-bg-subtle text-fg border border-border hover:bg-bg-hover",
        outline:
          "border border-border-strong bg-transparent text-fg hover:bg-bg-subtle",
        ghost: "text-fg-muted hover:bg-bg-subtle hover:text-fg",
        soft: "bg-accent/15 text-accent hover:bg-accent/25",
        danger: "bg-danger/15 text-danger hover:bg-danger/25",
        paper: "bg-paper text-paper-fg hover:opacity-95",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 rounded-[var(--radius-sm)] px-3 text-xs",
        lg: "h-12 rounded-[var(--radius-lg)] px-6 text-base",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
