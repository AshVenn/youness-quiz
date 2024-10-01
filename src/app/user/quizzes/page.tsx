'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, Reorder } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Loader2, BookOpen, Trash2, Edit, Save } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

type Quiz = {
  id: string
  prompt: string
  createdAt: string
  questionsCount: number
  subject: string
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Record<string, Quiz[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [editingSubject, setEditingSubject] = useState<string | null>(null)
  const [newSubjectName, setNewSubjectName] = useState('')
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchQuizzes() {
      if (!session?.user?.id) return
      try {
        const response = await fetch(`/api/user/${session.user.id}/quizzes`)
        if (!response.ok) throw new Error('Failed to fetch quizzes')
        const data = await response.json()

        const groupedQuizzes = data.quizzes.reduce((acc: Record<string, Quiz[]>, quiz: Quiz) => {
          if (!acc[quiz.subject]) acc[quiz.subject] = []
          acc[quiz.subject].push(quiz)
          return acc
        }, {})

        setQuizzes(groupedQuizzes)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load quizzes. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizzes()
  }, [session, toast])

  const handleDeleteSubject = async (subject: string) => {
    if (quizzes[subject].length > 0) {
      toast({
        title: "Error",
        description: `You cannot delete the subject "${subject}" as it has related quizzes.`,
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/user/${session?.user?.id}/subject`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject }),
      })

      if (!response.ok) throw new Error('Failed to delete subject')

      setQuizzes((prevQuizzes) => {
        const updatedQuizzes = { ...prevQuizzes }
        delete updatedQuizzes[subject]
        return updatedQuizzes
      })

      toast({
        title: "Succès",
        description: `Le sujet "${subject}" a été supprimé avec succès.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subject.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`/api/user/${session?.user?.id}/quizzes/${quizId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Failed to delete quiz');
  
      setQuizzes((prevQuizzes) => {
        const updatedQuizzes = { ...prevQuizzes };
        Object.keys(updatedQuizzes).forEach((subject) => {
          updatedQuizzes[subject] = updatedQuizzes[subject].filter((quiz) => quiz.id !== quizId);
        });
        return updatedQuizzes;
      });
  
      toast({
        title: "Succès",
        variant:"success",
        description: "Le quiz a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du quiz.",
        variant: "destructive",
      });
    }
  };
  

  const handleRenameSubject = async (oldSubject: string) => {
    if (!newSubjectName || newSubjectName === oldSubject) return

    try {
      const response = await fetch(`/api/user/${session?.user?.id}/subject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldSubject, newSubject: newSubjectName }),
      })

      if (!response.ok) throw new Error('Failed to rename subject')

      setQuizzes((prevQuizzes) => {
        const updatedQuizzes = { ...prevQuizzes }
        updatedQuizzes[newSubjectName] = updatedQuizzes[oldSubject]
        delete updatedQuizzes[oldSubject]
        return updatedQuizzes
      })

      setEditingSubject(null)
      setNewSubjectName('')

      toast({
        title: "Succès",
        variant:"success",
        description: `Le sujet "${oldSubject}" a été renommé en "${newSubjectName}".`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename subject.",
        variant: "destructive",
      })
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const sourceSubject = result.source.droppableId
    const destinationSubject = result.destination.droppableId
    const quizId = result.draggableId

    if (sourceSubject === destinationSubject) return

    try {
      const response = await fetch(`/api/user/${session?.user?.id}/quiz/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newSubject: destinationSubject }),
      })

      if (!response.ok) throw new Error('Failed to update quiz subject')

      setQuizzes((prevQuizzes) => {
        const updatedQuizzes = { ...prevQuizzes }
        const movedQuiz = updatedQuizzes[sourceSubject].find(quiz => quiz.id === quizId)
        if (movedQuiz) {
          updatedQuizzes[sourceSubject] = updatedQuizzes[sourceSubject].filter(quiz => quiz.id !== quizId)
          if (!updatedQuizzes[destinationSubject]) updatedQuizzes[destinationSubject] = []
          updatedQuizzes[destinationSubject].push({ ...movedQuiz, subject: destinationSubject })
        }
        return updatedQuizzes
      })

      toast({
        title: "Succès",
        description: `Le quiz a été déplacé vers "${destinationSubject}".`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move quiz.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6"
    >
      <h1 className="text-3xl font-bold mb-6">Mes Quiz</h1>
      {Object.keys(quizzes).length === 0 ? (
        <p className="text-center text-gray-500">Vous n'avez pas encore créé de quiz.</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(quizzes).map((subject) => (
            <Droppable droppableId={subject} key={subject}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="mb-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    {editingSubject === subject ? (
                      <div className="flex items-center">
                        <Input
                          value={newSubjectName}
                          onChange={(e) => setNewSubjectName(e.target.value)}
                          className="mr-2"
                        />
                        <Button onClick={() => handleRenameSubject(subject)}>
                          <Save className="h-4 w-4 mr-2" /> Sauvegarder
                        </Button>
                      </div>
                    ) : (
                      <h2 className="text-2xl font-semibold">{subject}</h2>
                    )}
                    <div className="flex space-x-2">
                      <Button onClick={() => {
                        setEditingSubject(subject)
                        setNewSubjectName(subject)
                      }}>
                        <Edit className="h-4 w-4 mr-2" /> Renommer
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="flex items-center">
                            <Trash2 className="h-4 w-4 mr-2" /> Supprimer le sujet
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                          </DialogHeader>
                          <p>Êtes-vous sûr de vouloir supprimer le sujet "{subject}" ?</p>
                          <DialogFooter>
                            <Button variant="destructive" onClick={() => handleDeleteSubject(subject)}>
                              Confirmer
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes[subject].map((quiz, index) => (
                      <Draggable key={quiz.id} draggableId={quiz.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="hover:shadow-lg transition-shadow"
                          >
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                <span className="truncate">{quiz.prompt}</span>
                                <BookOpen className="h-5 w-5 text-gray-400" />
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-500 mb-4">
                                Créé le {new Date(quiz.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm mb-4">
                                {quiz.questionsCount} question{quiz.questionsCount > 1 ? 's' : ''}
                              </p>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => router.push(`/user/takequiz/${quiz.id}`)}
                                  className="flex-1"
                                >
                                  Reprendre le Quiz
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button className="flex items-center">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Confirmer la suppression</DialogTitle>
                                    </DialogHeader>
                                    <p>Êtes-vous sûr de vouloir supprimer ce quiz ?</p>
                                    <DialogFooter>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteQuiz(quiz.id)}
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
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      )}
    </motion.div>
  )
}