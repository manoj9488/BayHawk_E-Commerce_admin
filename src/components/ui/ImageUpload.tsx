import { useRef } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { Button } from './index';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 4, 
  className = "" 
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newImages = [...images, ...files].slice(0, maxImages);
      onImagesChange(newImages);
    }
    // Reset input value to allow re-uploading the same file
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Button
        type="button"
        onClick={openFileDialog}
        className="flex items-center gap-2"
        disabled={images.length >= maxImages}
      >
        <Upload className="h-4 w-4" />
        Upload Image {images.length > 0 && `(${images.length}/${maxImages})`}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Image Preview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(image)}
              alt={`Product ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}
        
        {/* Add more image slots */}
        {Array.from({ length: maxImages - images.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            onClick={openFileDialog}
            className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-6 w-6 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Add Image</span>
          </div>
        ))}
      </div>

      {images.length > 0 && (
        <p className="text-sm text-gray-500">
          {images.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
}