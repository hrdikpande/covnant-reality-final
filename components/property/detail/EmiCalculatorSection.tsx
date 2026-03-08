"use client";

import { useState, useCallback } from "react";
import { Calculator } from "lucide-react";

interface EmiCalculatorSectionProps {
    price: number;
    listingType?: "sell" | "rent";
}

function calcEmi(principal: number, ratePercent: number, years: number): number {
    const r = ratePercent / 12 / 100;
    const n = years * 12;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function fmt(n: number): string {
    if (n >= 100000) return `₹ ${(n / 100000).toFixed(2)} L`;
    return `₹ ${Math.round(n).toLocaleString("en-IN")}`;
}

export function EmiCalculatorSection({ price, listingType }: EmiCalculatorSectionProps) {
    const defaultLoan = Math.round(price * 0.8);
    const [loan, setLoan] = useState(defaultLoan);
    const [rate, setRate] = useState(8.5);
    const [years, setYears] = useState(20);

    const handleLoanChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value.replace(/,/g, ""));
        if (!isNaN(val)) setLoan(val);
    }, []);

    // Rent properties don't use EMI
    if (listingType === "rent") return null;

    const emi = calcEmi(loan, rate, years);

    return (
        <section className="py-6 border-b border-border bg-bg-card">
            <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-text-secondary" />
                <h3 className="text-lg font-bold text-text-primary">EMI Calculator</h3>
            </div>

            <div className="bg-bg rounded-xl p-5 border border-border">
                <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
                    {/* Loan Amount */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Loan Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">₹</span>
                            <input
                                type="text"
                                value={loan.toLocaleString("en-IN")}
                                onChange={handleLoanChange}
                                className="w-full pl-8 pr-4 py-2.5 bg-bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                        {/* Interest Rate */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Interest Rate
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="20"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="w-full pl-3 pr-8 py-2.5 bg-bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary font-medium"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">%</span>
                            </div>
                        </div>

                        {/* Tenure */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Tenure
                            </label>
                            <div className="relative">
                                <select
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                    className="w-full pl-3 pr-8 py-2.5 bg-bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary font-medium appearance-none"
                                >
                                    {[5, 10, 15, 20, 25, 30].map((y) => (
                                        <option key={y} value={y}>{y} Years</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="mt-5 bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-accent-hover font-medium mb-0.5">Estimated EMI</p>
                        <p className="text-lg font-bold text-accent-hover">
                            {fmt(emi)} <span className="text-xs font-normal text-accent">/mo</span>
                        </p>
                    </div>
                    <p className="text-[10px] text-accent/80 text-right max-w-[100px] leading-tight">
                        *Indicative figures only
                    </p>
                </div>
            </div>
        </section>
    );
}
