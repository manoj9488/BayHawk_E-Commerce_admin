import { useState, useRef } from "react";
import { Button } from "../../ui";
import { Upload, X, Image as ImageIcon, CheckCircle } from "lucide-react";

interface PackedPhotoUploadProps {
  orderId: string;
  existingPhotos?: string[];
  onUpload: (photos: File[]) => Promise<void>;
  className?: string;
}

export function PackedPhotoUpload({
  existingPhotos = [],
  onUpload,
  className = "",
}: PackedPhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    setNewFiles((prev) => [...prev, ...imageFiles]);

    // Preview
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setNewFiles((prev) =>
      prev.filter((_, i) => i !== index - existingPhotos.length),
    );
  };

  const handleUpload = async () => {
    if (newFiles.length === 0) return;
    setLoading(true);
    try {
      await onUpload(newFiles);
      setNewFiles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}
    >
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-indigo-600" />
        Upload Packed Photos
      </h3>

      <div className="space-y-4">
        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4" />
            Select Photos
          </Button>
        </div>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={photo}
                  alt={`Packed ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                {index >= existingPhotos.length && (
                  <button
                    onClick={() => handleRemove(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                {index < existingPhotos.length && (
                  <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload Action */}
        {newFiles.length > 0 && (
          <Button onClick={handleUpload} disabled={loading} className="w-full">
            {loading
              ? "Uploading..."
              : `Upload ${newFiles.length} Photo${newFiles.length > 1 ? "s" : ""}`}
          </Button>
        )}

        {photos.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No photos uploaded yet
          </div>
        )}
      </div>
    </div>
  );
}
