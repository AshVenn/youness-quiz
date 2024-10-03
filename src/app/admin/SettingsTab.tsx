// SettingsTab.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'

type Settings = {
  defaultAttempts: number
  defaultQuizTimeLimit: number
  enablePublicLeaderboards: boolean
  enableInstantFeedback: boolean
  maxQuestionsPerQuiz: number
}

export default function SettingsTab() {
  const { toast } = useToast()
  const { data: settingsData, isLoading, error } = useQuery<Settings>({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await fetch('/api/admin/settings')
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des paramètres')
      }
      return res.json()
    },
  })

  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData)
    }
  }, [settingsData])

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Settings) => {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })
      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour des paramètres')
      }
      return res.json()
    },
    onSuccess: () => {
      toast({
        title: 'Paramètres mis à jour',
        description: 'Les paramètres ont été sauvegardés avec succès.',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les paramètres.',
        variant: 'destructive',
      })
    },
  })

  if (isLoading || !settings) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur lors du chargement des paramètres</div>
  }

  const handleSaveSettings = () => {
    if (settings) {
      updateSettingsMutation.mutate(settings)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres</CardTitle>
        <CardDescription>
          Gérez les paramètres globaux de SmartQ.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="default-attempts">
              Tentatives par défaut pour les nouveaux utilisateurs
            </Label>
            <Input
              id="default-attempts"
              type="number"
              value={settings.defaultAttempts}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultAttempts: parseInt(e.target.value, 10),
                })
              }
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="quiz-time-limit">
              Limite de temps par défaut pour les quiz (en minutes)
            </Label>
            <Input
              id="quiz-time-limit"
              type="number"
              value={settings.defaultQuizTimeLimit}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultQuizTimeLimit: parseInt(e.target.value, 10),
                })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-public-leaderboards"
              checked={settings.enablePublicLeaderboards}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  enablePublicLeaderboards: checked,
                })
              }
            />
            <Label htmlFor="enable-public-leaderboards">
              Activer les classements publics
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-instant-feedback"
              checked={settings.enableInstantFeedback}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  enableInstantFeedback: checked,
                })
              }
            />
            <Label htmlFor="enable-instant-feedback">
              Activer le feedback instantané pour les quiz
            </Label>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="max-questions-per-quiz">
              Nombre maximum de questions par quiz
            </Label>
            <Input
              id="max-questions-per-quiz"
              type="number"
              value={settings.maxQuestionsPerQuiz}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxQuestionsPerQuiz: parseInt(e.target.value, 10),
                })
              }
            />
          </div>
        </div>
        <Button className="mt-6" onClick={handleSaveSettings}>
          Sauvegarder les Paramètres
        </Button>
      </CardContent>
    </Card>
  )
}
