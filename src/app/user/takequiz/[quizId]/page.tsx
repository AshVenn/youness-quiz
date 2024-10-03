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

export default function TakeQuiz() {
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
  const [startTime, setStartTime] = useState<number | null>(null); // Added startTime state

  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const quizId = Array.isArray(params.quizId) ? params.quizId[0] : params.quizId;

  // Fetch quiz data when the component mounts
  useEffect(() => {
    if (quizId) {
      setLoading(true);
      fetchQuizData(quizId);
    }
  }, [quizId]);

  // Timer effect to count down the remaining time
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

      return () => clearInterval(intervalId); // Cleanup interval
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

      // Set timer if it is enabled and duration is provided
      if (data.timerEnabled && data.timerDuration) {
        setTimeLeft(data.timerDuration); // Set the timer duration
      }

      setStartTime(Date.now()); // Set the start time

      setLoading(false);
    } catch (error) {
      console.error(error);
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
    setStartTime(Date.now()); // Reset start time
    if (timeLeft !== null) {
      setTimeLeft(questions.length * 60); // Reset timer if it was enabled
    }
  };

  const calculateScore = () => {
    return quizState.answers.reduce(
      (score, answer, index) =>
        answer === questions[index].correctAnswer ? score + 1 : score,
      0
    );
  };

  const finishQuiz = async () => {
    // Prevent the function from running multiple times
    if (quizFinished) return;

    setQuizState((prev) => ({ ...prev, showResults: true }));
    setQuizFinished(true);

    const score = calculateScore();
    const endTime = Date.now();
    const timeTaken = startTime
      ? Math.floor((endTime - startTime) / 1000)
      : null; // Calculate time in seconds

    try {
      const response = await fetch('/api/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          answers: quizState.answers,
          score,
          timeTaken,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save quiz attempt');
      }
      toast({
        title: 'Quiz terminé',
        variant: 'success',
        description: 'Votre tentative a été enregistrée avec succès.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erreur',
        description:
          "Impossible d'enregistrer votre tentative. Veuillez réessayer.",
        variant: 'destructive',
      });
    }
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
      <div className="flex justify-center items-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button
              onClick={() => router.push('/user/dashboard')}
              className="mt-4"
            >
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Quiz vide</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aucune question trouvée pour ce quiz.</p>
            <Button
              onClick={() => router.push('/user/dashboard')}
              className="mt-4"
            >
              Retour au tableau de bord
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
        className="container mx-auto py-8"
      >
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Résultats du Quiz</CardTitle>
            <CardDescription>{quizTitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-4">
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
                <p className="font-semibold mb-2">{question.text}</p>
                <div className="flex items-center">
                  <p
                    className={
                      quizState.answers[index] === question.correctAnswer
                        ? 'text-green-600 flex items-center'
                        : 'text-red-600 flex items-center'
                    }
                  >
                    {quizState.answers[index] === question.correctAnswer ? (
                      <Check className="mr-2" />
                    ) : (
                      <X className="mr-2" />
                    )}
                    Votre réponse :{' '}
                    {question.options[quizState.answers[index]]}
                  </p>
                </div>
                {quizState.answers[index] !== question.correctAnswer && (
                  <p className="text-green-600 mt-2">
                    Réponse correcte : {question.options[question.correctAnswer]}
                  </p>
                )}
              </motion.div>
            ))}
            <div className="flex justify-between mt-6">
              <Button onClick={resetQuiz}>Recommencer le Quiz</Button>
              <Button onClick={() => router.push('/user/dashboard')}>
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8"
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{quizTitle}</CardTitle>
          {timeLeft !== null && (
            <CardDescription>
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
              <h2 className="text-xl font-bold mb-4">
                Question {quizState.currentQuestion + 1} sur {questions.length}
              </h2>
              <p className="mb-4">{currentQuestion.text}</p>
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
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between mt-6">
            <Button
              onClick={goToPreviousQuestion}
              disabled={quizState.currentQuestion === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
            </Button>
            <Button
              onClick={goToNextQuestion}
              disabled={quizState.answers[quizState.currentQuestion] === null}
            >
              {quizState.currentQuestion === questions.length - 1
                ? 'Terminer'
                : 'Suivant'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={finishQuiz} variant="destructive">
              Terminer le Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
