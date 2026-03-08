"use client";

import { PostPropertyContent } from "@/app/post-property/PostPropertyContent";



interface OwnerAddPropertyViewProps {
    onSuccess: () => void;
}

export function OwnerAddPropertyView({ onSuccess }: OwnerAddPropertyViewProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-border p-4 md:p-6 pb-20 overflow-hidden">
            {/* 
              We reuse the exact same PostPropertyContent widget
              used on the public /post-property page.
              Because the user is already signed in as 'owner', 
              the submission logic in PostPropertyContent will use their session.
            */}
            <PostPropertyContent onSuccess={onSuccess} />
        </div>
    );
}
