"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/components/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
    submitProperty as submitPropertyService,
    validateFormData,
    type PropertyFormData,
    type SubmitResult,
    type ValidationResult,
} from "@/lib/supabase/submit-property";

interface UseSubmitPropertyReturn {
    submitProperty: (formData: PropertyFormData) => Promise<SubmitResult>;
    isSubmitting: boolean;
    error: string | null;
    reset: () => void;
    validate: (formData: PropertyFormData) => ValidationResult;
}

export function useSubmitProperty(): UseSubmitPropertyReturn {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback(
        async (formData: PropertyFormData): Promise<SubmitResult> => {
            if (!user) {
                throw new Error("You must be logged in to post a property.");
            }

            setError(null);
            setIsSubmitting(true);

            try {
                const supabase = createClient();
                const result = await submitPropertyService(supabase, user.id, formData);
                return result;
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "An unexpected error occurred.";
                setError(message);
                throw err;
            } finally {
                setIsSubmitting(false);
            }
        },
        [user]
    );

    const reset = useCallback(() => {
        setError(null);
    }, []);

    return {
        submitProperty: submit,
        isSubmitting,
        error,
        reset,
        validate: validateFormData,
    };
}
