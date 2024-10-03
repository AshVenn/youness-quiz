'use client'

import React from 'react'
import { useState } from 'react'
import { 
  Users, 
  BookOpen, 
  PlusCircle, 
  BarChart2, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white shadow-md fixed inset-y-0 left-0 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-40
      `}>
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">SmartQ Admin</h2>
        </div>
        <nav className="mt-6">
          <Link href="/admin/users" passHref>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Utilisateurs
            </Button>
          </Link>
          <Link href="/admin/categories" passHref>
            <Button variant="ghost" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Catégories
            </Button>
          </Link>
          <Link href="/admin/quizzes" passHref>
            <Button variant="ghost" className="w-full justify-start">
              <PlusCircle className="mr-2 h-4 w-4" />
              Quiz
            </Button>
          </Link>
          <Link href="/admin/stats" passHref>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart2 className="mr-2 h-4 w-4" />
              Statistiques
            </Button>
          </Link>
          <Link href="/admin/settings" passHref>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Button>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <Button variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 lg:p-8 ml-0 lg:ml-64">
        {children}
      </main>
    </div>
  )
}