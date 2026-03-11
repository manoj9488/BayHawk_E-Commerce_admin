import { useState } from 'react';
import { Card, Badge, Button } from '../ui';
import { 
  Clock, Users, Star, ThumbsUp, ThumbsDown, MessageCircle, 
  Play, ExternalLink, User, Calendar, CheckCircle, Lightbulb,
  Heart, Share2, BookOpen, ChefHat
} from 'lucide-react';
import type { Recipe } from '../../types';

interface RecipeDetailsProps {
  recipe: Recipe;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
}

export function RecipeDetails({ recipe, onLike, onDislike }: RecipeDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'tips'>('overview');
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Recipe Header */}
      <Card className="overflow-hidden">
        <div className="relative h-64 bg-gray-100">
          {recipe.videoUrl && getVideoThumbnail(recipe.videoUrl) ? (
            <>
              <img 
                src={getVideoThumbnail(recipe.videoUrl)!} 
                alt={recipe.name}
                className="w-full h-full object-cover"
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
            </>
          ) : recipe.images?.[0] ? (
            <img 
              src={recipe.images[0]} 
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat className="h-20 w-20 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
              <p className="text-gray-600 text-lg">{recipe.description}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <Badge variant={getDifficultyColor(recipe.difficulty)}>
                {recipe.difficulty}
              </Badge>
              <Badge variant={recipe.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {recipe.isPublished ? 'Published' : 'Draft'}
              </Badge>
            </div>
          </div>

          {/* Recipe Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <Clock className="h-5 w-5" />
                <span className="font-semibold text-lg">{recipe.prepTime + recipe.cookTime}</span>
              </div>
              <p className="text-sm text-gray-600">Total Time (min)</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <Users className="h-5 w-5" />
                <span className="font-semibold text-lg">{recipe.serves}</span>
              </div>
              <p className="text-sm text-gray-600">Servings</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold text-lg">{recipe.rating?.toFixed(1) || '0.0'}</span>
              </div>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold text-lg">{recipe.reviewCount || 0}</span>
              </div>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
          </div>

          {/* Engagement Actions */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isLiked 
                    ? 'bg-green-100 text-green-700' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{(recipe.likes || 0) + (isLiked ? 1 : 0)} Likes</span>
              </button>
              
              <button
                onClick={handleDislike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isDisliked 
                    ? 'bg-red-100 text-red-700' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
                <span>{(recipe.dislikes || 0) + (isDisliked ? 1 : 0)} Dislikes</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="secondary" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Recipe', icon: BookOpen },
          { id: 'reviews', label: `Reviews (${recipe.reviewCount || 0})`, icon: MessageCircle },
          { id: 'tips', label: `Tips (${recipe.tips?.length || 0})`, icon: Lightbulb }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingredients */}
          <Card>
            <div className="p-6">
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
            </div>
          </Card>

          {/* Instructions */}
          <Card>
            <div className="p-6">
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
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'reviews' && (
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
            {recipe.reviews && recipe.reviews.length > 0 ? (
              <div className="space-y-4">
                {recipe.reviews.map((review) => (
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
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No reviews yet. Be the first to review this recipe!</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'tips' && (
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Cooking Tips</h3>
            {recipe.tips && recipe.tips.length > 0 ? (
              <div className="space-y-4">
                {recipe.tips.map((tip) => (
                  <div key={tip.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-700 mb-2">{tip.tip}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">by {tip.userName}</span>
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-yellow-600">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{tip.likes}</span>
                            </button>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">{new Date(tip.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No cooking tips yet. Share your experience!</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}