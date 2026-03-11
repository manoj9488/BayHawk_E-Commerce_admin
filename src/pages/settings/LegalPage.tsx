import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { Save, FileText, Edit, Eye, Plus, Calendar, Shield, Scale, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  settingsBackend,
  type LegalDocumentRecord,
  type LegalSettingsPayload,
} from '../../utils/settingsBackend';

const documentTypes = [
  { value: 'privacy', label: 'Privacy Policy', icon: Shield, required: true },
  { value: 'terms', label: 'Terms & Conditions', icon: FileText, required: true },
  { value: 'refund', label: 'Refund Policy', icon: RefreshCw, required: false },
  { value: 'shipping', label: 'Shipping Policy', icon: FileText, required: false },
  { value: 'cookie', label: 'Cookie Policy', icon: FileText, required: false },
  { value: 'disclaimer', label: 'Disclaimer', icon: Scale, required: false },
  { value: 'custom', label: 'Custom Document', icon: FileText, required: false },
] as const;

const defaultComplianceSettings: LegalSettingsPayload['complianceSettings'] = {
  gdprCompliance: true,
  ccpaCompliance: false,
  coppaCompliance: false,
  requireConsent: true,
  consentLogging: true,
  autoUpdateNotification: true,
};

function getDocumentIcon(type: LegalDocumentRecord['type']) {
  const documentType = documentTypes.find((item) => item.value === type);
  return documentType?.icon || FileText;
}

export function LegalPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<LegalDocumentRecord[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<LegalDocumentRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [complianceSettings, setComplianceSettings] = useState(defaultComplianceSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadSettings();
  }, [user?.loginType, user?.hubId, user?.storeId]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const payload = await settingsBackend.loadLegal(user);
      setDocuments(payload.documents);
      setComplianceSettings(payload.complianceSettings);
    } catch (error) {
      console.error('Failed to load legal settings:', error);
      setDocuments([]);
      setComplianceSettings(defaultComplianceSettings);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const payload = await settingsBackend.saveLegal(
        {
          documents,
          complianceSettings,
        },
        user
      );
      setDocuments(payload.documents);
      setComplianceSettings(payload.complianceSettings);
      alert('Legal settings saved successfully.');
    } catch (error) {
      console.error('Failed to save legal settings:', error);
      alert('Failed to save legal settings.');
    } finally {
      setSaving(false);
    }
  };

  const addNewDocument = () => {
    const newDocument: LegalDocumentRecord = {
      id: `draft-legal-${Date.now()}`,
      title: 'New Legal Document',
      type: 'custom',
      content: '',
      lastUpdated: new Date().toISOString().slice(0, 10),
      version: '1.0',
      isActive: false,
      isRequired: false,
    };
    setDocuments((current) => [...current, newDocument]);
    setSelectedDocument(newDocument);
    setIsEditing(true);
  };

  const updateDocument = (documentId: string, updates: Partial<LegalDocumentRecord>) => {
    setDocuments((current) =>
      current.map((document) =>
        document.id === documentId
          ? {
              ...document,
              ...updates,
              lastUpdated: new Date().toISOString().slice(0, 10),
            }
          : document
      )
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((current) => current.filter((document) => document.id !== id));
  };

  const needUpdatesCount = documents.filter((document) => {
    const lastUpdated = new Date(document.lastUpdated).getTime();
    return Date.now() - lastUpdated > 365 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Legal Documents</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage legal documents and compliance settings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={addNewDocument} className="w-full sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Add Document
          </Button>
          <Button className="w-full sm:w-auto" onClick={saveSettings} disabled={saving}>
            <Save className="mr-2 h-5 w-5" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-blue-50 p-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Compliance Status</h2>
            <p className="text-xs sm:text-sm text-gray-600">Legal compliance and document status overview</p>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {documents.filter((document) => document.isActive).length}
            </div>
            <div className="text-xs sm:text-sm text-green-600 mt-1">Active Documents</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {documents.filter((document) => document.isRequired && !document.isActive).length}
            </div>
            <div className="text-xs sm:text-sm text-red-600 mt-1">Missing Required</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{needUpdatesCount}</div>
            <div className="text-xs sm:text-sm text-yellow-600 mt-1">Need Updates</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {Object.values(complianceSettings).filter(Boolean).length}
            </div>
            <div className="text-xs sm:text-sm text-blue-600 mt-1">Compliance Rules</div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-green-50 p-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Legal Documents</h2>
            <p className="text-xs sm:text-sm text-gray-600">Manage your legal documents and policies</p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading legal documents...</p>
        ) : (
          <div className="space-y-4">
            {documents.map((document) => {
              const DocumentIcon = getDocumentIcon(document.type);
              const daysSinceUpdate = Math.floor(
                (Date.now() - new Date(document.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={document.id} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <DocumentIcon className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base truncate">{document.title}</h3>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                          <span>Version {document.version}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Updated {daysSinceUpdate}d ago</span>
                          {document.isRequired && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-red-600 font-medium">Required</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          document.isActive ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'
                        }`}
                      >
                        {document.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(document)}>
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(document);
                            setIsEditing(true);
                          }}
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        {!document.isRequired && (
                          <Button variant="ghost" size="sm" onClick={() => deleteDocument(document.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-xs sm:text-sm text-gray-600 line-clamp-2 flex-1">
                      {document.content}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={document.isActive}
                        onChange={(event) => updateDocument(document.id, { isActive: event.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-purple-50 p-2">
            <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Compliance Settings</h2>
            <p className="text-xs sm:text-sm text-gray-600">Configure legal compliance requirements</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {[
            { key: 'gdprCompliance', label: 'GDPR Compliance' },
            { key: 'ccpaCompliance', label: 'CCPA Compliance' },
            { key: 'coppaCompliance', label: 'COPPA Compliance' },
            { key: 'requireConsent', label: 'Require User Consent' },
            { key: 'consentLogging', label: 'Log Consent Records' },
            { key: 'autoUpdateNotification', label: 'Auto-Update Notifications' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
              <p className="font-medium text-xs sm:text-sm">{setting.label}</p>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={complianceSettings[setting.key as keyof typeof complianceSettings]}
                  onChange={(event) =>
                    setComplianceSettings({
                      ...complianceSettings,
                      [setting.key]: event.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {selectedDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-3 sm:p-4">
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => {
                setSelectedDocument(null);
                setIsEditing(false);
              }}
            />
            <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="rounded-lg bg-gray-100 p-2 flex-shrink-0">
                    {React.createElement(getDocumentIcon(selectedDocument.type), { className: "h-4 w-4 sm:h-5 sm:w-5 text-gray-600" })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold truncate">
                      {isEditing ? 'Edit' : 'View'}: {selectedDocument.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Version {selectedDocument.version} • Last updated: {selectedDocument.lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!isEditing && (
                    <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedDocument(null);
                    setIsEditing(false);
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <Input
                    label="Document Title"
                    value={selectedDocument.title}
                    disabled={!isEditing}
                    onChange={(event) => setSelectedDocument({ ...selectedDocument, title: event.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                    <select
                      value={selectedDocument.type}
                      disabled={!isEditing}
                      onChange={(event) =>
                        setSelectedDocument({
                          ...selectedDocument,
                          type: event.target.value as LegalDocumentRecord['type'],
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      {documentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label} {type.required ? '(Required)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Content</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    rows={15}
                    value={selectedDocument.content}
                    disabled={!isEditing}
                    onChange={(event) => setSelectedDocument({ ...selectedDocument, content: event.target.value })}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDocument.isActive}
                      disabled={!isEditing}
                      onChange={(event) =>
                        setSelectedDocument({ ...selectedDocument, isActive: event.target.checked })
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Document is active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDocument.isRequired}
                      disabled={!isEditing || documentTypes.find((type) => type.value === selectedDocument.type)?.required}
                      onChange={(event) =>
                        setSelectedDocument({ ...selectedDocument, isRequired: event.target.checked })
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Required document</span>
                  </label>
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
                    <Button variant="secondary" onClick={() => setIsEditing(false)} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        updateDocument(selectedDocument.id, selectedDocument);
                        setIsEditing(false);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Document
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
