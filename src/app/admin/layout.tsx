'use client'

import React, { useState } from 'react'
import { 
  LayoutDashboard,
  Settings, 
  LogOut,
  Menu,
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut } from 'next-auth/react'
import { ModeToggle } from '../toggle-theme';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const NavItems = () => (
    <>
      <Link href="/admin" passHref>
        <Button variant={pathname === '/admin' ? 'secondary' : 'ghost'} className="w-full justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Tableau de bord
        </Button>
      </Link>
      <Link href="/admin/settings" passHref>
        <Button variant={pathname === '/admin/settings' ? 'secondary' : 'ghost'} className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
      </Link>
    </>
  )

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile header */}
      <header className="md:hidden bg-gray-100 dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 dark:bg-gray-800">
            <div className="flex flex-col h-full">
              <div className="p-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">SmartQ Admin</h2>
              </div>
              <nav className="flex-1 mt-6 flex flex-col">
                <NavItems />
              </nav>
              <div className="p-4 flex items-center justify-between">
                <Button variant="outline" className="flex-1 mr-2" onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
                <ModeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">SmartQ Admin</h2>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-100 dark:bg-gray-800 shadow-md">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">SmartQ Admin</h2>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <NavItems />
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4 justify-between items-center">
            <Button variant="outline" className="flex-1 mr-2" onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
            <ModeToggle />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </main>
    </div>
  )
}
