import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '../../components/common';
import { Button, Card, Input, Badge } from '../../components/ui';
import { SimpleModal } from '../../components/ui/SimpleModal';
import { supportBackend, type ContactMessageRecord } from '../../utils/supportBackend';

export function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ContactMessageRecord | null>(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const result = await supportBackend.listContactMessages(
        search.trim() ? { search: search.trim() } : undefined
      );
      setMessages(result.items);
    } catch (error) {
      console.error('Failed to load contact messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMessages();
  }, [search]);

  const columns = useMemo(
    () => [
      { key: 'fullName', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'subject', label: 'Subject' },
      {
        key: 'submittedAt',
        label: 'Submitted',
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
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <p className="text-sm text-gray-600">View and respond to customer inquiries.</p>
        </div>
        <Button variant="secondary" onClick={loadMessages}>
          Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search by name, email, or subject"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="sm:max-w-sm"
          />
          <Badge variant="info">{messages.length} messages</Badge>
        </div>
      </Card>

      <DataTable
        data={messages}
        columns={columns}
        loading={loading}
        emptyMessage="No contact messages found"
        onView={(item) => setSelected(item)}
      />

      <SimpleModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Message from ${selected.fullName}` : 'Message'}
      >
        {selected && (
          <div className="p-6 space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-900">Contact Details</p>
              <p>Email: {selected.email}</p>
              {selected.phone && <p>Phone: {selected.phone}</p>}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Subject</p>
              <p>{selected.subject}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Message</p>
              <p className="whitespace-pre-wrap">{selected.message}</p>
            </div>
          </div>
        )}
      </SimpleModal>
    </div>
  );
}
