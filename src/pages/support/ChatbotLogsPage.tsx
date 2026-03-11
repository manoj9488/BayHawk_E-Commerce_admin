import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '../../components/common';
import { Badge, Button, Card, Input } from '../../components/ui';
import { supportBackend, type ChatbotMessageRecord } from '../../utils/supportBackend';

export function ChatbotLogsPage() {
  const [messages, setMessages] = useState<ChatbotMessageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadMessages = async () => {
    try {
      setLoading(true);
      const params = search.trim() ? { guestToken: search.trim() } : undefined;
      const result = await supportBackend.listChatbotMessages(params);
      setMessages(result.items);
    } catch (error) {
      console.error('Failed to load chatbot logs:', error);
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
      { key: 'senderType', label: 'Sender' },
      { key: 'messageText', label: 'Message' },
      { key: 'guestToken', label: 'Guest Token' },
      {
        key: 'sentAt',
        label: 'Sent At',
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
          <h1 className="text-2xl font-bold">Chatbot Logs</h1>
          <p className="text-sm text-gray-600">Review chat interactions and customer messages.</p>
        </div>
        <Button variant="secondary" onClick={loadMessages}>
          Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Filter by guest token"
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
        emptyMessage="No chatbot messages found"
      />
    </div>
  );
}
