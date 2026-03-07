import { useState, useRef } from 'react';
import { X, Plus, Video, Image, Link, Play, ExternalLink } from 'lucide-react';
import { Button, Input } from './index';

interface MediaItem {
  id: string;
  type: 'image' | 'video-url' | 'video-file';
  url: string;
  name: string;
  thumbnail?: string;
}

interface UnifiedMediaUploadProps {
  mediaItems: MediaItem[];
  onMediaChange: (items: MediaItem[]) => void;
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  maxImages?: number;
  maxVideos?: number;
  className?: string;
}

export function UnifiedMediaUpload({ 
  mediaItems, 
  onMediaChange, 
  videoUrl,
  onVideoUrlChange,
  maxImages = 6,
  maxVideos = 3,
  className = "" 
}: UnifiedMediaUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [urlError, setUrlError] = useState('');

  const validateVideoUrl = (url: string) => {
    if (!url) return '';
    
    try {
      new URL(url);
    } catch {
      return 'Please enter a valid URL';
    }

    const videoPatterns = [
      /youtube\.com\/watch\?v=|youtu\.be\//,
      /vimeo\.com\//,
      /dailymotion\.com\//,
      /facebook\.com\/.*\/videos\//,
      /instagram\.com\/p\//,
      /\.mp4$|\.webm$|\.ogg$/i
    ];

    const isValidVideo = videoPatterns.some(pattern => pattern.test(url));
    if (!isValidVideo) {
      return 'Please enter a valid video URL (YouTube, Vimeo, etc.)';
    }

    return '';
  };

  const handleVideoUrlChange = (url: string) => {
    onVideoUrlChange(url);
    const error = validateVideoUrl(url);
    setUrlError(error);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      const currentImages = mediaItems.filter(item => item.type === 'image');
      
      if (currentImages.length + imageFiles.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        return;
      }

      const newImages = imageFiles.map(file => ({
        id: Date.now().toString() + Math.random(),
        type: 'image' as const,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      
      onMediaChange([...mediaItems, ...newImages]);
    }
    
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const videoFiles = files.filter(file => file.type.startsWith('video/'));
      const currentVideos = mediaItems.filter(item => item.type === 'video-file');
      
      if (currentVideos.length + videoFiles.length > maxVideos) {
        alert(`Maximum ${maxVideos} video files allowed`);
        return;
      }

      const newVideos = videoFiles.map(file => ({
        id: Date.now().toString() + Math.random(),
        type: 'video-file' as const,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      
      onMediaChange([...mediaItems, ...newVideos]);
    }
    
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeMediaItem = (id: string) => {
    const updatedItems = mediaItems.filter(item => item.id !== id);
    onMediaChange(updatedItems);
  };

  const getVideoThumbnail = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
    }
    
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
    }
    
    return null;
  };

  const images = mediaItems.filter(item => item.type === 'image');
  const videoFiles = mediaItems.filter(item => item.type === 'video-file');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Video URL Section - Required */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipe Video URL (Optional)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="url"
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            value={videoUrl}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            className={`pl-10 ${urlError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            
          />
          {videoUrl && !urlError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <a 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
                title="Open video in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
        {urlError && (
          <p className="mt-1 text-sm text-red-600">{urlError}</p>
        )}
        {videoUrl && !urlError && (
          <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
            <Play className="h-3 w-3" />
            Valid video URL detected
          </p>
        )}
      </div>

      {/* Media Upload Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Recipe Media</h4>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              disabled={images.length >= maxImages}
              className="text-xs"
            >
              <Image className="h-3 w-3 mr-1" />
              Add Images ({images.length}/{maxImages})
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => videoInputRef.current?.click()}
              disabled={videoFiles.length >= maxVideos}
              className="text-xs"
            >
              <Video className="h-3 w-3 mr-1" />
              Add Videos ({videoFiles.length}/{maxVideos})
            </Button>
          </div>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoUpload}
          className="hidden"
        />

        {/* Media Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {/* Main Video URL Preview */}
          {videoUrl && !urlError && (
            <div className="relative group">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden border-2 border-blue-300">
                {getVideoThumbnail(videoUrl) ? (
                  <img 
                    src={getVideoThumbnail(videoUrl)!} 
                    alt="Main video"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-6 w-6 text-blue-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-4 w-4 text-white" />
                </div>
                <div className="absolute top-1 left-1">
                  <span className="text-xs px-1.5 py-0.5 rounded text-white font-medium bg-blue-500">
                    MAIN
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate">Main Video</p>
            </div>
          )}

          {/* Media Items */}
          {mediaItems.map((item) => (
            <div key={item.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-100">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                )}
                
                {item.type !== 'image' && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className="absolute top-1 left-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded text-white font-medium ${
                    item.type === 'image' ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    {item.type === 'image' ? 'IMG' : 'VID'}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mt-1 truncate" title={item.name}>
                {item.name}
              </p>
              
              <button
                type="button"
                onClick={() => removeMediaItem(item.id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                title="Remove media"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Add More Slots */}
          {images.length + videoFiles.length < maxImages + maxVideos && (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Plus className="h-4 w-4 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Add Media</span>
            </div>
          )}
        </div>

        {/* Media Summary */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t">
          <div className="flex gap-4">
            <span>Images: {images.length}/{maxImages}</span>
            <span>Videos: {videoFiles.length}/{maxVideos}</span>
          </div>
          <span>Supported: JPG, PNG, MP4, WebM</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Media Guidelines:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>Video URL is optional</strong> - Use YouTube, Vimeo, or direct video links</li>
          <li>• Add recipe images to showcase the cooking process and final dish</li>
          <li>• Optional video files for additional cooking demonstrations</li>
          <li>• Keep files under 10MB for better performance</li>
        </ul>
      </div>
    </div>
  );
}

export type { MediaItem };