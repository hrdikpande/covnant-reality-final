import { Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormData } from "./PostPropertyContent";

interface Step5ContactPreferencesProps {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
}

export function Step5ContactPreferences({ formData, updateFormData }: Step5ContactPreferencesProps) {
    const allowPhone = formData.allowPhone ?? true;
    const allowWhatsApp = formData.allowWhatsApp ?? true;

    const togglePreference = (key: string, currentValue: boolean) => {
        updateFormData({ [key]: !currentValue });
    };

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-text-primary">
                    How should buyers contact you?
                </h3>
                <p className="text-sm md:text-base text-text-secondary mt-1">
                    Select the communication channels you prefer for receiving property inquiries.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                {/* Phone Call */}
                <div
                    onClick={() => togglePreference("allowPhone", allowPhone)}
                    className={cn(
                        "flex items-center justify-between p-4 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 group",
                        allowPhone ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30 hover:bg-slate-50"
                    )}
                >
                    <div className="flex items-center gap-4 pr-4">
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors",
                            allowPhone ? "bg-primary/20 text-primary" : "bg-slate-100 text-text-muted group-hover:text-primary/70"
                        )}>
                            <Phone className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <p className={cn("text-sm transition-colors", allowPhone ? "font-bold text-primary" : "font-semibold text-text-primary")}>Allow Phone Call</p>
                            <p className="text-xs text-text-secondary mt-0.5" style={{ wordBreak: 'break-word' }}>Buyers can call your registered number</p>
                        </div>
                    </div>
                    {/* Toggle Switch */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={allowPhone}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
                            allowPhone ? "bg-primary" : "bg-slate-200"
                        )}
                    >
                        <span
                            className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                allowPhone ? "translate-x-6" : "translate-x-1"
                            )}
                        />
                    </button>
                </div>

                {/* WhatsApp */}
                <div
                    onClick={() => togglePreference("allowWhatsApp", allowWhatsApp)}
                    className={cn(
                        "flex items-center justify-between p-4 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 group",
                        allowWhatsApp ? "border-[#25D366] bg-[#25D366]/5 shadow-sm" : "border-border hover:border-[#25D366]/30 hover:bg-slate-50"
                    )}
                >
                    <div className="flex items-center gap-4 pr-4">
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors",
                            allowWhatsApp ? "bg-[#25D366]/20 text-[#25D366]" : "bg-slate-100 text-text-muted group-hover:text-[#25D366]/70"
                        )}>
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <p className={cn("text-sm transition-colors", allowWhatsApp ? "font-bold text-[#25D366]" : "font-semibold text-text-primary")}>Allow WhatsApp</p>
                            <p className="text-xs text-text-secondary mt-0.5" style={{ wordBreak: 'break-word' }}>Receive messages directly on WhatsApp</p>
                        </div>
                    </div>
                    {/* Toggle Switch */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={allowWhatsApp}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366]/20",
                            allowWhatsApp ? "bg-[#25D366]" : "bg-slate-200"
                        )}
                    >
                        <span
                            className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                allowWhatsApp ? "translate-x-6" : "translate-x-1"
                            )}
                        />
                    </button>
                </div>

            </div>
        </div>
    );
}
