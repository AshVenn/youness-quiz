import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { MainNav } from '@/components/main-nav'
import { UserNav } from '@/components/user-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SmartQ - Espace Utilisateur',
  description: 'Gérez vos quiz et votre profil sur SmartQ',
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`min-h-screen bg-background ${inter.className}`}>
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  )
}