"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { questions as aiQuestions } from '@/lib/questions/questions1'
import { questions as algorithmQuestions } from '@/lib/questions/questions2'
import { questions as matrixQuestions } from '@/lib/questions/questions3'
import { ModeToggle as ToggleTheme } from './toggle-theme'

interface Question {
  text: string
  options: string[]
  correctAnswer: number
}

interface QuizState {
  currentQuestion: number
  answers: number[]
  showResults: boolean
  selectedQuiz: string | null
}

const quizTypes = [
  { id: 'ai', name: 'IA', questions: aiQuestions },
  { id: 'algorithms', name: 'C et Algorithmes', questions: algorithmQuestions },
  { id: 'matrices', name: 'Matrices', questions: matrixQuestions },
]

export default function QuizApp() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    showResults: false,
    selectedQuiz: null,
  })

  useEffect(() => {
    if (quizState.selectedQuiz) {
      const selectedQuizQuestions = quizTypes.find(qt => qt.id === quizState.selectedQuiz)?.questions || []
      setQuestions(selectedQuizQuestions)
    }
  }, [quizState.selectedQuiz])

  const handleQuizSelection = (quizId: string) => {
    setQuizState({
      currentQuestion: 0,
      answers: [],
      showResults: false,
      selectedQuiz: quizId,
    })
  }

  const handleAnswer = (answer: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: [
        ...prev.answers.slice(0, prev.currentQuestion),
        answer,
        ...prev.answers.slice(prev.currentQuestion + 1)
      ]
    }))
  }

  const goToNextQuestion = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }))
    } else {
      setQuizState(prev => ({ ...prev, showResults: true }))
    }
  }

  const goToPreviousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }))
    }
  }

  const resetQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      answers: [],
      showResults: false,
      selectedQuiz: null,
    })
  }

  const switchQuiz = () => {
    resetQuiz()
  }

  const calculateScore = () => {
    return quizState.answers.reduce((score, answer, index) => 
      answer === questions[index].correctAnswer ? score + 1 : score, 0
    )
  }

  // Function to end the quiz immediately and show results
  const finishQuiz = () => {
    setQuizState(prev => ({ ...prev, showResults: true }))
  }

  if (!quizState.selectedQuiz) {
    return (
      <div className="relative">
        <ToggleTheme />
        <Card className="w-full max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Choisissez un quiz</CardTitle>
          </CardHeader>
          <CardContent>
            {quizTypes.map((quizType) => (
              <Button
                key={quizType.id}
                onClick={() => handleQuizSelection(quizType.id)}
                className="w-full mb-2"
              >
                {quizType.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="relative">
        <ToggleTheme />
        <div>Chargement...</div>
      </div>
    )
  }

  if (quizState.showResults) {
    const score = calculateScore()
    return (
      <div className="relative">
        <ToggleTheme />
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
              <Button onClick={switchQuiz}>Changer de Quiz</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[quizState.currentQuestion]
  const quizTitle = quizTypes.find(qt => qt.id === quizState.selectedQuiz)?.name || ''

  return (
    <div className="relative">
      <ToggleTheme />
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
            key={quizState.currentQuestion} // Add key to reset state on question change
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
            <Button onClick={switchQuiz}>Changer de Quiz</Button>
            <Button onClick={goToNextQuestion}>
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
  )
}
