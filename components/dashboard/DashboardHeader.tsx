import { Settings, User } from "lucide-react";

export function DashboardHeader() {
    return (
        <div className="bg-bg-card border border-border rounded-2xl shadow-sm p-4 sm:p-6 flex items-center justify-between transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-text-primary leading-tight">
                        Rahul Sharma
                    </h1>
                    <p className="text-sm text-text-secondary">Buyer Account</p>
                </div>
            </div>
            <button
                aria-label="Account settings"
                className="p-2.5 rounded-xl text-text-secondary hover:bg-slate-100 hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
                <Settings className="w-5 h-5" />
            </button>
        </div>
    );
}
