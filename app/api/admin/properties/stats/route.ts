import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/admin-auth";

/* ── Canonical subtype lists (must match HeroSearch / FilterContent) ── */

const RESIDENTIAL_SUBTYPES = [
    "Flat/Apartment",
    "Builder Floor",
    "Independent House/Villa",
    "Residential Land",
    "1 RK/ Studio Apartment",
    "Farm House",
    "Serviced Apartments",
];

const COMMERCIAL_SUBTYPES = [
    "Ready to Move Offices",
    "Bare Shell Offices",
    "Shops & Retail",
    "Commercial/Inst. Land",
    "Agricultural/Farm Land",
    "Industrial Land/Plots",
    "Warehouse",
    "Cold Storage",
    "Factory & Manufacturing",
    "Hotel/Resorts",
    "Industrial Shed",
    "RCC Shed",
    "Godown",
];

const RESIDENTIAL_PROPERTY_TYPES = new Set(["apartment", "villa", "house", "plot"]);

/**
 * GET /api/admin/properties/stats
 * Returns aggregate property counts broken down by listing type and category/subtype.
 */
export async function GET() {
    const { error: authError } = await verifyAdmin();
    if (authError) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    const supabase = await createClient();

    // Fetch all properties with the 3 columns we need for aggregation
    const { data, error } = await supabase
        .from("properties")
        .select("listing_type, property_type, commercial_type");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (data ?? []) as {
        listing_type: string;
        property_type: string;
        commercial_type: string | null;
    }[];

    const total = rows.length;

    // ── Listing type breakdown ──
    let sellCount = 0;
    let rentCount = 0;

    // ── Category breakdown ──
    let residentialTotal = 0;
    let commercialTotal = 0;

    const residentialSubtypeCounts: Record<string, number> = {};
    const commercialSubtypeCounts: Record<string, number> = {};

    // Initialize all subtypes to 0
    for (const st of RESIDENTIAL_SUBTYPES) residentialSubtypeCounts[st] = 0;
    residentialSubtypeCounts["Other"] = 0;
    for (const st of COMMERCIAL_SUBTYPES) commercialSubtypeCounts[st] = 0;

    // Build lowercase lookup maps for fuzzy matching
    const resMap = new Map<string, string>();
    for (const st of RESIDENTIAL_SUBTYPES) resMap.set(st.toLowerCase(), st);
    const comMap = new Map<string, string>();
    for (const st of COMMERCIAL_SUBTYPES) comMap.set(st.toLowerCase(), st);

    for (const row of rows) {
        // Listing type
        if (row.listing_type === "sell") sellCount++;
        else if (row.listing_type === "rent") rentCount++;

        const isResidential = RESIDENTIAL_PROPERTY_TYPES.has(row.property_type);
        const isCommercial = row.property_type === "commercial";

        if (isResidential) {
            residentialTotal++;
            const ct = row.commercial_type?.trim() ?? "";
            const matched = resMap.get(ct.toLowerCase());
            if (matched) {
                residentialSubtypeCounts[matched]++;
            } else {
                residentialSubtypeCounts["Other"]++;
            }
        } else if (isCommercial) {
            commercialTotal++;
            const ct = row.commercial_type?.trim() ?? "";
            const matched = comMap.get(ct.toLowerCase());
            if (matched) {
                commercialSubtypeCounts[matched]++;
            } else {
                // Unrecognized commercial subtype — find closest match or add as-is
                if (ct) {
                    // Check if it already exists in our counts (case-insensitive)
                    const existing = Object.keys(commercialSubtypeCounts).find(
                        (k) => k.toLowerCase() === ct.toLowerCase()
                    );
                    if (existing) {
                        commercialSubtypeCounts[existing]++;
                    } else {
                        commercialSubtypeCounts[ct] = (commercialSubtypeCounts[ct] || 0) + 1;
                    }
                } else {
                    // No commercial_type set — count under the first matching or "Other"
                    commercialSubtypeCounts["Other"] = (commercialSubtypeCounts["Other"] || 0) + 1;
                }
            }
        }
    }

    return NextResponse.json({
        total,
        byListingType: {
            sell: sellCount,
            rent: rentCount,
        },
        byCategory: {
            residential: {
                total: residentialTotal,
                subtypes: residentialSubtypeCounts,
            },
            commercial: {
                total: commercialTotal,
                subtypes: commercialSubtypeCounts,
            },
        },
    });
}
