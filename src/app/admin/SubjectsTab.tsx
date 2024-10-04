// SubjectsTab.tsx

'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Search, Edit, Trash } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Types
type Subject = {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  } | null;
  featured: boolean;
};

type Category = {
  _id: string;
  name: string;
};

export default function SubjectsTab() {
  // États
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editSubjectId, setEditSubjectId] = useState<string | null>(null);
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editSelectedCategoryId, setEditSelectedCategoryId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subjectIdToDelete, setSubjectIdToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupération des sujets
  const {
    data: subjects,
    isLoading,
    error,
  } = useQuery<Subject[]>({
    queryKey: ['admin-subjects'],
    queryFn: async () => {
      const res = await fetch('/api/admin/subjects');
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des sujets');
      }
      return res.json();
    },
  });

  // Récupération des catégories
  const {
    data: categories,
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

  // Mutation pour ajouter un sujet
  const addSubjectMutation = useMutation({
    mutationFn: async (newSubject: { name: string; categoryId?: string }) => {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject),
      });
      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout du sujet");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
      setIsAddSubjectDialogOpen(false);
      setNewSubjectName('');
      setSelectedCategoryId(null);
      toast({
        title: 'Sujet ajouté',
        description: 'Le sujet a été ajouté avec succès.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter le sujet.",
        variant: 'destructive',
      });
    },
  });

  // Mutation pour supprimer un sujet
  const deleteSubjectMutation = useMutation({
    mutationFn: async (subjectId: string) => {
      const res = await fetch(`/api/admin/subjects/${subjectId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la suppression du sujet");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
      setIsDeleteDialogOpen(false);
      setSubjectIdToDelete(null);
      toast({
        title: 'Sujet supprimé',
        description: 'Le sujet a été supprimé avec succès.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer le sujet.",
        variant: 'destructive',
      });
    },
  });

  // Mutation pour mettre à jour un sujet
  const updateSubjectMutation = useMutation({
    mutationFn: async ({
      subjectId,
      updatedSubject,
    }: {
      subjectId: string;
      updatedSubject: { name: string; categoryId?: string };
    }) => {
      const res = await fetch(`/api/admin/subjects/${subjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSubject),
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour du sujet");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
      setIsEditDialogOpen(false);
      setEditSubjectId(null);
      setEditSubjectName('');
      setEditSelectedCategoryId(null);
      toast({
        title: 'Sujet mis à jour',
        description: 'Le sujet a été mis à jour avec succès.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour le sujet.",
        variant: 'destructive',
      });
    },
  });

  // Mutation pour changer le statut en vedette
  const toggleFeaturedMutation = useMutation({
    mutationFn: async (subject: Subject) => {
      const res = await fetch(`/api/admin/subjects/${subject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !subject.featured }),
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour du sujet");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
      toast({
        title: 'Sujet mis à jour',
        description: 'Le statut du sujet a été mis à jour.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour le sujet.",
        variant: 'destructive',
      });
    },
  });

  // Gestion des actions
  const handleAddSubject = () => {
    const newSubject = {
      name: newSubjectName,
      categoryId: selectedCategoryId || undefined,
    };
    addSubjectMutation.mutate(newSubject);
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjectIdToDelete(subjectId);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditSubjectId(subject._id);
    setEditSubjectName(subject.name);
    setEditSelectedCategoryId(subject.category?._id || null);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubject = () => {
    if (editSubjectId) {
      const updatedSubject = {
        name: editSubjectName,
        categoryId: editSelectedCategoryId || undefined,
      };
      updateSubjectMutation.mutate({ subjectId: editSubjectId, updatedSubject });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des sujets</div>;
  }

  const filteredSubjects = subjects?.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Sujets</CardTitle>
        <CardDescription>
          Créez, modifiez ou supprimez des sujets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un sujet..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddSubjectDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un Sujet
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du sujet</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>En Vedette</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects?.map((subject) => (
                <TableRow key={subject._id}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.category?.name || 'Aucune'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={subject.featured}
                      onCheckedChange={() => toggleFeaturedMutation.mutate(subject)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSubject(subject)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteSubject(subject._id)}
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

        {/* Dialog pour ajouter un sujet */}
        <Dialog
          open={isAddSubjectDialogOpen}
          onOpenChange={setIsAddSubjectDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Sujet</DialogTitle>
              <DialogDescription>
                Créez un nouveau sujet pour vos quiz.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-name" className="text-right">
                  Nom du sujet
                </Label>
                <Input
                  id="subject-name"
                  className="col-span-3"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject-category" className="text-right">
                  Catégorie
                </Label>
                <Select
                  value={selectedCategoryId || ''}
                  onValueChange={(value) => setSelectedCategoryId(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddSubject}>
                Ajouter le Sujet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog pour modifier un sujet */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le Sujet</DialogTitle>
              <DialogDescription>
                Mettez à jour le nom du sujet et sa catégorie.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-subject-name" className="text-right">
                  Nom du sujet
                </Label>
                <Input
                  id="edit-subject-name"
                  className="col-span-3"
                  value={editSubjectName}
                  onChange={(e) => setEditSubjectName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-subject-category" className="text-right">
                  Catégorie
                </Label>
                <Select
                  value={editSelectedCategoryId || ''}
                  onValueChange={(value) => setEditSelectedCategoryId(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateSubject}>
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
                Êtes-vous sûr de vouloir supprimer ce sujet ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  if (subjectIdToDelete) {
                    deleteSubjectMutation.mutate(subjectIdToDelete);
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
  );
}
