import type { ComponentProps } from 'react';
import { ManualOrderForm } from '../../components/features/orders/ManualOrderForm';
import { PreOrderForm } from '../../components/features/orders/PreOrderForm';
import { PageHeader } from '../../components/ui';
import { MANUAL_ORDER_CONFIGS, PRE_ORDER_CONFIGS } from './scopedOrderData';

type ManualOrderSubmitData = Parameters<ComponentProps<typeof ManualOrderForm>['onSubmit']>[0];
type PreOrderSubmitData = Parameters<ComponentProps<typeof PreOrderForm>['onSubmit']>[0];

function createSubmitHandler<T>(scope: 'Hub' | 'Store', flow: 'order' | 'pre-order') {
  return async (data: T) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`${scope} ${flow} created:`, data);
      alert(`${scope} ${flow === 'order' ? 'Order' : 'Pre-order'} created successfully!`);
    } catch (error) {
      console.error(`Failed to create ${scope.toLowerCase()} ${flow}:`, error);
      alert(`Failed to create ${scope.toLowerCase()} ${flow}. Please try again.`);
    }
  };
}

function ScopedManualOrderPage({ scopeKey }: { scopeKey: 'hub' | 'store' }) {
  const config = MANUAL_ORDER_CONFIGS[scopeKey];
  const handleOrderSubmit: (data: ManualOrderSubmitData) => Promise<void> = createSubmitHandler(config.scope, 'order');

  return (
    <div className="space-y-6">
      <PageHeader title={config.title} description={config.description} />
      <ManualOrderForm
        moduleType={config.moduleType}
        products={config.products}
        hubs={config.hubs}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
}

function ScopedPreOrderPage({ scopeKey }: { scopeKey: 'hub' | 'store' }) {
  const config = PRE_ORDER_CONFIGS[scopeKey];
  const handlePreOrderSubmit: (data: PreOrderSubmitData) => Promise<void> = createSubmitHandler(config.scope, 'pre-order');

  return (
    <div className="space-y-6">
      <PageHeader title={config.title} description={config.description} />
      <PreOrderForm
        moduleType={config.moduleType}
        products={config.products}
        hubs={config.hubs}
        onSubmit={handlePreOrderSubmit}
      />
    </div>
  );
}

export function HubManualOrderPage() {
  return <ScopedManualOrderPage scopeKey="hub" />;
}

export function StoreManualOrderPage() {
  return <ScopedManualOrderPage scopeKey="store" />;
}

export function HubPreOrderPage() {
  return <ScopedPreOrderPage scopeKey="hub" />;
}

export function StorePreOrderPage() {
  return <ScopedPreOrderPage scopeKey="store" />;
}
