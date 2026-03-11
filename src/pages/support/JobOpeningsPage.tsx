import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '../../components/common';
import { Button, Card, Input, Badge } from '../../components/ui';
import { SimpleModal } from '../../components/ui/SimpleModal';
import { supportBackend, type JobOpeningRecord } from '../../utils/supportBackend';

const emptyForm = {
  title: '',
  department: '',
  location: '',
  employmentType: 'Full-time',
  description: '',
  remoteOption: '',
  displayOrder: 0,
  isActive: true,
};

export function JobOpeningsPage() {
  const [openings, setOpenings] = useState<JobOpeningRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<JobOpeningRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const loadOpenings = async () => {
    try {
      setLoading(true);
      const result = await supportBackend.listJobOpenings();
      setOpenings(result.items);
    } catch (error) {
      console.error('Failed to load job openings:', error);
      setOpenings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOpenings();
  }, []);

  const columns = useMemo(
    () => [
      { key: 'title', label: 'Role' },
      { key: 'department', label: 'Department' },
      { key: 'location', label: 'Location' },
      { key: 'employmentType', label: 'Type' },
      {
        key: 'isActive',
        label: 'Status',
        render: (value: unknown) => (
          <Badge variant={value ? 'success' : 'warning'}>{value ? 'Active' : 'Inactive'}</Badge>
        ),
      },
    ],
    []
  );

  const openCreate = () => {
    setSelected(null);
    setFormState({ ...emptyForm });
    setIsModalOpen(true);
  };

  const openEdit = (opening: JobOpeningRecord) => {
    setSelected(opening);
    setFormState({
      title: opening.title,
      department: opening.department,
      location: opening.location,
      employmentType: opening.employmentType,
      description: opening.description,
      remoteOption: opening.remoteOption || '',
      displayOrder: opening.displayOrder || 0,
      isActive: opening.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      if (selected) {
        await supportBackend.updateJobOpening(selected.id, {
          ...formState,
          displayOrder: Number(formState.displayOrder) || 0,
        });
      } else {
        await supportBackend.createJobOpening({
          ...formState,
          displayOrder: Number(formState.displayOrder) || 0,
        });
      }
      await loadOpenings();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save job opening:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Openings</h1>
          <p className="text-sm text-gray-600">Manage careers listings visible on the site.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={loadOpenings}>
            Refresh
          </Button>
          <Button onClick={openCreate}>Add Opening</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="info">{openings.length} openings</Badge>
        </div>
      </Card>

      <DataTable
        data={openings}
        columns={columns}
        loading={loading}
        emptyMessage="No job openings available"
        onEdit={openEdit}
      />

      <SimpleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selected ? 'Edit Job Opening' : 'Create Job Opening'}
      >
        <div className="p-6 space-y-4">
          <Input
            label="Title"
            value={formState.title}
            onChange={(event) => setFormState({ ...formState, title: event.target.value })}
          />
          <Input
            label="Department"
            value={formState.department}
            onChange={(event) => setFormState({ ...formState, department: event.target.value })}
          />
          <Input
            label="Location"
            value={formState.location}
            onChange={(event) => setFormState({ ...formState, location: event.target.value })}
          />
          <Input
            label="Employment Type"
            value={formState.employmentType}
            onChange={(event) => setFormState({ ...formState, employmentType: event.target.value })}
          />
          <Input
            label="Remote Option"
            value={formState.remoteOption}
            onChange={(event) => setFormState({ ...formState, remoteOption: event.target.value })}
          />
          <Input
            label="Display Order"
            type="number"
            value={formState.displayOrder}
            onChange={(event) =>
              setFormState({ ...formState, displayOrder: Number(event.target.value) })
            }
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900"
              rows={4}
              value={formState.description}
              onChange={(event) => setFormState({ ...formState, description: event.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formState.isActive}
              onChange={(event) => setFormState({ ...formState, isActive: event.target.checked })}
            />
            Active listing
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Opening'}
            </Button>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
}
