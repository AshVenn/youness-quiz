'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UsersTab from './UsersTab'
import CategoriesTab from './CategoriesTab'
import QuizzesTab from './QuizzesTab'
import StatsTab from './StatsTab'
import SettingsTab from './SettingsTab'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <TabsTrigger value="users" className="text-xs sm:text-sm">Utilisateurs</TabsTrigger>
          <TabsTrigger value="categories" className="text-xs sm:text-sm">Catégories</TabsTrigger>
          <TabsTrigger value="quizzes" className="text-xs sm:text-sm">Quiz</TabsTrigger>
          <TabsTrigger value="stats" className="text-xs sm:text-sm">Statistiques</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Paramètres</TabsTrigger>
        </TabsList>
      
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="quizzes">
          <QuizzesTab />
        </TabsContent>

        <TabsContent value="stats">
          <StatsTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}