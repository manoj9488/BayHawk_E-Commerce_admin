import { Card } from '../ui';
import { Info } from 'lucide-react';

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

interface NutritionDisplayProps {
  nutrition: NutritionInfo;
  servingSize: number;
  servingUnit: string;
  compact?: boolean;
}

export function NutritionDisplay({ 
  nutrition, 
  servingSize, 
  servingUnit, 
  compact = false 
}: NutritionDisplayProps) {
  if (compact) {
    return (
      <div className="bg-green-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">Nutrition per {servingSize}{servingUnit}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span>Calories:</span>
            <span className="font-semibold">{nutrition.calories}</span>
          </div>
          <div className="flex justify-between">
            <span>Protein:</span>
            <span className="font-semibold">{nutrition.protein}g</span>
          </div>
          <div className="flex justify-between">
            <span>Carbs:</span>
            <span className="font-semibold">{nutrition.carbs}g</span>
          </div>
          <div className="flex justify-between">
            <span>Fat:</span>
            <span className="font-semibold">{nutrition.fat}g</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold">Nutrition Facts</h3>
        <span className="text-sm text-gray-500">per {servingSize}{servingUnit}</span>
      </div>

      {/* Main Nutrition */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{nutrition.calories}</div>
          <div className="text-xs text-blue-800">Calories</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{nutrition.protein}g</div>
          <div className="text-xs text-green-800">Protein</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{nutrition.carbs}g</div>
          <div className="text-xs text-orange-800">Carbs</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{nutrition.fat}g</div>
          <div className="text-xs text-purple-800">Fat</div>
        </div>
      </div>

      {/* Detailed Nutrition */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Additional Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Fiber:</span>
              <span className="font-semibold">{nutrition.fiber}g</span>
            </div>
            <div className="flex justify-between">
              <span>Sugar:</span>
              <span className="font-semibold">{nutrition.sugar}g</span>
            </div>
            <div className="flex justify-between">
              <span>Sodium:</span>
              <span className="font-semibold">{nutrition.sodium}mg</span>
            </div>
            <div className="flex justify-between">
              <span>Cholesterol:</span>
              <span className="font-semibold">{nutrition.cholesterol}mg</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Vitamins & Minerals</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Vitamin A:</span>
              <span className="font-semibold">{nutrition.vitamins.vitaminA}IU</span>
            </div>
            <div className="flex justify-between">
              <span>Vitamin C:</span>
              <span className="font-semibold">{nutrition.vitamins.vitaminC}mg</span>
            </div>
            <div className="flex justify-between">
              <span>Calcium:</span>
              <span className="font-semibold">{nutrition.minerals.calcium}mg</span>
            </div>
            <div className="flex justify-between">
              <span>Iron:</span>
              <span className="font-semibold">{nutrition.minerals.iron}mg</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
