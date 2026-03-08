import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
}

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-bg-card rounded-2xl border border-border">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
                {title}
            </h3>
            <p className="text-text-secondary max-w-sm mx-auto mb-6">
                {description}
            </p>
            <Link href={actionHref}>
                <Button>{actionLabel}</Button>
            </Link>
        </div>
    );
}
