'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Filter, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Quiz = {
  quizId: string;
  title: string;
  createdAt: string;
  questionsCount: number;
  subject: string; // Subject is now a string (name)
  difficulty: string;
};

type Subject = {
  _id: string;
  name: string;
  createdAt: string;
};

type DashboardData = {
  totalQuizzes: number;
  bestScore: number;
  lastQuizDate: string | null;
  quizHistory: Quiz[];
  remainingAttempts: number;
};

const fetchSubjects = async (userId: string) => {
  const response = await fetch(`/api/user/${userId}/subject`);
  if (!response.ok) throw new Error('Échec du chargement des sujets');
  return response.json();
};

const fetchDashboardData = async (userId: string) => {
  const response = await fetch(`/api/user/${userId}/dashboard`);
  if (!response.ok) throw new Error('Échec du chargement des données du tableau de bord');
  return response.json();
};

const addSubject = async ({ userId, name }: { userId: string; name: string }) => {
  const response = await fetch(`/api/user/${userId}/subject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Échec de l\'ajout du sujet');
  }
  return response.json();
};

export default function DashboardPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [newSubject, setNewSubject] = useState<string>('');

  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['subjects', session?.user?.id],
    queryFn: () => fetchSubjects(session?.user?.id as string),
    enabled: !!session?.user?.id,
    staleTime: Infinity,
  });

  const subjects: Subject[] = Array.isArray(subjectsData?.subjects) ? subjectsData?.subjects : [];

  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ['dashboard', session?.user?.id],
    queryFn: () => fetchDashboardData(session?.user?.id as string),
    enabled: !!session?.user?.id,
    staleTime: Infinity,
  });

  const addSubjectMutation = useMutation({
    mutationFn: addSubject,
    onSuccess: () => {
      if (session?.user?.id) {
        queryClient.invalidateQueries({ queryKey: ['subjects', session.user.id] });
      }
  
      setNewSubject('');
      toast({
        title: 'Succès',
        description: 'Nouveau sujet ajouté avec succès.',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const handleGenerateQuiz = () => {
    router.push('/user/generate-quiz');
  };

  const handleAddSubject = () => {
    if (!newSubject) return;
    if (subjects.length >= 10) {
      toast({
        title: 'Limite atteinte',
        description: 'Vous avez atteint la limite de 10 sujets.',
        variant: 'destructive',
      });
      return;
    }
    addSubjectMutation.mutate({ userId: session?.user?.id as string, name: newSubject });
  };

  if (isLoadingSubjects || isLoadingDashboard) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Impossible de charger les données du tableau de bord.</p>
      </div>
    );
  }

  const { totalQuizzes, bestScore, lastQuizDate, quizHistory, remainingAttempts } = dashboardData;

  // Since subject is a string (name), we directly compare to it
  const filteredQuizzes = selectedSubject === 'all' 
    ? quizHistory 
    : quizHistory.filter((quiz: Quiz) => quiz.subject === selectedSubject);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bonjour, {session?.user?.name}</h1>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Prêt à créer un nouveau quiz ?</h2>
        <Button onClick={handleGenerateQuiz} size="lg" className="bg-white text-blue-500 hover:bg-blue-100 transition-colors duration-200">
          <Plus className="mr-2 h-5 w-5" /> Générer un Quiz
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 text-white shadow-lg"
      >
        <span className="text-lg font-semibold">Tentatives restantes :</span>
        <AnimatePresence>
          <motion.div
            key={remainingAttempts}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <span className="text-2xl font-bold mr-2">{remainingAttempts}</span>
            <Sparkles className="h-6 w-6 text-yellow-200" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Nouveau sujet"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button onClick={handleAddSubject} disabled={subjects.length >= 10}>
                  Ajouter un sujet
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{subjects.length >= 10 ? 'Vous avez atteint la limite de 10 sujets.' : 'Ajouter un nouveau sujet'}</p>
            </TooltipContent>
          </Tooltip>

      </div>

      <div className="flex items-center space-x-2">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner un sujet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les sujets</SelectItem>
            {subjects.map((subject: Subject) => (
              <SelectItem key={subject._id} value={subject.name}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Filter className="h-5 w-5" />
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Mes Quiz</h2>
      {filteredQuizzes.length === 0 ? (
        <p>Aucun quiz trouvé pour ce sujet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz: Quiz, index: number) => (
            <motion.div 
              key={quiz.quizId} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Créé le : {new Date(quiz.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground mb-2">Sujet : {quiz.subject}</p> {/* Directly use quiz.subject */}
                  <p className="text-sm text-muted-foreground mb-2">Difficulté : {quiz.difficulty}</p>
                  <p className="text-sm text-muted-foreground mb-4">Nombre de questions : {quiz.questionsCount}</p>
                  <Button asChild className="w-full">
                    <Link href={`/user/takequiz/${quiz.quizId}`}>Voir le Quiz</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
