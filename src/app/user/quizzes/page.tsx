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
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { AnalyticsDrawer } from '@/components/AnalyticsDrawer'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

type Quiz = {
  id: string
  prompt: string
  createdAt: string
  questionsCount: number
  subject: string
  timerDuration: number // Added timerDuration here
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

const fetchQuizzes = async (userId: string) => {
  const response = await fetch(`/api/user/${userId}/quizzes`)
  if (!response.ok) throw new Error('Failed to fetch quizzes')
  return response.json()
}

const fetchSubjects = async (userId: string) => {
  const response = await fetch(`/api/user/${userId}/subject`)
  if (!response.ok) throw new Error('Failed to fetch subjects')
  return response.json()
}

const fetchAttempts = async (userId: string, quizId: string) => {
  if (!quizId) throw new Error('Invalid quiz ID')
  const response = await fetch(
    `/api/user/${userId}/quizzes/${quizId}/attempts`
  )
  
  if (!response.ok) throw new Error('Failed to fetch attempts')
  return response.json()
}

export default function QuizzesPage() {
  const [editingSubject, setEditingSubject] = useState<string | null>(null)
  const [newSubjectName, setNewSubjectName] = useState('')
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [selectedQuizName, setSelectedQuizName] = useState<string | null>(null)
  const [selectedtimerDuration, setSelectedtimerDuration] = useState<number | null>(null) // Added state for timerDuration

  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: quizzesData, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['quizzes', session?.user?.id],
    queryFn: () => fetchQuizzes(session?.user?.id as string),
    enabled: !!session?.user?.id,
  })

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
    setSelectedtimerDuration(timerDuration) // Set the selected timerDuration
    setAnalyticsOpen(true)
  }

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
      if (!acc[quiz.subject]) acc[quiz.subject] = []
      acc[quiz.subject].push(quiz)
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
                                          quiz.timerDuration // Pass timerDuration here
                                        )
                                      }
                                    >
                                      <BarChart2 className="h-4 w-4" />
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
      <AnalyticsDrawer
        isOpen={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
        quizName={selectedQuizName || ''}
        attempts={attemptsData?.attempts || []}
        timerDuration={selectedtimerDuration || 0} // Pass selectedtimerDuration here
      />
    </motion.div>
  )
}