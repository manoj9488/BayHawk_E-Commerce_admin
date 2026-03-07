import { useState } from 'react';
import { Card, Badge, Button } from '../ui';
import { 
  Clock, Users, Star, ThumbsUp, ThumbsDown, MessageCircle, 
  Play, ExternalLink, User, Calendar, CheckCircle,
  Edit, Trash2
} from 'lucide-react';
import type { Recipe } from '../../types';

interface SimpleRecipeDetailsProps {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
  onLike?: (recipeId: string) => void;
  onDislike?: (recipeId: string) => void;
}

export function SimpleRecipeDetails({ 
  recipe, 
  onEdit, 
  onDelete, 
  onLike, 
  onDislike 
}: SimpleRecipeDetailsProps) {
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Recipe Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
        
        <div className="flex items-center justify-center gap-3 mb-4">
          <Badge variant={getDifficultyColor(recipe.difficulty)}>
            {recipe.difficulty}
          </Badge>
          <Badge variant={recipe.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {recipe.isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </div>

      {/* Video Section */}
      {recipe.videoUrl && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Recipe Video</h3>
          <div className="relative">
            {getVideoThumbnail(recipe.videoUrl) ? (
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={getVideoThumbnail(recipe.videoUrl)!} 
                  alt="Recipe video"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <a 
                    href={recipe.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100 transition-all"
                  >
                    <Play className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Watch Recipe Video</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <a 
                  href={recipe.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="h-5 w-5" />
                  Watch Recipe Video
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Recipe Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-blue-600 mb-2">
            <Clock className="h-5 w-5" />
            <span className="font-semibold text-lg">{recipe.prepTime + recipe.cookTime}</span>
          </div>
          <p className="text-sm text-gray-600">Total Time (min)</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-green-600 mb-2">
            <Users className="h-5 w-5" />
            <span className="font-semibold text-lg">{recipe.serves}</span>
          </div>
          <p className="text-sm text-gray-600">Servings</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-orange-600 mb-2">
            <Star className="h-5 w-5 fill-current" />
            <span className="font-semibold text-lg">{recipe.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <p className="text-sm text-gray-600">Rating</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-purple-600 mb-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold text-lg">{recipe.reviewCount || 0}</span>
          </div>
          <p className="text-sm text-gray-600">Reviews</p>
        </Card>
      </div>

      {/* Engagement Section - Clean and Prominent */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Recipe Feedback</h3>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handleLike}
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all ${
              isLiked 
                ? 'bg-green-100 text-green-700 shadow-md scale-105' 
                : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
            }`}
          >
            <ThumbsUp className={`h-8 w-8 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-bold text-xl">{(recipe.likes || 0) + (isLiked ? 1 : 0)}</span>
            <span className="text-sm font-medium">Likes</span>
          </button>
          
          <div className="w-px h-16 bg-gray-300"></div>
          
          <button
            onClick={handleDislike}
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all ${
              isDisliked 
                ? 'bg-red-100 text-red-700 shadow-md scale-105' 
                : 'hover:bg-gray-100 text-gray-600 hover:scale-105'
            }`}
          >
            <ThumbsDown className={`h-8 w-8 ${isDisliked ? 'fill-current' : ''}`} />
            <span className="font-bold text-xl">{(recipe.dislikes || 0) + (isDisliked ? 1 : 0)}</span>
            <span className="text-sm font-medium">Dislikes</span>
          </button>
        </div>
      </Card>

      {/* Ingredients & Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingredients */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
          <div className="space-y-3">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {index + 1}
                </span>
                <span className="font-medium">{ingredient.name}</span>
                <span className="text-gray-600 ml-auto">{ingredient.quantity}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Instructions</h3>
          <div className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Reviews Section */}
      {recipe.reviews && recipe.reviews.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
          <div className="space-y-4">
            {recipe.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.userAvatar ? (
                      <img src={review.userAvatar} alt={review.userName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.userName}</span>
                      {review.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button 
          onClick={() => onEdit?.(recipe)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Recipe
        </Button>
        <Button 
          variant="secondary"
          onClick={() => onDelete?.(recipe)}
          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Recipe
        </Button>
      </div>
    </div>
  );
}