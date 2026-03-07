import { Upload } from 'lucide-react';
import { Card } from '../ui';
import { EnhancedImageUpload } from '../ui/EnhancedImageUpload';

interface ProductImageUploadProps {
  images: File[];
  primaryImageIndex: number;
  onImagesChange: (images: File[]) => void;
  onSetPrimaryImage: (index: number) => void;
}

export function ProductImageUpload({ 
  images, 
  primaryImageIndex, 
  onImagesChange, 
  onSetPrimaryImage 
}: ProductImageUploadProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Upload className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold">Product Image</h2>
      </div>

      <EnhancedImageUpload
        images={images}
        onImagesChange={onImagesChange}
        primaryImageIndex={primaryImageIndex}
        onSetPrimaryImage={onSetPrimaryImage}
        maxImages={4}
      />
    </Card>
  );
}