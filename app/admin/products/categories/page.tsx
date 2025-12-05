"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
  Fish,
  Shell,
  Waves,
  FolderOpen,
  Drumstick,
  Egg,
  Leaf,
} from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  productCount: number
  icon: React.ElementType
  status: "active" | "inactive"
}

const categoryIcons: Record<string, React.ElementType> = {
  fish: Fish,
  prawns: Shell,
  crab: Shell,
  squid: Waves,
  lobster: Shell,
  chicken: Drumstick,
  mutton: Drumstick,
  egg: Egg,
  spices: Leaf,
}

export default function CategoriesPage() {
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [editCategoryOpen, setEditCategoryOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  
  // Load categories from localStorage or use defaults
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('productCategories')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Map icon names back to components
          return parsed.map((cat: any) => ({
            ...cat,
            icon: categoryIcons[cat.iconName] || Fish
          }))
        } catch (e) {
          console.error('Error loading categories:', e)
        }
      }
    }
    return [
      { id: "1", name: "Fish", slug: "fish", productCount: 45, icon: Fish, status: "active" },
      { id: "2", name: "Prawns", slug: "prawns", productCount: 30, icon: Shell, status: "active" },
      { id: "3", name: "Crab", slug: "crab", productCount: 20, icon: Shell, status: "active" },
      { id: "4", name: "Squid", slug: "squid", productCount: 15, icon: Waves, status: "active" },
      { id: "5", name: "Lobster", slug: "lobster", productCount: 10, icon: Shell, status: "active" },
    ]
  })
  
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", icon: "fish" })

  const saveCategories = (updatedCategories: Category[]) => {
    if (typeof window !== 'undefined') {
      const toSave = updatedCategories.map((cat) => {
        let iconName = 'fish'
        for (const [key, IconComponent] of Object.entries(categoryIcons)) {
          if (cat.icon === IconComponent) {
            iconName = key
            break
          }
        }
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          productCount: cat.productCount,
          iconName: iconName,
          status: cat.status
        }
      })
      localStorage.setItem('productCategories', JSON.stringify(toSave))
      window.dispatchEvent(new Event('categoriesUpdated'))
    }
  }

  const handleDelete = (category: Category) => {
    setDeletingCategory(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!deletingCategory) return
    const updatedCategories = categories.filter(c => c.id !== deletingCategory.id)
    setCategories(updatedCategories)
    saveCategories(updatedCategories)
    toast.success(`Category "${deletingCategory.name}" deleted successfully!`)
    setDeleteDialogOpen(false)
    setDeletingCategory(null)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setEditCategoryOpen(true)
  }

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    const updatedCategories = categories.map(c => 
      c.id === editingCategory.id ? editingCategory : c
    )
    setCategories(updatedCategories)
    saveCategories(updatedCategories)
    setEditCategoryOpen(false)
    setEditingCategory(null)
    toast.success(`Category updated successfully!`)
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.name || !newCategory.slug) return

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      slug: newCategory.slug,
      productCount: 0,
      icon: categoryIcons[newCategory.icon] || Fish,
      status: "active",
    }
    const updatedCategories = [...categories, category]
    setCategories(updatedCategories)
    saveCategories(updatedCategories)
    setNewCategory({ name: "", slug: "", icon: "fish" })
    setAddCategoryOpen(false)
    toast.success(`Category "${newCategory.name}" added successfully!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Categories</h1>
          <p className="text-muted-foreground">Manage product categories and organization</p>
        </div>
        <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>Create a new product category</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddCategory}>
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="category-slug"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(categoryIcons).map(([key, Icon]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, icon: key })}
                      className={`p-3 rounded-lg border transition-colors ${
                        newCategory.icon === key
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary hover:bg-primary/10"
                      }`}
                    >
                      <Icon className="h-5 w-5 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAddCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Category</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={editCategoryOpen} onOpenChange={setEditCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <form className="space-y-4" onSubmit={handleUpdateCategory}>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(categoryIcons).map(([key, Icon]) => {
                    const isSelected = editingCategory.icon === categoryIcons[key]
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, icon: categoryIcons[key] })}
                        className={`p-3 rounded-lg border transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary hover:bg-primary/10"
                        }`}
                      >
                        <Icon className="h-5 w-5 mx-auto" />
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Category</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Total Categories</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <Package className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{categories.reduce((sum, c) => sum + c.productCount, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-chart-1/10">
              <Package className="h-6 w-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round(categories.reduce((sum, c) => sum + c.productCount, 0) / categories.length)}
              </p>
              <p className="text-sm text-muted-foreground">Avg Products/Category</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Card key={category.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(category)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">/{category.slug}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{category.productCount} products</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      category.status === "active" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                    }
                  >
                    {category.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
