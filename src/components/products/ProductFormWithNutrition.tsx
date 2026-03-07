import { useState } from 'react';
import { Card, Button, Select } from '../ui';
import { Save, Upload, Package, Info } from 'lucide-react';
import { NutritionCustomization } from './NutritionCustomization';

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

interface ProductFormData {
  name: string;
  category: string;
  price: number;
  weight: number;
  unit: string;
  description: string;
  nutrition: NutritionInfo;
}

interface ProductFormProps {
  onSave: (product: ProductFormData) => void;
  onCancel: () => void;
}

export function ProductFormWithNutrition({ onSave, onCancel }: ProductFormProps) {
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
  });

  const [showNutrition, setShowNutrition] = useState(false);

  // Sample nutrition presets for different product categories
  const nutritionPresets = {
    'fresh-fish': {
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
    'shellfish': {
      calories: 85,
      protein: 18,
      carbs: 2,
      fat: 1,
      fiber: 0,
      sugar: 0,
      sodium: 140,
      cholesterol: 95,
      vitamins: {
        vitaminA: 90,
        vitaminC: 8,
        vitaminD: 2,
        vitaminB12: 8,
      },
      minerals: {
        calcium: 45,
        iron: 2.5,
        potassium: 220,
        magnesium: 30,
      },
    },
    'frozen': {
      calories: 180,
      protein: 15,
      carbs: 8,
      fat: 11,
      fiber: 2,
      sugar: 1,
      sodium: 250,
      cholesterol: 40,
      vitamins: {
        vitaminA: 50,
        vitaminC: 5,
        vitaminD: 8,
        vitaminB12: 1,
      },
      minerals: {
        calcium: 20,
        iron: 1.2,
        potassium: 280,
        magnesium: 20,
      },
    },
    'accessories': {
      calories: 45,
      protein: 8,
      carbs: 6,
      fat: 1,
      fiber: 3,
      sugar: 2,
      sodium: 150,
      cholesterol: 0,
      vitamins: {
        vitaminA: 200,
        vitaminC: 15,
        vitaminD: 0,
        vitaminB12: 0,
      },
      minerals: {
        calcium: 80,
        iron: 1.5,
        potassium: 120,
        magnesium: 12,
      },
    },
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-populate nutrition when category changes
    if (field === 'category' && nutritionPresets[value as keyof typeof nutritionPresets]) {
      setFormData(prev => ({
        ...prev,
        category: value,
        nutrition: nutritionPresets[value as keyof typeof nutritionPresets]
      }));
    }
  };

  const handleNutritionChange = (nutrition: NutritionInfo) => {
    setFormData(prev => ({
      ...prev,
      nutrition
    }));
  };

  const calculateNutritionPerKg = (nutrition: NutritionInfo, weight: number, unit: string) => {
    const weightInKg = unit === 'kg' ? weight : weight / 1000;
    if (weightInKg === 0) return nutrition;
    
    return {
      calories: Math.round((nutrition.calories / weightInKg) * 100) / 100,
      protein: Math.round((nutrition.protein / weightInKg) * 100) / 100,
      carbs: Math.round((nutrition.carbs / weightInKg) * 100) / 100,
      fat: Math.round((nutrition.fat / weightInKg) * 100) / 100,
      fiber: Math.round((nutrition.fiber / weightInKg) * 100) / 100,
      sugar: Math.round((nutrition.sugar / weightInKg) * 100) / 100,
      sodium: Math.round((nutrition.sodium / weightInKg) * 100) / 100,
      cholesterol: Math.round((nutrition.cholesterol / weightInKg) * 100) / 100,
      vitamins: {
        vitaminA: Math.round((nutrition.vitamins.vitaminA / weightInKg) * 100) / 100,
        vitaminC: Math.round((nutrition.vitamins.vitaminC / weightInKg) * 100) / 100,
        vitaminD: Math.round((nutrition.vitamins.vitaminD / weightInKg) * 100) / 100,
        vitaminB12: Math.round((nutrition.vitamins.vitaminB12 / weightInKg) * 100) / 100,
      },
      minerals: {
        calcium: Math.round((nutrition.minerals.calcium / weightInKg) * 100) / 100,
        iron: Math.round((nutrition.minerals.iron / weightInKg) * 100) / 100,
        potassium: Math.round((nutrition.minerals.potassium / weightInKg) * 100) / 100,
        magnesium: Math.round((nutrition.minerals.magnesium / weightInKg) * 100) / 100,
      },
    };
  };

  const nutritionPerKg = calculateNutritionPerKg(formData.nutrition, formData.weight, formData.unit);

  const handleSave = () => {
    onSave(formData);
  };

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
              options={[
                { value: '', label: 'Select Category' },
                { value: 'fresh-fish', label: 'Fresh Fish' },
                { value: 'shellfish', label: 'Shellfish' },
                { value: 'frozen', label: 'Frozen Items' },
                { value: 'accessories', label: 'Accessories' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
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

        {/* Product Image Upload */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
          </div>
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
         <>
           {/* Nutrition Per Kg Display */}
           <Card>
             <div className="flex items-center gap-2 mb-4">
               <Info className="h-5 w-5 text-purple-600" />
               <h3 className="text-lg font-semibold">Nutrition per 1kg</h3>
               <span className="text-sm text-gray-500">Automatically calculated based on weight</span>
             </div>
             
             <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
               <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                 <div className="text-xl font-bold text-purple-600">{nutritionPerKg.calories}</div>
                 <div className="text-xs text-purple-800">Calories</div>
               </div>
               <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                 <div className="text-xl font-bold text-green-600">{nutritionPerKg.protein}g</div>
                 <div className="text-xs text-green-800">Protein</div>
               </div>
               <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                 <div className="text-xl font-bold text-orange-600">{nutritionPerKg.fat}g</div>
                 <div className="text-xs text-orange-800">Fat</div>
               </div>
               <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                 <div className="text-xl font-bold text-blue-600">{nutritionPerKg.carbs}g</div>
                 <div className="text-xs text-blue-800">Carbs</div>
               </div>
             </div>
             
             <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
               <div className="border rounded-lg p-3 bg-gray-50">
                 <h4 className="font-medium text-gray-900 mb-2 text-sm">Vitamins per 1kg</h4>
                 <div className="grid grid-cols-2 gap-2 text-xs">
                   <div className="flex justify-between">
                     <span>Vitamin A:</span>
                     <span className="font-semibold">{nutritionPerKg.vitamins.vitaminA}IU</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Vitamin C:</span>
                     <span className="font-semibold">{nutritionPerKg.vitamins.vitaminC}mg</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Vitamin D:</span>
                     <span className="font-semibold">{nutritionPerKg.vitamins.vitaminD}IU</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Vitamin B12:</span>
                     <span className="font-semibold">{nutritionPerKg.vitamins.vitaminB12}mcg</span>
                   </div>
                 </div>
               </div>
               
               <div className="border rounded-lg p-3 bg-gray-50">
                 <h4 className="font-medium text-gray-900 mb-2 text-sm">Minerals per 1kg</h4>
                 <div className="grid grid-cols-2 gap-2 text-xs">
                   <div className="flex justify-between">
                     <span>Calcium:</span>
                     <span className="font-semibold">{nutritionPerKg.minerals.calcium}mg</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Iron:</span>
                     <span className="font-semibold">{nutritionPerKg.minerals.iron}mg</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Potassium:</span>
                     <span className="font-semibold">{nutritionPerKg.minerals.potassium}mg</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Magnesium:</span>
                     <span className="font-semibold">{nutritionPerKg.minerals.magnesium}mg</span>
                   </div>
                 </div>
               </div>
             </div>
           </Card>

           <NutritionCustomization
             baseQuantity={formData.weight}
             baseUnit={formData.unit}
             nutrition={formData.nutrition}
             onNutritionChange={handleNutritionChange}
           />
         </>
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
