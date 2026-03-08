import { Button } from "@/components/ui/Button";
import { UploadCloud, Image as ImageIcon, Video, FileText, FileBadge, X } from "lucide-react";
import { FormData } from "./PostPropertyContent";

interface Step3MediaUploadProps {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    showErrors?: boolean;
}

interface UploadSectionProps {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    accept: string;
    multiple?: boolean;
    files: File[];
    onFilesAdded: (files: File[]) => void;
    onRemoveFile: (index: number) => void;
}

function UploadSection({
    id,
    title,
    description,
    icon,
    accept,
    multiple = true,
    files,
    onFilesAdded,
    onRemoveFile,
}: UploadSectionProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            onFilesAdded(newFiles);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                    {icon}
                </div>
                <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
            </div>

            <div className="relative flex flex-col items-center justify-center w-full p-6 md:p-8 border-2 border-dashed border-border rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-primary/50 transition-colors group min-h-[160px] md:min-h-[180px]">
                <input
                    type="file"
                    id={id}
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none rounded-xl"
                    aria-label={`Upload ${title}`}
                />

                <UploadCloud className="w-8 h-8 text-text-muted mb-3 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-text-primary mb-1">
                    Click to browse or drag and drop
                </p>
                <p className="text-xs text-text-muted mb-4 text-center">
                    {description}
                </p>

                <Button type="button" variant="outline" size="sm" className="pointer-events-none">
                    Browse Files
                </Button>
            </div>

            {/* Selected Files List */}
            {files && files.length > 0 && (
                <div className="flex flex-col gap-2 mt-1">
                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between p-2.5 bg-white border border-border rounded-lg text-sm"
                        >
                            <span className="truncate text-text-secondary max-w-[85%]">
                                {file.name}
                            </span>
                            <button
                                type="button"
                                onClick={() => onRemoveFile(index)}
                                className="p-1 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                                aria-label="Remove file"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function Step3MediaUpload({ formData, updateFormData, showErrors }: Step3MediaUploadProps) {
    // Initialize file arrays if they don't exist
    const photos = formData.photos || [];
    const videos = formData.videos || [];
    const floorPlans = formData.floorPlans || [];
    const documents = formData.documents || [];

    const handleAddFiles = (field: string, newFiles: File[], currentFiles: File[]) => {
        updateFormData({
            [field]: [...currentFiles, ...newFiles],
        });
    };

    const handleRemoveFile = (field: string, indexToRemove: number, currentFiles: File[]) => {
        updateFormData({
            [field]: currentFiles.filter((_, index) => index !== indexToRemove),
        });
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-2">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-text-primary">
                    Upload Media & Documents
                </h3>
                <p className="text-sm md:text-base text-text-secondary mt-1">
                    Properties with high-quality photos get 5x more leads.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Photos */}
                <UploadSection
                    id="upload-photos"
                    title="Property Photos"
                    description="Upload high-res images of the exterior, interiors, and amenities. (Max 5MB each, JPG/PNG)"
                    icon={<ImageIcon className="w-4 h-4" />}
                    accept="image/jpeg, image/png, image/webp"
                    files={photos}
                    onFilesAdded={(newFiles) => handleAddFiles("photos", newFiles, photos)}
                    onRemoveFile={(index) => handleRemoveFile("photos", index, photos)}
                />
                {showErrors && (!photos || photos.length === 0) && (
                    <p className="text-xs text-danger -mt-1">Please upload at least one property photo.</p>
                )}

                {/* 2. Videos */}
                <UploadSection
                    id="upload-videos"
                    title="Property Video (Optional)"
                    description="A quick walk-through video helps buyers understand the layout. (Max 50MB, MP4)"
                    icon={<Video className="w-4 h-4" />}
                    accept="video/mp4, video/quicktime"
                    multiple={false}
                    files={videos}
                    onFilesAdded={(newFiles) => handleAddFiles("videos", newFiles, videos)}
                    onRemoveFile={(index) => handleRemoveFile("videos", index, videos)}
                />

                {/* 3. Floor Plan */}
                <UploadSection
                    id="upload-floorplan"
                    title="Floor Plan (Optional)"
                    description="Upload 2D or 3D floor plans. Highly recommended for apartments & villas."
                    icon={<FileText className="w-4 h-4" />}
                    accept="image/jpeg, image/png, application/pdf"
                    files={floorPlans}
                    onFilesAdded={(newFiles) => handleAddFiles("floorPlans", newFiles, floorPlans)}
                    onRemoveFile={(index) => handleRemoveFile("floorPlans", index, floorPlans)}
                />

                {/* 4. Documents */}
                <UploadSection
                    id="upload-documents"
                    title="Documents / KYC"
                    description="Upload Ownership proof or RERA certificate (Visible only to our verification team)."
                    icon={<FileBadge className="w-4 h-4" />}
                    accept="application/pdf, image/jpeg"
                    files={documents}
                    onFilesAdded={(newFiles) => handleAddFiles("documents", newFiles, documents)}
                    onRemoveFile={(index) => handleRemoveFile("documents", index, documents)}
                />
            </div>
        </div>
    );
}
