// CategoriesTab.tsx

'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusCircle, Search, Edit, Trash } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Switch } from '@/components/ui/switch'

type Category = {
  _id: string
  name: string
  featured: boolean
}

export default function CategoriesTab() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null)
  const [editCategoryName, setEditCategoryName] = useState('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null
  )
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Récupération des catégories
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des catégories');
      }
      return res.json();
    },
  });

  // Mutation pour ajouter une catégorie
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory: { name: string }) => {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      })
      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout de la catégorie")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setIsAddCategoryDialogOpen(false)
      setNewCategoryName('')
      toast({
        title: 'Catégorie ajoutée',
        description: 'La catégorie a été ajoutée avec succès.',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter la catégorie.",
        variant: 'destructive',
      })
    },
  })

  // Mutation pour supprimer une catégorie
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error("Erreur lors de la suppression de la catégorie")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setIsDeleteDialogOpen(false)
      setCategoryIdToDelete(null)
      toast({
        title: 'Catégorie supprimée',
        description: 'La catégorie a été supprimée avec succès.',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer la catégorie.",
        variant: 'destructive',
      })
    },
  })

  // Mutation pour mettre à jour une catégorie
  const updateCategoryMutation = useMutation({
    mutationFn: async ({
      categoryId,
      updatedCategory,
    }: {
      categoryId: string
      updatedCategory: { name: string }
    }) => {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategory),
      })
      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour de la catégorie")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setIsEditDialogOpen(false)
      setEditCategoryId(null)
      setEditCategoryName('')
      toast({
        title: 'Catégorie mise à jour',
        description: 'La catégorie a été mise à jour avec succès.',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour la catégorie.",
        variant: 'destructive',
      })
    },
  })

  // Mutation pour changer le statut en vedette
  const toggleFeaturedMutation = useMutation({
    mutationFn: async (category: Category) => {
      const res = await fetch(`/api/admin/categories/${category._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !category.featured }),
      })
      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour de la catégorie")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast({
        title: 'Catégorie mise à jour',
        description: 'Le statut de la catégorie a été mis à jour.',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour la catégorie.",
        variant: 'destructive',
      })
    },
  })

  const handleAddCategory = () => {
    addCategoryMutation.mutate({ name: newCategoryName })
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryIdToDelete(categoryId)
    setIsDeleteDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditCategoryId(category._id)
    setEditCategoryName(category.name)
    setIsEditDialogOpen(true)
  }

  const handleUpdateCategory = () => {
    if (editCategoryId) {
      updateCategoryMutation.mutate({
        categoryId: editCategoryId,
        updatedCategory: { name: editCategoryName },
      })
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur lors du chargement des catégories</div>
  }

  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Catégories</CardTitle>
        <CardDescription>
          Créez, modifiez ou supprimez des catégories de quiz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une catégorie..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddCategoryDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter une Catégorie
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de la catégorie</TableHead>
                <TableHead>En Vedette</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories?.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={category.featured}
                      onCheckedChange={() =>
                        toggleFeaturedMutation.mutate(category)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Dialog pour ajouter une catégorie */}
        <Dialog
          open={isAddCategoryDialogOpen}
          onOpenChange={setIsAddCategoryDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une Nouvelle Catégorie</DialogTitle>
              <DialogDescription>
                Créez une nouvelle catégorie pour organiser vos quiz.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category-name" className="text-right">
                  Nom de la catégorie
                </Label>
                <Input
                  id="category-name"
                  className="col-span-3"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddCategory}>
                Ajouter la Catégorie
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog pour modifier une catégorie */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la Catégorie</DialogTitle>
              <DialogDescription>
                Mettez à jour le nom de la catégorie.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category-name" className="text-right">
                  Nom de la catégorie
                </Label>
                <Input
                  id="edit-category-name"
                  className="col-span-3"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateCategory}>
                Mettre à jour
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog pour confirmer la suppression */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cette catégorie ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  if (categoryIdToDelete) {
                    deleteCategoryMutation.mutate(categoryIdToDelete)
                  }
                }}
              >
                Supprimer
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Annuler
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
