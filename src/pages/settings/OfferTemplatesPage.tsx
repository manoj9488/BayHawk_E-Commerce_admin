import { useEffect, useState } from 'react';
import { Card, Button } from '../../components/ui';
import { Edit2, Image as ImageIcon, Save, Plus, Trash2 } from 'lucide-react';
import { settingsBackend, fileToDataUrl, type OfferTemplateRecord } from '../../utils/settingsBackend';

export function OfferTemplatesPage() {
  const [carouselTemplates, setCarouselTemplates] = useState<OfferTemplateRecord[]>([]);
  const [otherTemplates, setOtherTemplates] = useState<OfferTemplateRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<OfferTemplateRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    void loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const payload = await settingsBackend.loadOfferTemplates();
      setCarouselTemplates(payload.carouselTemplates);
      setOtherTemplates(payload.otherTemplates);
    } catch (error) {
      console.error('Failed to load offer templates:', error);
      setCarouselTemplates([]);
      setOtherTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const payload = await settingsBackend.saveOfferTemplates({
        carouselTemplates,
        otherTemplates,
      });
      setCarouselTemplates(payload.carouselTemplates);
      setOtherTemplates(payload.otherTemplates);
      alert('Offer templates saved successfully.');
    } catch (error) {
      console.error('Failed to save offer templates:', error);
      alert('Failed to save offer templates.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (template: OfferTemplateRecord) => {
    setEditingTemplate({ ...template });
    setIsModalOpen(true);
  };

  const handleApplyEdit = () => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingTemplate) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setEditingTemplate({ ...editingTemplate, imageUrl: dataUrl });
      } catch (error) {
        console.error('Failed to process image:', error);
        alert('Failed to process image.');
      }
    }
  };

  const addNewTemplate = (type: 'carousel' | 'other') => {
    const newTemplate: OfferTemplateRecord = {
      id: `draft-template-${Date.now()}`,
      title: 'New Offer',
      description: '',
      imageUrl: '',
      linkUrl: '',
      isActive: true,
      type,
      order: (type === 'carousel' ? carouselTemplates : otherTemplates).length + 1,
    };
    
    if (type === 'carousel') {
      setCarouselTemplates([...carouselTemplates, newTemplate]);
    } else {
      setOtherTemplates([...otherTemplates, newTemplate]);
    }
    
    handleEdit(newTemplate);
  };

  const deleteTemplate = (id: string, type: 'carousel' | 'other') => {
    if (type === 'carousel') {
      setCarouselTemplates(carouselTemplates.filter(t => t.id !== id));
    } else {
      setOtherTemplates(otherTemplates.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Offer Templates</h1>
          <p className="text-gray-600">Manage carousel and promotional offer templates</p>
        </div>
        <Button onClick={handleSaveAll} disabled={saving || loading}>
          <Save className="mr-2 h-5 w-5" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      {loading ? (
        <Card>
          <p className="text-sm text-gray-500">Loading templates...</p>
        </Card>
      ) : (
        <>
          {/* Carousel Templates */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Carousel Offer Templates ({carouselTemplates.length})</h2>
                <p className="text-sm text-gray-600">These templates appear in the main carousel on user page</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => addNewTemplate('carousel')}>
                <Plus className="h-4 w-4 mr-1" />
                Add Carousel
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {carouselTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 space-y-3 relative group">
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center overflow-hidden border">
                    {template.imageUrl ? (
                      <img src={template.imageUrl} alt={template.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold truncate">{template.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    {!template.isActive && <span className="text-[10px] text-red-500 font-bold uppercase">Inactive</span>}
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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTemplate(template.id, 'carousel')}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Other Offer Templates */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Other Offer Templates ({otherTemplates.length})</h2>
                <p className="text-sm text-gray-600">Additional promotional templates displayed on user page</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => addNewTemplate('other')}>
                <Plus className="h-4 w-4 mr-1" />
                Add Template
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {otherTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 space-y-3">
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center overflow-hidden border">
                    {template.imageUrl ? (
                      <img src={template.imageUrl} alt={template.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold truncate">{template.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    {!template.isActive && <span className="text-[10px] text-red-500 font-bold uppercase">Inactive</span>}
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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTemplate(template.id, 'other')}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Edit Modal */}
      {isModalOpen && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Offer Template</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={editingTemplate.title}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter offer title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/offer"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select 
                    value={editingTemplate.type}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="carousel">Carousel</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingTemplate.order}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Offer Image *</label>
                <div className="space-y-2">
                  {editingTemplate.imageUrl && (
                    <div className="aspect-video bg-gray-100 rounded overflow-hidden border">
                      <img src={editingTemplate.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
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
              <Button onClick={handleApplyEdit} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Apply Changes
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
