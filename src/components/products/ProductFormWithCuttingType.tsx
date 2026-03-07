import { useState, useEffect } from 'react';
import { Card, Button, Select } from '../ui';
import { Save, Package, Info, Scissors, Plus } from 'lucide-react';
import { NutritionCustomization } from './NutritionCustomization';
import { ProductVariantForm } from './ProductVariantForm';
import { useAuth } from '../../context/AuthContext';
import type { CuttingType } from '../../types';

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

interface ProductFormData {
  name: string;
  category: string;
  price: number;
  weight: number;
  unit: string;
  description: string;
  nutrition: NutritionInfo;
  variants: ProductVariant[];
}

interface ProductFormProps {
  onSave: (product: ProductFormData) => void;
  onCancel: () => void;
}

// Mock cutting types data
const mockCuttingTypes: CuttingType[] = [
  // Hub - Fish only
  { 
    id: '1', 
    name: 'Whole Fish', 
    description: 'Complete fish without cutting', 
    category: 'fish', 
    moduleType: 'hub', 
    method: '1. Clean the fish thoroughly\n2. Remove scales using a scaler\n3. Gut the fish by making an incision from belly to gills\n4. Remove internal organs\n5. Wash with cold water\n6. Pat dry with paper towels',
    imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=200&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '2', 
    name: 'Fish Fillet', 
    description: 'Boneless fish pieces', 
    category: 'fish', 
    moduleType: 'hub', 
    method: '1. Place fish on cutting board\n2. Make a cut behind the gills down to the backbone\n3. Turn knife parallel to board and cut along backbone\n4. Remove fillet in one piece\n5. Repeat on other side\n6. Remove any remaining bones with tweezers',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '5', 
    name: 'Whole Chicken', 
    description: 'Complete chicken without cutting', 
    category: 'chicken', 
    moduleType: 'store', 
    method: '1. Remove from packaging\n2. Remove giblets from cavity\n3. Rinse inside and outside with cold water\n4. Pat dry with paper towels\n5. Trim excess fat and skin\n6. Ready for roasting or further processing',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&h=200&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '6', 
    name: 'Chicken Curry Cut', 
    description: 'Medium pieces with bone', 
    category: 'chicken', 
    moduleType: 'store', 
    method: '1. Place chicken breast-side up\n2. Cut through skin between leg and body\n3. Remove legs and thighs\n4. Cut wings at joints\n5. Cut breast into 4-6 pieces\n6. Cut thighs and drumsticks at joint',
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
];

export function ProductFormWithCuttingType({ onSave, onCancel }: ProductFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: 0,
    weight: 100,
    unit: 'g',
    description: '',
    nutrition: {
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
    variants: [{
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
  const [availableCuttingTypes, setAvailableCuttingTypes] = useState<CuttingType[]>([]);

  // Filter cutting types based on user's module and category
  useEffect(() => {
    const userModule = user?.loginType === 'hub' ? 'hub' : 'store';
    const filtered = mockCuttingTypes.filter(type => {
      if (user?.loginType === 'super_admin') return true;
      return type.moduleType === userModule;
    });
    setAvailableCuttingTypes(filtered);
  }, [user?.loginType]);

  // Get cutting types for specific category
  const getCuttingTypesForCategory = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'fish': 'fish',
      'prawns': 'fish',
      'crab': 'fish',
      'squid': 'fish',
      'lobster': 'fish',
      'chicken': 'chicken',
      'mutton': 'mutton',
      'egg': 'other'
    };
    
    const mappedCategory = categoryMap[category] || 'other';
    return availableCuttingTypes.filter(type => type.category === mappedCategory);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    onSave(formData);
  };

  const categoryOptions = user?.loginType === 'hub' 
    ? [
        { value: '', label: 'Select Category' },
        { value: 'fish', label: 'Fish' },
        { value: 'prawns', label: 'Prawns' },
        { value: 'crab', label: 'Crab' },
        { value: 'squid', label: 'Squid' },
        { value: 'lobster', label: 'Lobster' },
      ]
    : [
        { value: '', label: 'Select Category' },
        { value: 'chicken', label: 'Chicken' },
        { value: 'mutton', label: 'Mutton' },
        { value: 'egg', label: 'Egg' },
        { value: 'spices', label: 'Spices' },
      ];

  return (
    <div className="space-y-6">
      {/* Basic Product Information */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Product Information</h2>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <Select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              options={categoryOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Price (₹) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight/Quantity *
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <Select
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                options={[
                  { value: 'g', label: 'grams (g)' },
                  { value: 'kg', label: 'kilograms (kg)' },
                  { value: 'piece', label: 'piece' },
                  { value: 'pack', label: 'pack' },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter product description"
          />
        </div>
      </Card>

      {/* Product Variants with Cutting Types */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Product Variants & Cutting Types</h2>
          </div>
          <Button onClick={addVariant} variant="secondary" size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Variant
          </Button>
        </div>

        <div className="space-y-6">
          {formData.variants.map((variant, index) => (
            <ProductVariantForm
              key={variant.id}
              variant={variant}
              index={index}
              availableCuttingTypes={getCuttingTypesForCategory(formData.category)}
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
          baseQuantity={formData.weight}
          baseUnit={formData.unit}
          nutrition={formData.nutrition}
          onNutritionChange={(nutrition) => handleInputChange('nutrition', nutrition)}
        />
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Product
        </Button>
      </div>
    </div>
  );
}
