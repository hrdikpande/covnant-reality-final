import { cn } from "@/lib/utils";
import type { BadgeVariant } from "@/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
    default:
        "bg-primary-light text-primary",
    success:
        "bg-emerald-50 text-accent",
    warning:
        "bg-amber-50 text-warning",
    danger:
        "bg-red-50 text-danger",
    outline:
        "bg-transparent border border-border text-text-secondary",
};

function Badge({
    className,
    variant = "default",
    children,
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                variantStyles[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

export { Badge };
export type { BadgeProps };
