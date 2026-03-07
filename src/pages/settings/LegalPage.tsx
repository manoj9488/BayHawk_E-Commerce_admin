import React from 'react';
import { useState } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { Save, FileText, Edit, Eye, Plus, Calendar, Shield, Scale, RefreshCw, X } from 'lucide-react';

interface LegalDocument {
  id: string;
  title: string;
  type: 'privacy' | 'terms' | 'refund' | 'shipping' | 'cookie' | 'disclaimer' | 'custom';
  content: string;
  lastUpdated: string;
  version: string;
  isActive: boolean;
  isRequired: boolean;
}

export function LegalPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([
    {
      id: '1',
      title: 'Privacy Policy',
      type: 'privacy',
      content: 'This Privacy Policy describes how BAYHAWK collects, uses, and protects your personal information...',
      lastUpdated: '2024-01-15',
      version: '2.1',
      isActive: true,
      isRequired: true
    },
    {
      id: '2',
      title: 'Terms & Conditions',
      type: 'terms',
      content: 'By using our services, you agree to these terms and conditions...',
      lastUpdated: '2024-01-10',
      version: '1.8',
      isActive: true,
      isRequired: true
    },
    {
      id: '3',
      title: 'Refund Policy',
      type: 'refund',
      content: 'Our refund policy outlines the conditions under which refunds are processed...',
      lastUpdated: '2024-01-05',
      version: '1.3',
      isActive: true,
      isRequired: false
    },
    {
      id: '4',
      title: 'Shipping Policy',
      type: 'shipping',
      content: 'This policy covers our shipping procedures, delivery times, and related terms...',
      lastUpdated: '2023-12-20',
      version: '1.5',
      isActive: true,
      isRequired: false
    },
    {
      id: '5',
      title: 'Cookie Policy',
      type: 'cookie',
      content: 'This Cookie Policy explains how we use cookies and similar technologies...',
      lastUpdated: '2023-12-15',
      version: '1.2',
      isActive: false,
      isRequired: false
    }
  ]);

  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [complianceSettings, setComplianceSettings] = useState({
    gdprCompliance: true,
    ccpaCompliance: false,
    coppaCompliance: false,
    requireConsent: true,
    consentLogging: true,
    autoUpdateNotification: true
  });

  const documentTypes = [
    { value: 'privacy', label: 'Privacy Policy', icon: Shield, required: true },
    { value: 'terms', label: 'Terms & Conditions', icon: FileText, required: true },
    { value: 'refund', label: 'Refund Policy', icon: RefreshCw, required: false },
    { value: 'shipping', label: 'Shipping Policy', icon: FileText, required: false },
    { value: 'cookie', label: 'Cookie Policy', icon: FileText, required: false },
    { value: 'disclaimer', label: 'Disclaimer', icon: Scale, required: false },
    { value: 'custom', label: 'Custom Document', icon: FileText, required: false }
  ];

  const addNewDocument = () => {
    const newDocument: LegalDocument = {
      id: Date.now().toString(),
      title: 'New Legal Document',
      type: 'custom',
      content: '',
      lastUpdated: new Date().toISOString().split('T')[0],
      version: '1.0',
      isActive: false,
      isRequired: false
    };
    setDocuments([...documents, newDocument]);
    setSelectedDocument(newDocument);
    setIsEditing(true);
  };

  const updateDocument = (id: string, updates: Partial<LegalDocument>) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { 
        ...doc, 
        ...updates, 
        lastUpdated: new Date().toISOString().split('T')[0],
        version: updates.content ? incrementVersion(doc.version) : doc.version
      } : doc
    ));
  };

  const incrementVersion = (version: string): string => {
    const parts = version.split('.');
    const minor = parseInt(parts[1] || '0') + 1;
    return `${parts[0]}.${minor}`;
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const getDocumentIcon = (type: string) => {
    const docType = documentTypes.find(t => t.value === type);
    return docType?.icon || FileText;
  };

  const getStatusColor = (isActive: boolean, isRequired: boolean) => {
    if (!isActive && isRequired) return 'text-red-600 bg-red-50';
    if (isActive) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getStatusText = (isActive: boolean, isRequired: boolean) => {
    if (!isActive && isRequired) return 'Required - Inactive';
    if (isActive) return 'Active';
    return 'Inactive';
  };

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
          <Button className="w-full sm:w-auto">
            <Save className="mr-2 h-5 w-5" />
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
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
              {documents.filter(d => d.isActive).length}
            </div>
            <div className="text-xs sm:text-sm text-green-600 mt-1">Active Documents</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {documents.filter(d => d.isRequired && !d.isActive).length}
            </div>
            <div className="text-xs sm:text-sm text-red-600 mt-1">Missing Required</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              {documents.filter(d => {
                const daysSinceUpdate = Math.floor((Date.now() - new Date(d.lastUpdated).getTime()) / (1000 * 60 * 60 * 24));
                return daysSinceUpdate > 365;
              }).length}
            </div>
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

      {/* Legal Documents */}
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

        <div className="space-y-4">
          {documents.map((document) => {
            const DocumentIcon = getDocumentIcon(document.type);
            const statusColor = getStatusColor(document.isActive, document.isRequired);
            const statusText = getStatusText(document.isActive, document.isRequired);
            const daysSinceUpdate = Math.floor((Date.now() - new Date(document.lastUpdated).getTime()) / (1000 * 60 * 60 * 24));

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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor} whitespace-nowrap`}>
                      {statusText}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDocument(document)}
                      >
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDocument(document.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs sm:text-sm text-gray-600 line-clamp-2 flex-1">
                    {document.content.substring(0, 150)}...
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={document.isActive}
                      onChange={(e) => updateDocument(document.id, { isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>

                {daysSinceUpdate > 365 && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs sm:text-sm text-yellow-700">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    This document hasn't been updated in over a year. Consider reviewing for accuracy.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Compliance Settings */}
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
            { key: 'gdprCompliance', label: 'GDPR Compliance', desc: 'European General Data Protection Regulation compliance' },
            { key: 'ccpaCompliance', label: 'CCPA Compliance', desc: 'California Consumer Privacy Act compliance' },
            { key: 'coppaCompliance', label: 'COPPA Compliance', desc: 'Children\'s Online Privacy Protection Act compliance' },
            { key: 'requireConsent', label: 'Require User Consent', desc: 'Require explicit consent for data collection' },
            { key: 'consentLogging', label: 'Log Consent Records', desc: 'Keep records of user consent for legal purposes' },
            { key: 'autoUpdateNotification', label: 'Auto-Update Notifications', desc: 'Notify users when legal documents are updated' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs sm:text-sm">{setting.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={complianceSettings[setting.key as keyof typeof complianceSettings]}
                  onChange={(e) => setComplianceSettings({
                    ...complianceSettings,
                    [setting.key]: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Document Editor Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-3 sm:p-4">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => {
              setSelectedDocument(null);
              setIsEditing(false);
            }} />
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDocument(null);
                      setIsEditing(false);
                    }}
                  >
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
                    onChange={(e) => setSelectedDocument({
                      ...selectedDocument,
                      title: e.target.value
                    })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                    <select
                      value={selectedDocument.type}
                      disabled={!isEditing}
                      onChange={(e) => setSelectedDocument({
                        ...selectedDocument,
                        type: e.target.value as any
                      })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      {documentTypes.map(type => (
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
                    onChange={(e) => setSelectedDocument({
                      ...selectedDocument,
                      content: e.target.value
                    })}
                    placeholder="Enter the legal document content here..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDocument.isActive}
                      disabled={!isEditing}
                      onChange={(e) => setSelectedDocument({
                        ...selectedDocument,
                        isActive: e.target.checked
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Document is active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDocument.isRequired}
                      disabled={!isEditing || documentTypes.find(t => t.value === selectedDocument.type)?.required}
                      onChange={(e) => setSelectedDocument({
                        ...selectedDocument,
                        isRequired: e.target.checked
                      })}
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
                    <Button onClick={() => {
                      updateDocument(selectedDocument.id, selectedDocument);
                      setIsEditing(false);
                    }} className="w-full sm:w-auto">
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
