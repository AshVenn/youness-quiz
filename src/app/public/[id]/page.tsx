'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CommentRatings } from '@/components/CommentRatings';

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizState {
  currentQuestion: number;
  answers: number[];
  showResults: boolean;
}

export default function PublicQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    showResults: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number>(0);

  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const quizId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (quizId) {
      setLoading(true);
      fetchQuizData(quizId);
    }
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === 0 && !quizFinished) {
      finishQuiz();
      return;
    }

    if (timeLeft !== null && timeLeft > 0) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) =>
          prevTimeLeft && prevTimeLeft > 0 ? prevTimeLeft - 1 : 0
        );
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timeLeft, quizFinished]);

  const fetchQuizData = async (id: string) => {
    try {
      const response = await fetch(`/api/quiz/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz data');
      }
      const data = await response.json();

      setQuestions(data.questions);
      setQuizTitle(data.prompt);
      setQuizState((prev) => ({
        ...prev,
        answers: new Array(data.questions.length).fill(null),
      }));

      if (data.timerEnabled && data.timerDuration) {
        setTimeLeft(data.timerDuration);
      }

      setStartTime(Date.now());
      setLoading(false);
    } catch (error) {
      setError('Erreur lors du chargement du quiz.');
      setLoading(false);
    }
  };

  const handleAnswer = (answer: number) => {
    setQuizState((prev) => ({
      ...prev,
      answers: [
        ...prev.answers.slice(0, prev.currentQuestion),
        answer,
        ...prev.answers.slice(prev.currentQuestion + 1),
      ],
    }));
  };

  const goToNextQuestion = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    } else {
      finishQuiz();
    }
  };

  const goToPreviousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
      }));
    }
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      answers: new Array(questions.length).fill(null),
      showResults: false,
    });
    setQuizFinished(false);
    setStartTime(Date.now());
    if (timeLeft !== null) {
      setTimeLeft(questions.length * 60);
    }
  };

  const calculateScore = () => {
    return quizState.answers.reduce(
      (score, answer, index) =>
        answer === questions[index].correctAnswer ? score + 1 : score,
      0
    );
  };

  const finishQuiz = () => {
    if (quizFinished) return;

    setQuizState((prev) => ({ ...prev, showResults: true }));
    setQuizFinished(true);
    setShowJoinDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button
              onClick={() => router.push('/')}
              className="mt-4 w-full"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen p-4 mt-28">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Quiz vide</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aucune question trouvée pour ce quiz.</p>
            <Button
              onClick={() => router.push('/')}
              className="mt-4 w-full"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState.showResults) {
    const score = calculateScore();
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4 mt-28"
      >
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Résultats du Quiz</CardTitle>
            <CardDescription className="text-sm sm:text-base">{quizTitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold mb-4">
              Votre score : {score} / {questions.length}
            </p>
            <Progress
              value={(score / questions.length) * 100}
              className="mb-6"
            />
            {questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4 p-4 border rounded-lg"
              >
                <p className="font-semibold mb-2 text-sm sm:text-base">{question.text}</p>
                <div className="flex items-center">
                  <p
                    className={`text-sm sm:text-base ${
                      quizState.answers[index] === question.correctAnswer
                        ? 'text-green-600 flex items-center'
                        : 'text-red-600 flex items-center'
                    }`}
                  >
                    {quizState.answers[index] === question.correctAnswer ? (
                      <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <X className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                    Votre réponse : {question.options[quizState.answers[index]]}
                  </p>
                </div>
                {quizState.answers[index] !== question.correctAnswer && (
                  <p className="text-green-600 mt-2 text-sm sm:text-base">
                    Réponse correcte : {question.options[question.correctAnswer]}
                  </p>
                )}
              </motion.div>
            ))}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Évaluez ce quiz :</h3>
              <CommentRatings
                rating={userRating}
                onRatingChange={(rating) => {
                  setUserRating(rating);
                  toast({
                    title: "Merci pour votre évaluation !",
                    description: "Inscrivez-vous pour que votre avis soit pris en compte.",
                    variant: "default",
                  });
                }}
                size={24}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
              <Button onClick={resetQuiz} className="w-full sm:w-auto">Recommencer le Quiz</Button>
              <Button onClick={() => router.push('/')} className="w-full sm:w-auto">
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vous avez aimé cette expérience ?</DialogTitle>
              <DialogDescription>
                Rejoignez-nous pour créer vos propres quiz, suivre vos progrès et bien plus encore !
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowJoinDialog(false)}>Plus tard</Button>
              <Button onClick={() => router.push('/register')}>S'inscrire</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container bg-background mx-auto py-8 px-4 mt-20"
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">{quizTitle}</CardTitle>
          {timeLeft !== null && (
            <CardDescription className="text-sm sm:text-base">
              Temps restant: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, '0')}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Progress
            value={((quizState.currentQuestion + 1) / questions.length) * 100}
            className="mb-6"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={quizState.currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Question {quizState.currentQuestion + 1} sur {questions.length}
              </h2>
              <p className="mb-4 text-sm sm:text-base">{currentQuestion.text}</p>
              <RadioGroup
                onValueChange={(value) => handleAnswer(parseInt(value))}
                value={
                  quizState.answers[quizState.currentQuestion]?.toString() || ''
                }
              >
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label htmlFor={`option-${index}`} className="text-sm sm:text-base">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
            <Button
              onClick={goToPreviousQuestion}
              disabled={quizState.currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
            </Button>
            <Button
              onClick={goToNextQuestion}
              disabled={quizState.answers[quizState.currentQuestion] === null}
              className="w-full sm:w-auto"
            >
              {quizState.currentQuestion === questions.length - 1
                ? 'Terminer'
                : 'Suivant'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={finishQuiz} variant="destructive" className="w-full sm:w-auto">
              Terminer le Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}