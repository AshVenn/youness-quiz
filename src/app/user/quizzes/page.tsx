// QuizzesPage.tsx

'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import {
  Loader2,
  BookOpen,
  Trash2,
  Edit,
  Save,
  BarChart2,
  Settings,
  Info,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { AnalyticsDrawer } from '@/components/AnalyticsDrawer'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

type Quiz = {
  id: string
  prompt: string
  createdAt: string
  questionsCount: number
  subject: string | null
  difficulty: string
  timerDuration: number
  averageRating: number
  ratingCount: number
  attemptCount: number
  public: boolean
}

type Subject = {
  id: string
  name: string
}

type Attempt = {
  score: number
  attemptNumber: number
  createdAt: string
  timeTaken: number
}

export default function QuizzesPage() {
  const [editingSubject, setEditingSubject] = useState<string | null>(null)
  const [newSubjectName, setNewSubjectName] = useState('')
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [selectedQuizName, setSelectedQuizName] = useState<string | null>(null)
  const [selectedtimerDuration, setSelectedtimerDuration] = useState<number | null>(null)

  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [quizToEdit, setQuizToEdit] = useState<Quiz | null>(null)
  const [updatedQuizData, setUpdatedQuizData] = useState<Partial<Quiz>>({})

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [quizDetails, setQuizDetails] = useState<any>(null)

  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: quizzesData, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['quizzes', session?.user?.id],
    queryFn: () => fetchQuizzes(session?.user?.id as string),
    enabled: !!session?.user?.id,
  });

  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['subjects', session?.user?.id],
    queryFn: () => fetchSubjects(session?.user?.id as string),
    enabled: !!session?.user?.id,
  })

  const { data: attemptsData } = useQuery({
    queryKey: ['attempts', session?.user?.id, selectedQuizId],
    queryFn: () =>
      fetchAttempts(session?.user?.id as string, selectedQuizId as string),
    enabled: !!session?.user?.id && !!selectedQuizId,
  })

  const deleteSubjectMutation = useMutation({
    mutationFn: async (subject: string) => {
      const response = await fetch(`/api/user/${session?.user?.id}/subject`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject }),
      })
      if (!response.ok) throw new Error('Failed to delete subject')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', session?.user?.id] })
      queryClient.invalidateQueries({ queryKey: ['quizzes', session?.user?.id] })
      toast({
        title: 'Succès',
        description: 'Le sujet a été supprimé avec succès.',
        variant: 'success',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Échec de la suppression du sujet.',
        variant: 'destructive',
      })
    },
  })

  const deleteQuizMutation = useMutation({
    mutationFn: async (quizId: string) => {
      const response = await fetch(`/api/user/${session?.user?.id}/quizzes/${quizId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete quiz')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', session?.user?.id] })
      toast({
        title: 'Succès',
        description: 'Le quiz a été supprimé avec succès.',
        variant: 'success',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Échec de la suppression du quiz.',
        variant: 'destructive',
      })
    },
  })

  const renameSubjectMutation = useMutation({
    mutationFn: async ({ oldSubject, newSubject }: { oldSubject: string; newSubject: string }) => {
      const response = await fetch(`/api/user/${session?.user?.id}/subject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldSubject, newSubject }),
      })
      if (!response.ok) throw new Error('Failed to rename subject')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', session?.user?.id] })
      queryClient.invalidateQueries({ queryKey: ['quizzes', session?.user?.id] })
      setEditingSubject(null)
      setNewSubjectName('')
      toast({
        title: 'Succès',
        description: 'Le sujet a été renommé avec succès.',
        variant: 'success',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Échec du renommage du sujet.',
        variant: 'destructive',
      })
    },
  })

  const moveQuizMutation = useMutation({
    mutationFn: async ({ quizId, newSubject }: { quizId: string; newSubject: string }) => {
      const response = await fetch(`/api/user/${session?.user?.id}/quiz/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newSubject }),
      })
      if (!response.ok) throw new Error('Failed to update quiz subject')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', session?.user?.id] })
      toast({
        title: 'Succès',
        description: 'Le quiz a été déplacé avec succès.',
        variant: 'success',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Échec du déplacement du quiz.',
        variant: 'destructive',
      })
    },
  })

  const handleDeleteSubject = (subject: string) => {
    deleteSubjectMutation.mutate(subject)
  }

  const handleDeleteQuiz = (quizId: string) => {
    deleteQuizMutation.mutate(quizId)
  }

  const handleRenameSubject = (oldSubject: string) => {
    if (!newSubjectName || newSubjectName === oldSubject) return
    renameSubjectMutation.mutate({ oldSubject, newSubject: newSubjectName })
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const sourceSubject = result.source.droppableId
    const destinationSubject = result.destination.droppableId
    const quizId = result.draggableId

    if (sourceSubject === destinationSubject) return

    moveQuizMutation.mutate({ quizId, newSubject: destinationSubject })
  }

  const handleAnalytics = (
    quizId: string,
    quizName: string,
    timerDuration: number
  ) => {
    setSelectedQuizId(quizId)
    setSelectedQuizName(quizName)
    setSelectedtimerDuration(timerDuration)
    setAnalyticsOpen(true)
  }

  const openSettingsDialog = (quiz: Quiz) => {
    setQuizToEdit(quiz)
    setUpdatedQuizData({
      public: quiz.public,
      timerDuration: quiz.timerDuration,
      // Ajoutez d'autres champs si nécessaire
    })
    setIsSettingsDialogOpen(true)
  }

  const handleUpdateQuizSettings = async () => {
    if (!quizToEdit) return
    try {
      const response = await fetch(`/api/user/${session?.user?.id}/quizzes/${quizToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuizData),
      })
      if (!response.ok) throw new Error('Failed to update quiz settings')
      const data = await response.json()
      queryClient.invalidateQueries({ queryKey: ['quizzes', session?.user?.id] })
      setIsSettingsDialogOpen(false)
      toast({
        title: 'Succès',
        description: 'Les paramètres du quiz ont été mis à jour.',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error updating quiz settings:', error)
      toast({
        title: 'Erreur',
        description: 'Échec de la mise à jour des paramètres du quiz.',
        variant: 'destructive',
      })
    }
  }

  const openDetailsDialog = async (quizId: string) => {
    if (!session?.user?.id) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour voir les détails du quiz.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const response = await fetch(`/api/user/${session.user.id}/quizzes/${quizId}`);
      if (!response.ok) throw new Error('Failed to fetch quiz details');
      const data = await response.json();
      setQuizDetails(data);
      setIsDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      toast({
        title: 'Erreur',
        description: 'Échec de la récupération des détails du quiz.',
        variant: 'destructive',
      });
    }
  };

  if (isLoadingQuizzes || isLoadingSubjects) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const quizzes = quizzesData?.quizzes || []
  const subjects = subjectsData?.subjects || []

  const groupedQuizzes = quizzes.reduce(
    (acc: Record<string, Quiz[]>, quiz: Quiz) => {
      if (!acc[quiz.subject || 'Sans Sujet']) acc[quiz.subject || 'Sans Sujet'] = []
      acc[quiz.subject || 'Sans Sujet'].push(quiz)
      return acc
    },
    {}
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6 px-4 sm:px-6 lg:px-8"
    >
      <h1 className="text-3xl font-bold mb-6">Mes Quiz</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        {subjects.length === 0 ? (
          <p className="text-center text-gray-500">
            Vous n'avez pas encore créé de sujets.
          </p>
        ) : (
          subjects.map((subject: Subject) => (
            <Droppable droppableId={subject.id} key={subject.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="mb-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    {editingSubject === subject.id ? (
                      <div className="flex items-center flex-grow mr-2">
                        <Input
                          value={newSubjectName}
                          onChange={(e) => setNewSubjectName(e.target.value)}
                          className="mr-2"
                        />
                        <Button
                          onClick={() => handleRenameSubject(subject.name)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <h2 className="text-2xl font-semibold">
                        {subject.name}
                      </h2>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setEditingSubject(subject.id)
                          setNewSubjectName(subject.name)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="flex items-center"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Confirmer la suppression
                            </DialogTitle>
                          </DialogHeader>
                          <p>
                            Êtes-vous sûr de vouloir supprimer le sujet "
                            {subject.name}" ?
                          </p>
                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleDeleteSubject(subject.name)
                              }
                            >
                              Confirmer
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {groupedQuizzes[subject.id] &&
                  groupedQuizzes[subject.id].length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {groupedQuizzes[subject.id].map(
                        (quiz: Quiz, index: number) => (
                          <Draggable
                            key={quiz.id}
                            draggableId={quiz.id}
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="hover:shadow-lg transition-shadow"
                              >
                                <CardHeader>
                                  <CardTitle className="flex items-center justify-between">
                                    <span className="truncate">
                                      {quiz.prompt}
                                    </span>
                                    <BookOpen className="h-5 w-5 text-gray-400" />
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-gray-500 mb-4">
                                    Créé le{' '}
                                    {new Date(
                                      quiz.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm mb-4">
                                    {quiz.questionsCount} question
                                    {quiz.questionsCount > 1 ? 's' : ''}
                                  </p>
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() =>
                                        router.push(
                                          `/user/takequiz/${quiz.id}`
                                        )
                                      }
                                      className="flex-1"
                                    >
                                      Reprendre le Quiz
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleAnalytics(
                                          quiz.id,
                                          quiz.prompt,
                                          quiz.timerDuration
                                        )
                                      }
                                    >
                                      <BarChart2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      onClick={() => openDetailsDialog(quiz.id)}
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      onClick={() => openSettingsDialog(quiz)}
                                    >
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button className="flex items-center">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Confirmer la suppression
                                          </DialogTitle>
                                        </DialogHeader>
                                        <p>
                                          Êtes-vous sûr de vouloir supprimer ce
                                          quiz ?
                                        </p>
                                        <DialogFooter>
                                          <Button
                                            variant="destructive"
                                            onClick={() =>
                                              handleDeleteQuiz(quiz.id)
                                            }
                                          >
                                            Confirmer
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      Aucun quiz dans ce sujet.
                    </p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))
        )}
      </DragDropContext>

      {/* Dialog pour les paramètres du quiz */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paramètres du Quiz</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Label>Rendre le quiz public</Label>
              <Switch
                checked={updatedQuizData.public}
                onCheckedChange={(value) => setUpdatedQuizData({ ...updatedQuizData, public: value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timerDuration" className="text-right">
                Durée du timer (secondes)
              </Label>
              <Input
                id="timerDuration"
                type="number"
                className="col-span-3"
                value={updatedQuizData.timerDuration || 0}
                onChange={(e) => setUpdatedQuizData({ ...updatedQuizData, timerDuration: Number(e.target.value) })}
              />
            </div>
            {/* Ajoutez d'autres paramètres si nécessaire */}
          </div>
          <DialogFooter>
            <Button
              onClick={() => handleUpdateQuizSettings()}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour les détails du quiz */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du Quiz</DialogTitle>
          </DialogHeader>
          {quizDetails ? (
            <div className="py-4">
              <p><strong>Titre :</strong> {quizDetails.quiz.prompt}</p>
              <p><strong>Créé le :</strong> {new Date(quizDetails.quiz.createdAt).toLocaleDateString()}</p>
              <p><strong>Nombre de questions :</strong> {quizDetails.quiz.questionsCount}</p>
              <p><strong>Note moyenne :</strong> {quizDetails.quiz.averageRating} ({quizDetails.quiz.ratingCount} avis)</p>
              <p><strong>Nombre total de tentatives :</strong> {quizDetails.statistics.totalAttempts}</p>
              <p><strong>Nombre total d'utilisateurs ayant pris le quiz :</strong> {quizDetails.statistics.totalUsers}</p>
              {/* Ajoutez d'autres détails si nécessaire */}
            </div>
          ) : (
            <p>Chargement des détails...</p>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnalyticsDrawer
        isOpen={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
        quizName={selectedQuizName || ''}
        attempts={attemptsData?.attempts || []}
        timerDuration={selectedtimerDuration || 0}
      />
    </motion.div>
  )
}

async function fetchQuizzes(userId: string) {
  const response = await fetch(`/api/user/${userId}/quizzes`)
  if (!response.ok) throw new Error('Failed to fetch quizzes')
  return response.json()
}

async function fetchSubjects(userId: string) {
  const response = await fetch(`/api/user/${userId}/subject`)
  if (!response.ok) throw new Error('Failed to fetch subjects')
  return response.json()
}

async function fetchAttempts(userId: string, quizId: string) {
  if (!quizId) throw new Error('Invalid quiz ID')
  const response = await fetch(
    `/api/user/${userId}/quizzes/${quizId}/attempts`
  )
  
  if (!response.ok) throw new Error('Failed to fetch attempts')
  return response.json()
}
