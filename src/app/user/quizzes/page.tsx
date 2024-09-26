'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, BookOpen } from 'lucide-react'

type Quiz = {
  id: string
  prompt: string
  createdAt: string
  questionsCount: number
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
        setQuizzes(data.quizzes)
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
      {quizzes.length === 0 ? (
        <p className="text-center text-gray-500">Vous n'avez pas encore créé de quiz.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
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
                <Button
                  onClick={() => router.push(`/user/takequiz/${quiz.id}`)}
                  className="w-full"
                >
                  Reprendre le Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}