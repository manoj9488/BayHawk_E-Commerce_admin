import { useState } from 'react';
import { Card, Button } from '../ui';
import { Plus, Minus, Info, Check, Eye, EyeOff, X, Trash2 } from 'lucide-react';

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

interface SelectedNutrition {
  [key: string]: boolean;
}

interface NutritionCustomizationProps {
  baseQuantity: number;
  baseUnit: string;
  nutrition: NutritionInfo;
  selectedNutrition?: SelectedNutrition;
  onNutritionChange: (nutrition: NutritionInfo) => void;
  onSelectedNutritionChange?: (selected: SelectedNutrition) => void;
}

export function NutritionCustomization({ 
  baseQuantity, 
  baseUnit, 
  nutrition, 
  selectedNutrition = {},
  onNutritionChange,
  onSelectedNutritionChange
}: NutritionCustomizationProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(baseQuantity);
  const [showPreview, setShowPreview] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNutritionName, setNewNutritionName] = useState('');
  const [newNutritionValue, setNewNutritionValue] = useState(0);
  const [newNutritionUnit, setNewNutritionUnit] = useState('g');
  const [customNutrients, setCustomNutrients] = useState<Array<{key: string; label: string; unit: string; category?: string}>>([]);
  const [removedFields, setRemovedFields] = useState<Set<string>>(new Set());

  const calculateNutrition = (value: number) => {
    const ratio = selectedQuantity / baseQuantity;
    return Math.round(value * ratio * 100) / 100;
  };

  const updateNutritionValue = (key: string, value: number, category?: string) => {
    const updatedNutrition = { ...nutrition };
    
    if (category) {
      (updatedNutrition as any)[category] = {
        ...(updatedNutrition as any)[category],
        [key]: value
      };
    } else {
      (updatedNutrition as any)[key] = value;
    }
    
    onNutritionChange(updatedNutrition);
  };

  const toggleNutritionSelection = (key: string, category?: string) => {
    if (!onSelectedNutritionChange) return;
    
    const fullKey = category ? `${category}.${key}` : key;
    const updated = {
      ...selectedNutrition,
      [fullKey]: !selectedNutrition[fullKey]
    };
    onSelectedNutritionChange(updated);
  };

  const isNutritionSelected = (key: string, category?: string) => {
    const fullKey = category ? `${category}.${key}` : key;
    return selectedNutrition[fullKey] || false;
  };

  const addCustomNutrient = () => {
    if (!newNutritionName.trim()) return;
    
    const key = newNutritionName.toLowerCase().replace(/\s+/g, '_');
    const newField = {
      key,
      label: newNutritionName,
      unit: newNutritionUnit
    };
    
    setCustomNutrients([...customNutrients, newField]);
    updateNutritionValue(key, newNutritionValue);
    
    // Reset form
    setNewNutritionName('');
    setNewNutritionValue(0);
    setNewNutritionUnit('g');
    setShowAddForm(false);
  };

  const removeCustomNutrient = (key: string) => {
    setCustomNutrients(customNutrients.filter(n => n.key !== key));
    
    // Remove from nutrition data
    const updatedNutrition = { ...nutrition };
    delete (updatedNutrition as any)[key];
    onNutritionChange(updatedNutrition);
    
    // Remove from selected
    if (onSelectedNutritionChange) {
      const updated = { ...selectedNutrition };
      delete updated[key];
      onSelectedNutritionChange(updated);
    }
  };

  const removePredefinedField = (key: string, category?: string) => {
    const fullKey = category ? `${category}.${key}` : key;
    setRemovedFields(new Set(removedFields).add(fullKey));
    
    // Unselect if selected
    if (onSelectedNutritionChange && selectedNutrition[fullKey]) {
      const updated = { ...selectedNutrition };
      delete updated[fullKey];
      onSelectedNutritionChange(updated);
    }
  };

  const isFieldRemoved = (key: string, category?: string) => {
    const fullKey = category ? `${category}.${key}` : key;
    return removedFields.has(fullKey);
  };

  const getSelectedNutritionCount = () => {
    return Object.values(selectedNutrition).filter(Boolean).length;
  };

  const nutritionFields = [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbohydrates', unit: 'g' },
    { key: 'fat', label: 'Total Fat', unit: 'g' },
    { key: 'fiber', label: 'Fiber', unit: 'g' },
    { key: 'sugar', label: 'Sugar', unit: 'g' },
    { key: 'sodium', label: 'Sodium', unit: 'mg' },
    { key: 'cholesterol', label: 'Cholesterol', unit: 'mg' },
  ];

  const vitaminFields = [
    { key: 'vitaminA', label: 'Vitamin A', unit: 'IU' },
    { key: 'vitaminC', label: 'Vitamin C', unit: 'mg' },
    { key: 'vitaminD', label: 'Vitamin D', unit: 'IU' },
    { key: 'vitaminB12', label: 'Vitamin B12', unit: 'mcg' },
  ];

  const mineralFields = [
    { key: 'calcium', label: 'Calcium', unit: 'mg' },
    { key: 'iron', label: 'Iron', unit: 'mg' },
    { key: 'potassium', label: 'Potassium', unit: 'mg' },
    { key: 'magnesium', label: 'Magnesium', unit: 'mg' },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Nutrition Information</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {getSelectedNutritionCount()} selected for label
          </span>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong> Check the boxes next to nutrition values you want to include on the product label. 
          Only selected nutrition information will be displayed to customers.
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Serving Size
        </label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Number(e.target.value) || 1)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
              min="1"
            />
            <span className="text-sm text-gray-600">{baseUnit}</span>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setSelectedQuantity(selectedQuantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Base serving: {baseQuantity} {baseUnit}
        </p>
      </div>

      {/* Basic Nutrition */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Basic Nutrition</h4>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {nutritionFields.filter(field => !isFieldRemoved(field.key)).map(field => {
            const isSelected = isNutritionSelected(field.key);
            return (
              <div key={field.key} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleNutritionSelection(field.key)}
                    className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                      isSelected 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </button>
                  <div>
                    <label className="text-sm font-medium text-gray-700 cursor-pointer">
                      {field.label}
                    </label>
                    <p className="text-xs text-gray-500">per {selectedQuantity} {baseUnit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={(nutrition as any)[field.key]}
                    onChange={(e) => updateNutritionValue(field.key, Number(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-xs text-gray-500 w-8">{field.unit}</span>
                  <button
                    type="button"
                    onClick={() => removePredefinedField(field.key)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vitamins */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Vitamins</h4>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {vitaminFields.filter(field => !isFieldRemoved(field.key, 'vitamins')).map(field => {
            const isSelected = isNutritionSelected(field.key, 'vitamins');
            return (
              <div key={field.key} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleNutritionSelection(field.key, 'vitamins')}
                    className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                      isSelected 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </button>
                  <div>
                    <label className="text-sm font-medium text-gray-700 cursor-pointer">
                      {field.label}
                    </label>
                    <p className="text-xs text-gray-500">per {selectedQuantity} {baseUnit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={nutrition.vitamins[field.key as keyof typeof nutrition.vitamins]}
                    onChange={(e) => updateNutritionValue(field.key, Number(e.target.value) || 0, 'vitamins')}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-xs text-gray-500 w-8">{field.unit}</span>
                  <button
                    type="button"
                    onClick={() => removePredefinedField(field.key, 'vitamins')}
                    className="text-red-600 hover:text-red-800"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Minerals */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Minerals</h4>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {mineralFields.filter(field => !isFieldRemoved(field.key, 'minerals')).map(field => {
            const isSelected = isNutritionSelected(field.key, 'minerals');
            return (
              <div key={field.key} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleNutritionSelection(field.key, 'minerals')}
                    className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                      isSelected 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </button>
                  <div>
                    <label className="text-sm font-medium text-gray-700 cursor-pointer">
                      {field.label}
                    </label>
                    <p className="text-xs text-gray-500">per {selectedQuantity} {baseUnit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={nutrition.minerals[field.key as keyof typeof nutrition.minerals]}
                    onChange={(e) => updateNutritionValue(field.key, Number(e.target.value) || 0, 'minerals')}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-xs text-gray-500 w-8">{field.unit}</span>
                  <button
                    type="button"
                    onClick={() => removePredefinedField(field.key, 'minerals')}
                    className="text-red-600 hover:text-red-800"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Nutrition Values */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Custom Nutrition Values</h4>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Custom Value
          </Button>
        </div>

        {showAddForm && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-3">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newNutritionName}
                  onChange={(e) => setNewNutritionName(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                  placeholder="e.g., Omega-3"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Value *</label>
                <input
                  type="number"
                  value={newNutritionValue}
                  onChange={(e) => setNewNutritionValue(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                  step="0.1"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Unit *</label>
                <select
                  value={newNutritionUnit}
                  onChange={(e) => setNewNutritionUnit(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                >
                  <option value="g">g</option>
                  <option value="mg">mg</option>
                  <option value="mcg">mcg</option>
                  <option value="IU">IU</option>
                  <option value="kcal">kcal</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <Button type="button" onClick={addCustomNutrient} size="sm" className="flex-1">
                  Add
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)} size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {customNutrients.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {customNutrients.map(field => {
              const isSelected = isNutritionSelected(field.key);
              return (
                <div key={field.key} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                  isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleNutritionSelection(field.key)}
                      className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                        isSelected 
                          ? 'border-green-500 bg-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </button>
                    <div>
                      <label className="text-sm font-medium text-gray-700 cursor-pointer">
                        {field.label}
                      </label>
                      <p className="text-xs text-gray-500">per {selectedQuantity} {baseUnit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={(nutrition as any)[field.key] || 0}
                      onChange={(e) => updateNutritionValue(field.key, Number(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                      step="0.1"
                      min="0"
                    />
                    <span className="text-xs text-gray-500 w-8">{field.unit}</span>
                    <button
                      type="button"
                      onClick={() => removeCustomNutrient(field.key)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-500">No custom nutrition values added yet</p>
          </div>
        )}
      </div>

      {/* Nutrition Facts Preview - Only Selected Items */}
      {showPreview && getSelectedNutritionCount() > 0 && (
        <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded-lg">
          <h4 className="font-bold text-center mb-2">Nutrition Facts Preview</h4>
          <p className="text-xs text-center text-gray-600 mb-2">
            (Only selected nutrition values will appear on product label)
          </p>
          <div className="border-b-8 border-black mb-2"></div>
          <div className="text-sm">
            <div className="flex justify-between font-semibold">
              <span>Serving Size</span>
              <span>{selectedQuantity} {baseUnit}</span>
            </div>
            <div className="border-b-4 border-black my-2"></div>
            
            {/* Calories - Always show if selected */}
            {isNutritionSelected('calories') && (
              <div className="flex justify-between font-bold text-lg">
                <span>Calories</span>
                <span>{calculateNutrition(nutrition.calories)}</span>
              </div>
            )}
            
            {getSelectedNutritionCount() > (isNutritionSelected('calories') ? 1 : 0) && (
              <>
                <div className="border-b border-gray-300 my-1"></div>
                <div className="text-xs text-right font-semibold">% Daily Value*</div>
                <div className="space-y-1">
                  {/* Basic Nutrition - Only Selected */}
                  {nutritionFields.filter(field => field.key !== 'calories' && isNutritionSelected(field.key)).map(field => (
                    <div key={field.key} className="flex justify-between">
                      <span>
                        <strong>{field.label}</strong> {calculateNutrition((nutrition as any)[field.key])}{field.unit}
                      </span>
                      <span className="font-semibold">
                        {field.key === 'fat' && Math.round((calculateNutrition(nutrition.fat) / 65) * 100)}
                        {field.key === 'cholesterol' && Math.round((calculateNutrition(nutrition.cholesterol) / 300) * 100)}
                        {field.key === 'sodium' && Math.round((calculateNutrition(nutrition.sodium) / 2300) * 100)}
                        {field.key === 'carbs' && Math.round((calculateNutrition(nutrition.carbs) / 300) * 100)}
                        {field.key === 'fiber' && Math.round((calculateNutrition(nutrition.fiber) / 25) * 100)}
                        {['fat', 'cholesterol', 'sodium', 'carbs', 'fiber'].includes(field.key) && '%'}
                      </span>
                    </div>
                  ))}
                  
                  {/* Vitamins - Only Selected */}
                  {vitaminFields.filter(field => isNutritionSelected(field.key, 'vitamins')).map(field => (
                    <div key={field.key} className="flex justify-between">
                      <span>
                        <strong>{field.label}</strong> {calculateNutrition(nutrition.vitamins[field.key as keyof typeof nutrition.vitamins])}{field.unit}
                      </span>
                      <span className="font-semibold">*</span>
                    </div>
                  ))}
                  
                  {/* Minerals - Only Selected */}
                  {mineralFields.filter(field => isNutritionSelected(field.key, 'minerals')).map(field => (
                    <div key={field.key} className="flex justify-between">
                      <span>
                        <strong>{field.label}</strong> {calculateNutrition(nutrition.minerals[field.key as keyof typeof nutrition.minerals])}{field.unit}
                      </span>
                      <span className="font-semibold">*</span>
                    </div>
                  ))}
                  
                  {/* Custom Nutrients - Only Selected */}
                  {customNutrients.filter(field => isNutritionSelected(field.key)).map(field => (
                    <div key={field.key} className="flex justify-between">
                      <span>
                        <strong>{field.label}</strong> {calculateNutrition((nutrition as any)[field.key] || 0)}{field.unit}
                      </span>
                      <span className="font-semibold">*</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="border-b-8 border-black my-2"></div>
            <div className="text-xs">
              <p>* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet.</p>
            </div>
          </div>
        </div>
      )}

      {/* No Selection Message */}
      {getSelectedNutritionCount() === 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>No nutrition values selected.</strong> Select nutrition values above to include them on the product label.
          </p>
        </div>
      )}
    </Card>
  );
}
