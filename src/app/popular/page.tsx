'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from 'next/link'

type PopularQuiz = {
  _id: string;
  title: string;
  createdBy: {
    _id: string;
    username: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  featured: boolean;
  attemptCount: number;
  averageRating: number;
  ratingCount: number;
}

export default function PopularQuizzesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [quizzes, setQuizzes] = useState<PopularQuiz[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ITEMS_PER_PAGE = 6

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/quiz/popular?page=${currentPage}&limit=${ITEMS_PER_PAGE}`)
        if (!res.ok) {
          throw new Error('Échec de la récupération des quiz')
        }
        const data = await res.json()
        setQuizzes(data.quizzes)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error('Erreur lors de la récupération des quiz populaires :', error)
        setError('Erreur lors de la récupération des quiz populaires.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [currentPage])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Quiz Populaires</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/quiz/${quiz._id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{quiz.title}</span>
                    {quiz.featured && (
                      <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">par {quiz.createdBy.username}</p>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={
                      quiz.difficulty === 'easy' ? 'secondary' :
                      quiz.difficulty === 'medium' ? 'default' :
                      'destructive'
                    }>
                      {quiz.difficulty}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {quiz.attemptCount} tentatives
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(quiz.averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {quiz.averageRating.toFixed(1)} ({quiz.ratingCount} avis)
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href="#" 
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
