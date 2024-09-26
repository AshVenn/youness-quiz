'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

type UserProfile = {
  name: string
  email: string
  role: string
  createdAt: string
  quizCount: number
  averageScore: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user?.id) return
      try {
        const response = await fetch(`/api/user/${session.user.id}/profile`)
        if (!response.ok) throw new Error('Failed to fetch profile')
        const data = await response.json()
        setProfile(data.profile)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [session, toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return <div className="text-center">Profile not found.</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6"
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Mon Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/images/user.png" alt={profile.name} />
              <AvatarFallback>{profile.name}</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">{profile.name}</p>
            <p className="text-gray-500">{profile.email}</p>
            <p className="text-sm text-gray-500">Membre depuis {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.quizCount}</p>
              <p className="text-sm text-gray-500">Quiz créés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.averageScore.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Score moyen</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => window.location.href = '/user/settings'}>
            Modifier le profil
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}