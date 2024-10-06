'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronRight, Star } from 'lucide-react'
import { Input } from "@/components/ui/input"
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

type Category = {
  _id: string;
  name: string;
  subjects: Subject[];
  featured: boolean;
}

type Subject = {
  _id: string;
  name: string;
  quizzes: Quiz[];
  featured: boolean;
}

type Quiz = {
  _id: string;
  title: string;
  createdBy: {
    _id: string;
    username: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  featured: boolean;
  averageRating: number;
  ratingCount: number;
}

const ITEMS_PER_PAGE = 5

export default function CategoriesPage() {
  const [originalCategories, setOriginalCategories] = useState<Category[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetch('/api/categories/full')
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setOriginalCategories(data);
        setCategories(data);
      })
      .catch((error) => console.error('Erreur lors de la récupération des catégories :', error));
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);

    if (term === '') {
      setCategories(originalCategories);
      return;
    }

    const filteredCategories = originalCategories.map(category => ({
      ...category,
      subjects: category.subjects.map(subject => ({
        ...subject,
        quizzes: subject.quizzes.filter(quiz => 
          quiz.title.toLowerCase().includes(term) ||
          quiz.createdBy.username.toLowerCase().includes(term)
        )
      })).filter(subject => 
        subject.name.toLowerCase().includes(term) || subject.quizzes.length > 0
      )
    })).filter(category => 
      category.name.toLowerCase().includes(term) || category.subjects.length > 0
    )

    setCategories(filteredCategories);
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    )
  }

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE)
  const paginatedCategories = categories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Catégories</h1>
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Rechercher des catégories, sujets ou quiz..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full max-w-md mx-auto"
          />
        </div>
        <motion.div layout className="space-y-6">
          <AnimatePresence>
            {paginatedCategories.map(category => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-card text-card-foreground">
                  <CardHeader className="cursor-pointer" onClick={() => toggleCategory(category._id)}>
                    <CardTitle className="text-3xl flex items-center justify-between">
                      {category.name}
                      {expandedCategories.includes(category._id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedCategories.includes(category._id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          {category.subjects.map(subject => (
                            <div key={subject._id} className="mb-4">
                              <h3 
                                className="text-2xl font-semibold mb-2 cursor-pointer flex items-center"
                                onClick={() => toggleSubject(subject._id)}
                              >
                                {subject.name}
                                {expandedSubjects.includes(subject._id) ? (
                                  <ChevronDown className="h-4 w-4 ml-2" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 ml-2" />
                                )}
                              </h3>
                              <AnimatePresence>
                                {expandedSubjects.includes(subject._id) && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {(subject.quizzes || []).map(quiz => (
                                      <Link href={`/quiz/${quiz._id}`} key={quiz._id}>
                                        <Card className="mb-2 hover:bg-accent transition-colors">
                                          <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                              <div>
                                                <h4 className="font-medium">{quiz.title}</h4>
                                                <p className="text-sm text-muted-foreground">par {quiz.createdBy.username}</p>
                                              </div>
                                              <div className="flex items-center space-x-2">
                                                <Badge
                                                  variant={
                                                    quiz.difficulty === 'easy'
                                                      ? 'secondary'
                                                      : quiz.difficulty === 'medium'
                                                      ? 'default'
                                                      : 'destructive'
                                                  }
                                                >
                                                  {quiz.difficulty}
                                                </Badge>
                                                {quiz.featured && (
                                                  <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                                                )}
                                              </div>
                                            </div>
                                            <div className="mt-2 flex items-center">
                                              <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                  <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                      i < Math.round(quiz.averageRating)
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-muted-foreground'
                                                    }`}
                                                  />
                                                ))}
                                              </div>
                                              <span className="ml-2 text-sm text-muted-foreground">
                                                {quiz.averageRating.toFixed(1)} ({quiz.ratingCount} avis)
                                              </span>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </Link>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
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
    </div>
  )
}