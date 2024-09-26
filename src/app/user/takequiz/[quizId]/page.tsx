'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from 'next/navigation';

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

  const router = useRouter();
  const params = useParams();
  const quizId = Array.isArray(params.quizId) ? params.quizId[0] : params.quizId; // Fix for string | string[] issue

  useEffect(() => {
    if (quizId) {
      setLoading(true);
      fetchQuizData(quizId);
    }
  }, [quizId]);

  const fetchQuizData = async (id: string) => {
    try {
      const response = await fetch(`/api/quiz/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz data');
      }
      const data = await response.json();
      setQuestions(data.questions);
      setQuizTitle(data.prompt);
      setQuizState(prev => ({ ...prev, answers: new Array(data.questions.length).fill(null) }));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Erreur lors du chargement du quiz.');
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswer = (answer: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: [
        ...prev.answers.slice(0, prev.currentQuestion),
        answer,
        ...prev.answers.slice(prev.currentQuestion + 1)
      ]
    }));
  };

  // Navigate to next question
  const goToNextQuestion = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    } else {
      setQuizState(prev => ({ ...prev, showResults: true }));
    }
  };

  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }));
    }
  };

  // Reset the quiz
  const resetQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      answers: [],
      showResults: false,
    });
  };

  // Calculate final score
  const calculateScore = () => {
    return quizState.answers.reduce((score, answer, index) =>
      answer === questions[index].correctAnswer ? score + 1 : score, 0);
  };

  // Function to finish the quiz
  const finishQuiz = () => {
    setQuizState(prev => ({ ...prev, showResults: true }));
  };

  if (loading) {
    return (
      <div className="relative">
        <div>Chargement du quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <div>{error}</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="relative">
        <div>Aucune question trouvée pour ce quiz.</div>
      </div>
    );
  }

  if (quizState.showResults) {
    const score = calculateScore();
    return (
      <div className="relative">
        <Card className="w-full max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Résultats du Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-4">Votre score : {score} / {questions.length}</p>
            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">{question.text}</p>
                <p className={quizState.answers[index] === question.correctAnswer ? "text-green-600" : "text-red-600"}>
                  Votre réponse : {question.options[quizState.answers[index]]}
                </p>
                {quizState.answers[index] !== question.correctAnswer && (
                  <p className="text-green-600">Réponse correcte : {question.options[question.correctAnswer]}</p>
                )}
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <Button onClick={resetQuiz}>Recommencer le Quiz</Button>
              <Button onClick={() => router.push('/')}>Retour à l'accueil</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestion];

  return (
    <div className="relative">
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>{quizTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={(quizState.currentQuestion + 1) / questions.length * 100} className="mb-4" />
          <h2 className="text-xl font-bold mb-4">
            Question {quizState.currentQuestion + 1} sur {questions.length}
          </h2>
          <p className="mb-4">{currentQuestion.text}</p>
          <RadioGroup
            key={quizState.currentQuestion}
            onValueChange={(value) => handleAnswer(parseInt(value))}
            value={quizState.answers[quizState.currentQuestion]?.toString() || ""}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex justify-between mt-4">
            <Button onClick={goToPreviousQuestion} disabled={quizState.currentQuestion === 0}>
              Précédent
            </Button>
            <Button onClick={goToNextQuestion} disabled={quizState.answers[quizState.currentQuestion] === null}>
              {quizState.currentQuestion === questions.length - 1 ? "Terminer" : "Suivant"}
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={finishQuiz} className="bg-red-600 text-white">
              Terminer le Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
