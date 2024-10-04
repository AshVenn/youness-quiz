// UsersTab.tsx

'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserPlus, Search, Edit, Trash, Key } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type User = {
  _id: string
  username: string
  firstName: string
  lastName: string
  email: string
  role: string
  remainingAttempts: number
  createdAt: string
}

type NewUser = {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}

export default function UsersTab() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState<NewUser>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'user',
  })
  const [editUserId, setEditUserId] = useState<string | null>(null)
  const [editUser, setEditUser] = useState<Partial<User>>({})
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false)
  const [newPassword, setNewPassword] = useState('')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Récupération des utilisateurs
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch('/api/admin/users')
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs')
      }
      return res.json()
    },
  })

  // Mutation pour ajouter un utilisateur
  const addUserMutation = useMutation({
    mutationFn: async (newUser: NewUser) => {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout de l'utilisateur")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsAddUserDialogOpen(false)
      setNewUser({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'user',
      })
      toast({
        title: 'Utilisateur ajouté',
        description: "L'utilisateur a été ajouté avec succès.",
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter l'utilisateur.",
        variant: 'destructive',
      })
    },
  })

  // Mutation pour supprimer un utilisateur
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsDeleteDialogOpen(false)
      setUserIdToDelete(null)
      toast({
        title: 'Utilisateur supprimé',
        description: "L'utilisateur a été supprimé avec succès.",
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer l'utilisateur.",
        variant: 'destructive',
      })
    },
  })

  // Mutation pour mettre à jour un utilisateur
  const updateUserMutation = useMutation({
    mutationFn: async ({
      userId,
      updatedUser,
    }: {
      userId: string
      updatedUser: Partial<User>
    }) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      })
      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour de l'utilisateur")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsEditDialogOpen(false)
      setEditUser({})
      setEditUserId(null)
      toast({
        title: 'Utilisateur mis à jour',
        description:
          "Les informations de l'utilisateur ont été mises à jour avec succès.",
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour l'utilisateur.",
        variant: 'destructive',
      })
    },
  })

  // Mutation pour réinitialiser le mot de passe
  const resetPasswordMutation = useMutation({
    mutationFn: async ({
      userId,
      newPassword,
    }: {
      userId: string
      newPassword: string
    }) => {
      const res = await fetch(`/api/admin/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })
      if (!res.ok) {
        throw new Error("Erreur lors de la réinitialisation du mot de passe")
      }
      return res.json()
    },
    onSuccess: () => {
      setIsResetPasswordDialogOpen(false)
      setNewPassword('')
      toast({
        title: 'Mot de passe réinitialisé',
        description: "Le mot de passe a été mis à jour avec succès.",
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible de réinitialiser le mot de passe.",
        variant: 'destructive',
      })
    },
  })

  const handleAddUser = () => {
    addUserMutation.mutate(newUser)
  }

  const handleDeleteUser = (userId: string) => {
    setUserIdToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditUserId(user._id)
    setEditUser(user)
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = () => {
    if (editUserId) {
      updateUserMutation.mutate({ userId: editUserId, updatedUser: editUser })
    }
  }

  const handleResetPassword = (userId: string) => {
    setEditUserId(userId)
    setIsResetPasswordDialogOpen(true)
  }

  const handleConfirmResetPassword = () => {
    if (editUserId) {
      resetPasswordMutation.mutate({ userId: editUserId, newPassword })
    }
  }

  if (isLoading) {
    return <div className="mt-24">Chargement...</div>
  }

  if (error) {
    return <div>Erreur lors du chargement des utilisateurs</div>
  }

  const filteredUsers = users?.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Utilisateurs</CardTitle>
        <CardDescription>
          Gérez les comptes utilisateurs, leurs tentatives et leurs rôles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un Utilisateur
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Nom d'utilisateur</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Rôle</TableHead>
                <TableHead>Tentatives</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {user.role}
                  </TableCell>
                  <TableCell>{user.remainingAttempts}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResetPassword(user._id)}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user._id)}
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

        {/* Dialog pour ajouter un utilisateur */}
        <Dialog
          open={isAddUserDialogOpen}
          onOpenChange={setIsAddUserDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un Nouvel Utilisateur</DialogTitle>
              <DialogDescription>
                Créez un nouveau compte utilisateur ou administrateur ici.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Nom d'utilisateur
                </Label>
                <Input
                  id="username"
                  className="col-span-3"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  className="col-span-3"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Nom
                </Label>
                <Input
                  id="lastName"
                  className="col-span-3"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  className="col-span-3"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="col-span-3"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rôle
                </Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddUser}>
                Ajouter l'Utilisateur
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog pour modifier un utilisateur */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'Utilisateur</DialogTitle>
              <DialogDescription>
                Mettez à jour les informations de l'utilisateur.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-username" className="text-right">
                  Nom d'utilisateur
                </Label>
                <Input
                  id="edit-username"
                  className="col-span-3"
                  value={editUser.username || ''}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-firstName" className="text-right">
                  Prénom
                </Label>
                <Input
                  id="edit-firstName"
                  className="col-span-3"
                  value={editUser.firstName || ''}
                  onChange={(e) =>
                    setEditUser({ ...editUser, firstName: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-lastName" className="text-right">
                  Nom
                </Label>
                <Input
                  id="edit-lastName"
                  className="col-span-3"
                  value={editUser.lastName || ''}
                  onChange={(e) =>
                    setEditUser({ ...editUser, lastName: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  className="col-span-3"
                  value={editUser.email || ''}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Rôle
                </Label>
                <Select
                  value={editUser.role || 'user'}
                  onValueChange={(value) =>
                    setEditUser({ ...editUser, role: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateUser}>
                Mettre à jour
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog pour réinitialiser le mot de passe */}
        <Dialog
          open={isResetPasswordDialogOpen}
          onOpenChange={setIsResetPasswordDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Réinitialiser le Mot de Passe</DialogTitle>
              <DialogDescription>
                Entrez un nouveau mot de passe pour l'utilisateur.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-password" className="text-right">
                  Nouveau Mot de Passe
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  className="col-span-3"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleConfirmResetPassword}>
                Réinitialiser
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
                Êtes-vous sûr de vouloir supprimer cet utilisateur ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  if (userIdToDelete) {
                    deleteUserMutation.mutate(userIdToDelete)
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
