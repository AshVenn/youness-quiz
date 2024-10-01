// src/app/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Home, BookOpen, User, LogIn, LogOut, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from 'next/link'

export default function LandingPage() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)

  useEffect(() => {
    if (session) {
      // Fetch the user's remaining attempts
      fetch(`/api/user/${session.user.id}/remaining-attempts`)
        .then(res => res.json())
        .then(data => {
          setRemainingAttempts(data.remainingAttempts)
        })
        .catch(err => {
          console.error(err)
          setRemainingAttempts(0) // default to 0 if error occurs
        })
    } else {
      setRemainingAttempts(null)
    }
  }, [session])

  const handleSubmit = async () => {
    setIsLoading(true)

    if (!session) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour générer un quiz.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (remainingAttempts !== null && remainingAttempts <= 0) {
      toast({
        title: "Limite atteinte",
        description: "Vous n'avez plus de tentatives restantes.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const quizResponse = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!quizResponse.ok) {
        const quizError = await quizResponse.json()
        throw new Error(quizError.message || 'Erreur lors de la génération du quiz.')
      }

      const quizData = await quizResponse.json()

      // Update remainingAttempts in state
      if (remainingAttempts !== null) {
        setRemainingAttempts(remainingAttempts - 1)
      }

      router.push(`/user/takequiz/${quizData.quizId}`)
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <header className="w-full p-4 bg-white/80 backdrop-blur-sm shadow-sm">
        <NavigationMenu className="max-w-screen-xl mx-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Home className="mr-2 h-4 w-4" />
                  Accueil
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Quizzes</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/default"
                      >
                        <BookOpen className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Explorez nos Quizzes
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Découvrez une variété de quizzes sur différents sujets.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/default"
                      >
                        <div className="text-sm font-medium leading-none">Catégories</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Explorez les quizzes par catégorie.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/default"
                      >
                        <div className="text-sm font-medium leading-none">Populaires</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Découvrez les quizzes les plus appréciés.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  À propos
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              {session ? (
                <NavigationMenuTrigger>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </NavigationMenuTrigger>
              ) : (
                <NavigationMenuTrigger>
                  <LogIn className="mr-2 h-4 w-4" />
                <UserPlus className="mr-2 h-4 w-4"/>
                </NavigationMenuTrigger>
              )}
              <NavigationMenuContent>
                <ul className="p-4 w-[200px]">
                  {session ? (
                    <>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/user/dashboard" className="block py-2 px-4 hover:bg-accent rounded-md">
                            Mon Profil
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/default" className="block py-2 px-4 hover:bg-accent rounded-md">
                            Mes Quizzes
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <button
                          onClick={() => signOut()}
                          className="w-full text-left py-2 px-4 hover:bg-accent rounded-md flex items-center"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Déconnexion
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <button
                          onClick={() => signIn()}
                          className="w-full text-left py-2 px-4 hover:bg-accent rounded-md flex items-center"
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Connexion
                        </button>
                      </li>
                      <li>
                      <button  className="w-full text-left py-2 px-4 hover:bg-accent rounded-md flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" />
                          <Link href="/register" className="block  hover:bg-accent rounded-md">
                            Inscription
                          </Link>
                          </button>
                      </li>
                    
                    </>
                  )}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-grow flex justify-center items-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              <motion.div
                className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                SmartQ?
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.p
              className="text-lg mb-6 text-center text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Générez un QCM sur :
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Saisissez votre sujet ici"
                className="mb-4"
                disabled={!session || (remainingAttempts !== null && remainingAttempts <= 0)}
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !prompt || !session || (remainingAttempts !== null && remainingAttempts <= 0)}
                className="w-full"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Générer'}
              </Button>
              {session && remainingAttempts !== null && (
                <p className="mt-2 text-center text-sm text-gray-600">
                  Tentatives restantes : {remainingAttempts}
                </p>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
