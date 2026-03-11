import { useState } from 'react';
import { Card, Badge } from '../ui';
import { 
  Clock, Users, ThumbsUp, ThumbsDown, Star, MessageCircle, 
  Eye, Edit, Trash2, Play, Heart, Share2, BookOpen, ChefHat
} from 'lucide-react';
import type { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onView?: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
  onLike?: (recipeId: string) => void;
  onDislike?: (recipeId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export function RecipeCard({ 
  recipe, 
  onView, 
  onEdit, 
  onDelete, 
  onLike, 
  onDislike,
  showActions = true,
  compact = false 
}: RecipeCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    if (isDisliked) setIsDisliked(false);
    setIsLiked(!isLiked);
    onLike?.(recipe.id);
  };

  const handleDislike = () => {
    if (isLiked) setIsLiked(false);
    setIsDisliked(!isDisliked);
    onDislike?.(recipe.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVideoThumbnail = (url: string) => {
    const youtubeMatch = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
    }
    return null;
  };

  if (compact) {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Recipe Image/Video */}
          <div className="w-20 h-20 flex-shrink-0">
            <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative">
              {recipe.videoUrl && getVideoThumbnail(recipe.videoUrl) ? (
                <>
                  <img 
                    src={getVideoThumbnail(recipe.videoUrl)!} 
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </>
              ) : recipe.images?.[0] ? (
                <img 
                  src={recipe.images[0]} 
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Recipe Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{recipe.name}</h3>
              <Badge variant={getDifficultyColor(recipe.difficulty)} className="ml-2 flex-shrink-0">
                {recipe.difficulty}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{recipe.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {recipe.prepTime + recipe.cookTime}m
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {recipe.serves}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {recipe.likes || 0}
              </span>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => onView?.(recipe)}
                className="p-1 hover:bg-gray-100 rounded transition-colors" 
                title="View Recipe"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button 
                onClick={() => onEdit?.(recipe)}
                className="p-1 hover:bg-gray-100 rounded transition-colors" 
                title="Edit Recipe"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Recipe Image/Video */}
      <div className="relative h-48 bg-gray-100">
        {recipe.videoUrl && getVideoThumbnail(recipe.videoUrl) ? (
          <>
            <img 
              src={getVideoThumbnail(recipe.videoUrl)!} 
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                 onClick={() => onView?.(recipe)}>
              <Play className="h-12 w-12 text-white" />
            </div>
          </>
        ) : recipe.images?.[0] ? (
          <img 
            src={recipe.images[0]} 
            alt={recipe.name}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onView?.(recipe)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center cursor-pointer"
               onClick={() => onView?.(recipe)}>
            <ChefHat className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={recipe.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {recipe.isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={getDifficultyColor(recipe.difficulty)}>
            {recipe.difficulty}
          </Badge>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{recipe.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
        </div>

        {/* Recipe Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">{recipe.prepTime + recipe.cookTime}</span>
            </div>
            <p className="text-xs text-gray-600">Total Time</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <Users className="h-4 w-4" />
              <span className="font-semibold">{recipe.serves}</span>
            </div>
            <p className="text-xs text-gray-600">Servings</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{recipe.rating?.toFixed(1) || '0.0'}</span>
            </div>
            <p className="text-xs text-gray-600">Rating</p>
          </div>
        </div>

        {/* Engagement Section */}
        <div className="flex items-center justify-between mb-4 p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            {/* Like/Dislike */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors ${
                  isLiked 
                    ? 'bg-green-100 text-green-700' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{(recipe.likes || 0) + (isLiked ? 1 : 0)}</span>
              </button>
              
              <button
                onClick={handleDislike}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors ${
                  isDisliked 
                    ? 'bg-red-100 text-red-700' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
                <span>{(recipe.dislikes || 0) + (isDisliked ? 1 : 0)}</span>
              </button>
            </div>

            {/* Reviews */}
            <button className="flex items-center gap-1 px-2 py-1 rounded-full text-sm hover:bg-gray-100 text-gray-600 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span>{recipe.reviewCount || 0}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <Heart className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2">
            <button 
              onClick={() => onView?.(recipe)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              View Recipe
            </button>
            <button 
              onClick={() => onEdit?.(recipe)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Edit Recipe"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete?.(recipe)}
              className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete Recipe"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}