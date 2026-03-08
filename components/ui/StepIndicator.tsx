import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps?: number;
}

const STEP_LABELS = [
    "Role",
    "Details",
    "Media",
    "Amenities",
    "Contact",
    "Review",
];

export function StepIndicator({ currentStep, totalSteps = 6 }: StepIndicatorProps) {
    const activeProgressWidth = Math.max(0, Math.min(100, ((currentStep - 1) / (totalSteps - 1)) * 100));

    return (
        <div className="w-full overflow-x-auto hide-scrollbar pb-8 md:pb-10 pt-4" role="list" aria-label="Step progress">
            <div className="min-w-[460px] sm:min-w-full px-4 sm:px-8 lg:px-4">
                <div className="relative flex justify-between items-center">
                    {/* Background Connecting Line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] lg:h-[3px] bg-slate-200 z-0" />

                    {/* Active Progress Connecting Line */}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] lg:h-[3px] bg-primary z-0 transition-all duration-300 ease-in-out"
                        style={{ width: `${activeProgressWidth}%` }}
                    />

                    {/* Step Nodes */}
                    {STEP_LABELS.map((label, index) => {
                        const stepNum = index + 1;
                        const isCompleted = currentStep > stepNum;
                        const isCurrent = currentStep === stepNum;

                        return (
                            <div
                                key={label}
                                className="relative flex flex-col items-center z-10 group"
                                role="listitem"
                                aria-current={isCurrent ? "step" : undefined}
                            >
                                {/* Mask behind the circle to clear the line */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full z-0" />

                                {/* Step Circle */}
                                <div className={cn(
                                    "relative z-10 flex items-center justify-center rounded-full font-semibold transition-all duration-200 border-2",
                                    "w-8 h-8 text-xs md:w-10 md:h-10 md:text-sm",
                                    isCompleted ? "bg-primary border-primary text-white" :
                                        isCurrent ? "border-primary text-primary bg-white" :
                                            "border-border text-text-muted bg-white",
                                    isCurrent && "ring-4 ring-primary/10"
                                )}>
                                    {isCompleted ? (
                                        <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
                                    ) : (
                                        stepNum
                                    )}
                                </div>

                                {/* Step Label */}
                                <span className={cn(
                                    "absolute mt-1 whitespace-nowrap font-medium transition-colors duration-200",
                                    "top-9 text-[10px] md:top-11 md:text-xs lg:text-[13px]",
                                    (isCurrent || isCompleted) ? "text-text-primary" : "text-text-muted"
                                )}>
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
