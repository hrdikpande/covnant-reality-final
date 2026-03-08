"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { BadgeCheck, Heart } from "lucide-react";

interface GallerySectionProps {
    images: string[];
    verified?: boolean;
}

export function GallerySection({ images, verified }: GallerySectionProps) {
    const displayImages = images.length > 0
        ? images
        : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"];

    const [activeIndex, setActiveIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollPosition = container.scrollLeft;
            const itemWidth = container.offsetWidth;
            const newIndex = Math.round(scrollPosition / itemWidth);
            if (newIndex !== activeIndex && newIndex >= 0 && newIndex < displayImages.length) {
                setActiveIndex(newIndex);
            }
        };

        let timeoutId: NodeJS.Timeout;
        const debouncedScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleScroll, 50);
        };

        container.addEventListener("scroll", debouncedScroll);
        return () => {
            container.removeEventListener("scroll", debouncedScroll);
            clearTimeout(timeoutId);
        };
    }, [activeIndex, displayImages.length]);

    return (
        <section className="relative w-full aspect-[4/3] max-h-[300px] md:max-h-[380px] lg:max-h-[450px] bg-bg group lg:rounded-t-2xl overflow-hidden">
            {/* Horizontal Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-x-contain"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {displayImages.map((src, idx) => (
                    <div
                        key={idx}
                        className="w-full h-full flex-shrink-0 snap-center snap-always relative"
                    >
                        <Image
                            src={src}
                            alt={`Property image ${idx + 1}`}
                            fill
                            className="object-cover"
                            priority={idx === 0}
                        />
                    </div>
                ))}
            </div>

            {/* Top Left: Verified Badge */}
            {verified && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-accent/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                </div>
            )}

            {/* Top Right: Save Icon */}
            <button
                onClick={() => setIsSaved(!isSaved)}
                className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm shadow-sm rounded-full transition-colors active:scale-95"
                aria-label={isSaved ? "Unsave property" : "Save property"}
            >
                <Heart
                    className={`w-5 h-5 transition-colors ${isSaved ? "fill-danger text-danger" : "text-text-secondary"}`}
                />
            </button>

            {/* Bottom Center: Indicator Dots */}
            {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
                    {displayImages.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? "bg-white w-5" : "bg-white/50 w-1.5"}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
