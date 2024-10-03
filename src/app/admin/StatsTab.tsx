// StatsTab.tsx

'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Stats = {
  activeUsers: number
  quizzesCreated: number
  totalAttempts: number
}

export default function StatsTab() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<Stats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des statistiques')
      }
      return res.json()
    },
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (error || !stats) {
    return <div>Erreur lors du chargement des statistiques</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques</CardTitle>
        <CardDescription>
          Visualisez les statistiques d'utilisation de SmartQ.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.activeUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quiz Créés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.quizzesCreated}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tentatives Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.totalAttempts}</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Graphiques à venir</h3>
          <p>
            Des graphiques détaillés seront ajoutés ici pour visualiser les
            tendances d'utilisation, les performances des quiz, etc.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
