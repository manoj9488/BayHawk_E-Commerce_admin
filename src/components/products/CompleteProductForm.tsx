import { useState } from 'react';
import { Button } from '../ui';
import { Save, Scissors, Plus, Info, Eye, EyeOff, Package } from 'lucide-react';
import { ProductInformationForm, type ProductInformationData } from './ProductInformationForm';
import { ComboInformationForm, type ComboInformationData } from './ComboInformationForm';
import { ProductImageUpload } from './ProductImageUpload';
import { ProductDescriptionEditor } from './ProductDescriptionEditor';
import { ProductVariantForm } from './ProductVariantForm';
import { DayBasedPricing, type DayBasedPricingData } from './DayBasedPricing';
import { ProductTags, type ProductTagsData } from './ProductTags';
import { NutritionCustomization } from './NutritionCustomization';
import { Card } from '../ui';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  vitamins: {
    vitaminA: number;
    vitaminC: number;
    vitaminD: number;
    vitaminB12: number;
  };
  minerals: {
    calcium: number;
    iron: number;
    potassium: number;
    magnesium: number;
  };
}

interface ProductVariant {
  id: string;
  type: string;
  size: string;
  grossWeight: string;
  netWeight: string;
  pieces: string;
  serves: string;
  skuNumber: string;
  actualPrice: number;
  salesPrice: number;
  stock: number;
  igst: number;
  cgst: number;
  sgst: number;
  cuttingTypeId?: string;
}

interface SelectedNutrition {
  [key: string]: boolean;
}

interface CompleteProductFormData extends ProductInformationData {
  isCombo: boolean;
  comboData: ComboInformationData;
  images: File[];
  primaryImageIndex: number;
  description: string;
  dayBasedPricing: DayBasedPricingData;
  productTags: ProductTagsData;
  nutrition: NutritionInfo;
  selectedNutrition: SelectedNutrition;
  variants: ProductVariant[];
}

interface CompleteProductFormProps {
  onSave: (product: CompleteProductFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CompleteProductFormData>;
}

// Mock cutting types for hub (fish only)
const mockCuttingTypes = [
  { 
    id: '1', 
    name: 'Whole Fish', 
    description: 'Complete fish without cutting', 
    category: 'fish'
  },
  { 
    id: '2', 
    name: 'Fish Fillet', 
    description: 'Boneless fish pieces', 
    category: 'fish'
  },
  { 
    id: '3', 
    name: 'Fish Steaks', 
    description: 'Cross-cut fish pieces', 
    category: 'fish'
  },
  { 
    id: '4', 
    name: 'Fish Curry Cut', 
    description: 'Medium pieces with bone', 
    category: 'fish'
  },
  { 
    id: '5', 
    name: 'Cleaned', 
    description: 'Cleaned and ready to cook', 
    category: 'fish'
  },
];

export function CompleteProductForm({ onSave, onCancel, initialData }: CompleteProductFormProps) {
  const [formData, setFormData] = useState<CompleteProductFormData>({
    isCombo: initialData?.isCombo || false,
    nameEn: initialData?.nameEn || '',
    nameTa: initialData?.nameTa || '',
    category: initialData?.category || '',
    hsnNumber: initialData?.hsnNumber || '',
    variant: initialData?.variant || '',
    fishSize: initialData?.fishSize || '',
    maxSize: initialData?.maxSize || '',
    basePriceMin: initialData?.basePriceMin || 0,
    basePriceMax: initialData?.basePriceMax || 0,
    fishCountMin: initialData?.fishCountMin || 0,
    fishCountMax: initialData?.fishCountMax || 0,
    isBestSeller: initialData?.isBestSeller || false,
    isRareProduct: initialData?.isRareProduct || false,
    isActive: initialData?.isActive || true,
    productType: initialData?.productType || '',
    season: initialData?.season || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    comboData: initialData?.comboData || {
      comboName: '',
      comboOfferPercent: 0,
      comboDescription: '',
      comboItems: [],
      isBestSeller: false,
      isRareProduct: false,
      isActive: true,
      productType: '',
      season: '',
      metaTitle: '',
      metaDescription: ''
    },
    images: initialData?.images || [],
    primaryImageIndex: initialData?.primaryImageIndex || 0,
    description: initialData?.description || '',
    dayBasedPricing: initialData?.dayBasedPricing || {
      enabled: false,
      dayPrices: [
        { day: 'monday', price: 0, enabled: false },
        { day: 'tuesday', price: 0, enabled: false },
        { day: 'wednesday', price: 0, enabled: false },
        { day: 'thursday', price: 0, enabled: false },
        { day: 'friday', price: 0, enabled: false },
        { day: 'saturday', price: 0, enabled: false },
        { day: 'sunday', price: 0, enabled: false },
      ]
    },
    productTags: initialData?.productTags || {
      tags: []
    },
    nutrition: initialData?.nutrition || {
      calories: 165,
      protein: 20,
      carbs: 0,
      fat: 8,
      fiber: 0,
      sugar: 0,
      sodium: 60,
      cholesterol: 70,
      vitamins: {
        vitaminA: 120,
        vitaminC: 3,
        vitaminD: 10,
        vitaminB12: 2,
      },
      minerals: {
        calcium: 12,
        iron: 0.9,
        potassium: 350,
        magnesium: 25,
      },
    },
    selectedNutrition: initialData?.selectedNutrition || {
      calories: true,
      protein: true,
      fat: true,
      'vitamins.vitaminD': true,
      'minerals.calcium': true,
    },
    variants: initialData?.variants || [{
      id: '1',
      type: 'Regular',
      size: 'Medium',
      grossWeight: '500g',
      netWeight: '450g',
      pieces: '1',
      serves: '2-3',
      skuNumber: '',
      actualPrice: 0,
      salesPrice: 0,
      stock: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cuttingTypeId: ''
    }]
  });

  const [showNutrition, setShowNutrition] = useState(false);

  const handleProductInfoChange = (field: keyof ProductInformationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleComboInfoChange = (field: keyof ComboInformationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      comboData: {
        ...prev.comboData,
        [field]: value
      }
    }));
  };

  const handleToggleCombo = () => {
    setFormData(prev => ({
      ...prev,
      isCombo: !prev.isCombo
    }));
  };

  const handleImageUpload = (images: File[]) => {
    setFormData(prev => ({
      ...prev,
      images,
      primaryImageIndex: images.length > 0 ? Math.min(prev.primaryImageIndex, images.length - 1) : 0
    }));
  };

  const handleSetPrimaryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      primaryImageIndex: index
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
  };

  const handleDayBasedPricingChange = (dayBasedPricing: DayBasedPricingData) => {
    setFormData(prev => ({
      ...prev,
      dayBasedPricing
    }));
  };

  const handleProductTagsChange = (productTags: ProductTagsData) => {
    setFormData(prev => ({
      ...prev,
      productTags
    }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      type: 'Regular',
      size: 'Medium',
      grossWeight: '500g',
      netWeight: '450g',
      pieces: '1',
      serves: '2-3',
      skuNumber: '',
      actualPrice: 0,
      salesPrice: 0,
      stock: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cuttingTypeId: ''
    };
    
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = () => {
    // Validate required fields based on combo or regular product
    if (formData.isCombo) {
      if (!formData.comboData.comboName || !formData.comboData.productType || !formData.comboData.metaTitle || !formData.comboData.metaDescription || formData.comboData.comboItems.length === 0) {
        alert('Please fill in all required combo fields (Combo Name, Products, Product Type, Meta Title, Meta Description)');
        return;
      }
    } else {
      if (!formData.nameEn || !formData.category || !formData.productType || !formData.metaTitle || !formData.metaDescription) {
        alert('Please fill in all required fields (Product Name English, Category, Product Type, Meta Title, Meta Description)');
        return;
      }
    }
    
    // Validate at least one variant
    if (formData.variants.length === 0) {
      alert('Please add at least one product variant');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header with Combo Toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {formData.isCombo ? 'Create Combo Product' : 'Create New Product'}
              </h2>
              <p className="text-sm text-gray-600">
                {formData.isCombo ? 'Bundle multiple products with special offers' : 'Add a single product to your catalog'}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant={formData.isCombo ? "primary" : "secondary"}
            onClick={handleToggleCombo}
          >
            {formData.isCombo ? 'Switch to Single Product' : 'Switch to Combo Product'}
          </Button>
        </div>
      </Card>

      {/* Product Visibility Section */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {formData.isActive ? (
              <Eye className="h-5 w-5 text-green-600" />
            ) : (
              <EyeOff className="h-5 w-5 text-red-600" />
            )}
            <h3 className="text-lg font-semibold">Product Visibility</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${formData.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {formData.isActive ? 'Product is Visible' : 'Product is Hidden'}
            </span>
            <Button
              type="button"
              variant={formData.isActive ? "secondary" : "primary"}
              onClick={() => handleProductInfoChange('isActive', !formData.isActive)}
              className={formData.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200'}
            >
              {formData.isActive ? (
                <>
                  <EyeOff className="mr-2 h-5 w-5" />
                  Hide Product
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-5 w-5" />
                  Show Product
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mt-3 p-3 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">
            {formData.isActive ? (
              <>
                <strong>Visible:</strong> This product will be displayed to customers and available for purchase.
              </>
            ) : (
              <>
                <strong>Hidden:</strong> This product will not be visible to customers and cannot be purchased. Use this to temporarily remove products from your store.
              </>
            )}
          </p>
        </div>
      </Card>

      {/* Product/Combo Information Section - Conditional */}
      {!formData.isCombo ? (
        <ProductInformationForm
          data={{
            nameEn: formData.nameEn,
            nameTa: formData.nameTa,
            category: formData.category,
            hsnNumber: formData.hsnNumber,
            variant: formData.variant,
            fishSize: formData.fishSize,
            maxSize: formData.maxSize,
            basePriceMin: formData.basePriceMin,
            basePriceMax: formData.basePriceMax,
            fishCountMin: formData.fishCountMin,
            fishCountMax: formData.fishCountMax,
            isBestSeller: formData.isBestSeller,
            isRareProduct: formData.isRareProduct,
            isActive: formData.isActive,
            productType: formData.productType,
            season: formData.season,
            metaTitle: formData.metaTitle,
            metaDescription: formData.metaDescription,
          }}
          onChange={handleProductInfoChange}
        />
      ) : (
        <ComboInformationForm
          data={formData.comboData}
          onChange={handleComboInfoChange}
          availableCategories={[
            { id: '1', name: 'Sea Fish' },
            { id: '2', name: 'Freshwater Fish' },
            { id: '3', name: 'Shell Fish' },
            { id: '4', name: 'Dry Fish' },
            { id: '5', name: 'Meat' },
            { id: '6', name: 'Eggs' },
            { id: '7', name: 'Spices' },
            { id: '8', name: 'Ready to Eat' },
            { id: '9', name: 'Ready to Cook' }
          ]}
        />
      )}

      {/* Product Image Section */}
      <ProductImageUpload
        images={formData.images}
        primaryImageIndex={formData.primaryImageIndex}
        onImagesChange={handleImageUpload}
        onSetPrimaryImage={handleSetPrimaryImage}
      />

      {/* Description Section */}
      <ProductDescriptionEditor
        value={formData.description}
        onChange={handleDescriptionChange}
      />

      {/* Day-based Pricing Section */}
      <DayBasedPricing
        data={formData.dayBasedPricing}
        onChange={handleDayBasedPricingChange}
      />

      {/* Product Tags Section */}
      <ProductTags
        data={formData.productTags}
        onChange={handleProductTagsChange}
      />

      {/* Product Variants & Cutting Types Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Product Variants & Cutting Types</h2>
          </div>
          <Button onClick={addVariant} variant="secondary" size="sm">
            <Plus className="mr-1 h-5 w-5" />
            Add Variant
          </Button>
        </div>

        <div className="space-y-6">
          {formData.variants.map((variant, index) => (
            <ProductVariantForm
              key={variant.id}
              variant={variant}
              index={index}
              availableCuttingTypes={mockCuttingTypes}
              canRemove={formData.variants.length > 1}
              onVariantChange={handleVariantChange}
              onRemoveVariant={removeVariant}
            />
          ))}
        </div>
      </Card>

      {/* Nutrition Information Toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Nutrition Information</h3>
          </div>
          <Button
            type="button"
            variant={showNutrition ? "primary" : "secondary"}
            onClick={() => setShowNutrition(!showNutrition)}
          >
            {showNutrition ? 'Hide Nutrition' : 'Add Nutrition'}
          </Button>
        </div>
        
        {!showNutrition && (
          <p className="text-sm text-gray-600 mt-2">
            Add detailed nutrition information to help customers make informed choices
          </p>
        )}
      </Card>

      {/* Nutrition Customization */}
      {showNutrition && (
        <NutritionCustomization
          baseQuantity={100}
          baseUnit="g"
          nutrition={formData.nutrition}
          selectedNutrition={formData.selectedNutrition}
          onNutritionChange={(nutrition) => setFormData(prev => ({ ...prev, nutrition }))}
          onSelectedNutritionChange={(selectedNutrition) => setFormData(prev => ({ ...prev, selectedNutrition }))}
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-5 w-5" />
          Save Product
        </Button>
      </div>
    </div>
  );
}

export type { CompleteProductFormData };