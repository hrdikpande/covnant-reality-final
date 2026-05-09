"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Eye, Trash2, Globe, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Blog } from "@/types";

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("blogs")
            .select("*, blog_properties(count)")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching blogs:", error);
        } else if (data) {
            setBlogs(data as any);
        }
        setLoading(false);
    };

    const togglePublishStatus = async (blog: Blog) => {
        const newStatus = blog.status === "draft" ? "published" : "draft";
        
        // Block publishing if SEO score is low or missing requirements
        if (newStatus === "published" && blog.seo_score < 60) {
            alert("Cannot publish: SEO score is below 60. Please edit the blog and improve its SEO.");
            return;
        }

        const { error } = await supabase
            .from("blogs")
            .update({ 
                status: newStatus,
                published_at: newStatus === "published" ? new Date().toISOString() : null
            })
            .eq("id", blog.id);

        if (!error) {
            fetchBlogs();
        } else {
            alert("Failed to update status");
        }
    };

    const deleteBlog = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;
        
        const { error } = await supabase.from("blogs").delete().eq("id", id);
        if (!error) {
            fetchBlogs();
        } else {
            alert("Failed to delete blog");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Blog Management</h1>
                    <p className="text-sm text-text-secondary mt-1">Manage your SEO-optimized blog posts</p>
                </div>
                <Link
                    href="/admin/blogs/new"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Blog
                </Link>
            </div>

            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-border">
                                <th className="py-4 px-6 font-semibold text-text-secondary text-sm">Title</th>
                                <th className="py-4 px-6 font-semibold text-text-secondary text-sm">Status</th>
                                <th className="py-4 px-6 font-semibold text-text-secondary text-sm">SEO Score</th>
                                <th className="py-4 px-6 font-semibold text-text-secondary text-sm">Properties</th>
                                <th className="py-4 px-6 font-semibold text-text-secondary text-sm">Date</th>
                                <th className="py-4 px-6 font-semibold text-text-secondary text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-text-muted">Loading blogs...</td>
                                </tr>
                            ) : blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-text-muted">No blogs found. Create your first one!</td>
                                </tr>
                            ) : (
                                blogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-text-primary truncate max-w-[250px]">{blog.title}</p>
                                            <p className="text-xs text-text-muted mt-1">{blog.slug}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {blog.status === 'published' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                                                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${blog.seo_score >= 80 ? 'bg-green-500' : blog.seo_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${blog.seo_score}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-text-primary">{blog.seo_score}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-text-secondary">
                                            {(blog as any).blog_properties?.[0]?.count || 0} linked
                                        </td>
                                        <td className="py-4 px-6 text-sm text-text-secondary">
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={`/blog/${blog.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
                                                    title="Preview Public Page"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => togglePublishStatus(blog)}
                                                    className={`p-2 transition-colors rounded-lg ${blog.status === 'published' ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:text-text-primary hover:bg-slate-100'}`}
                                                    title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                                                >
                                                    <Globe className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteBlog(blog.id)}
                                                    className="p-2 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
