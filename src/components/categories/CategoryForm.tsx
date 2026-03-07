import { useState, useRef } from 'react';
import { Card, Button, Input } from '../ui';
import { Package, Upload, X, Eye, EyeOff, Save, Image as ImageIcon } from 'lucide-react';

interface CategoryFormData {
  id?: string;
  name: string;
  nameTa: string;
  description: string;
  icon: string;
  color: string;
  image?: File | string;
  isActive: boolean;
  order: number;
  type: 'hub' | 'store';
}

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSave: (data: CategoryFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const CATEGORY_COLORS = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
];

const CATEGORY_ICONS = [
  { value: 'fish', label: 'Fish', emoji: '🐟' },
  { value: 'shrimp', label: 'Shrimp', emoji: '🦐' },
  { value: 'crab', label: 'Crab', emoji: '🦀' },
  { value: 'squid', label: 'Squid', emoji: '🦑' },
  { value: 'chicken', label: 'Chicken', emoji: '🐔' },
  { value: 'meat', label: 'Meat', emoji: '🥩' },
  { value: 'egg', label: 'Egg', emoji: '🥚' },
  { value: 'spices', label: 'Spices', emoji: '🌶️' },
  { value: 'vegetable', label: 'Vegetable', emoji: '🥬' },
  { value: 'fruit', label: 'Fruit', emoji: '🍎' },
];

export function CategoryForm({ initialData, onSave, onCancel, isEdit = false }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    nameTa: initialData?.nameTa || '',
    description: initialData?.description || '',
    icon: initialData?.icon || 'fish',
    color: initialData?.color || 'blue',
    image: initialData?.image || undefined,
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    order: initialData?.order || 0,
    type: initialData?.type || 'hub',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof initialData?.image === 'string' ? initialData.image : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.nameTa || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Basic Information */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Category Information</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name (English) *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Sea Fish, Chicken, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name (Tamil) *
              </label>
              <Input
                value={formData.nameTa}
                onChange={(e) => handleInputChange('nameTa', e.target.value)}
                placeholder="கடல் மீன், கோழி, etc."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hub">Hub (Fish Products)</option>
              <option value="store">Store (Meat, Eggs, etc.)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Visual Settings */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Visual Settings</h3>
        </div>
        
        <div className="space-y-4">
          {/* Category Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            
            <div className="flex items-start gap-4">
              {/* Image Preview */}
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">No image</p>
                  </div>
                )}
              </div>
              
              {/* Upload Button */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 200x200px, Max 5MB (JPG, PNG, WebP)
                </p>
              </div>
            </div>
          </div>
          
          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Icon
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {CATEGORY_ICONS.map(icon => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => handleInputChange('icon', icon.value)}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    formData.icon === icon.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{icon.emoji}</div>
                  <div className="text-xs text-gray-600">{icon.label}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Color
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {CATEGORY_COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('color', color.value)}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    formData.color === color.value
                      ? 'border-gray-800'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${color.class}`}></div>
                  <div className="text-xs text-gray-600">{color.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Status & Visibility */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {formData.isActive ? (
              <Eye className="h-5 w-5 text-green-600" />
            ) : (
              <EyeOff className="h-5 w-5 text-red-600" />
            )}
            <h3 className="text-lg font-semibold">Category Visibility</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${formData.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {formData.isActive ? 'Category is Visible' : 'Category is Hidden'}
            </span>
            <Button
              type="button"
              variant={formData.isActive ? "secondary" : "primary"}
              onClick={() => handleInputChange('isActive', !formData.isActive)}
              className={formData.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200'}
            >
              {formData.isActive ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide Category
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Show Category
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mt-3 p-3 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">
            {formData.isActive ? (
              <>
                <strong>Visible:</strong> This category will be displayed in both Hub and Store product forms and customer-facing interfaces.
              </>
            ) : (
              <>
                <strong>Hidden:</strong> This category will not be visible to users and cannot be selected for new products. Existing products will remain unaffected.
              </>
            )}
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="secondary" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          {isEdit ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </div>
  );
}

export type { CategoryFormData };