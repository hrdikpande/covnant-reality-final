"use client";

import { AlertCircle, Clock } from "lucide-react";

export function AgentListingComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-border rounded-2xl text-center shadow-sm">
      <div className="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-full mb-4">
        <Clock className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">
        Property Listing Coming Soon
      </h3>
      <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
        Agents will soon be able to list properties on the platform. Currently,
        only property owners can submit new listings directly.
      </p>
      <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg text-left max-w-sm">
        <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600">
          We are working on dedicated tools for agents to manage multiple
          listings. Stay tuned!
        </p>
      </div>
    </div>
  );
}
