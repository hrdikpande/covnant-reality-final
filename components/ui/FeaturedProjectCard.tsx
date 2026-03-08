import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Building2, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface FeaturedProjectCardProps {
    project: Project;
    className?: string;
}

export function FeaturedProjectCard({ project, className }: FeaturedProjectCardProps) {
    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
        return `₹${price.toLocaleString("en-IN")}`;
    };

    return (
        <Link href={`/search?project=${project.id}`} className={cn("group bg-white rounded-3xl border border-border shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 block", className)}>
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={project.image} alt={project.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="default" className="bg-black/70 backdrop-blur-md text-white shadow-sm border-0 font-medium px-3 py-1">
                        RERA: {project.reraBadge}
                    </Badge>
                </div>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">{project.name}</h3>
                        <div className="flex items-center gap-1.5 mt-2 text-text-secondary">
                            <Building2 className="h-4 w-4" />
                            <span className="text-sm font-medium">By {project.builder}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-text-secondary">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{project.location}, {project.city}</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-border/50">
                    <div>
                        <p className="text-xs text-text-muted mb-1">Starting Price</p>
                        <div className="flex items-center gap-1 text-text-primary font-bold text-lg">
                            {formatPrice(project.startingPrice)}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-text-muted mb-1">Status</p>
                        <div className="flex items-center gap-1.5 text-text-primary font-medium">
                            <Calendar className="h-4 w-4 text-primary" />
                            {project.possessionStatus}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
