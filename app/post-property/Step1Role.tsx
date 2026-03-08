import { Building2, UserCircle2, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormData } from "./PostPropertyContent";

type Role = "Owner" | "Agent" | "Builder";

interface Step1RoleProps {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    showErrors?: boolean;
}

const ROLES: { id: Role; title: string; description: string; icon: React.ReactNode }[] = [
    {
        id: "Owner",
        title: "Owner",
        description: "I am the owner of the property",
        icon: <UserCircle2 className="w-6 h-6" />,
    },
    {
        id: "Agent",
        title: "Agent",
        description: "I am a real estate agent or broker",
        icon: <Building2 className="w-6 h-6" />,
    },
    {
        id: "Builder",
        title: "Builder",
        description: "I am a builder or developer",
        icon: <HardHat className="w-6 h-6" />,
    },
];

export function Step1Role({ formData, updateFormData, showErrors }: Step1RoleProps) {
    const selectedRole = formData.role as Role | undefined;

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-text-primary">
                    Who are you posting as?
                </h3>
                <p className="text-sm md:text-base text-text-secondary mt-1">
                    Select your role to help us customize your experience.
                </p>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row">
                {ROLES.map((role) => {
                    const isSelected = selectedRole === role.id;

                    return (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => updateFormData({ role: role.id })}
                            className={cn(
                                "flex items-start p-5 rounded-xl border-2 text-left transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none",
                                isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-white hover:border-primary/30 hover:bg-slate-50"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center w-12 h-12 rounded-full shrink-0 mr-4 transition-colors",
                                isSelected ? "bg-primary text-white" : "bg-slate-100 text-text-secondary group-hover:text-primary"
                            )}>
                                {role.icon}
                            </div>

                            <div className="flex-1 mt-0.5">
                                <h4 className={cn(
                                    "text-base font-semibold transition-colors",
                                    isSelected ? "text-primary" : "text-text-primary"
                                )}>
                                    {role.title}
                                </h4>
                                <p className="text-sm text-text-secondary mt-1">
                                    {role.description}
                                </p>
                            </div>

                            {/* Selection Indicator */}
                            <div className={cn(
                                "flex flex-col items-center justify-center w-6 h-6 rounded-full border-2 shrink-0 transition-colors ml-4 mt-2",
                                isSelected
                                    ? "border-primary bg-primary"
                                    : "border-border bg-transparent"
                            )}>
                                {isSelected && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {showErrors && !formData.role && (
                <p className="text-xs text-danger mt-4">
                    Please select a role to continue.
                </p>
            )}
        </div>
    );
}
