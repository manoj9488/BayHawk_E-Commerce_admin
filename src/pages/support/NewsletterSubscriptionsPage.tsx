import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '../../components/common';
import { Badge, Button, Card, Input } from '../../components/ui';
import { supportBackend, type NewsletterSubscriptionRecord } from '../../utils/supportBackend';

export function NewsletterSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscriptionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const result = await supportBackend.listNewsletterSubscriptions(
        search.trim() ? { search: search.trim() } : undefined
      );
      setSubscriptions(result.items);
    } catch (error) {
      console.error('Failed to load newsletter subscriptions:', error);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSubscriptions();
  }, [search]);

  const columns = useMemo(
    () => [
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' },
      {
        key: 'subscribedAt',
        label: 'Subscribed',
        render: (value: unknown) =>
          value ? new Date(String(value)).toLocaleString() : '-',
      },
      {
        key: 'unsubscribedAt',
        label: 'Unsubscribed',
        render: (value: unknown) =>
          value ? new Date(String(value)).toLocaleString() : '-',
      },
    ],
    []
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Newsletter Subscriptions</h1>
          <p className="text-sm text-gray-600">Monitor newsletter subscribers and status.</p>
        </div>
        <Button variant="secondary" onClick={loadSubscriptions}>
          Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search by email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="sm:max-w-sm"
          />
          <Badge variant="info">{subscriptions.length} subscriptions</Badge>
        </div>
      </Card>

      <DataTable
        data={subscriptions}
        columns={columns}
        loading={loading}
        emptyMessage="No newsletter subscriptions found"
      />
    </div>
  );
}
