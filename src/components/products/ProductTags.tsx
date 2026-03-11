import { useState } from 'react';
import { Card, Button } from '../ui';
import { Tag, X, Plus, ChevronUp, ChevronDown } from 'lucide-react';

interface ProductTagsData {
  tags: string[];
}

interface ProductTagsProps {
  data: ProductTagsData;
  onChange: (data: ProductTagsData) => void;
}

// Common fish names and tags for suggestions
const COMMON_FISH_TAGS = [
  'Aiykoora', 'Anjal', 'Kalagnani', 'King fish', 'Konema', 'Neimeen',
  'Nettaiyan Cheela', 'Neymeen', 'Sakala', 'Sear', 'Spanish mackerels',
  'Surmai', 'Thora', 'Tuvar Anjari', 'Vangiram', 'Vanjaram', 'Visonu',
  'Fresh fish', 'Sea fish', 'Premium quality', 'Daily catch', 'Boneless',
  'Whole fish', 'Fillet', 'Curry cut', 'Steaks', 'Cleaned'
];

export function ProductTags({ data, onChange }: ProductTagsProps) {
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !data.tags.includes(trimmedTag)) {
      onChange({
        tags: [...data.tags, trimmedTag]
      });
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange({
      tags: data.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddNewTag = () => {
    if (newTag.trim()) {
      addTag(newTag);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewTag();
    } else if (e.key === ',') {
      e.preventDefault();
      handleAddNewTag();
    }
  };

  const addSuggestedTag = (tag: string) => {
    addTag(tag);
  };

  const getFilteredSuggestions = () => {
    return COMMON_FISH_TAGS.filter(tag => 
      !data.tags.includes(tag) && 
      tag.toLowerCase().includes(newTag.toLowerCase())
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Product Tags</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Add tags to help customers find your product in search. These keywords will show results when customers type them.
          </p>

          {/* Add New Tag Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tag name..."
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && newTag && getFilteredSuggestions().length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                  {getFilteredSuggestions().slice(0, 8).map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => addSuggestedTag(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={handleAddNewTag}
              disabled={!newTag.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Separate tags with commas or press Enter to add
          </p>

          {/* Current Tags */}
          {data.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Current Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {data.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-blue-600" 
                      onClick={() => removeTag(tag)}
                    />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Most Used Tags Suggestions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Choose from the most used tags:</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_FISH_TAGS
                .filter(tag => !data.tags.includes(tag))
                .slice(0, 12)
                .map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addSuggestedTag(tag)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
            </div>
          </div>

          {/* Tags Summary */}
          {data.tags.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-green-800 mb-1">
                Search Keywords ({data.tags.length} tags):
              </h4>
              <p className="text-xs text-green-700">
                Customers can find this product by searching: {data.tags.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export type { ProductTagsData };