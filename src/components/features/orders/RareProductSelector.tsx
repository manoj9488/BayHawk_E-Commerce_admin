import { useState } from 'react';
import { Button, Badge, Modal } from '../../ui';
import { Crown, AlertTriangle, Clock, Package, Plus, Check } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';
import type { Product, ProductVariant } from '../../../types';

interface RareProductSelectorProps {
  product: Product;
  variant: ProductVariant;
  onAddToOrder: (productId: string, variantId: string, alternateProductId?: string, alternateVariantId?: string) => void;
  availableProducts: Product[];
  className?: string;
}

export function RareProductSelector({ 
  product, 
  variant, 
  onAddToOrder, 
  availableProducts,
  className = '' 
}: RareProductSelectorProps) {
  const [showAlternateModal, setShowAlternateModal] = useState(false);
  const [selectedAlternate, setSelectedAlternate] = useState<{
    productId: string;
    variantId: string;
  } | null>(null);

  const alternateProducts = availableProducts.filter(p => 
    p.category === product.category && 
    !p.isRare && 
    p.id !== product.id &&
    p.isActive
  );

  const handleAddRareProduct = () => {
    if (product.isRare) {
      setShowAlternateModal(true);
    } else {
      onAddToOrder(product.id, variant.id);
    }
  };

  const handleConfirmWithAlternate = () => {
    onAddToOrder(
      product.id, 
      variant.id, 
      selectedAlternate?.productId, 
      selectedAlternate?.variantId
    );
    setShowAlternateModal(false);
    setSelectedAlternate(null);
  };

  const handleConfirmWithoutAlternate = () => {
    onAddToOrder(product.id, variant.id);
    setShowAlternateModal(false);
  };

  return (
    <>
      <div className={`border rounded-lg p-3 hover:border-blue-300 transition-colors ${className}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{product.nameEn}</h4>
            <p className="text-sm text-gray-600">{product.nameTa}</p>
            <p className="text-xs text-gray-500">{product.sku}</p>
          </div>
          <div className="flex gap-1">
            {product.isBestSeller && (
              <Badge variant="warning">Best Seller</Badge>
            )}
            {product.isRare && (
              <Badge variant="danger" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Rare
              </Badge>
            )}
            {product.deliveryType === 'exotic' && (
              <Badge variant="purple" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Exotic
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex-1">
              <p className="text-sm font-medium">{variant.type} - {variant.size}</p>
              <p className="text-xs text-gray-600">{variant.serves} • Stock: {variant.stock}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(variant.price)}
                </span>
                {variant.discount && (
                  <Badge variant="success">{variant.discount}% off</Badge>
                )}
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddRareProduct}
              disabled={variant.stock === 0}
              className={product.isRare ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {product.isRare && (
          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="text-xs text-orange-800">
                <p className="font-medium">Rare Product Notice:</p>
                <p>Available for next slot delivery. Please select an alternate product in case this item is unavailable during procurement.</p>
              </div>
            </div>
          </div>
        )}

        {product.deliveryType === 'exotic' && (
          <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-purple-600 mt-0.5" />
              <div className="text-xs text-purple-800">
                <p className="font-medium">Exotic Product:</p>
                <p>Requires 2-7 days for delivery. Imported delicacy with premium quality.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showAlternateModal}
        onClose={() => setShowAlternateModal(false)}
        title="Select Alternate Product"
        size="lg"
      >
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">Rare Product Selected</h3>
                <p className="text-sm text-orange-800 leading-relaxed">
                  <span className="font-medium">{product.nameEn}</span> is a rare product available for next slot delivery. 
                  Please select an alternate product below in case this item is unavailable during procurement.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Available Alternate Products</h4>
              <Badge variant="info">{alternateProducts.length} options</Badge>
            </div>
            
            {alternateProducts.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {alternateProducts.map((altProduct) => (
                  <div 
                    key={altProduct.id} 
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-gray-900">{altProduct.nameEn}</h5>
                          {altProduct.isBestSeller && (
                            <Badge variant="warning" className="text-xs">⭐ Best Seller</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{altProduct.nameTa}</p>
                        <p className="text-xs text-gray-500 mt-1">{altProduct.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Select Variant</p>
                      {altProduct.variants.map((altVariant) => {
                        const isSelected = selectedAlternate?.productId === altProduct.id && 
                                         selectedAlternate?.variantId === altVariant.id;
                        return (
                          <button
                            key={altVariant.id}
                            type="button"
                            onClick={() => setSelectedAlternate({
                              productId: altProduct.id,
                              variantId: altVariant.id
                            })}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-gray-900">
                                  {altVariant.type} - {altVariant.size}
                                </p>
                                {altVariant.discount && (
                                  <Badge variant="success" className="text-xs">{altVariant.discount}% OFF</Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{altVariant.serves}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-green-600">
                                  {formatCurrency(altVariant.price)}
                                </span>
                                <span className="text-xs text-gray-500">• Stock: {altVariant.stock}</span>
                              </div>
                            </div>
                            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="h-4 w-4 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 font-medium">No alternate products available</p>
                <p className="text-sm text-gray-500 mt-1">in {product.category} category</p>
              </div>
            )}
          </div>

          {selectedAlternate && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Alternate Product Selected</p>
                  <p className="text-sm text-blue-800">
                    {alternateProducts.find(p => p.id === selectedAlternate.productId)?.nameEn} - {
                      alternateProducts.find(p => p.id === selectedAlternate.productId)?.variants
                        .find(v => v.id === selectedAlternate.variantId)?.type
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAlternateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleConfirmWithoutAlternate}
              className="flex-1 border border-gray-300"
            >
              Skip Alternate
            </Button>
            <Button
              type="button"
              onClick={handleConfirmWithAlternate}
              disabled={!selectedAlternate}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Confirm Order
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
