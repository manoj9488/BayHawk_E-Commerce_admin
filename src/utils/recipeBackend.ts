import type { Recipe } from "../types";
import { recipesApi } from "./api";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: {
    message?: string;
  };
}

interface BackendRecipeIngredient {
  productId?: string | null;
  name: string;
  quantity: string;
}

interface BackendRecipeVideo {
  id: string;
  type: "url" | "file";
  url: string;
  name: string;
  thumbnail?: string;
}

interface BackendRecipeTip {
  id: string;
  userId: string;
  userName: string;
  tip: string;
  likes: number;
  createdAt: string;
}

interface BackendRecipe {
  id: string;
  moduleType: "hub" | "store";
  moduleScope?: "hub" | "store";
  hubId?: string | null;
  storeId?: string | null;
  name: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  prepTime: number;
  cookTime: number;
  serves: number;
  ingredients: BackendRecipeIngredient[];
  instructions: string[];
  images: string[];
  image?: string;
  videoUrl?: string;
  additionalVideos?: BackendRecipeVideo[];
  isPublished: boolean;
  likes?: number;
  dislikes?: number;
  rating?: number;
  reviewCount?: number;
  reviews?: Recipe["reviews"];
  tips?: BackendRecipeTip[];
  tipsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

function unwrapResponse<T>(response: { data?: ApiEnvelope<T> }): T {
  const payload = response.data;

  if (!payload?.success || payload.data === undefined) {
    throw new Error(payload?.error?.message || "Request failed");
  }

  return payload.data;
}

export function mapBackendRecipeToAdminRecipe(recipe: BackendRecipe): Recipe {
  return {
    id: recipe.id,
    moduleType: recipe.moduleType || recipe.moduleScope,
    hubId: recipe.hubId || undefined,
    storeId: recipe.storeId || undefined,
    name: recipe.name,
    description: recipe.description,
    category: recipe.category,
    difficulty: recipe.difficulty,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    serves: recipe.serves,
    ingredients: (recipe.ingredients || []).map((ingredient) => ({
      productId: ingredient.productId || undefined,
      name: ingredient.name,
      quantity: ingredient.quantity,
    })),
    instructions: recipe.instructions || [],
    images: recipe.images?.length ? recipe.images : recipe.image ? [recipe.image] : [],
    videoUrl: recipe.videoUrl,
    additionalVideos: recipe.additionalVideos || [],
    isPublished: recipe.isPublished,
    likes: recipe.likes || 0,
    dislikes: recipe.dislikes || 0,
    rating: recipe.rating || 0,
    reviewCount: recipe.reviewCount || 0,
    reviews: recipe.reviews || [],
    tips: (recipe.tips || []).map((tip) => ({
      id: tip.id,
      userId: tip.userId,
      userName: tip.userName,
      tip: tip.tip,
      likes: tip.likes,
      createdAt: tip.createdAt,
    })),
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
  };
}

export async function listRecipes(params?: Record<string, string>): Promise<Recipe[]> {
  const response = await recipesApi.getAll(params);
  return unwrapResponse<BackendRecipe[]>(response).map(mapBackendRecipeToAdminRecipe);
}

export async function getRecipeById(
  recipeId: string,
  params?: Record<string, string>
): Promise<Recipe> {
  const response = await recipesApi.getById(recipeId, params);
  return mapBackendRecipeToAdminRecipe(unwrapResponse<BackendRecipe>(response));
}

export async function createRecipe(payload: unknown): Promise<Recipe> {
  const response = await recipesApi.create(payload);
  return mapBackendRecipeToAdminRecipe(unwrapResponse<BackendRecipe>(response));
}

export async function updateRecipe(recipeId: string, payload: unknown): Promise<Recipe> {
  const response = await recipesApi.update(recipeId, payload);
  return mapBackendRecipeToAdminRecipe(unwrapResponse<BackendRecipe>(response));
}

export async function deleteRecipe(recipeId: string): Promise<{ id: string; deleted: boolean }> {
  const response = await recipesApi.delete(recipeId);
  return unwrapResponse<{ id: string; deleted: boolean }>(response);
}
