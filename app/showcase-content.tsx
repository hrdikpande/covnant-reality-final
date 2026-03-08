"use client";

import { Search, Mail, EyeOff, ArrowRight, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export function ShowcaseContent() {
    return (
        <div className="space-y-12">
            {/* ── Buttons ──────────────────────────────────────────────── */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Buttons</h2>

                <div className="space-y-6">
                    {/* Variants */}
                    <div>
                        <p className="text-sm text-text-secondary mb-3">Variants</p>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="danger">Danger</Button>
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <p className="text-sm text-text-secondary mb-3">Sizes</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                        </div>
                    </div>

                    {/* With Icons */}
                    <div>
                        <p className="text-sm text-text-secondary mb-3">With Icons</p>
                        <div className="flex flex-wrap gap-3">
                            <Button leftIcon={<Plus className="h-4 w-4" />}>
                                Add Property
                            </Button>
                            <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                View All
                            </Button>
                            <Button variant="ghost" leftIcon={<Heart className="h-4 w-4" />}>
                                Wishlist
                            </Button>
                        </div>
                    </div>

                    {/* States */}
                    <div>
                        <p className="text-sm text-text-secondary mb-3">States</p>
                        <div className="flex flex-wrap gap-3">
                            <Button loading>Loading</Button>
                            <Button disabled>Disabled</Button>
                            <Button fullWidth>Full Width</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Badges ──────────────────────────────────────────────── */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Badges</h2>
                <div className="flex flex-wrap gap-3">
                    <Badge>Default</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="outline">Outline</Badge>
                </div>
            </section>

            {/* ── Inputs ──────────────────────────────────────────────── */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Inputs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                    <Input label="Full Name" placeholder="John Doe" />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        leftIcon={<Mail className="h-4 w-4" />}
                    />
                    <Input
                        label="Search"
                        placeholder="Search properties..."
                        leftIcon={<Search className="h-4 w-4" />}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        rightIcon={<EyeOff className="h-4 w-4" />}
                    />
                    <Input
                        label="With Error"
                        placeholder="Invalid input"
                        error="This field is required"
                    />
                    <Input
                        label="With Helper"
                        placeholder="Enter value"
                        helperText="Minimum 6 characters"
                    />
                </div>
            </section>

            {/* ── Cards ───────────────────────────────────────────────── */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Cards</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Basic Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-text-primary">Basic Card</h3>
                                <Badge variant="success">New</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-text-secondary">
                                A simple card with header, content, and footer sections.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button size="sm" variant="outline" fullWidth>
                                Learn More
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Hoverable Card */}
                    <Card hoverable>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-text-primary">
                                    Hoverable Card
                                </h3>
                                <Badge variant="warning">Hot</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-text-secondary">
                                Hover over this card to see the shadow transition effect.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <div className="flex gap-2 w-full">
                                <Button size="sm" variant="outline" fullWidth>
                                    Details
                                </Button>
                                <Button size="sm" fullWidth>
                                    Contact
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Property-like Card */}
                    <Card hoverable>
                        <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <span className="text-text-muted text-sm">Property Image</span>
                        </div>
                        <CardContent>
                            <div className="flex items-center justify-between mb-1">
                                <Badge>Featured</Badge>
                                <Heart className="h-4 w-4 text-text-muted" />
                            </div>
                            <h3 className="font-semibold mt-2">₹85,00,000</h3>
                            <p className="text-sm text-text-secondary mt-1">
                                3 BHK Apartment, MG Road
                            </p>
                            <p className="text-xs text-text-muted mt-1">1450 sq.ft • 3 Bed • 2 Bath</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* ── Color Palette ───────────────────────────────────────── */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Color Palette</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    <ColorSwatch color="bg-primary" label="Primary" hex="#2563EB" />
                    <ColorSwatch color="bg-primary-hover" label="Primary Hover" hex="#1D4ED8" />
                    <ColorSwatch color="bg-accent" label="Accent" hex="#10B981" />
                    <ColorSwatch color="bg-danger" label="Danger" hex="#EF4444" />
                    <ColorSwatch color="bg-warning" label="Warning" hex="#F59E0B" />
                    <ColorSwatch color="bg-bg" label="Background" hex="#F8FAFC" border />
                </div>
            </section>
        </div>
    );
}

function ColorSwatch({
    color,
    label,
    hex,
    border = false,
}: {
    color: string;
    label: string;
    hex: string;
    border?: boolean;
}) {
    return (
        <div className="text-center">
            <div
                className={`h-16 rounded-xl ${color} ${border ? "border border-border" : ""
                    }`}
            />
            <p className="text-xs font-medium mt-2 text-text-primary">{label}</p>
            <p className="text-xs text-text-muted">{hex}</p>
        </div>
    );
}
