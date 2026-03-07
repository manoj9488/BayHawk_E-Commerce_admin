import { useState } from 'react';
import { Card, Input } from '../../ui';
import { RollbackButton } from '../../rollback/RollbackButton';
import { useRollback } from '../../../context/RollbackContext';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export const ProductRollbackDemo = () => {
  const [product, setProduct] = useState<Product>({
    id: 'prod_001',
    name: 'Fresh Chicken',
    price: 250,
    category: 'Poultry',
    stock: 100
  });

  const { saveState } = useRollback();

  const updateProduct = (field: keyof Product, value: string | number) => {
    const previousState = { ...product };
    const newState = { ...product, [field]: value };
    
    setProduct(newState);
    
    // Save state for rollback
    saveState(
      `Update ${field}`,
      'product',
      product.id,
      previousState,
      newState
    );
  };

  const handleRollback = (previousState: Product) => {
    setProduct(previousState);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Product Management with Rollback</h2>
        <RollbackButton
          entityType="product"
          entityId={product.id}
          onRollback={handleRollback}
        />
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <Input
              value={product.name}
              onChange={(e) => updateProduct('name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input
              value={product.category}
              onChange={(e) => updateProduct('category', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <Input
              type="number"
              value={product.price}
              onChange={(e) => updateProduct('price', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <Input
              type="number"
              value={product.stock}
              onChange={(e) => updateProduct('stock', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Current Product State:</h4>
          <pre className="text-sm">{JSON.stringify(product, null, 2)}</pre>
        </div>
      </Card>
    </div>
  );
};
