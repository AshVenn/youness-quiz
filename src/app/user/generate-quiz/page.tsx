"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Subject {
  id: string;
  name: string;
  quizCount: number;
}

export default function GenerateQuizPage() {
  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [subject, setSubject] = useState<string>(''); // We'll store the subject ID here
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0); // Duration in seconds
  const [isLoading, setIsLoading] = useState(false);
  const [useExistingSubject, setUseExistingSubject] = useState(false); // Toggle between new or existing subjects
  const [existingSubjects, setExistingSubjects] = useState<Subject[]>([]); // Load user's existing subjects
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRemainingAttempts() {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/user/${session.user.id}/remaining-attempts`);
          const data = await response.json();
          setRemainingAttempts(data.remainingAttempts);
        } catch (error) {
          console.error('Failed to fetch remaining attempts:', error);
          toast({
            title: 'Erreur',
            description: 'Impossible de récupérer le nombre de tentatives restantes.',
            variant: 'destructive',
          });
        }
      }
    }

    async function fetchExistingSubjects() {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/user/${session.user.id}/subject`);
          const data = await response.json();
          setExistingSubjects(data.subjects);
        } catch (error) {
          console.error('Failed to load subjects:', error);
          toast({
            title: 'Erreur',
            description: 'Impossible de charger les sujets existants.',
            variant: 'destructive',
          });
        }
      }
    }

    fetchRemainingAttempts();
    fetchExistingSubjects();
  }, [session, toast]);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!session) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour générer un quiz.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (remainingAttempts !== null && remainingAttempts <= 0) {
      toast({
        title: 'Limite atteinte',
        description: "Vous n'avez plus de tentatives restantes.",
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const quizResponse = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, difficulty, subject, timerEnabled, timerDuration }),
      });

      if (!quizResponse.ok) {
        const quizError = await quizResponse.json();
        throw new Error(quizError.message || 'Erreur lors de la génération du quiz.');
      }

      const quizData = await quizResponse.json();

      if (remainingAttempts !== null) {
        setRemainingAttempts(remainingAttempts - 1);
      }

      // Redirect to take quiz page with the generated quiz ID
      router.push(`/user/takequiz/${quizData.quizId}`);
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : "Une erreur s'est produite. Veuillez réessayer.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6"
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Générer un Nouveau Quiz</CardTitle>
          <CardDescription className="text-center">
            Entrez un sujet ou une question pour générer un quiz personnalisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Histoire de la Révolution française"
              className="w-full"
            />
            <Select onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Facile</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="hard">Difficile</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="subject-toggle"
                  checked={useExistingSubject}
                  onCheckedChange={setUseExistingSubject}
                />
                <Label htmlFor="subject-toggle">
                  {useExistingSubject ? 'Choisir un sujet existant' : 'Créer un nouveau sujet'}
                </Label>
              </div>
              {useExistingSubject ? (
                <Select onValueChange={(id) => setSubject(id)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un sujet" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Entrez le sujet du quiz"
                  className="w-full"
                />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="timer-mode"
                checked={timerEnabled}
                onCheckedChange={setTimerEnabled}
              />
              <Label htmlFor="timer-mode">Activer le chronomètre</Label>
            </div>
            {timerEnabled && (
              <div>
                <Input
                  type="number"
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(Number(e.target.value))}
                  placeholder="Durée du chronomètre (en secondes)"
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">Durée en secondes</p>
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !prompt || !difficulty || !subject || (remainingAttempts !== null && remainingAttempts <= 0)}
              className="w-full"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
              {isLoading ? 'Génération en cours...' : 'Générer le Quiz'}
            </Button>
            {remainingAttempts !== null && (
              <p className="text-center text-sm text-muted-foreground">
                Tentatives restantes : {remainingAttempts}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
