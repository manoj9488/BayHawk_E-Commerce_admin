import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '../../components/common';
import { Badge, Button, Card, Input, Select } from '../../components/ui';
import { SimpleModal } from '../../components/ui/SimpleModal';
import { supportBackend, type JobApplicationRecord } from '../../utils/supportBackend';

const statusOptions = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' },
];

export function JobApplicationsPage() {
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<JobApplicationRecord | null>(null);
  const [status, setStatus] = useState('submitted');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const result = await supportBackend.listJobApplications(
        search.trim() ? { search: search.trim() } : undefined
      );
      setApplications(result.items);
    } catch (error) {
      console.error('Failed to load job applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, [search]);

  const columns = useMemo(
    () => [
      { key: 'fullName', label: 'Candidate' },
      { key: 'email', label: 'Email' },
      {
        key: 'opening',
        label: 'Opening',
        render: (_value: unknown, item: JobApplicationRecord) => item.opening?.title || '-',
      },
      {
        key: 'status',
        label: 'Status',
        render: (value: unknown) => <Badge variant="info">{String(value)}</Badge>,
      },
      {
        key: 'submittedAt',
        label: 'Submitted',
        render: (value: unknown) =>
          value ? new Date(String(value)).toLocaleString() : '-',
      },
    ],
    []
  );

  const openDetails = (application: JobApplicationRecord) => {
    setSelected(application);
    setStatus(application.status || 'submitted');
    setNote(application.note || '');
  };

  const handleSave = async () => {
    if (!selected || saving) return;
    setSaving(true);

    try {
      const updated = await supportBackend.updateJobApplication(selected.id, {
        status,
        note,
      });
      setApplications((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      setSelected(updated);
    } catch (error) {
      console.error('Failed to update application:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <p className="text-sm text-gray-600">Review candidate applications and update statuses.</p>
        </div>
        <Button variant="secondary" onClick={loadApplications}>
          Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="sm:max-w-sm"
          />
          <Badge variant="info">{applications.length} applications</Badge>
        </div>
      </Card>

      <DataTable
        data={applications}
        columns={columns}
        loading={loading}
        emptyMessage="No job applications found"
        onView={openDetails}
      />

      <SimpleModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Application: ${selected.fullName}` : 'Application'}
      >
        {selected && (
          <div className="p-6 space-y-4 text-sm">
            <div className="space-y-1 text-gray-700">
              <p><span className="font-semibold">Email:</span> {selected.email}</p>
              {selected.phone && <p><span className="font-semibold">Phone:</span> {selected.phone}</p>}
              {selected.opening && (
                <p><span className="font-semibold">Opening:</span> {selected.opening.title}</p>
              )}
              <p><span className="font-semibold">Resume:</span> {selected.resumeUrl}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-2">Cover Letter</p>
              <p className="whitespace-pre-wrap text-gray-700">{selected.coverLetter}</p>
            </div>

            <Select
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              options={statusOptions}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Internal Note</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Close
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </SimpleModal>
    </div>
  );
}
