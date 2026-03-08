"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonVariant, ButtonSize } from "@/types";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-primary text-white hover:bg-primary-hover active:bg-primary-hover shadow-sm",
    secondary:
        "bg-slate-100 text-text-primary hover:bg-slate-200 active:bg-slate-300",
    outline:
        "border border-border text-text-primary bg-white hover:bg-slate-50 active:bg-slate-100",
    ghost:
        "text-text-secondary hover:bg-slate-100 active:bg-slate-200",
    danger:
        "bg-danger text-white hover:bg-danger-hover active:bg-danger-hover shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-sm gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            fullWidth = false,
            loading = false,
            disabled,
            leftIcon,
            rightIcon,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    variantStyles[variant],
                    sizeStyles[size],
                    fullWidth && "w-full",
                    className
                )}
                {...props}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    leftIcon
                )}
                {children}
                {!loading && rightIcon}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
