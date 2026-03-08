import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        id: 1,
        name: "Rajesh Kumar",
        role: "Home Buyer",
        image: "https://i.pravatar.cc/150?u=rajesh",
        rating: 5,
        text: "Finding a home in a busy city like Mumbai felt impossible until I used this platform. Most listings are verified, which saved me from many fake deals.",
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "Property Investor",
        image: "https://i.pravatar.cc/150?u=priya",
        rating: 5,
        text: "As an investor, transparency and accurate data are key. This platform provides the best insights into local property markets in India.",
    },
    {
        id: 3,
        name: "Ananya Gupta",
        role: "First-time Buyer",
        image: "https://i.pravatar.cc/150?u=ananya",
        rating: 5,
        text: "The paperwork and legalities of buying my first house in Delhi were made simple through their guided process. Highly recommended!",
    },
];

export function Testimonials() {
    return (
        <section className="py-12 lg:py-20 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 lg:mb-12">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                        What Our Users Say
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
                        Real stories from buyers, sellers, and agents who trust our platform.
                    </p>
                </div>

                {/* Mobile: Horizontal scroll | Desktop: 3-column grid */}
                <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="min-w-[85%] sm:min-w-[350px] lg:min-w-0 snap-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-50">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 leading-none mb-1 text-sm sm:text-base">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-none">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < testimonial.rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-200 fill-gray-200"
                                            }`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed flex-grow italic">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
