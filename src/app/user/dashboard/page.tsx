'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, BookOpen, Award, Clock } from 'lucide-react'

type Quiz = {
  quizId: string
  title: string
  createdAt: string
  questionsCount: number
}

type DashboardData = {
  totalQuizzes: number
  bestScore: number
  lastQuizDate: string | null
  quizHistory: Quiz[]
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true)
      try {
        if (session?.user?.id) {
          const response = await fetch(`/api/user/${session.user.id}/dashboard`)
          if (!response.ok) throw new Error('Failed to fetch dashboard data')
          const data = await response.json()
          setDashboardData(data)
        }
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du tableau de bord.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchDashboardData()
    }
  }, [session, toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Impossible de charger les données du tableau de bord.</p>
      </div>
    )
  }

  const { totalQuizzes, bestScore, lastQuizDate, quizHistory } = dashboardData

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des quiz
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuizzes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meilleur score
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bestScore}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dernier quiz
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastQuizDate ? new Date(lastQuizDate).toLocaleDateString() : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Mes Quiz</h2>
      {quizHistory.length === 0 ? (
        <p>Vous n'avez pas encore créé de quiz.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizHistory.map((quiz, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Créé le: {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Nombre de questions: {quiz.questionsCount}
                </p>
                <Button asChild className="w-full">
                  <Link href={`/user/takequiz/${quiz.quizId}`}>
                    Voir le Quiz
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
