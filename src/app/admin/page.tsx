'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserPlus, 
  ChevronDown,
  Search,
  Edit,
  Trash,
  Plus,
  Minus,
  PlusCircle,
} from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

// Mock data for demonstration
const users = [
  { id: 1, username: 'user1', firstName: 'Jean', lastName: 'Dupont', email: 'jean@example.com', role: 'user', remainingAttempts: 5, createdAt: '2023-01-01' },
  { id: 2, username: 'user2', firstName: 'Marie', lastName: 'Martin', email: 'marie@example.com', role: 'admin', remainingAttempts: 10, createdAt: '2023-01-02' },
]

const categories = [
  { id: 1, name: 'Histoire' },
  { id: 2, name: 'Sciences' },
  { id: 3, name: 'Littérature' },
]

const quizzes = [
  { id: 1, title: 'Histoire de France', category: 'Histoire', difficulty: 'Moyen', questionsCount: 10 },
  { id: 2, title: 'Système solaire', category: 'Sciences', difficulty: 'Facile', questionsCount: 8 },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>Gérez les comptes utilisateurs, leurs tentatives et leurs rôles.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
                <Input className="w-full sm:w-1/3" placeholder="Rechercher un utilisateur..." />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Ajouter un Utilisateur
                    </Button>
                  </DialogTrigger>
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
                        <Input id="username" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input id="email" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                          Rôle
                        </Label>
                        <select id="role" className="col-span-3">
                          <option value="user">Utilisateur</option>
                          <option value="admin">Administrateur</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Ajouter l'Utilisateur</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Liste des utilisateurs enregistrés</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom d'utilisateur</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Tentatives restantes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.remainingAttempts}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Plus className="mr-2 h-4 w-4" />
                                Augmenter les tentatives
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Minus className="mr-2 h-4 w-4" />
                                Diminuer les tentatives
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Catégories</CardTitle>
              <CardDescription>Créez, modifiez ou supprimez des catégories de quiz.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
                <Input className="w-full sm:w-1/3" placeholder="Rechercher une catégorie..." />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter une Catégorie
                    </Button>
                  </DialogTrigger>
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
                        <Input id="category-name" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Ajouter la Catégorie</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Liste des catégories de quiz</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom de la catégorie</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Quiz</CardTitle>
              <CardDescription>Créez, modifiez ou supprimez des quiz.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
                <Input className="w-full sm:w-1/3" placeholder="Rechercher un quiz..." />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Créer un Quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Créer un Nouveau Quiz</DialogTitle>
                      <DialogDescription>
                        Ajoutez un nouveau quiz à votre collection.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quiz-title" className="text-right">
                          Titre
                        </Label>
                        <Input id="quiz-title" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quiz-category" className="text-right">
                          Catégorie
                        </Label>
                        <select id="quiz-category" className="col-span-3">
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quiz-difficulty" className="text-right">
                          Difficulté
                        </Label>
                        <select id="quiz-difficulty" className="col-span-3">
                          <option value="easy">Facile</option>
                          <option value="medium">Moyen</option>
                          <option value="hard">Difficile</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Créer le Quiz</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Liste des quiz disponibles</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Difficulté</TableHead>
                      <TableHead>Nombre de Questions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell>{quiz.title}</TableCell>
                        <TableCell>{quiz.category}</TableCell>
                        <TableCell>{quiz.difficulty}</TableCell>
                        <TableCell>{quiz.questionsCount}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Visualisez les statistiques d'utilisation de SmartQ.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Utilisateurs Actifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">1,234</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Créés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">567</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Tentatives Totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">8,901</p>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Graphiques à venir</h3>
                <p>Des graphiques détaillés seront ajoutés ici pour visualiser les tendances d'utilisation, les performances des quiz, etc.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
              <CardDescription>Gérez les paramètres globaux de SmartQ.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="default-attempts">Tentatives par défaut pour les nouveaux utilisateurs</Label>
                  <Input id="default-attempts" type="number" defaultValue={5} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="quiz-time-limit">Limite de temps par défaut pour les quiz (en minutes)</Label>
                  <Input id="quiz-time-limit" type="number" defaultValue={10} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="enable-public-leaderboards" />
                  <Label htmlFor="enable-public-leaderboards">Activer les classements publics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="enable-instant-feedback" />
                  <Label htmlFor="enable-instant-feedback">Activer le feedback instantané pour les quiz</Label>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="max-questions-per-quiz">Nombre maximum de questions par quiz</Label>
                  <Input id="max-questions-per-quiz" type="number" defaultValue={20} />
                </div>
              </div>
              <Button className="mt-6">Sauvegarder les Paramètres</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}