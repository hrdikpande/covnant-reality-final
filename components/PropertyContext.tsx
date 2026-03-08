"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PropertyContextType {
    savedProperties: string[];
    toggleSave: (propertyId: string) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
    const [savedProperties, setSavedProperties] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("savedProperties");
        if (stored) {
            try {
                setTimeout(() => {
                    setSavedProperties(JSON.parse(stored));
                }, 0);
            } catch (err) {
                console.error("Failed to parse savedProperties from localStorage", err);
            }
        }
    }, []);

    const toggleSave = (propertyId: string) => {
        setSavedProperties((prev) => {
            let nextState;
            if (prev.includes(propertyId)) {
                nextState = prev.filter((id) => id !== propertyId);
            } else {
                nextState = [...prev, propertyId];
            }
            localStorage.setItem("savedProperties", JSON.stringify(nextState));
            return nextState;
        });
    };

    return (
        <PropertyContext.Provider value={{ savedProperties, toggleSave }}>
            {children}
        </PropertyContext.Provider>
    );
}

export function usePropertyContext() {
    const context = useContext(PropertyContext);
    if (context === undefined) {
        throw new Error("usePropertyContext must be used within a PropertyProvider");
    }
    return context;
}
