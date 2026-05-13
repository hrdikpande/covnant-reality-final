"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search, CheckCircle2, ChevronRight, Upload, Image as ImageIcon, X, XCircle } from "lucide-react";
import type { Property } from "@/types";
import { PropertyCard } from "@/components/ui/PropertyCard";

export default function NewBlogPage() {
    const router = useRouter();
    const supabase = createClient();
    
    // Step state
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    
    // Data state
    const [serialNumbersInput, setSerialNumbersInput] = useState("");
    const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
    const [invalidSerials, setInvalidSerials] = useState<number[]>([]);
    const [isFetchingSerials, setIsFetchingSerials] = useState(false);
    
    // Blog generation inputs
    const [titleInput, setTitleInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const [tone, setTone] = useState("Informative");
    const [rawNotes, setRawNotes] = useState("");
    
    // Generated Data
    const [generatedBlog, setGeneratedBlog] = useState<any>(null);
    const [editedContent, setEditedContent] = useState("");
    
    // Images
    const [images, setImages] = useState<{url: string, alt: string, isOg: boolean}[]>([]);
    const [uploading, setUploading] = useState(false);

    // Fetch properties by serial number when input changes
    useEffect(() => {
        const fetchProperties = async () => {
            if (!serialNumbersInput.trim()) {
                setSelectedProperties([]);
                setInvalidSerials([]);
                return;
            }

            const inputSerials = serialNumbersInput
                .split(",")
                .map(s => parseInt(s.trim(), 10))
                .filter(s => !isNaN(s));

            if (inputSerials.length === 0) {
                setSelectedProperties([]);
                setInvalidSerials([]);
                return;
            }

            setIsFetchingSerials(true);
            try {
                const res = await fetch(`/api/admin/properties/by-serial?serials=${inputSerials.join(",")}`);
                if (res.ok) {
                    const { data } = await res.json();
                    setSelectedProperties(data as Property[]);
                    
                    // Identify which entered serials were not found
                    const foundSerials = (data as Property[]).map(p => p.serial_number);
                    const notFound = inputSerials.filter(s => !foundSerials.includes(s));
                    setInvalidSerials(notFound);
                }
            } catch (err) {
                console.error("Failed to fetch properties by serials:", err);
            }
            setIsFetchingSerials(false);
        };

        const timeoutId = setTimeout(fetchProperties, 500);
        return () => clearTimeout(timeoutId);
    }, [serialNumbersInput]);

    const handleGenerate = async () => {
        if (!keyword) return alert("Focus keyword is required");
        
        try {
            const res = await fetch("/api/admin/blogs/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    properties: selectedProperties,
                    rawContent: rawNotes,
                    keyword,
                    tone
                })
            });
            const data = await res.json();
            if (res.ok) {
                if (titleInput) data.title = titleInput; // Override if user provided one
                setGeneratedBlog(data);
                setEditedContent(data.content);
                setStep(3);
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to generate blog");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `blogs/${fileName}`;

        const { data, error } = await supabase.storage
            .from('property-media')
            .upload(filePath, file);

        if (error) {
            alert("Upload failed: " + error.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('property-media')
                .getPublicUrl(filePath);
            
            setImages(prev => [...prev, { url: publicUrl, alt: "", isOg: prev.length === 0 }]);
        }
        setUploading(false);
    };

    const handlePublish = async (status: 'draft' | 'published' = 'draft') => {
        if (!generatedBlog) return;

        // Validation for publish
        if (status === 'published') {
            if (generatedBlog.seoScore < 60) return alert("Cannot publish: SEO Score must be at least 60.");
            if (images.length > 0 && images.some(img => !img.alt.trim())) return alert("All images must have alt text.");
        }

        const ogImage = images.find(img => img.isOg)?.url || images[0]?.url || null;

        const { data: blogData, error: blogError } = await supabase
            .from("blogs")
            .insert({
                title: generatedBlog.title,
                slug: generatedBlog.slug,
                meta_title: generatedBlog.metaTitle,
                meta_description: generatedBlog.metaDescription,
                content: editedContent,
                excerpt: generatedBlog.excerpt,
                focus_keyword: keyword,
                keywords: generatedBlog.keywords,
                status,
                published_at: status === 'published' ? new Date().toISOString() : null,
                og_image: ogImage,
                word_count: generatedBlog.wordCount,
                reading_time: generatedBlog.readingTime,
                seo_score: generatedBlog.seoScore,
                schema_markup: generatedBlog.schemaMarkup
            })
            .select()
            .single();

        if (blogError) return alert("Failed to save blog: " + blogError.message);

        // Save blog_properties
        if (selectedProperties.length > 0) {
            const bpData = selectedProperties.map(p => ({
                blog_id: blogData.id,
                property_id: p.id,
                anchor_text: p.title
            }));
            await supabase.from("blog_properties").insert(bpData);
        }

        // Save blog_images
        if (images.length > 0) {
            const biData = images.map(img => ({
                blog_id: blogData.id,
                url: img.url,
                alt_text: img.alt
            }));
            await supabase.from("blog_images").insert(biData);
        }

        router.push("/admin/blogs");
    };

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <h1 className="text-2xl font-bold text-text-primary mb-6">Create New Blog</h1>

            {/* Stepper */}
            <div className="flex items-center gap-4 mb-8">
                {[
                    { num: 1, label: "Select Properties" },
                    { num: 2, label: "Write Content" },
                    { num: 3, label: "Images" },
                    { num: 4, label: "Review & Publish" }
                ].map(s => (
                    <div key={s.num} className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${step >= s.num ? 'text-primary' : 'text-text-muted'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.num ? 'bg-primary text-white' : 'bg-slate-100'}`}>
                                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                            </div>
                            <span className="font-medium">{s.label}</span>
                        </div>
                        {s.num < 4 && <ChevronRight className="w-5 h-5 text-text-muted" />}
                    </div>
                ))}
            </div>

            {/* STEP 1: Select Properties */}
            {step === 1 && (
                <div className="flex gap-8">
                    <div className="flex-1 bg-white rounded-xl border border-border shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-4">Link Properties</h2>
                        <p className="text-sm text-text-muted mb-4">
                            Enter the serial numbers of the properties you want to link to this blog post, separated by commas (e.g. "12, 45, 78").
                        </p>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Property Serial Numbers</label>
                            <input 
                                type="text"
                                placeholder="e.g. 12, 45, 78"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                value={serialNumbersInput}
                                onChange={(e) => setSerialNumbersInput(e.target.value)}
                            />
                        </div>

                        {isFetchingSerials && (
                            <div className="text-sm text-text-muted mb-4 animate-pulse">Fetching properties...</div>
                        )}

                        {invalidSerials.length > 0 && !isFetchingSerials && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2">
                                <XCircle className="w-5 h-5 shrink-0" />
                                <div>
                                    <p className="font-semibold">Invalid or not found serial numbers:</p>
                                    <p>{invalidSerials.join(", ")}</p>
                                </div>
                            </div>
                        )}

                        {selectedProperties.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-text-primary">Found Properties ({selectedProperties.length})</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedProperties.map(p => (
                                        <div key={p.id} className="border border-border rounded-xl p-4 bg-slate-50 flex gap-4 items-center">
                                            {p.image && (
                                                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-xs font-bold text-primary mb-1">#{p.serial_number}</div>
                                                <h4 className="font-bold text-sm text-text-primary line-clamp-1" title={p.title}>{p.title}</h4>
                                                <p className="text-xs text-text-muted capitalize">{p.type} • {p.city}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={() => setStep(2)}
                                disabled={selectedProperties.length === 0 && serialNumbersInput.trim() !== ""}
                                className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold disabled:opacity-50 transition-colors hover:bg-primary/90"
                            >
                                Continue to Content
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: Write Content */}
            {step === 2 && (
                <div className="flex gap-8">
                    <div className="flex-1 space-y-6 bg-white p-6 rounded-xl border border-border shadow-sm">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Blog Title (Optional)</label>
                                <input type="text" className="w-full border p-2.5 rounded-lg" value={titleInput} onChange={e => setTitleInput(e.target.value)} placeholder="Leave blank to auto-generate" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Focus Keyword <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border p-2.5 rounded-lg" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. 2BHK in Gachibowli" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Tone</label>
                            <select className="w-full border p-2.5 rounded-lg" value={tone} onChange={e => setTone(e.target.value)}>
                                <option>Informative</option>
                                <option>Conversational</option>
                                <option>Professional</option>
                                <option>Persuasive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Raw Notes / Content Idea</label>
                            <textarea 
                                className="w-full border p-4 rounded-lg h-40" 
                                value={rawNotes} 
                                onChange={e => setRawNotes(e.target.value)}
                                placeholder="Paste your raw notes, market insights, or bullet points here..."
                            />
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setStep(1)} className="text-text-secondary hover:text-text-primary px-4 py-2 font-medium">Back</button>
                            <button onClick={handleGenerate} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Generate SEO Blog</button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: Images & Edit */}
            {step === 3 && generatedBlog && (
                <div className="flex gap-8">
                    <div className="flex-1 flex flex-col bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-border bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Edit Generated Content</h3>
                            <div className="text-sm text-text-secondary">
                                <span className="mr-4">Word count: <strong>{generatedBlog.wordCount}</strong></span>
                                <span>Reading time: <strong>{generatedBlog.readingTime} min</strong></span>
                            </div>
                        </div>
                        <textarea 
                            className="w-full flex-1 p-6 font-mono text-sm resize-none focus:outline-none"
                            value={editedContent}
                            onChange={e => setEditedContent(e.target.value)}
                            style={{ minHeight: '500px' }}
                        />
                    </div>
                    <div className="w-80 space-y-6">
                        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                            <h3 className="font-bold mb-4">Blog Images</h3>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border hover:border-primary rounded-xl cursor-pointer bg-slate-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 text-text-muted mb-2" />
                                    <p className="text-sm text-text-secondary">{uploading ? "Uploading..." : "Click to upload image"}</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                            </label>
                            
                            <div className="mt-4 space-y-4">
                                {images.map((img, i) => (
                                    <div key={i} className="border border-border rounded-lg p-3 relative group">
                                        <div className="aspect-video bg-slate-100 rounded mb-2 overflow-hidden flex items-center justify-center relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                                            {img.isOg && <span className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Cover (OG)</span>}
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="Alt text (Required for SEO)" 
                                            className="w-full border p-2 text-sm rounded"
                                            value={img.alt}
                                            onChange={(e) => {
                                                const newImgs = [...images];
                                                newImgs[i].alt = e.target.value;
                                                setImages(newImgs);
                                            }}
                                        />
                                        <div className="flex items-center gap-2 mt-2">
                                            <input 
                                                type="radio" 
                                                name="ogImage" 
                                                checked={img.isOg} 
                                                onChange={() => {
                                                    const newImgs = images.map((image, idx) => ({ ...image, isOg: idx === i }));
                                                    setImages(newImgs);
                                                }}
                                            />
                                            <span className="text-xs text-text-secondary">Set as Cover Image</span>
                                        </div>
                                        <button 
                                            onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                            className="absolute -top-2 -right-2 bg-white border border-border text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={() => setStep(4)}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold"
                        >
                            Review & Publish
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4: Review & Publish */}
            {step === 4 && generatedBlog && (
                <div className="max-w-3xl mx-auto bg-white rounded-xl border border-border shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">SEO Review</h2>
                    
                    <div className="flex items-center justify-center mb-10">
                        <div className="text-center">
                            <div className="text-5xl font-black text-primary mb-2">{generatedBlog.seoScore}/100</div>
                            <p className="text-text-secondary font-medium">SEO Score</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <CheckItem 
                            label="Title length (50-60 chars)" 
                            passed={(generatedBlog?.metaTitle?.length || 0) >= 50 && (generatedBlog?.metaTitle?.length || 0) <= 60} 
                            value={`${generatedBlog?.metaTitle?.length || 0} chars`} 
                        />
                        <CheckItem 
                            label="Meta description length (120-160 chars)" 
                            passed={(generatedBlog?.metaDescription?.length || 0) >= 120 && (generatedBlog?.metaDescription?.length || 0) <= 160} 
                            value={`${generatedBlog?.metaDescription?.length || 0} chars`} 
                        />
                        <CheckItem 
                            label="Focus keyword in title" 
                            passed={(generatedBlog?.metaTitle || "").toLowerCase().includes((keyword || "").toLowerCase())} 
                        />
                        <CheckItem 
                            label="Word count > 800" 
                            passed={(generatedBlog?.wordCount || 0) >= 800} 
                            value={`${generatedBlog?.wordCount || 0} words`} 
                        />
                        <CheckItem 
                            label="Properties linked" 
                            passed={selectedProperties.length > 0} 
                            value={`${selectedProperties.length} properties`} 
                        />
                        <CheckItem 
                            label="Images have alt text" 
                            passed={images.length > 0 && images.every(i => i.alt.trim().length > 0)} 
                        />
                        <CheckItem 
                            label="Cover (OG) image set" 
                            passed={images.some(i => i.isOg)} 
                        />
                    </div>

                    <div className="flex justify-between border-t border-border pt-6">
                        <button onClick={() => setStep(3)} className="text-text-secondary hover:text-text-primary px-4 py-2 font-medium">Back to Editor</button>
                        <div className="flex gap-3">
                            <button onClick={() => handlePublish('draft')} className="px-6 py-2.5 rounded-lg font-bold border border-border hover:bg-slate-50 transition-colors">Save Draft</button>
                            <button 
                                onClick={() => handlePublish('published')} 
                                className="bg-primary text-white px-8 py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={(generatedBlog?.seoScore || 0) < 60 || (images.length > 0 && images.some(img => !img.alt.trim()))}
                            >
                                Publish Blog
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CheckItem({ label, passed, value }: { label: string, passed: boolean, value?: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-slate-50">
            <div className="flex items-center gap-3">
                {passed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                <span className="font-medium text-text-primary">{label}</span>
            </div>
            {value && <span className="text-sm font-semibold text-text-secondary">{value}</span>}
        </div>
    );
}
