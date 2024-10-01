'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Quiz = {
  quizId: string;
  title: string;
  createdAt: string;
  questionsCount: number;
  subject: string;
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
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [newSubject, setNewSubject] = useState<string>('');
  const [subjectLimitReached, setSubjectLimitReached] = useState<boolean>(false);

  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchSubjects() {
      setIsLoading(true);
      try {
        if (session?.user?.id) {
          const response = await fetch(`/api/user/${session.user.id}/subject`);
          if (!response.ok) throw new Error('Failed to fetch subjects');
          const data = await response.json();
          console.log(data);
          
          const subjectsArray = Array.isArray(data.subjects) ? data.subjects : [];
          setSubjects(subjectsArray);

          if (subjectsArray.length >= 6) {
            setSubjectLimitReached(true);
          }
        }
      } catch (err) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les sujets.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      fetchSubjects();
    }
  }, [session, toast]);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        if (session?.user?.id) {
          const response = await fetch(`/api/user/${session.user.id}/dashboard`);
          if (!response.ok) throw new Error('Failed to fetch dashboard data');
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (err) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données du tableau de bord.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      fetchDashboardData();
    }
  }, [session, toast]);

  const handleGenerateQuiz = () => {
    router.push('/user/generate-quiz');
  };

  const handleAddSubject = async () => {
    if (!newSubject) return;

    if (subjectLimitReached) {
      toast({
        title: 'Limite atteinte',
        description: 'Vous avez déjà ajouté 6 sujets.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`/api/user/${session?.user?.id}/subject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubject }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add subject');
      }

      const newSubjectData = await response.json();
      setSubjects((prevSubjects) => [...prevSubjects, newSubjectData]);
      setNewSubject('');

      if (subjects.length + 1 >= 6) {
        setSubjectLimitReached(true);
      }

      toast({
        title: 'Succès',
        variant: "success",
        description: 'Nouveau sujet ajouté avec succès.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';

      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
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

  const { totalQuizzes, bestScore, lastQuizDate, quizHistory } = dashboardData;

  const filteredQuizzes = selectedSubject === 'all' 
    ? quizHistory 
    : quizHistory.filter((quiz) => quiz.subject === selectedSubject);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bonjour, {session?.user.name}</h1>

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

      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Nouveau sujet"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />
        <Button onClick={handleAddSubject}>Ajouter un sujet</Button>
      </div>

      <div className="flex items-center space-x-2">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner un sujet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les sujets</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject._id} value={subject._id}>
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
          {filteredQuizzes.map((quiz, index) => (
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
                  <p className="text-sm text-muted-foreground mb-2">Créé le: {new Date(quiz.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground mb-2">Sujet: {quiz.subject}</p>
                  <p className="text-sm text-muted-foreground mb-2">Difficulté: {quiz.difficulty}</p>
                  <p className="text-sm text-muted-foreground mb-4">Nombre de questions: {quiz.questionsCount}</p>
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
