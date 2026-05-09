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
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    
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

    // Fetch properties on mount
    useEffect(() => {
        const fetchProperties = async () => {
            const { data, error } = await supabase
                .from("properties")
                .select("*")
                .eq("status", "approved")
                .order("created_at", { ascending: false })
                .limit(50);
            
            if (data) setProperties(data as Property[]);
        };
        fetchProperties();
    }, []);

    // Filter properties
    const filteredProperties = properties.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePropertyToggle = (property: Property) => {
        setSelectedProperties(prev => 
            prev.some(p => p.id === property.id)
                ? prev.filter(p => p.id !== property.id)
                : [...prev, property]
        );
    };

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
        const fileName = \`\${Math.random()}.\${fileExt}\`;
        const filePath = \`blogs/\${fileName}\`;

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
                <div className="flex gap-8 h-[600px]">
                    <div className="flex-1 flex flex-col bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-border">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                                <input 
                                    type="text"
                                    placeholder="Search properties by name, location, or type..."
                                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                            {filteredProperties.map(p => (
                                <div 
                                    key={p.id} 
                                    onClick={() => handlePropertyToggle(p)}
                                    className={`cursor-pointer border-2 rounded-xl overflow-hidden ${selectedProperties.some(sp => sp.id === p.id) ? 'border-primary shadow-md' : 'border-transparent'}`}
                                >
                                    <PropertyCard property={p} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-80 bg-slate-50 rounded-xl border border-border p-6 flex flex-col">
                        <h3 className="font-bold text-lg mb-4">Selected Properties ({selectedProperties.length})</h3>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {selectedProperties.map(p => (
                                <div key={p.id} className="bg-white p-3 rounded-lg border border-border shadow-sm flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-sm line-clamp-1">{p.title}</p>
                                        <p className="text-xs text-text-muted">{p.city}</p>
                                    </div>
                                    <button onClick={() => handlePropertyToggle(p)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => setStep(2)}
                            disabled={selectedProperties.length === 0}
                            className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-bold disabled:opacity-50"
                        >
                            Continue to Content
                        </button>
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
                            passed={generatedBlog.metaTitle.length >= 50 && generatedBlog.metaTitle.length <= 60} 
                            value={\`\${generatedBlog.metaTitle.length} chars\`} 
                        />
                        <CheckItem 
                            label="Meta description length (120-160 chars)" 
                            passed={generatedBlog.metaDescription.length >= 120 && generatedBlog.metaDescription.length <= 160} 
                            value={\`\${generatedBlog.metaDescription.length} chars\`} 
                        />
                        <CheckItem 
                            label="Focus keyword in title" 
                            passed={generatedBlog.metaTitle.toLowerCase().includes(keyword.toLowerCase())} 
                        />
                        <CheckItem 
                            label="Word count > 800" 
                            passed={generatedBlog.wordCount >= 800} 
                            value={\`\${generatedBlog.wordCount} words\`} 
                        />
                        <CheckItem 
                            label="Properties linked" 
                            passed={selectedProperties.length > 0} 
                            value={\`\${selectedProperties.length} properties\`} 
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
                                disabled={generatedBlog.seoScore < 60 || (images.length > 0 && images.some(img => !img.alt.trim()))}
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
