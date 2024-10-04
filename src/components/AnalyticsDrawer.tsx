import React, { useMemo } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

type Attempt = {
  score: number
  attemptNumber: number
  createdAt: string
  timeTaken: number
}

type AnalyticsDrawerProps = {
  isOpen: boolean
  onClose: () => void
  quizName: string
  attempts: Attempt[]
  timerDuration?: number // Optional
}

export function AnalyticsDrawer({
  isOpen,
  onClose,
  quizName,
  attempts,
  timerDuration,
}: AnalyticsDrawerProps) {
  const data = useMemo(() => {
    return attempts.map((attempt) => ({
      attemptNumber: attempt.attemptNumber,
      score: attempt.score,
      timeTaken: attempt.timeTaken, // Keep timeTaken in seconds
    }))
  }, [attempts])

  const maxScore = useMemo(
    () => Math.max(...data.map((attempt) => attempt.score)),
    [data]
  )

  const maxTimeTaken = useMemo(
    () => Math.max(...data.map((attempt) => attempt.timeTaken)),
    [data]
  )

  const maxTimeAxis = useMemo(() => {
    if (timerDuration && timerDuration > 0) {
      return Math.max(maxTimeTaken, timerDuration)
    } else {
      return maxTimeTaken
    }
  }, [maxTimeTaken, timerDuration])

  const averageScore = useMemo(() => {
    const sum = data.reduce((acc, attempt) => acc + attempt.score, 0)
    return (sum / data.length).toFixed(2)
  }, [data])

  const averageTime = useMemo(() => {
    const sum = data.reduce((acc, attempt) => acc + attempt.timeTaken, 0)
    return (sum / data.length).toFixed(2) + 's' // Append 's' for seconds
  }, [data])

  const scoreTrend = useMemo(() => {
    if (data.length < 2) return '0'
    const firstScore = data[data.length - 1].score
    const lastScore = data[0].score
    if (firstScore === 0) return '0' // Avoid division by zero
    return (((lastScore - firstScore) / firstScore) * 100).toFixed(2)
  }, [data])

  const timeTrend = useMemo(() => {
    if (data.length < 2) return '0'
    const firstTime = data[data.length - 1].timeTaken
    const lastTime = data[0].timeTaken
    if (firstTime === 0) return '0' // Avoid division by zero
    return (((lastTime - firstTime) / firstTime) * 100).toFixed(2)
  }, [data])

  const chartConfig = {
    score: {
      label: 'Score',
      color: 'hsl(var(--chart-1))',
    },
    time: {
      label: 'Temps',
      color: 'hsl(var(--chart-2))',
    },
  }

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="h-screen w-full max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] flex flex-col overflow-auto">
        {/* Header */}
        <div className="p-6">
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle className="text-2xl font-bold">
              Analyse des tentatives : {quizName}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="mt-4 space-y-8">
            {/* Bar Chart for Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Progression des scores</CardTitle>
                <CardDescription>
                  Évolution de vos performances au fil des tentatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-64">
                  <ResponsiveContainer>
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="attemptNumber"
                        tickLine={false}
                        tickMargin={10}
                        reversed={true} // To display latest attempt first
                      />
                      <YAxis
                        domain={[0, maxScore]}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="score"
                        fill="var(--color-score)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  {Number(scoreTrend) > 0 ? (
                    <>
                      Progression de {scoreTrend}%{' '}
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </>
                  ) : Number(scoreTrend) < 0 ? (
                    <>
                      Régression de {Math.abs(Number(scoreTrend))}%{' '}
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    </>
                  ) : (
                    'Pas de changement'
                  )}
                </div>
                <div className="leading-none text-muted-foreground">
                  Score moyen : {averageScore} points
                </div>
              </CardFooter>
            </Card>

            {/* Line Chart for Time Taken */}
            <Card>
              <CardHeader>
                <CardTitle>Temps par tentative</CardTitle>
                <CardDescription>
                  Durée de chaque tentative en secondes
                  {timerDuration && timerDuration > 0
                    ? ` (Durée totale du quiz : ${timerDuration} secondes)`
                    : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-64">
                  <ResponsiveContainer>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="attemptNumber"
                        tickLine={false}
                        reversed={true} // To display latest attempt first
                      />
                      <YAxis
                        domain={[0, maxTimeAxis]}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}s`}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="timeTaken"
                        stroke="var(--color-time)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  {Number(timeTrend) < 0 ? (
                    <>
                      Amélioration de {Math.abs(Number(timeTrend))}%{' '}
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    </>
                  ) : Number(timeTrend) > 0 ? (
                    <>
                      Augmentation de {timeTrend}%{' '}
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    </>
                  ) : (
                    'Pas de changement'
                  )}
                </div>
                <div className="leading-none text-muted-foreground">
                  Temps moyen : {averageTime}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
