"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = true,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-text-primary"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                            {leftIcon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full h-10 px-3 text-sm bg-white border rounded-xl transition-colors duration-200",
                            "placeholder:text-text-muted",
                            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-border-focus",
                            error
                                ? "border-danger focus:ring-danger/20 focus:border-danger"
                                : "border-border",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            className
                        )}
                        {...props}
                    />

                    {rightIcon && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                            {rightIcon}
                        </span>
                    )}
                </div>

                {error && (
                    <p className="text-xs text-danger">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-xs text-text-muted">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
