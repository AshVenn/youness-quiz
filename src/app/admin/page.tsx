// page.tsx

'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UsersTab from './UsersTab'
import CategoriesTab from './CategoriesTab'
import QuizzesTab from './QuizzesTab'
import StatsTab from './StatsTab'
import SettingsTab from './SettingsTab'
import RequestsTab from './RequestsTab' // Import du nouveau composant

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="sticky top-0 z-1"> {/* Ajout de bg-white */}
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="users" className="text-xs sm:text-sm">
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-xs sm:text-sm">
              Catégories
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="text-xs sm:text-sm">
              Quiz
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-xs sm:text-sm">
              Demandes
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs sm:text-sm">
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">
              Paramètres
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="pt-4"> {/* Ajout de padding-top pour éviter le chevauchement */}
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
          <TabsContent value="quizzes">
            <QuizzesTab />
          </TabsContent>
          <TabsContent value="requests">
            <RequestsTab />
          </TabsContent>
          <TabsContent value="stats">
            <StatsTab />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
