// components/Navbar.tsx
'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Import Badge component
import {
  Home,
  BookOpen,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import SmartQ from './SmartQ';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Add dark mode state

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="w-full p-4 bg-white/80 dark:bg-gray-800 dark:backdrop-blur-sm shadow-sm fixed top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary dark:text-white flex items-center">
        <SmartQ 
          className="w-[150px] h-[30px] sm:w-[200px] sm:h-[40px] md:w-[250px] md:h-[50px] lg:w-[300px] lg:h-[60px]"
        />


          <Badge>Beta</Badge> {/* Add Badge for SmartQ */}
        </Link>
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="mr-2">
            {darkMode ? <Sun /> : <Moon />}
          </Button>
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
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md dark:bg-gray-700"
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
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:bg-gray-700 dark:hover:bg-gray-600"
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
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:bg-gray-700 dark:hover:bg-gray-600"
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
                <ul className="p-4 w-[200px] dark:bg-gray-700">
                  {session ? (
                    <>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/user/dashboard" className="block py-2 px-4 hover:bg-accent rounded-md dark:hover:bg-gray-600">
                            Mon Profil
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/default" className="block py-2 px-4 hover:bg-accent rounded-md dark:hover:bg-gray-600">
                            Mes Quizzes
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <button
                          onClick={() => signOut()}
                          className="w-full text-left py-2 px-4 hover:bg-accent rounded-md flex items-center dark:hover:bg-gray-600"
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
                          className="w-full text-left py-2 px-4 hover:bg-accent rounded-md flex items-center dark:hover:bg-gray-600"
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Connexion
                        </button>
                      </li>
                      <li>
                        <button className="w-full text-left py-2 px-4 hover:bg-accent rounded-md flex items-center dark:hover:bg-gray-600">
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
            className="md:hidden mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Link href="/" className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <Home className="inline-block mr-2 h-4 w-4" />
                Accueil
              </Link>
              <div className="py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                <BookOpen className="inline-block mr-2 h-4 w-4" />
                Quizzes
                <ul className="ml-6 mt-2 space-y-2">
                  <li>
                    <Link href="/search" className="block py-2 hover:text-blue-600 transition-colors duration-200 dark:hover:text-blue-400">
                      Explorez nos Quizzes
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="block py-2 hover:text-blue-600 transition-colors duration-200 dark:hover:text-blue-400">
                      Catégories
                    </Link>
                  </li>
                  <li>
                    <Link href="/popular" className="block py-2 hover:text-blue-600 transition-colors duration-200 dark:hover:text-blue-400">
                      Populaires
                    </Link>
                  </li>
                </ul>
              </div>
              <Link href="/about" className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                À propos
              </Link>
              {session ? (
                <>
                  <Link href="/user/dashboard" className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <User className="inline-block mr-2 h-4 w-4" />
                    Mon Profil
                  </Link>
                  <Link href="/default" className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    Mes Quizzes
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <LogOut className="inline-block mr-2 h-4 w-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => signIn()}
                    className="w-full text-left py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <LogIn className="inline-block mr-2 h-4 w-4" />
                    Connexion
                  </button>
                  <Link href="/register" className="block py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
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
  );
}
