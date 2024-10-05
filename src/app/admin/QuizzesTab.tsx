'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Search, Edit, Trash, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

type Subject = {
  _id: string;
  name: string;
};

type Quiz = {
  _id: string;
  title: string;
  subject: string; // ID du sujet
  difficulty: string;
  prompt: string;
  questionsCount: number;
  featured: boolean; // Champ pour indiquer si le quiz est en vedette
};

export default function QuizzesTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddQuizDialogOpen, setIsAddQuizDialogOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>({
    title: '',
    subject: '',
    difficulty: 'easy',
    prompt: '',
    questionsCount: 5,
    featured: false,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quizIdToDelete, setQuizIdToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupération des quiz
  const {
    data: quizzes,
    isLoading: isLoadingQuizzes,
    error,
  } = useQuery<Quiz[]>({
    queryKey: ['admin-quizzes'],
    queryFn: async () => {
      const res = await fetch('/api/admin/quizzes');
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des quiz');
      }
      return res.json();
    },
  });

  // Récupération des sujets
  const { data: subjects } = useQuery<Subject[]>({
    queryKey: ['admin-subjects'],
    queryFn: async () => {
      const res = await fetch('/api/admin/subjects');
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des sujets');
      }
      return res.json();
    },
  });

  // Mutation pour ajouter un quiz avec l'état de chargement
  const { mutate: addQuiz, isLoading: isAddingQuiz } = useMutation<
    Quiz,
    Error,
    Partial<Quiz>
  >({
    mutationFn: async (newQuiz: Partial<Quiz>) => {
      const res = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuiz),
      });
      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout du quiz");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      setIsAddQuizDialogOpen(false);
      setNewQuiz({
        title: '',
        subject: '',
        difficulty: 'easy',
        prompt: '',
        questionsCount: 5,
        featured: false,
      });
      toast({
        title: 'Quiz ajouté',
        description: 'Le quiz a été ajouté avec succès.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter le quiz.",
        variant: 'destructive',
      });
    },
  });

  // Mutation pour supprimer un quiz
  const { mutate: deleteQuiz } = useMutation<void, Error, string>({
    mutationFn: async (quizId: string) => {
      const res = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Erreur lors de la suppression du quiz');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      setIsDeleteDialogOpen(false);
      setQuizIdToDelete(null);
      toast({
        title: 'Quiz supprimé',
        description: 'Le quiz a été supprimé avec succès.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le quiz.',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour mettre à jour le statut en vedette d'un quiz
  const { mutate: toggleFeatured } = useMutation<Quiz, Error, Quiz>({
    mutationFn: async (quiz: Quiz) => {
      const res = await fetch(`/api/admin/quizzes/${quiz._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !quiz.featured }),
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour du quiz");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      toast({
        title: 'Quiz mis à jour',
        description: 'Le statut du quiz a été mis à jour.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le quiz.',
        variant: 'destructive',
      });
    },
  });

  const handleAddQuiz = () => {
    addQuiz(newQuiz);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizIdToDelete(quizId);
    setIsDeleteDialogOpen(true);
  };

  if (isLoadingQuizzes) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des quiz</div>;
  }

  const filteredQuizzes = quizzes?.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subjects
        ?.find((subj) => subj._id === quiz.subject)
        ?.name?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Quiz</CardTitle>
        <CardDescription>
          Créez, modifiez ou supprimez des quiz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un quiz..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddQuizDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer un Quiz
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Difficulté</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>En Vedette</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuizzes?.map((quiz) => (
                <TableRow key={quiz._id}>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>
                    {subjects?.find((subj) => subj._id === quiz.subject)?.name}
                  </TableCell>
                  <TableCell>{quiz.difficulty}</TableCell>
                  <TableCell>{quiz.questionsCount}</TableCell>
                  <TableCell>
                    <Switch
                      checked={quiz.featured}
                      onCheckedChange={() => toggleFeatured(quiz)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteQuiz(quiz._id)}
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

        {/* Dialog pour ajouter un quiz */}
        <Dialog
          open={isAddQuizDialogOpen}
          onOpenChange={setIsAddQuizDialogOpen}
        >
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
                <Input
                  id="quiz-title"
                  className="col-span-3"
                  value={newQuiz.title}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quiz-prompt" className="text-right">
                  Prompt
                </Label>
                <Textarea
                  id="quiz-prompt"
                  className="col-span-3"
                  value={newQuiz.prompt}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, prompt: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quiz-questions-count" className="text-right">
                  Nombre de Questions
                </Label>
                <Input
                  id="quiz-questions-count"
                  type="number"
                  min={1}
                  max={20}
                  className="col-span-3"
                  value={newQuiz.questionsCount}
                  onChange={(e) =>
                    setNewQuiz({
                      ...newQuiz,
                      questionsCount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quiz-subject" className="text-right">
                  Sujet
                </Label>
                <Select
                  value={newQuiz.subject}
                  onValueChange={(value) =>
                    setNewQuiz({ ...newQuiz, subject: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez un sujet" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.map((subject) => (
                      <SelectItem key={subject._id} value={subject._id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quiz-difficulty" className="text-right">
                  Difficulté
                </Label>
                <Select
                  value={newQuiz.difficulty}
                  onValueChange={(value) =>
                    setNewQuiz({ ...newQuiz, difficulty: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une difficulté" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Facile</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="hard">Difficile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleAddQuiz}
                disabled={isAddingQuiz}
              >
                {isAddingQuiz ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                {isAddingQuiz ? 'Création en cours...' : 'Créer le Quiz'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog pour confirmer la suppression */}
        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce quiz ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  if (quizIdToDelete) {
                    deleteQuiz(quizIdToDelete);
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
