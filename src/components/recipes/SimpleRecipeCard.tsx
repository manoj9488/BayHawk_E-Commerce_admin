import { useState } from 'react';
import { Card, Badge } from '../ui';
import { 
  Clock, Users, ThumbsUp, ThumbsDown, Star, MessageCircle, 
  Eye, Edit, Trash2, Play, ChefHat
} from 'lucide-react';
import type { Recipe } from '../../types';

interface SimpleRecipeCardProps {
  recipe: Recipe;
  onView?: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
  onLike?: (recipeId: string) => void;
  onDislike?: (recipeId: string) => void;
}

export function SimpleRecipeCard({ 
  recipe, 
  onView, 
  onEdit, 
  onDelete, 
  onLike, 
  onDislike
}: SimpleRecipeCardProps) {
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Recipe Image */}
      <div className="relative h-48 bg-gray-100">
        {recipe.images?.[0] ? (
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
        
        {/* Video Play Button Overlay */}
        {recipe.videoUrl && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
               onClick={() => onView?.(recipe)}>
            <Play className="h-12 w-12 text-white" />
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
        <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-semibold text-sm">{recipe.prepTime + recipe.cookTime}m</span>
            </div>
            <p className="text-xs text-gray-600">Time</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <Users className="h-4 w-4" />
              <span className="font-semibold text-sm">{recipe.serves}</span>
            </div>
            <p className="text-xs text-gray-600">Serves</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold text-sm">{recipe.rating?.toFixed(1) || '0.0'}</span>
            </div>
            <p className="text-xs text-gray-600">Rating</p>
          </div>
        </div>

        {/* Engagement Section - Clean Layout */}
        <div className="mb-4">
          <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
            {/* Left Side - Likes & Dislikes */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isLiked 
                    ? 'bg-green-100 text-green-700 shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-semibold">{(recipe.likes || 0) + (isLiked ? 1 : 0)}</span>
              </button>
              
              <button
                onClick={handleDislike}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isDisliked 
                    ? 'bg-red-100 text-red-700 shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
                <span className="font-semibold">{(recipe.dislikes || 0) + (isDisliked ? 1 : 0)}</span>
              </button>
            </div>

            {/* Right Side - Reviews Count */}
            <div className="flex items-center gap-1 text-gray-600">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{recipe.reviewCount || 0} reviews</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => onView?.(recipe)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Eye className="h-4 w-4 inline mr-1" />
            View
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
      </div>
    </Card>
  );
}
