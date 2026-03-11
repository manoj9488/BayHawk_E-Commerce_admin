import { useState } from 'react';
import { Search, Plus, Package, Zap, Crown } from 'lucide-react';
import { Input, Button, Badge, Card } from '../../ui';
import { formatCurrency } from '../../../utils/helpers';
import type { Product } from '../../../types';

interface ProductSelectorProps {
  products: Product[];
  onProductAdd: (product: Product, variantId: string) => void;
  isEliteMember?: boolean;
  moduleType?: 'hub' | 'store' | 'both';
}

export function ProductSelector({ 
  products, 
  onProductAdd, 
  isEliteMember = false,
  moduleType = 'both'
}: ProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories from products
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameTa.includes(searchQuery) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory && product.isActive;
  });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      all: 'All Products',
      fish: 'Fish',
      prawns: 'Prawns',
      crab: 'Crab',
      squid: 'Squid',
      lobster: 'Lobster',
      chicken: 'Chicken',
      mutton: 'Mutton',
      egg: 'Eggs',
      spices: 'Spices'
    };
    return labels[category] || category;
  };

  const getDeliveryBadge = (deliveryType: string) => {
    switch (deliveryType) {
      case 'same_day':
        return <Badge variant="success">Same Day</Badge>;
      case 'next_day':
        return <Badge variant="info">Next Day</Badge>;
      case 'exotic':
        return <Badge variant="warning">4 Days</Badge>;
      default:
        return null;
    }
  };

  const getSourceBadge = (sourceType: string) => {
    return sourceType === 'hub' ? (
      <Badge variant="info">Hub</Badge>
    ) : (
      <Badge variant="success">Store</Badge>
    );
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Product Selection</h3>
          <p className="text-sm text-gray-600">
            Search and add products to the order
            {moduleType === 'hub' && ' (Fish products only)'}
            {moduleType === 'store' && ' (All products available)'}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products by name, Tamil name, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No products found matching your search criteria.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:border-purple-300 transition-colors">
              {/* Product Header */}
              <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{product.nameEn}</h4>
                    <p className="text-sm text-gray-600">{product.nameTa}</p>
                    <p className="text-xs text-gray-500 font-mono">{product.sku}</p>
                  </div>
                </div>
                
                {/* Product Badges */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.isBestSeller && (
                    <Badge variant="warning">Best Seller</Badge>
                  )}
                  {product.isRare && (
                    <Badge variant="danger">Rare</Badge>
                  )}
                  {getDeliveryBadge(product.deliveryType)}
                  {getSourceBadge(product.sourceType)}
                </div>
              </div>
              
              {/* Product Variants */}
              <div className="space-y-2">
                {product.variants.map((variant) => {
                  const finalPrice = variant.price;
                  const discountedPrice = variant.discount 
                    ? finalPrice * (1 - variant.discount / 100) 
                    : finalPrice;
                  const elitePrice = isEliteMember 
                    ? discountedPrice * 0.95 // 5% additional elite discount
                    : discountedPrice;

                  return (
                    <div key={variant.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {variant.type} - {variant.size}
                          </p>
                          <p className="text-xs text-gray-600">
                            {variant.grossWeight} • {variant.serves}
                          </p>
                          <p className="text-xs text-gray-500">
                            Stock: {variant.stock} available
                          </p>
                        </div>
                        
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => onProductAdd(product, variant.id)}
                          disabled={variant.stock === 0}
                          className="ml-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Pricing */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {variant.discount ? (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              {formatCurrency(finalPrice)}
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              {formatCurrency(discountedPrice)}
                            </span>
                            <Badge variant="success">
                              {variant.discount}% OFF
                            </Badge>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-green-600">
                            {formatCurrency(finalPrice)}
                          </span>
                        )}
                        
                        {isEliteMember && (
                          <>
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-semibold text-yellow-600">
                              {formatCurrency(elitePrice)}
                            </span>
                            <Badge variant="warning" className="flex items-center gap-1">
                              <Crown className="h-2 w-2" />
                              Elite
                            </Badge>
                          </>
                        )}
                      </div>
                      
                      {variant.stock === 0 && (
                        <div className="mt-2 text-xs text-red-600 font-medium">
                          Out of Stock
                        </div>
                      )}
                      
                      {variant.stock > 0 && variant.stock <= 5 && (
                        <div className="mt-2 text-xs text-orange-600 font-medium">
                          Only {variant.stock} left!
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Elite Member Notice */}
      {isEliteMember && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <Crown className="h-4 w-4" />
            <span className="text-sm font-medium">Elite Member Pricing Active</span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Additional 5% discount applied on all products for Elite members
          </p>
        </div>
      )}
    </Card>
  );
}