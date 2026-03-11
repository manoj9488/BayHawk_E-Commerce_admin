import { useEffect, useState } from 'react';
import { Card, Button, Select } from '../../components/ui';
import { Upload, Play, Trash2, Calendar, Settings, Eye } from 'lucide-react';
import { settingsBackend, fileToDataUrl, type AdvertisementRecord } from '../../utils/settingsBackend';

export function AdvertisementPage() {
  const [ads, setAds] = useState<AdvertisementRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState<'festival' | 'regular' | 'seasonal'>('regular');
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    void loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);
      const payload = await settingsBackend.loadAdvertisements();
      setAds(payload.ads);
    } catch (error) {
      console.error('Failed to load advertisements:', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const saveAds = async (nextAds = ads) => {
    try {
      setSaving(true);
      const payload = await settingsBackend.saveAdvertisements({ ads: nextAds });
      setAds(payload.ads);
      alert('Advertisement settings saved successfully.');
    } catch (error) {
      console.error('Failed to save advertisements:', error);
      alert('Failed to save advertisement settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setUploadingVideo(true);
        const dataUrl = await fileToDataUrl(file);
        
        const newAd: AdvertisementRecord = {
          id: `draft-ad-${Date.now()}`,
          title: `New ${selectedType} Ad`,
          type: selectedType,
          videoUrl: dataUrl, // Backend will resolve this Data URL to Cloudinary URL
          isActive: false,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        
        const nextAds = [...ads, newAd];
        setAds(nextAds);
        // We don't auto-save here, user must click "Save All Changes" or we can auto-save if preferred.
        // Let's match the pattern of other settings pages where they have a "Save All" button.
      } catch (error) {
        console.error('Failed to process video file:', error);
        alert('Failed to process video file.');
      } finally {
        setUploadingVideo(false);
      }
    }
  };

  const toggleAdStatus = (id: string) => {
    const nextAds = ads.map(ad => 
      ad.id === id ? { ...ad, isActive: !ad.isActive } : { ...ad, isActive: false }
    );
    setAds(nextAds);
  };

  const deleteAd = (id: string) => {
    const nextAds = ads.filter(ad => ad.id !== id);
    setAds(nextAds);
  };

  const activeAd = ads.find(ad => ad.isActive);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Advertisement Management</h1>
          <p className="text-gray-600">Manage video advertisements for customer app</p>
        </div>
        <Button onClick={() => void saveAds()} disabled={saving || loading}>
          <Play className="mr-2 h-5 w-5" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      {loading ? (
        <Card>
          <p className="text-sm text-gray-500">Loading advertisements...</p>
        </Card>
      ) : (
        <>
          {/* Current Active Ad Preview */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Current Active Advertisement</h2>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Live on Customer App</span>
              </div>
            </div>
            
            {activeAd ? (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden relative max-w-[200px] mx-auto">
                    <video 
                      key={activeAd.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                    >
                      <source src={activeAd.videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      LIVE
                    </div>
                  </div>
                </div>
                <div className="lg:w-2/3">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{activeAd.title}</h3>
                      <p className="text-sm text-gray-600 capitalize">{activeAd.type} Advertisement</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Upload Date</label>
                        <p className="text-sm text-gray-600">{activeAd.uploadDate}</p>
                      </div>
                      {activeAd.schedule && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Schedule</label>
                          <p className="text-sm text-gray-600">
                            {activeAd.schedule.startDate} to {activeAd.schedule.endDate}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No active advertisement</p>
                <p className="text-sm text-gray-400">Upload and activate an ad to display on customer app</p>
              </div>
            )}
          </Card>

          {/* Upload New Advertisement */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Upload New Advertisement</h2>
            
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Advertisement Type
                  </label>
                  <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as any)}
                    options={[
                      { value: 'regular', label: 'Regular Advertisement' },
                      { value: 'festival', label: 'Festival Special' },
                      { value: 'seasonal', label: 'Seasonal Offer' }
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Upload (9:16 Aspect Ratio)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                    disabled={uploadingVideo}
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadingVideo ? 'Processing...' : 'Click to upload video or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 9:16 aspect ratio, MP4 format, max 50MB
                    </p>
                  </label>
                </div>
              </div>

              {selectedType === 'festival' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Advertisement Library */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Advertisement Library</h2>
              <span className="text-sm text-gray-500">{ads.length} total ads</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ads.map((ad) => (
                <div key={ad.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden relative mb-3 max-w-[120px] mx-auto">
                    <video 
                      className="w-full h-full object-cover"
                    >
                      <source src={ad.videoUrl} type="video/mp4" />
                    </video>
                    {ad.isActive && (
                      <div className="absolute top-1 right-1 bg-green-500 text-white px-1 py-0.5 rounded text-xs">
                        ACTIVE
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">{ad.title}</h3>
                    <p className="text-xs text-gray-500 capitalize">{ad.type}</p>
                    <p className="text-xs text-gray-400">Uploaded: {ad.uploadDate}</p>
                    
                    {ad.schedule && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Calendar className="h-3 w-3" />
                        <span>Scheduled</span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant={ad.isActive ? "secondary" : "primary"}
                        onClick={() => toggleAdStatus(ad.id)}
                        className="flex-1 text-xs"
                      >
                        {ad.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => deleteAd(ad.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Advertisement Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Advertisement Guidelines</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Video format: MP4, maximum 50MB file size</li>
              <li>• Aspect ratio: 9:16 (vertical format for mobile)</li>
              <li>• Duration: 15-30 seconds recommended</li>
              <li>• Festival ads can be scheduled for specific date ranges</li>
              <li>• Only one advertisement can be active at a time</li>
              <li>• Regular ads display until manually changed</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
