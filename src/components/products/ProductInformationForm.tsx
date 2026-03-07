import { Package } from 'lucide-react';
import { Card } from '../ui';
import { useAuth } from '../../context/AuthContext';

interface ProductInformationData {
  nameEn: string;
  nameTa: string;
  category: string;
  hsnNumber: string;
  variant: string;
  fishSize: string;
  maxSize: string;
  basePriceMin: number;
  basePriceMax: number;
  fishCountMin: number;
  fishCountMax: number;
  isBestSeller: boolean;
  isRareProduct: boolean;
  isActive: boolean;
  productType: 'fresh' | 'frozen' | 'processed' | '';
  season: string;
  metaTitle: string;
  metaDescription: string;
}

interface ProductInformationFormProps {
  data: ProductInformationData;
  onChange: (field: keyof ProductInformationData, value: any) => void;
}

// Mock categories data - in real app, this would come from API/context
const mockCategories = [
  // Hub Categories
  {
    id: '1',
    name: 'Sea Fish',
    nameTa: 'கடல் மீன்',
    isActive: true,
    applicableFor: 'hub' as const
  },
  {
    id: '2',
    name: 'Freshwater Fish',
    nameTa: 'நன்னீர் மீன்',
    isActive: true,
    applicableFor: 'hub' as const
  },
  {
    id: '3',
    name: 'Shell Fish',
    nameTa: 'ஓடு மீன்',
    isActive: true,
    applicableFor: 'hub' as const
  },
  {
    id: '4',
    name: 'Dry Fish',
    nameTa: 'காய்ந்த மீன்',
    isActive: true,
    applicableFor: 'hub' as const
  },
  // Store Categories
  {
    id: '5',
    name: 'Meat',
    nameTa: 'இறைச்சி',
    isActive: true,
    applicableFor: 'store' as const
  },
  {
    id: '6',
    name: 'Eggs',
    nameTa: 'முட்டை',
    isActive: true,
    applicableFor: 'store' as const
  },
  {
    id: '7',
    name: 'Spices',
    nameTa: 'மசாலா',
    isActive: true,
    applicableFor: 'store' as const
  },
  {
    id: '8',
    name: 'Ready to Eat',
    nameTa: 'உடனடி உணவு',
    isActive: true,
    applicableFor: 'store' as const
  },
  {
    id: '9',
    name: 'Ready to Cook',
    nameTa: 'சமைக்க தயார்',
    isActive: true,
    applicableFor: 'store' as const
  }
];

export function ProductInformationForm({ data, onChange }: ProductInformationFormProps) {
  const { user } = useAuth();
  
  // Filter categories based on user type and active status
  const getAvailableCategories = () => {
    const userType = user?.loginType === 'super_admin' ? 'both' : 
                    user?.loginType === 'hub' ? 'hub' : 'store';
    
    return mockCategories.filter(category => {
      // Only show active categories
      if (!category.isActive) return false;
      
      // Super admin sees all categories
      if (userType === 'both') return true;
      
      // Filter by applicability for hub/store users
      return category.applicableFor === userType;
    });
  };

  const availableCategories = getAvailableCategories();

  // Check if selected category is a fish category
  const isFishCategory = () => {
    const selectedCategory = mockCategories.find(cat => cat.id === data.category);
    return selectedCategory?.applicableFor === 'hub';
  };

  const showAllFields = isFishCategory();

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Product Information</h2>
        <div className="flex items-center gap-4 ml-auto">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.isBestSeller}
              onChange={(e) => onChange('isBestSeller', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Best Seller</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.isRareProduct}
              onChange={(e) => onChange('isRareProduct', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Rare Product</span>
          </label>
        </div>
      </div>

      {/* First Row: Product Names, Category, HSN Number */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name (English) *
          </label>
          <input
            type="text"
            value={data.nameEn}
            onChange={(e) => onChange('nameEn', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Seer Fish"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name (Tamil) *
          </label>
          <input
            type="text"
            value={data.nameTa}
            onChange={(e) => onChange('nameTa', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="வஞ்சிரம்"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={data.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {availableCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.nameTa})
              </option>
            ))}
          </select>
          {availableCategories.length === 0 && (
            <p className="text-xs text-red-600 mt-1">
              No categories available. Please contact admin to add categories.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            HSN Number
          </label>
          <input
            type="text"
            value={data.hsnNumber}
            onChange={(e) => onChange('hsnNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="100"
          />
        </div>
      </div>

      {/* Conditional Fields - Show only for Fish Categories */}
      {showAllFields && (
        <>
          {/* Second Row: Variant, Fish Size, Max */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variant
              </label>
              <input
                type="text"
                value={data.variant}
                onChange={(e) => onChange('variant', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fish Size
              </label>
              <input
                type="text"
                value={data.fishSize}
                onChange={(e) => onChange('fishSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1 kg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max
              </label>
              <input
                type="text"
                value={data.maxSize}
                onChange={(e) => onChange('maxSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2 kg"
              />
            </div>
          </div>

          {/* Third Row: Base Price and Fish Count */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price (₹) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min</label>
                  <input
                    type="number"
                    value={data.basePriceMin}
                    onChange={(e) => onChange('basePriceMin', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1299"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max</label>
                  <input
                    type="number"
                    value={data.basePriceMax}
                    onChange={(e) => onChange('basePriceMax', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1299"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fish Count
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min</label>
                  <input
                    type="number"
                    value={data.fishCountMin}
                    onChange={(e) => onChange('fishCountMin', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max</label>
                  <input
                    type="number"
                    value={data.fishCountMax}
                    onChange={(e) => onChange('fishCountMax', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fourth Row: Product Type and Season */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type *
              </label>
              <select
                value={data.productType}
                onChange={(e) => onChange('productType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="fresh">Fresh</option>
                <option value="frozen">Frozen</option>
                <option value="processed">Processed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Season
              </label>
              <input
                type="text"
                value={data.season}
                onChange={(e) => onChange('season', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="April - December"
              />
            </div>
          </div>

        </>
      )}

      {/* Basic Fields - Show for Non-Fish Categories */}
      {!showAllFields && data.category && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Price (₹) *
            </label>
            <input
              type="number"
              value={data.basePriceMin}
              onChange={(e) => onChange('basePriceMin', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="299"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variant
            </label>
            <input
              type="text"
              value={data.variant}
              onChange={(e) => onChange('variant', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="500g, 1kg, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight/Quantity
            </label>
            <input
              type="text"
              value={data.fishSize}
              onChange={(e) => onChange('fishSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="500g"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <input
              type="text"
              value={data.maxSize}
              onChange={(e) => onChange('maxSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="kg, pieces, dozen"
            />
          </div>
        </div>
      )}

      {/* Common SEO Fields - Show for all selected categories */}
      {data.category && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title Tag *
            </label>
            <input
              type="text"
              value={data.metaTitle}
              onChange={(e) => onChange('metaTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Fresh Seer Fish - Premium Quality | BayHawk"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">{data.metaTitle.length}/60 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description *
            </label>
            <textarea
              value={data.metaDescription}
              onChange={(e) => onChange('metaDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buy fresh seer fish online. Premium quality, cleaned and delivered to your doorstep. Rich in omega-3 and protein."
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">{data.metaDescription.length}/160 characters</p>
          </div>
        </div>
      )}
    </Card>
  );
}

export type { ProductInformationData };
