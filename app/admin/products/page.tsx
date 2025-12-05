"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DataTable } from "@/components/admin/data-table"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/types"
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle,
  Archive,
  Download,
  Upload,
  ImageIcon,
} from "lucide-react"
import { toast } from "sonner"

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  
  // Load categories dynamically
  const [categories, setCategories] = useState<string[]>([
    "Fish", "Prawns", "Crab", "Squid", "Lobster", "Chicken", "Mutton", "Egg", "Spices"
  ])
  
  // Function to load categories from localStorage
  const loadCategories = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('productCategories')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const categoryNames = parsed.map((cat: any) => cat.name)
          setCategories(categoryNames)
        } catch (e) {
          console.error('Error loading categories:', e)
        }
      }
    }
  }
  
  // Load from localStorage on mount and listen for changes
  useEffect(() => {
    loadCategories()
    
    // Listen for storage changes (when category is added in another tab/page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'productCategories') {
        loadCategories()
      }
    }
    
    // Listen for custom event (same page updates)
    const handleCategoryUpdate = () => {
      loadCategories()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('categoriesUpdated', handleCategoryUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('categoriesUpdated', handleCategoryUpdate)
    }
  }, [])
  const [addProductOpen, setAddProductOpen] = useState(false)
  const [editProductOpen, setEditProductOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    unit: "",
    stock: "",
    lowStockThreshold: "",
    description: "",
    image: "",
  })

  const [imagePreview, setImagePreview] = useState<string>("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setNewProduct({ ...newProduct, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const [editForm, setEditForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    unit: "",
    stock: "",
    lowStockThreshold: "",
    description: "",
    status: "active" as "active" | "inactive",
  })

  const filteredProducts = products.filter((product) => {
    if (categoryFilter !== "all" && product.category !== categoryFilter) return false
    return true
  })

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.status === "active").length
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold).length

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProduct.name || !newProduct.sku || !newProduct.category || !newProduct.price) {
      toast.error("Please fill in all required fields")
      return
    }

    const product: Product = {
      id: `p-${Date.now()}`,
      name: newProduct.name,
      sku: newProduct.sku,
      category: newProduct.category,
      price: Number(newProduct.price),
      unit: newProduct.unit || "kg",
      stock: Number(newProduct.stock) || 0,
      lowStockThreshold: Number(newProduct.lowStockThreshold) || 10,
      status: "active",
      description: newProduct.description,
    }

    addProduct(product)
    toast.success(`Product "${product.name}" added successfully!`)
    setAddProductOpen(false)
    setImagePreview("")
    setNewProduct({
      name: "",
      sku: "",
      category: "",
      price: "",
      unit: "",
      stock: "",
      lowStockThreshold: "",
      description: "",
      image: "",
    })
  }

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct) return

    updateProduct(selectedProduct.id, {
      name: editForm.name,
      sku: editForm.sku,
      category: editForm.category,
      price: Number(editForm.price),
      unit: editForm.unit,
      stock: Number(editForm.stock),
      lowStockThreshold: Number(editForm.lowStockThreshold),
      description: editForm.description,
      status: editForm.status,
    })

    toast.success(`Product "${editForm.name}" updated successfully!`)
    setEditProductOpen(false)
    setSelectedProduct(null)
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setEditForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: String(product.price),
      unit: product.unit,
      stock: String(product.stock),
      lowStockThreshold: String(product.lowStockThreshold),
      description: product.description || "",
      status: product.status,
    })
    setEditProductOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    deleteProduct(product.id)
    toast.success(`Product "${product.name}" deleted successfully!`)
  }

  const handleToggleStatus = (product: Product) => {
    const newStatus = product.status === "active" ? "inactive" : "active"
    updateProduct(product.id, { status: newStatus })
    toast.success(`Product "${product.name}" ${newStatus === "active" ? "activated" : "deactivated"}`)
  }

  const columns = [
    {
      key: "product",
      header: "Product",
      cell: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (product: Product) => (
        <Badge variant="outline" className="capitalize">
          {product.category}
        </Badge>
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (product: Product) => (
        <div>
          <p className="font-semibold">₹{product.price}</p>
          <p className="text-sm text-muted-foreground">per {product.unit}</p>
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      cell: (product: Product) => {
        const isLowStock = product.stock <= product.lowStockThreshold
        return (
          <div className="flex items-center gap-2">
            {isLowStock ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : (
              <CheckCircle className="h-4 w-4 text-success" />
            )}
            <div>
              <p className={isLowStock ? "text-destructive font-medium" : "font-medium"}>
                {product.stock} {product.unit}
              </p>
              <p className="text-xs text-muted-foreground">Min: {product.lowStockThreshold}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (product: Product) => (
        <Badge
          variant="outline"
          className={
            product.status === "active"
              ? "bg-success/20 text-success border-success/30"
              : "bg-muted text-muted-foreground"
          }
        >
          {product.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (product: Product) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditDialog(product)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleStatus(product)}>
              <Archive className="mr-2 h-4 w-4" />
              {product.status === "active" ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProduct(product)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">Add, update, and manage all products in your inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Add a new product to your inventory</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleAddProduct}>
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      placeholder="VEG-TOM-001"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newProduct.unit}
                      onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                    >
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="g">Gram (g)</SelectItem>
                        <SelectItem value="ltr">Litre (ltr)</SelectItem>
                        <SelectItem value="ml">Millilitre (ml)</SelectItem>
                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                        <SelectItem value="dozen">Dozen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Low Stock Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    placeholder="10"
                    value={newProduct.lowStockThreshold}
                    onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Product description..."
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImagePreview("")
                            setNewProduct({ ...newProduct, image: "" })
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block text-center p-4">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setAddProductOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Product</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalProducts}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeProducts}</p>
              <p className="text-sm text-muted-foreground">Active Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lowStockProducts}</p>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoryFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("all")}
        >
          All Categories
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={filteredProducts}
            columns={columns}
            searchPlaceholder="Search products by name, SKU..."
            onExport={() => toast.success("Products exported successfully!")}
          />
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={editProductOpen} onOpenChange={setEditProductOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEditProduct}>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  id="edit-sku"
                  value={editForm.sku}
                  onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unit">Unit</Label>
                <Select value={editForm.unit} onValueChange={(value) => setEditForm({ ...editForm, unit: value })}>
                  <SelectTrigger id="edit-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="ltr">Litre (ltr)</SelectItem>
                    <SelectItem value="ml">Millilitre (ml)</SelectItem>
                    <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                    <SelectItem value="dozen">Dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-threshold">Low Stock Threshold</Label>
              <Input
                id="edit-threshold"
                type="number"
                value={editForm.lowStockThreshold}
                onChange={(e) => setEditForm({ ...editForm, lowStockThreshold: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                rows={3}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value: "active" | "inactive") => setEditForm({ ...editForm, status: value })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditProductOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
