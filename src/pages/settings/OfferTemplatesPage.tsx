import { useState } from 'react';
import { Card, Button } from '../../components/ui';
import { Edit2, Image as ImageIcon, Save } from 'lucide-react';

interface OfferTemplate {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  type: 'carousel' | 'other';
  order: number;
}

export function OfferTemplatesPage() {
  const [carouselTemplates, setCarouselTemplates] = useState<OfferTemplate[]>([
    { id: '1', title: 'Summer Sale', description: 'Up to 50% off', imageUrl: '', linkUrl: '', isActive: true, type: 'carousel', order: 1 },
    { id: '2', title: 'Fresh Arrivals', description: 'New products daily', imageUrl: '', linkUrl: '', isActive: true, type: 'carousel', order: 2 },
    { id: '3', title: 'Weekend Special', description: 'Limited time offer', imageUrl: '', linkUrl: '', isActive: true, type: 'carousel', order: 3 },
  ]);

  const [otherTemplates, setOtherTemplates] = useState<OfferTemplate[]>([
    { id: '4', title: 'Flash Deal', description: 'Today only', imageUrl: '', linkUrl: '', isActive: true, type: 'other', order: 1 },
    { id: '5', title: 'Bundle Offer', description: 'Buy more save more', imageUrl: '', linkUrl: '', isActive: true, type: 'other', order: 2 },
  ]);

  const [editingTemplate, setEditingTemplate] = useState<OfferTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (template: OfferTemplate) => {
    setEditingTemplate({ ...template });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingTemplate) return;

    if (editingTemplate.type === 'carousel') {
      setCarouselTemplates(prev =>
        prev.map(t => t.id === editingTemplate.id ? editingTemplate : t)
      );
    } else {
      setOtherTemplates(prev =>
        prev.map(t => t.id === editingTemplate.id ? editingTemplate : t)
      );
    }

    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingTemplate) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingTemplate({ ...editingTemplate, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Offer Templates</h1>
          <p className="text-gray-600">Manage carousel and promotional offer templates</p>
        </div>
      </div>

      {/* Carousel Templates */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Carousel Offer Templates (3)</h2>
          <p className="text-sm text-gray-600">These templates appear in the main carousel on user page</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {carouselTemplates.map((template) => (
            <div key={template.id} className="border rounded-lg p-4 space-y-3">
              <div className="aspect-video bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                {template.imageUrl ? (
                  <img src={template.imageUrl} alt={template.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{template.title}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEdit(template)}
                  className="flex-1"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Other Offer Templates */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Other Offer Templates (2)</h2>
          <p className="text-sm text-gray-600">Additional promotional templates displayed on user page</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {otherTemplates.map((template) => (
            <div key={template.id} className="border rounded-lg p-4 space-y-3">
              <div className="aspect-video bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                {template.imageUrl ? (
                  <img src={template.imageUrl} alt={template.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{template.title}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEdit(template)}
                  className="flex-1"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Modal */}
      {isModalOpen && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Offer Template</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={editingTemplate.title}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter offer title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Enter offer description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link URL</label>
                <input
                  type="url"
                  value={editingTemplate.linkUrl}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, linkUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://example.com/offer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Offer Image *</label>
                <div className="space-y-2">
                  {editingTemplate.imageUrl && (
                    <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                      <img src={editingTemplate.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500">Recommended: 1200x600px for carousel, 800x400px for other offers</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingTemplate.isActive}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, isActive: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium">Active (Display on user page)</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTemplate(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
