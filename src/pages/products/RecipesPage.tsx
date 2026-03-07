import { useState } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { SimpleModal } from '../../components/ui/SimpleModal';
import { UnifiedMediaUpload, type MediaItem } from '../../components/ui/UnifiedMediaUpload';
import { SimpleRecipeCard } from '../../components/recipes/SimpleRecipeCard';
import { SimpleRecipeDetails } from '../../components/recipes/SimpleRecipeDetails';
import { Plus, Building2, Store, X, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { filterDataByModule } from '../../utils/rbac';
import type { Recipe } from '../../types';

const mockHubRecipes: Recipe[] = [
  { 
    id: 'h1', 
    name: 'Fish Curry - Kerala Style', 
    description: 'Traditional Kerala fish curry with coconut milk', 
    category: 'Fish', 
    difficulty: 'medium', 
    prepTime: 15, 
    cookTime: 30, 
    serves: 4, 
    ingredients: [
      { name: 'Fish (Kingfish)', quantity: '500g' },
      { name: 'Coconut milk', quantity: '200ml' },
      { name: 'Curry leaves', quantity: '10-12' }
    ], 
    instructions: [
      'Clean and cut fish into medium pieces',
      'Heat oil in a pan and add curry leaves',
      'Add fish pieces and cook until golden'
    ], 
    images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'], 
    videoUrl: 'https://youtube.com/watch?v=fish-curry-kerala',
    isPublished: true, 
    moduleType: 'hub', 
    hubId: 'hub_1',
    likes: 45,
    dislikes: 3,
    rating: 4.5,
    reviewCount: 12,
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: 'Priya Sharma',
        rating: 5,
        comment: 'Absolutely delicious! The coconut milk makes it so creamy.',
        createdAt: '2024-01-15T10:30:00Z',
        isVerified: true
      }
    ],
    tips: [
      {
        id: 't1',
        userId: 'u2',
        userName: 'Chef Ravi',
        tip: 'Add a pinch of turmeric for better color and flavor',
        likes: 8,
        createdAt: '2024-01-16T14:20:00Z'
      }
    ]
  },
  { 
    id: 'h2', 
    name: 'Prawn Masala', 
    description: 'Spicy prawn masala with aromatic spices', 
    category: 'Fish', 
    difficulty: 'easy', 
    prepTime: 10, 
    cookTime: 20, 
    serves: 3, 
    ingredients: [], 
    instructions: [], 
    images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop'], 
    videoUrl: 'https://youtube.com/watch?v=prawn-masala-recipe',
    isPublished: true, 
    moduleType: 'hub', 
    hubId: 'hub_1',
    likes: 32,
    dislikes: 1,
    rating: 4.2,
    reviewCount: 8
  },
  { 
    id: 'h3', 
    name: 'Crab Roast', 
    description: 'Chettinad style crab roast', 
    category: 'Fish', 
    difficulty: 'hard', 
    prepTime: 20, 
    cookTime: 45, 
    serves: 4, 
    ingredients: [], 
    instructions: [], 
    images: ['https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop'], 
    isPublished: false, 
    moduleType: 'hub', 
    hubId: 'hub_1',
    likes: 18,
    dislikes: 2,
    rating: 4.0,
    reviewCount: 5
  }
];

const mockStoreRecipes: Recipe[] = [
  { 
    id: 's1', 
    name: 'Grilled Fish Steak', 
    description: 'Healthy grilled fish with herbs', 
    category: 'Fish', 
    difficulty: 'easy', 
    prepTime: 10, 
    cookTime: 15, 
    serves: 2, 
    ingredients: [], 
    instructions: [], 
    images: ['https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop'], 
    videoUrl: 'https://youtube.com/watch?v=grilled-fish-recipe',
    isPublished: true, 
    moduleType: 'store', 
    storeId: 'store_1',
    likes: 28,
    dislikes: 0,
    rating: 4.8,
    reviewCount: 6
  },
  { 
    id: 's2', 
    name: 'Chicken Biryani', 
    description: 'Aromatic chicken biryani with basmati rice', 
    category: 'Chicken', 
    difficulty: 'medium', 
    prepTime: 30, 
    cookTime: 60, 
    serves: 6, 
    ingredients: [], 
    instructions: [], 
    images: ['https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop'], 
    isPublished: true, 
    moduleType: 'store', 
    storeId: 'store_1',
    likes: 67,
    dislikes: 4,
    rating: 4.6,
    reviewCount: 23
  }
];

export function RecipesPage() {
  const { user } = useAuth();
  const [hubRecipes, setHubRecipes] = useState<Recipe[]>(mockHubRecipes);
  const [storeRecipes, setStoreRecipes] = useState<Recipe[]>(mockStoreRecipes);
  const [activeSection, setActiveSection] = useState<'hub' | 'store'>('hub');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    name: '',
    description: '',
    category: '',
    difficulty: 'easy',
    prepTime: 0,
    cookTime: 0,
    serves: 0,
    ingredients: [],
    instructions: [],
    images: [],
    isPublished: true
  });

  // Categories based on user type
  const getCategories = () => {
    if (user?.loginType === 'hub') {
      return ['All', 'Fish']; // Hub only shows fish-based categories
    } else if (user?.loginType === 'store') {
      return ['All', 'Fish', 'Chicken', 'Mutton', 'Egg', 'Quick & Easy', 'Traditional', 'Healthy']; // Store shows all categories
    } else {
      // Super admin sees all categories
      return ['All', 'Fish', 'Chicken', 'Mutton', 'Egg', 'Quick & Easy', 'Traditional', 'Healthy'];
    }
  };

  // Filter recipes based on user's module access
  const allRecipes = [...hubRecipes, ...storeRecipes];
  const filteredRecipesData = filterDataByModule(allRecipes, user);
  
  const filteredHubRecipes = filteredRecipesData.filter(recipe => recipe.moduleType === 'hub');
  const filteredStoreRecipes = filteredRecipesData.filter(recipe => recipe.moduleType === 'store');

  // Determine which sections to show based on user type
  const getAvailableSections = () => {
    if (user?.loginType === 'hub') {
      return ['hub'];
    } else if (user?.loginType === 'store') {
      return ['store'];
    } else {
      // Super admin sees all sections
      return ['hub', 'store'];
    }
  };

  const availableSections = getAvailableSections();

  // Set default active section based on user type
  useState(() => {
    const defaultSection = user?.loginType === 'hub' ? 'hub' : user?.loginType === 'store' ? 'store' : 'hub';
    setActiveSection(defaultSection as 'hub' | 'store');
  });

  const currentRecipes = activeSection === 'hub' ? filteredHubRecipes : filteredStoreRecipes;

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowViewModal(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setNewRecipe(recipe);
    setShowEditModal(true);
  };

  const handleDeleteRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedRecipe) {
      if (activeSection === 'hub') {
        setHubRecipes(hubRecipes.filter(r => r.id !== selectedRecipe.id));
      } else {
        setStoreRecipes(storeRecipes.filter(r => r.id !== selectedRecipe.id));
      }
      setShowDeleteModal(false);
      setSelectedRecipe(null);
      alert(`Recipe "${selectedRecipe.name}" has been deleted successfully!`);
    }
  };

  const resetForm = () => {
    setMediaItems([]);
    setVideoUrl('');
    setNewRecipe({
      name: '',
      description: '',
      category: '',
      difficulty: 'easy',
      prepTime: 0,
      cookTime: 0,
      serves: 0,
      ingredients: [],
      instructions: [],
      images: [],
      isPublished: true
    });
  };

  const handleLike = (recipeId: string) => {
    console.log('Like recipe:', recipeId);
    // Update recipe likes in state
    if (activeSection === 'hub') {
      setHubRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, likes: (recipe.likes || 0) + 1 }
          : recipe
      ));
    } else {
      setStoreRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, likes: (recipe.likes || 0) + 1 }
          : recipe
      ));
    }
  };

  const handleDislike = (recipeId: string) => {
    console.log('Dislike recipe:', recipeId);
    // Update recipe dislikes in state
    if (activeSection === 'hub') {
      setHubRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, dislikes: (recipe.dislikes || 0) + 1 }
          : recipe
      ));
    } else {
      setStoreRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, dislikes: (recipe.dislikes || 0) + 1 }
          : recipe
      ));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Recipe Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage recipes and cooking guides</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto flex-shrink-0">
          <Plus className="mr-2 h-5 w-5" /> 
          <span className="hidden sm:inline">Add Recipe</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Hub/Store Section Tabs - Only show if there are multiple sections */}
      {availableSections.length > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 p-1 bg-gray-50 rounded-lg">
            <button
              onClick={() => setActiveSection('hub')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md font-medium transition-all text-sm ${
                activeSection === 'hub' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Hub Recipes ({filteredHubRecipes.length})
            </button>
            <button
              onClick={() => setActiveSection('store')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeSection === 'store' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Store className="h-4 w-4" />
              Store Recipes ({filteredStoreRecipes.length})
            </button>
          </div>
        </Card>
      )}

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentRecipes.map((recipe) => (
          <SimpleRecipeCard
            key={recipe.id}
            recipe={recipe}
            onView={handleViewRecipe}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))}
      </div>

      {currentRecipes.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Clock className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first recipe</p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Add Recipe
          </Button>
        </Card>
      )}

      {/* Add Recipe Modal */}
      <SimpleModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Recipe"
        size="xl"
      >
        <form className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
                <Input 
                  placeholder="Fish Curry - Kerala Style" 
                  value={newRecipe.name || ''}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, name: e.target.value }))}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newRecipe.category || ''}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {getCategories().filter((c: string) => c !== 'All').map((cat: string) => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                rows={3} 
                placeholder="Describe your recipe..."
                value={newRecipe.description || ''}
                onChange={(e) => setNewRecipe(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          {/* Recipe Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                <Input 
                  type="number" 
                  placeholder="15" 
                  value={newRecipe.prepTime || ''}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
                <Input 
                  type="number" 
                  placeholder="30" 
                  value={newRecipe.cookTime || ''}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                <Input 
                  type="number" 
                  placeholder="4" 
                  value={newRecipe.serves || ''}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, serves: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={newRecipe.difficulty || 'easy'}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recipe Media</h3>
            <UnifiedMediaUpload
              mediaItems={mediaItems}
              onMediaChange={setMediaItems}
              videoUrl={videoUrl}
              onVideoUrlChange={setVideoUrl}
              maxImages={6}
              maxVideos={2}
            />
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
            <div className="space-y-2">
              {newRecipe.ingredients?.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    placeholder="Ingredient name" 
                    value={ingredient.name}
                    onChange={(e) => {
                      const updated = [...(newRecipe.ingredients || [])];
                      updated[index] = { ...ingredient, name: e.target.value };
                      setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                    }}
                    className="flex-1" 
                  />
                  <Input 
                    placeholder="Quantity" 
                    value={ingredient.quantity}
                    onChange={(e) => {
                      const updated = [...(newRecipe.ingredients || [])];
                      updated[index] = { ...ingredient, quantity: e.target.value };
                      setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                    }}
                    className="w-24" 
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const updated = [...(newRecipe.ingredients || [])];
                      updated.splice(index, 1);
                      setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => setNewRecipe(prev => ({ 
                  ...prev, 
                  ingredients: [...(prev.ingredients || []), { name: '', quantity: '' }] 
                }))}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" /> Add Ingredient
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Instructions</h3>
            <div className="space-y-2">
              {newRecipe.instructions?.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <span className="w-8 h-10 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-100 rounded">
                    {index + 1}.
                  </span>
                  <textarea
                    placeholder="Step instruction"
                    value={instruction}
                    onChange={(e) => {
                      const updated = [...(newRecipe.instructions || [])];
                      updated[index] = e.target.value;
                      setNewRecipe(prev => ({ ...prev, instructions: updated }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={2}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const updated = [...(newRecipe.instructions || [])];
                      updated.splice(index, 1);
                      setNewRecipe(prev => ({ ...prev, instructions: updated }));
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => setNewRecipe(prev => ({ 
                  ...prev, 
                  instructions: [...(prev.instructions || []), ''] 
                }))}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" /> Add Step
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button 
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={() => {
                // Validate required fields
                if (!newRecipe.name || !newRecipe.category) {
                  alert('Please fill in all required fields: recipe name and category');
                  return;
                }

                const images = mediaItems.filter(item => item.type === 'image').map(item => item.url);
                const videoFiles = mediaItems.filter(item => item.type === 'video-file');

                const recipeToSave: Recipe = {
                  id: `${activeSection[0]}${Date.now()}`,
                  name: newRecipe.name || '',
                  description: newRecipe.description || '',
                  category: newRecipe.category || '',
                  difficulty: newRecipe.difficulty || 'easy',
                  prepTime: newRecipe.prepTime || 0,
                  cookTime: newRecipe.cookTime || 0,
                  serves: newRecipe.serves || 0,
                  ingredients: newRecipe.ingredients || [],
                  instructions: newRecipe.instructions || [],
                  images: images,
                  videoUrl: videoUrl || undefined,
                  additionalVideos: videoFiles.map(vf => ({
                    id: vf.id,
                    type: 'file' as const,
                    url: vf.url,
                    name: vf.name
                  })),
                  isPublished: true,
                  likes: 0,
                  dislikes: 0,
                  rating: 0,
                  reviewCount: 0,
                  reviews: [],
                  tips: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                
                if (activeSection === 'hub') {
                  setHubRecipes([...hubRecipes, recipeToSave]);
                } else {
                  setStoreRecipes([...storeRecipes, recipeToSave]);
                }
                
                setShowAddModal(false);
                resetForm();
                alert(`Recipe "${recipeToSave.name}" has been added successfully!`);
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Recipe
            </button>
          </div>
        </form>
      </SimpleModal>

      {/* View Recipe Modal */}
      <SimpleModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedRecipe(null);
        }}
        title="Recipe Details"
        size="2xl"
      >
        {selectedRecipe && (
          <SimpleRecipeDetails
            recipe={selectedRecipe}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        )}
      </SimpleModal>

      {/* Edit Recipe Modal */}
      <SimpleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedRecipe(null);
          resetForm();
        }}
        title="Edit Recipe"
        size="xl"
      >
        {selectedRecipe && (
          <form className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
                  <Input 
                    placeholder="Fish Curry - Kerala Style" 
                    value={newRecipe.name || selectedRecipe.name}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newRecipe.category || selectedRecipe.category}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {getCategories().filter((c: string) => c !== 'All').map((cat: string) => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  rows={3} 
                  placeholder="Describe your recipe..."
                  value={newRecipe.description || selectedRecipe.description}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Recipe Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                  <Input 
                    type="number" 
                    placeholder="15" 
                    value={newRecipe.prepTime || selectedRecipe.prepTime}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
                  <Input 
                    type="number" 
                    placeholder="30" 
                    value={newRecipe.cookTime || selectedRecipe.cookTime}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                  <Input 
                    type="number" 
                    placeholder="4" 
                    value={newRecipe.serves || selectedRecipe.serves}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, serves: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={newRecipe.difficulty || selectedRecipe.difficulty}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Media Upload Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recipe Media</h3>
              <UnifiedMediaUpload
                mediaItems={mediaItems}
                onMediaChange={setMediaItems}
                videoUrl={videoUrl || selectedRecipe.videoUrl || ''}
                onVideoUrlChange={setVideoUrl}
                maxImages={6}
                maxVideos={2}
              />
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
              <div className="space-y-2">
                {(newRecipe.ingredients || selectedRecipe.ingredients).map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      placeholder="Ingredient name" 
                      value={ingredient.name}
                      onChange={(e) => {
                        const updated = [...(newRecipe.ingredients || selectedRecipe.ingredients)];
                        updated[index] = { ...ingredient, name: e.target.value };
                        setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                      }}
                      className="flex-1" 
                    />
                    <Input 
                      placeholder="Quantity" 
                      value={ingredient.quantity}
                      onChange={(e) => {
                        const updated = [...(newRecipe.ingredients || selectedRecipe.ingredients)];
                        updated[index] = { ...ingredient, quantity: e.target.value };
                        setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                      }}
                      className="w-24" 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const updated = [...(newRecipe.ingredients || selectedRecipe.ingredients)];
                        updated.splice(index, 1);
                        setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                      }}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => setNewRecipe(prev => ({ 
                    ...prev, 
                    ingredients: [...(prev.ingredients || selectedRecipe.ingredients), { name: '', quantity: '' }] 
                  }))}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" /> Add Ingredient
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Instructions</h3>
              <div className="space-y-2">
                {(newRecipe.instructions || selectedRecipe.instructions).map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="w-8 h-10 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-100 rounded">
                      {index + 1}.
                    </span>
                    <textarea
                      placeholder="Step instruction"
                      value={instruction}
                      onChange={(e) => {
                        const updated = [...(newRecipe.instructions || selectedRecipe.instructions)];
                        updated[index] = e.target.value;
                        setNewRecipe(prev => ({ ...prev, instructions: updated }));
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={2}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const updated = [...(newRecipe.instructions || selectedRecipe.instructions)];
                        updated.splice(index, 1);
                        setNewRecipe(prev => ({ ...prev, instructions: updated }));
                      }}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => setNewRecipe(prev => ({ 
                    ...prev, 
                    instructions: [...(prev.instructions || selectedRecipe.instructions), ''] 
                  }))}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" /> Add Step
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button 
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedRecipe(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  const images = mediaItems.filter(item => item.type === 'image').map(item => item.url);
                  const videoFiles = mediaItems.filter(item => item.type === 'video-file');

                  const updatedRecipe: Recipe = {
                    ...selectedRecipe,
                    name: newRecipe.name || selectedRecipe.name,
                    description: newRecipe.description || selectedRecipe.description,
                    category: newRecipe.category || selectedRecipe.category,
                    difficulty: newRecipe.difficulty || selectedRecipe.difficulty,
                    prepTime: newRecipe.prepTime || selectedRecipe.prepTime,
                    cookTime: newRecipe.cookTime || selectedRecipe.cookTime,
                    serves: newRecipe.serves || selectedRecipe.serves,
                    ingredients: newRecipe.ingredients || selectedRecipe.ingredients,
                    instructions: newRecipe.instructions || selectedRecipe.instructions,
                    images: images.length > 0 ? images : selectedRecipe.images,
                    videoUrl: videoUrl || selectedRecipe.videoUrl || undefined,
                    additionalVideos: videoFiles.length > 0 ? videoFiles.map(vf => ({
                      id: vf.id,
                      type: 'file' as const,
                      url: vf.url,
                      name: vf.name
                    })) : selectedRecipe.additionalVideos,
                    isPublished: selectedRecipe.isPublished,
                    updatedAt: new Date().toISOString()
                  };
                  
                  if (activeSection === 'hub') {
                    setHubRecipes(hubRecipes.map(r => r.id === selectedRecipe.id ? updatedRecipe : r));
                  } else {
                    setStoreRecipes(storeRecipes.map(r => r.id === selectedRecipe.id ? updatedRecipe : r));
                  }
                  
                  setShowEditModal(false);
                  setSelectedRecipe(null);
                  resetForm();
                  alert(`Recipe "${updatedRecipe.name}" has been updated successfully!`);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Recipe
              </button>
            </div>
          </form>
        )}
      </SimpleModal>

      {/* Delete Confirmation Modal */}
      <SimpleModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedRecipe(null);
        }}
        title="Delete Recipe"
        size="md"
      >
        {selectedRecipe && (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Delete Recipe</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700">
                Are you sure you want to delete <strong>"{selectedRecipe.name}"</strong>? 
                This will permanently remove the recipe and all its data.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedRecipe(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Recipe
              </button>
            </div>
          </div>
        )}
      </SimpleModal>
    </div>
  );
}