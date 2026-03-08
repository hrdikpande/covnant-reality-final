import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ─── Card ───────────────────────────────────────────────────────────────── */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverable = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-bg-card rounded-2xl border border-border shadow-sm overflow-hidden",
                    hoverable &&
                    "transition-shadow duration-200 hover:shadow-md cursor-pointer",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

/* ─── CardHeader ─────────────────────────────────────────────────────────── */

const CardHeader = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("px-4 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-3", className)}
            {...props}
        >
            {children}
        </div>
    );
});

CardHeader.displayName = "CardHeader";

/* ─── CardContent ────────────────────────────────────────────────────────── */

const CardContent = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("px-4 py-2 sm:px-6 sm:py-3", className)}
            {...props}
        >
            {children}
        </div>
    );
});

CardContent.displayName = "CardContent";

/* ─── CardFooter ─────────────────────────────────────────────────────────── */

const CardFooter = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "px-4 pb-4 pt-2 sm:px-6 sm:pb-6 sm:pt-3 border-t border-border",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
export type { CardProps };
