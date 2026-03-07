import { useRef } from 'react';
import { Upload, X, Plus, Star } from 'lucide-react';
import { Button } from './index';

interface EnhancedImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  primaryImageIndex: number;
  onSetPrimaryImage: (index: number) => void;
  maxImages?: number;
  className?: string;
}

export function EnhancedImageUpload({ 
  images, 
  onImagesChange, 
  primaryImageIndex,
  onSetPrimaryImage,
  maxImages = 4, 
  className = "" 
}: EnhancedImageUploadProps) {
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
    
    // Adjust primary image index if needed
    if (primaryImageIndex >= newImages.length && newImages.length > 0) {
      onSetPrimaryImage(newImages.length - 1);
    } else if (primaryImageIndex === index && newImages.length > 0) {
      onSetPrimaryImage(0);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Button
          type="button"
          onClick={openFileDialog}
          className="flex items-center gap-2"
          disabled={images.length >= maxImages}
        >
          <Upload className="h-4 w-4" />
          Upload Image {images.length > 0 && `(${images.length}/${maxImages})`}
        </Button>
        
        {images.length > 0 && (
          <p className="text-sm text-gray-600">
            Click <Star className="inline h-4 w-4 text-yellow-500" /> to set primary image
          </p>
        )}
      </div>

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
            <div className={`relative rounded-lg border-2 overflow-hidden ${
              primaryImageIndex === index 
                ? 'border-yellow-400 ring-2 ring-yellow-200' 
                : 'border-gray-200'
            }`}>
              <img
                src={URL.createObjectURL(image)}
                alt={`Product ${index + 1}`}
                className="w-full h-24 object-cover"
              />
              
              {/* Primary Image Badge */}
              {primaryImageIndex === index && (
                <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Primary
                </div>
              )}
              
              {/* Image Number */}
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {primaryImageIndex !== index && (
                <button
                  type="button"
                  onClick={() => onSetPrimaryImage(index)}
                  className="bg-yellow-500 text-white rounded-full p-1 shadow-sm hover:bg-yellow-600 transition-colors"
                  title="Set as primary image"
                >
                  <Star className="h-3 w-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
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
        <div className="text-sm text-gray-500 space-y-1">
          <p>{images.length} of {maxImages} images uploaded</p>
          {primaryImageIndex < images.length && (
            <p>Primary image: Image {primaryImageIndex + 1}</p>
          )}
        </div>
      )}
    </div>
  );
}