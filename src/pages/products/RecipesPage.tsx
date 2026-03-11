import { useEffect, useState } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { SimpleModal } from '../../components/ui/SimpleModal';
import { UnifiedMediaUpload, type MediaItem } from '../../components/ui/UnifiedMediaUpload';
import { SimpleRecipeCard } from '../../components/recipes/SimpleRecipeCard';
import { SimpleRecipeDetails } from '../../components/recipes/SimpleRecipeDetails';
import { Plus, Building2, Store, X, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Recipe } from '../../types';
import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  listRecipes,
  updateRecipe,
} from '../../utils/recipeBackend';

type RecipeDraft = Pick<
  Recipe,
  | 'name'
  | 'description'
  | 'category'
  | 'difficulty'
  | 'prepTime'
  | 'cookTime'
  | 'serves'
  | 'ingredients'
  | 'instructions'
  | 'isPublished'
>;

const DEFAULT_DRAFT: RecipeDraft = {
  name: '',
  description: '',
  category: '',
  difficulty: 'easy',
  prepTime: 0,
  cookTime: 0,
  serves: 1,
  ingredients: [],
  instructions: [],
  isPublished: true,
};

const STORE_CATEGORY_OPTIONS = ['fish', 'chicken', 'mutton', 'egg', 'quick & easy', 'traditional', 'healthy'];

function formatCategoryLabel(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildDraft(recipe?: Recipe | null): RecipeDraft {
  if (!recipe) {
    return { ...DEFAULT_DRAFT, ingredients: [], instructions: [] };
  }

  return {
    name: recipe.name,
    description: recipe.description,
    category: recipe.category,
    difficulty: recipe.difficulty,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    serves: recipe.serves,
    ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
    instructions: [...recipe.instructions],
    isPublished: recipe.isPublished,
  };
}

function buildMediaItems(recipe?: Recipe | null): MediaItem[] {
  if (!recipe) {
    return [];
  }

  return [
    ...(recipe.images || []).map((url, index) => ({
      id: `${recipe.id}-image-${index + 1}`,
      type: 'image' as const,
      url,
      name: `Image ${index + 1}`,
    })),
    ...((recipe.additionalVideos || []).map((video, index) => ({
      id: video.id || `${recipe.id}-video-${index + 1}`,
      type: 'video-file' as const,
      url: video.url,
      name: video.name || `Video ${index + 1}`,
      thumbnail: video.thumbnail,
    })) || []),
  ];
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Failed to read file "${file.name}"`));
    reader.readAsDataURL(file);
  });
}

function getRecipeQuery(user: ReturnType<typeof useAuth>['user']) {
  if (!user) {
    return { limit: '200' };
  }

  if (user.loginType === 'hub') {
    return {
      limit: '200',
      moduleType: 'hub',
      ...(user.hubId ? { hubId: user.hubId } : {}),
    };
  }

  if (user.loginType === 'store') {
    return {
      limit: '200',
      moduleType: 'store',
      ...(user.storeId ? { storeId: user.storeId } : {}),
    };
  }

  return { limit: '200' };
}

export function RecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeSection, setActiveSection] = useState<'hub' | 'store'>('hub');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [draft, setDraft] = useState<RecipeDraft>(DEFAULT_DRAFT);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setActiveSection(user?.loginType === 'store' ? 'store' : 'hub');
  }, [user?.loginType]);

  useEffect(() => {
    void fetchRecipes();
  }, [user?.loginType, user?.hubId, user?.storeId]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setRecipes(await listRecipes(getRecipeQuery(user)));
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      setRecipes([]);
      alert('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredHubRecipes = recipes.filter((recipe) => recipe.moduleType === 'hub');
  const filteredStoreRecipes = recipes.filter((recipe) => recipe.moduleType === 'store');
  const currentRecipes =
    user?.loginType === 'super_admin'
      ? activeSection === 'hub'
        ? filteredHubRecipes
        : filteredStoreRecipes
      : recipes;

  const availableSections =
    user?.loginType === 'super_admin'
      ? (['hub', 'store'] as const)
      : user?.loginType === 'store'
        ? (['store'] as const)
        : (['hub'] as const);

  const categoryOptions = Array.from(
    new Set([
      ...(activeSection === 'hub' ? ['fish'] : STORE_CATEGORY_OPTIONS),
      ...currentRecipes.map((recipe) => recipe.category).filter(Boolean),
    ])
  );

  const resetForm = () => {
    setDraft({ ...DEFAULT_DRAFT, ingredients: [], instructions: [] });
    setMediaItems([]);
    setVideoUrl('');
    setSelectedRecipe(null);
  };

  const syncRecipe = (recipe: Recipe) => {
    setRecipes((prev) => {
      const exists = prev.some((item) => item.id === recipe.id);
      return exists ? prev.map((item) => (item.id === recipe.id ? recipe : item)) : [recipe, ...prev];
    });
    setSelectedRecipe((prev) => (prev?.id === recipe.id ? recipe : prev));
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openViewModal = async (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowViewModal(true);

    try {
      const detail = await getRecipeById(recipe.id);
      syncRecipe(detail);
    } catch (error) {
      console.error('Failed to load recipe detail:', error);
    }
  };

  const openEditModal = (recipe: Recipe) => {
    setShowViewModal(false);
    setSelectedRecipe(recipe);
    setDraft(buildDraft(recipe));
    setMediaItems(buildMediaItems(recipe));
    setVideoUrl(recipe.videoUrl || '');
    setShowEditModal(true);
  };

  const openDeleteModal = (recipe: Recipe) => {
    setShowViewModal(false);
    setSelectedRecipe(recipe);
    setShowDeleteModal(true);
  };

  const buildRequestedBy = () => {
    if (!user?.id || !user.name || !user.role) {
      throw new Error('Admin identity is missing. Please login again.');
    }

    return {
      userId: user.id,
      name: user.name,
      role: user.role,
    };
  };

  const serializeMediaItems = async () => {
    const images = await Promise.all(
      mediaItems
        .filter((item) => item.type === 'image')
        .map(async (item) => (item.file ? fileToDataUrl(item.file) : item.url))
    );

    const additionalVideos = await Promise.all(
      mediaItems
        .filter((item) => item.type === 'video-file')
        .map(async (item) => ({
          id: item.id,
          type: item.file ? ('file' as const) : ('url' as const),
          url: item.file ? await fileToDataUrl(item.file) : item.url,
          name: item.name,
          thumbnail: item.thumbnail,
        }))
    );

    return { images, additionalVideos };
  };

  const handleSave = async (mode: 'create' | 'update') => {
    try {
      if (!draft.name.trim() || !draft.category.trim()) {
        alert('Recipe name and category are required.');
        return;
      }

      if (draft.description.trim().length < 10) {
        alert('Description must be at least 10 characters.');
        return;
      }

      const ingredients = draft.ingredients
        .map((ingredient) => ({
          productId: ingredient.productId,
          name: ingredient.name.trim(),
          quantity: ingredient.quantity.trim(),
        }))
        .filter((ingredient) => ingredient.name && ingredient.quantity);

      const instructions = draft.instructions.map((step) => step.trim()).filter(Boolean);

      if (!ingredients.length || !instructions.length) {
        alert('Add at least one ingredient and one instruction.');
        return;
      }

      setSaving(true);
      const moduleType = selectedRecipe?.moduleType || activeSection;
      const locationPayload =
        moduleType === 'hub'
          ? { hubId: selectedRecipe?.hubId || user?.hubId || null, storeId: null }
          : { hubId: null, storeId: selectedRecipe?.storeId || user?.storeId || null };
      const serializedMedia = await serializeMediaItems();

      const payload = {
        moduleType,
        ...locationPayload,
        name: draft.name.trim(),
        description: draft.description.trim(),
        category: draft.category.trim(),
        difficulty: draft.difficulty,
        prepTime: draft.prepTime,
        cookTime: draft.cookTime,
        serves: draft.serves,
        ingredients,
        instructions,
        images: serializedMedia.images,
        videoUrl: videoUrl.trim() || undefined,
        additionalVideos: serializedMedia.additionalVideos,
        isPublished: draft.isPublished,
        requestedBy: buildRequestedBy(),
      };

      const savedRecipe =
        mode === 'create'
          ? await createRecipe(payload)
          : await updateRecipe(selectedRecipe!.id, payload);

      syncRecipe(savedRecipe);
      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
      alert(`Recipe "${savedRecipe.name}" has been ${mode === 'create' ? 'created' : 'updated'} successfully.`);
    } catch (error) {
      console.error('Failed to save recipe:', error);
      alert(error instanceof Error ? error.message : 'Failed to save recipe.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedRecipe) {
      return;
    }

    try {
      setSaving(true);
      await deleteRecipe(selectedRecipe.id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== selectedRecipe.id));
      setShowDeleteModal(false);
      setSelectedRecipe(null);
      alert(`Recipe "${selectedRecipe.name}" has been deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete recipe.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Recipe Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage recipes, publish status, and recipe content cards from the backend.
          </p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto flex-shrink-0">
          <Plus className="mr-2 h-5 w-5" />
          <span className="hidden sm:inline">Add Recipe</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {availableSections.length > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 p-1 bg-gray-50 rounded-lg">
            <button
              onClick={() => setActiveSection('hub')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md font-medium transition-all text-sm ${
                activeSection === 'hub' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
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

      {loading ? (
        <Card className="p-12 text-center">
          <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading recipes</h3>
          <p className="text-gray-500">Fetching recipe data from the backend.</p>
        </Card>
      ) : currentRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRecipes.map((recipe) => (
            <SimpleRecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={openViewModal}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Clock className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-500 mb-4">Create the first recipe for this module.</p>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-5 w-5" />
            Add Recipe
          </Button>
        </Card>
      )}

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
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
                <Input
                  placeholder="Fish Curry - Kerala Style"
                  value={draft.name}
                  onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {formatCategoryLabel(category)}
                    </option>
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
                value={draft.description}
                onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                <Input
                  type="number"
                  value={draft.prepTime}
                  onChange={(e) => setDraft((prev) => ({ ...prev, prepTime: parseInt(e.target.value, 10) || 0 }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
                <Input
                  type="number"
                  value={draft.cookTime}
                  onChange={(e) => setDraft((prev) => ({ ...prev, cookTime: parseInt(e.target.value, 10) || 0 }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                <Input
                  type="number"
                  value={draft.serves}
                  onChange={(e) => setDraft((prev) => ({ ...prev, serves: parseInt(e.target.value, 10) || 1 }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={draft.difficulty}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      difficulty: e.target.value as Recipe['difficulty'],
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <label className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={draft.isPublished}
                onChange={(e) => setDraft((prev) => ({ ...prev, isPublished: e.target.checked }))}
              />
              Publish immediately
            </label>
          </div>

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

          <div>
            <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
            <div className="space-y-2">
              {draft.ingredients.map((ingredient, index) => (
                <div key={`${ingredient.name}-${index}`} className="flex gap-2">
                  <Input
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => {
                      const next = [...draft.ingredients];
                      next[index] = { ...ingredient, name: e.target.value };
                      setDraft((prev) => ({ ...prev, ingredients: next }));
                    }}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) => {
                      const next = [...draft.ingredients];
                      next[index] = { ...ingredient, quantity: e.target.value };
                      setDraft((prev) => ({ ...prev, ingredients: next }));
                    }}
                    className="w-28"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        ingredients: prev.ingredients.filter((_, itemIndex) => itemIndex !== index),
                      }))
                    }
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    ingredients: [...prev.ingredients, { name: '', quantity: '' }],
                  }))
                }
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" /> Add Ingredient
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Instructions</h3>
            <div className="space-y-2">
              {draft.instructions.map((instruction, index) => (
                <div key={`${instruction}-${index}`} className="flex gap-2">
                  <span className="w-8 h-10 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-100 rounded">
                    {index + 1}.
                  </span>
                  <textarea
                    placeholder="Step instruction"
                    value={instruction}
                    onChange={(e) => {
                      const next = [...draft.instructions];
                      next[index] = e.target.value;
                      setDraft((prev) => ({ ...prev, instructions: next }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        instructions: prev.instructions.filter((_, itemIndex) => itemIndex !== index),
                      }))
                    }
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    instructions: [...prev.instructions, ''],
                  }))
                }
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
              disabled={saving}
              onClick={() => void handleSave('create')}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Recipe'}
            </button>
          </div>
        </form>
      </SimpleModal>

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
          <SimpleRecipeDetails recipe={selectedRecipe} onEdit={openEditModal} onDelete={openDeleteModal} />
        )}
      </SimpleModal>

      <SimpleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Recipe"
        size="xl"
      >
        {selectedRecipe && (
          <form className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
                  <Input
                    value={draft.name}
                    onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {formatCategoryLabel(category)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                  <Input
                    type="number"
                    value={draft.prepTime}
                    onChange={(e) => setDraft((prev) => ({ ...prev, prepTime: parseInt(e.target.value, 10) || 0 }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
                  <Input
                    type="number"
                    value={draft.cookTime}
                    onChange={(e) => setDraft((prev) => ({ ...prev, cookTime: parseInt(e.target.value, 10) || 0 }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                  <Input
                    type="number"
                    value={draft.serves}
                    onChange={(e) => setDraft((prev) => ({ ...prev, serves: parseInt(e.target.value, 10) || 1 }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={draft.difficulty}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        difficulty: e.target.value as Recipe['difficulty'],
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <label className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={draft.isPublished}
                  onChange={(e) => setDraft((prev) => ({ ...prev, isPublished: e.target.checked }))}
                />
                Published
              </label>
            </div>

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

            <div>
              <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
              <div className="space-y-2">
                {draft.ingredients.map((ingredient, index) => (
                  <div key={`${ingredient.name}-${index}`} className="flex gap-2">
                    <Input
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) => {
                        const next = [...draft.ingredients];
                        next[index] = { ...ingredient, name: e.target.value };
                        setDraft((prev) => ({ ...prev, ingredients: next }));
                      }}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Quantity"
                      value={ingredient.quantity}
                      onChange={(e) => {
                        const next = [...draft.ingredients];
                        next[index] = { ...ingredient, quantity: e.target.value };
                        setDraft((prev) => ({ ...prev, ingredients: next }));
                      }}
                      className="w-28"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          ingredients: prev.ingredients.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      ingredients: [...prev.ingredients, { name: '', quantity: '' }],
                    }))
                  }
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" /> Add Ingredient
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Instructions</h3>
              <div className="space-y-2">
                {draft.instructions.map((instruction, index) => (
                  <div key={`${instruction}-${index}`} className="flex gap-2">
                    <span className="w-8 h-10 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-100 rounded">
                      {index + 1}.
                    </span>
                    <textarea
                      placeholder="Step instruction"
                      value={instruction}
                      onChange={(e) => {
                        const next = [...draft.instructions];
                        next[index] = e.target.value;
                        setDraft((prev) => ({ ...prev, instructions: next }));
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          instructions: prev.instructions.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      instructions: [...prev.instructions, ''],
                    }))
                  }
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
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleSave('update')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {saving ? 'Updating...' : 'Update Recipe'}
              </button>
            </div>
          </form>
        )}
      </SimpleModal>

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
                Are you sure you want to delete <strong>"{selectedRecipe.name}"</strong>? This will permanently remove
                the recipe and its reactions and tips from the admin flow.
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
                onClick={() => void confirmDelete()}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70"
              >
                {saving ? 'Deleting...' : 'Delete Recipe'}
              </button>
            </div>
          </div>
        )}
      </SimpleModal>
    </div>
  );
}
