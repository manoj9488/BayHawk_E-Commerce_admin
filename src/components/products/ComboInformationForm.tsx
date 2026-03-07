import { Package, Plus, X, Percent } from 'lucide-react';
import { Card, Button } from '../ui';

interface ComboItem {
  id: string;
  categoryId: string;
  productId: string;
  quantity: number;
}

interface ComboInformationData {
  comboName: string;
  comboOfferPercent: number;
  comboDescription: string;
  comboItems: ComboItem[];
  isBestSeller: boolean;
  isRareProduct: boolean;
  isActive: boolean;
  productType: 'fresh' | 'frozen' | 'processed' | '';
  season: string;
  metaTitle: string;
  metaDescription: string;
}

interface ComboInformationFormProps {
  data: ComboInformationData;
  onChange: (field: keyof ComboInformationData, value: any) => void;
  availableCategories: Array<{ id: string; name: string }>;
}

const mockProductsByCategory: Record<string, Array<{ id: string; name: string; price: number }>> = {
  '1': [{ id: 'p1', name: 'Sea Bass', price: 450 }, { id: 'p2', name: 'Seer Fish', price: 650 }],
  '2': [{ id: 'p3', name: 'Catfish', price: 300 }, { id: 'p4', name: 'Tilapia', price: 250 }],
  '5': [{ id: 'p5', name: 'Chicken Breast', price: 280 }, { id: 'p6', name: 'Mutton Curry Cut', price: 550 }],
  '6': [{ id: 'p7', name: 'Farm Eggs (6 pcs)', price: 42 }, { id: 'p8', name: 'Country Eggs (6 pcs)', price: 54 }],
  '7': [{ id: 'p9', name: 'Turmeric Powder', price: 80 }, { id: 'p10', name: 'Chili Powder', price: 90 }],
  '8': [{ id: 'p11', name: 'Biryani Mix', price: 120 }, { id: 'p12', name: 'Curry Ready', price: 150 }],
  '9': [{ id: 'p13', name: 'Marinated Chicken', price: 320 }, { id: 'p14', name: 'Tandoori Mix', price: 340 }]
};

export function ComboInformationForm({ data, onChange, availableCategories }: ComboInformationFormProps) {
  const addComboItem = () => {
    const newItem: ComboItem = {
      id: Date.now().toString(),
      categoryId: '',
      productId: '',
      quantity: 1
    };
    onChange('comboItems', [...data.comboItems, newItem]);
  };

  const removeComboItem = (id: string) => {
    onChange('comboItems', data.comboItems.filter(item => item.id !== id));
  };

  const updateComboItem = (id: string, field: keyof ComboItem, value: string | number) => {
    onChange('comboItems', data.comboItems.map(item =>
      item.id === id ? { ...item, [field]: value, ...(field === 'categoryId' ? { productId: '' } : {}) } : item
    ));
  };

  const calculateTotalPrice = () => {
    return data.comboItems.reduce((total, item) => {
      const category = mockProductsByCategory[item.categoryId];
      const product = category?.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateComboPrice = () => {
    const total = calculateTotalPrice();
    return total - (total * data.comboOfferPercent / 100);
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold">Combo Product Information</h2>
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

      {/* Combo Basic Details */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Combo Name *
          </label>
          <input
            type="text"
            value={data.comboName}
            onChange={(e) => onChange('comboName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Fish & Meat Combo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Percent className="h-4 w-4" />
            Offer Percentage *
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.comboOfferPercent}
            onChange={(e) => onChange('comboOfferPercent', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="10"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Combo Description *
        </label>
        <textarea
          value={data.comboDescription}
          onChange={(e) => onChange('comboDescription', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Get fresh fish and premium meat together at a special price!"
          rows={2}
        />
      </div>

      {/* Products in Combo */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Products in Combo *</h3>
          <Button onClick={addComboItem} variant="secondary" size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {data.comboItems.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Package className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">No products added yet</p>
          </div>
        )}

        {data.comboItems.map((item, index) => {
          const category = mockProductsByCategory[item.categoryId];
          const product = category?.find(p => p.id === item.productId);
          const itemTotal = (product?.price || 0) * item.quantity;

          return (
            <div key={item.id} className="p-3 border border-gray-200 rounded-lg bg-white mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Product {index + 1}</span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => removeComboItem(item.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-2 grid-cols-1 sm:grid-cols-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select
                    value={item.categoryId}
                    onChange={(e) => updateComboItem(item.id, 'categoryId', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select</option>
                    {availableCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Product</label>
                  <select
                    value={item.productId}
                    onChange={(e) => updateComboItem(item.id, 'productId', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!item.categoryId}
                  >
                    <option value="">Select</option>
                    {item.categoryId && mockProductsByCategory[item.categoryId]?.map(prod => (
                      <option key={prod.id} value={prod.id}>{prod.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateComboItem(item.id, 'quantity', Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Price</label>
                  <div className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-medium">
                    ₹{itemTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {data.comboItems.length > 0 && (
          <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 mt-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-xs text-gray-600">Products</p>
                <p className="text-lg font-bold text-gray-900">{data.comboItems.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Original</p>
                <p className="text-lg font-bold text-gray-900">₹{calculateTotalPrice().toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Discount</p>
                <p className="text-lg font-bold text-red-600">-₹{(calculateTotalPrice() * data.comboOfferPercent / 100).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Final Price</p>
                <p className="text-lg font-bold text-green-600">₹{calculateComboPrice().toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Type and Season */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Type *
          </label>
          <select
            value={data.productType}
            onChange={(e) => onChange('productType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="April - December"
          />
        </div>
      </div>

      {/* SEO Meta Tags */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title Tag *
          </label>
          <input
            type="text"
            value={data.metaTitle}
            onChange={(e) => onChange('metaTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Fish & Meat Combo - Special Offer | BayHawk"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Get fresh fish and premium meat together at a special discounted price. Save more with our combo offers!"
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">{data.metaDescription.length}/160 characters</p>
        </div>
      </div>
    </Card>
  );
}

export type { ComboInformationData, ComboItem };
