import React, { useMemo } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

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
}

export function AnalyticsDrawer({ isOpen, onClose, quizName, attempts }: AnalyticsDrawerProps) {
  const data = useMemo(() => {
    return attempts.map(attempt => ({
      attemptNumber: attempt.attemptNumber,
      score: attempt.score,
      timeTaken: Math.round(attempt.timeTaken / 60), // Convert to minutes
    }))
  }, [attempts])

  const maxScore = useMemo(() => Math.max(...data.map(attempt => attempt.score)), [data])
  const maxTimeTaken = useMemo(() => Math.max(...data.map(attempt => attempt.timeTaken)), [data])

  const averageScore = useMemo(() => {
    const sum = data.reduce((acc, attempt) => acc + attempt.score, 0)
    return (sum / data.length).toFixed(2)
  }, [data])

  const averageTime = useMemo(() => {
    const sum = data.reduce((acc, attempt) => acc + attempt.timeTaken, 0)
    return (sum / data.length).toFixed(2)
  }, [data])

  const scoreTrend = useMemo(() => {
    if (data.length < 2) return 0
    const firstScore = data[0].score
    const lastScore = data[data.length - 1].score
    return ((lastScore - firstScore) / firstScore * 100).toFixed(2)
  }, [data])

  const timeTrend = useMemo(() => {
    if (data.length < 2) return 0
    const firstTime = data[0].timeTaken
    const lastTime = data[data.length - 1].timeTaken
    return ((lastTime - firstTime) / firstTime * 100).toFixed(2)
  }, [data])

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
    time: {
      label: "Temps",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
<Drawer open={isOpen} onClose={onClose}>
  <DrawerContent className="h-screen p-6 w-full max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] overflow-y-auto">
    <DrawerHeader className="flex justify-between items-center">
      <DrawerTitle className="text-2xl font-bold">Analyse des tentatives : {quizName}</DrawerTitle>
      <DrawerClose asChild>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </DrawerClose>
    </DrawerHeader>

    <div className="mt-4 space-y-8">
      {/* Bar Chart for Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Progression des scores</CardTitle>
          <CardDescription>Évolution de vos performances au fil des tentatives</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attemptNumber" tickLine={false} tickMargin={10} />
                <YAxis domain={[0, maxScore]} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {Number(scoreTrend) > 0 ? (
              <>Progression de {scoreTrend}% <TrendingUp className="h-4 w-4 text-green-500" /></>
            ) : (
              <>Régression de {Math.abs(Number(scoreTrend))}% <TrendingDown className="h-4 w-4 text-red-500" /></>
            )}
          </div>
          <div className="leading-none text-muted-foreground">Score moyen : {averageScore} points</div>
        </CardFooter>
      </Card>

      {/* Line Chart for Time Taken */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Temps par tentative</CardTitle>
          <CardDescription>Durée de chaque tentative en minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attemptNumber" tickLine={false} />
                <YAxis domain={[0, maxTimeTaken]} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="timeTaken" stroke="var(--color-time)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {Number(timeTrend) < 0 ? (
              <>Amélioration de {Math.abs(Number(timeTrend))}% <TrendingDown className="h-4 w-4 text-green-500" /></>
            ) : (
              <>Augmentation de {timeTrend}% <TrendingUp className="h-4 w-4 text-red-500" /></>
            )}
          </div>
          <div className="leading-none text-muted-foreground">Temps moyen : {averageTime} minutes</div>
        </CardFooter>
      </Card> */}
    </div>
  </DrawerContent>
</Drawer>

  )
}