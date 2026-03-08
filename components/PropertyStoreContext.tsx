"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Property, PropertyStatus } from "@/types";

interface PropertyStoreContextType {
    properties: Property[];
    addProperty: (newProperty: Property) => void;
    updatePropertyStatus: (id: string, status: PropertyStatus) => void;
}

const PropertyStoreContext = createContext<PropertyStoreContextType | undefined>(undefined);

export function PropertyStoreProvider({ children }: { children: ReactNode }) {
    const [properties, setProperties] = useState<Property[]>([]);

    const addProperty = (newProperty: Property) => {
        setProperties((prev) => [newProperty, ...prev]);
    };

    const updatePropertyStatus = (id: string, status: PropertyStatus) => {
        setProperties((prev) =>
            prev.map((prop) =>
                prop.id === id ? { ...prop, status } : prop
            )
        );
    };

    return (
        <PropertyStoreContext.Provider value={{ properties, addProperty, updatePropertyStatus }}>
            {children}
        </PropertyStoreContext.Provider>
    );
}

export function usePropertyStore() {
    const context = useContext(PropertyStoreContext);
    if (context === undefined) {
        throw new Error("usePropertyStore must be used within a PropertyStoreProvider");
    }
    return context;
}
