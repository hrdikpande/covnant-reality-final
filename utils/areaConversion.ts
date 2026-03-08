export type AreaUnit = "Sq ft" | "Sq yd" | "Sq m" | "Acre" | "Hectare";

export const AREA_UNITS: AreaUnit[] = ["Sq ft", "Sq yd", "Sq m", "Acre", "Hectare"];

/**
 * Conversion ratios back to Sq ft (1 Unit = X Sq ft).
 */
const CONVERSION_TO_SQFT: Record<AreaUnit, number> = {
    "Sq ft": 1,
    "Sq yd": 9,
    "Sq m": 10.7639,
    "Acre": 43560,
    "Hectare": 107639,
};

/**
 * Normalizes standard database identifiers back into our strict type. 
 */
export function normalizeUnit(unitStr?: string | null): AreaUnit {
    if (!unitStr) return "Sq ft";
    const lower = unitStr.toLowerCase();

    if (lower.includes("acre")) return "Acre";
    if (lower.includes("hectare")) return "Hectare";
    if (lower.includes("yd") || lower.includes("yard")) return "Sq yd";
    if (lower.includes("m") && !lower.includes("o")) return "Sq m"; // crude check to avoid 'month' catching

    return "Sq ft"; // default fallback
}

/**
 * Converts any area unit value to its Square Foot equivalent.
 */
export function convertToSqft(value: number, unit: AreaUnit): number {
    return value * CONVERSION_TO_SQFT[unit];
}

/**
 * Converts a Square Foot value to a target unit.
 */
export function convertFromSqft(valueInSqft: number, targetUnit: AreaUnit): number {
    return valueInSqft / CONVERSION_TO_SQFT[targetUnit];
}

/**
 * General purpose conversion from any unit to any other unit.
 */
export function convertArea(value: number, fromUnit: AreaUnit, toUnit: AreaUnit): number {
    if (fromUnit === toUnit) return value;
    const valueInSqft = convertToSqft(value, fromUnit);
    return convertFromSqft(valueInSqft, toUnit);
}
