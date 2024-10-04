'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Home, BookOpen, User, LogIn, LogOut, UserPlus, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import { BackgroundLines } from "@/components/ui/background-lines"

export default function LandingPage() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (session) {
      fetch(`/api/user/${session.user.id}/remaining-attempts`)
        .then(res => res.json())
        .then(data => {
          setRemainingAttempts(data.remainingAttempts)
        })
        .catch(err => {
          console.error(err)
          setRemainingAttempts(0)
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
    <div className="flex flex-col min-h-screen">
      <header className="w-full p-4 bg-white/80 backdrop-blur-sm shadow-sm fixed top-0 z-50">
          <div className="max-w-screen-xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">SmartQ?</Link>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
            <NavigationMenu className="hidden md:flex">
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
                            href="/search"
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
                            href="/categories"
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
                            href="/popular"
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
                            <button className="w-full text-left py-2 px-4 hover:bg-accent rounded-md flex items-center">
                              <UserPlus className="mr-2 h-4 w-4" />
                              <Link href="/register" className="block hover:bg-accent rounded-md">
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
          </div>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Link href="/" className="block py-3 px-4 hover:bg-gray-100 transition-colors duration-200">
                    <Home className="inline-block mr-2 h-4 w-4" />
                    Accueil
                  </Link>
                  <div className="py-3 px-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <BookOpen className="inline-block mr-2 h-4 w-4" />
                    Quizzes
                    <ul className="ml-6 mt-2 space-y-2">
                      <li>
                        <Link href="/search" className="block py-2 hover:text-blue-600 transition-colors duration-200">
                          Explorez nos Quizzes
                        </Link>
                      </li>
                      <li>
                        <Link href="/categories" className="block py-2 hover:text-blue-600 transition-colors duration-200">
                          Catégories
                        </Link>
                      </li>
                      <li>
                        <Link href="/popular" className="block py-2 hover:text-blue-600 transition-colors duration-200">
                          Populaires
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <Link href="/about" className="block py-3 px-4 hover:bg-gray-100 transition-colors duration-200">
                    À propos
                  </Link>
                  {session ? (
                    <>
                      <Link href="/user/dashboard" className="block py-3 px-4 hover:bg-gray-100 transition-colors duration-200">
                        <User className="inline-block mr-2 h-4 w-4" />
                        Mon Profil
                      </Link>
                      <Link href="/default" className="block py-3 px-4 hover:bg-gray-100 transition-colors duration-200">
                        Mes Quizzes
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left py-3 px-4 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <LogOut className="inline-block mr-2 h-4 w-4" />
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => signIn()}
                        className="w-full text-left py-3 px-4 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <LogIn className="inline-block mr-2 h-4 w-4" />
                        Connexion
                      </button>
                      <Link href="/register" className="block py-3 px-4 hover:bg-gray-100 transition-colors duration-200">
                        <UserPlus className="inline-block mr-2 h-4 w-4" />
                        Inscription
                      </Link>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
        <BackgroundBeamsWithCollision>
        <main className="flex-grow flex flex-col justify-center items-center p-4 mt-16">
          <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-400 text-4xl md:text-6xl lg:text-8xl font-sans py-2 md:py-10 font-bold tracking-tight">
              SmartQ?
            </h2>
            <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center mb-8">
              Générez des quiz intelligents sur n'importe quel sujet, instantanément.
            </p>
            <Card className="w-full max-w-md backdrop-blur-sm shadow-lg mx-auto">
              <CardContent className="p-6">
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
                    className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 hover:from-purple-600 hover:via-violet-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Générer le Quiz'}
                  </Button>
                  {session && remainingAttempts !== null && (
                    <motion.p
                      className="mt-2 text-center text-sm text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      Tentatives restantes : {remainingAttempts}
                    </motion.p>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </BackgroundLines>
        </main>
      </BackgroundBeamsWithCollision>
    </div>
  )
}