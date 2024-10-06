'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Moon,
  CreditCard,
  Search,
  Grid,
  TrendingUp
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import SmartQ from './SmartQ';

export default function Navbar() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { 
      href: '#', 
      label: 'Explorez', 
      icon: BookOpen,
      subItems: [
        { href: '/search', label: 'Recherchez', icon: Search, description: 'Trouvez des quiz sur tous les sujets' },
        { href: '/categories', label: 'Catégories', icon: Grid, description: 'Explorez les quiz par catégorie' },
        { href: '/popular', label: 'Populaire', icon: TrendingUp, description: 'Découvrez les quiz les plus appréciés' },
      ]
    },
    { href: '/about', label: 'À propos', icon: User },
    { href: '/pricing', label: 'Tarifs', icon: CreditCard },
  ];

  return (
    <header className="w-full p-4 bg-background text-foreground shadow-sm fixed top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <SmartQ 
            className="w-[150px] h-[30px] sm:w-[200px] sm:h-[40px] md:w-[250px] md:h-[50px] lg:w-[300px] lg:h-[60px]"
          />
          <Badge variant="secondary" className="ml-2">Beta</Badge>
        </Link>
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="mr-2">
            {darkMode ? <Sun className="text-foreground" /> : <Moon className="text-foreground" />}
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
              <SheetHeader>
                <SheetTitle>
                  <SmartQ className="w-[150px] h-[30px]" />
                </SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  Naviguez à travers SmartQ
                </SheetDescription>
              </SheetHeader>
              <nav className="py-4">
                {menuItems.map((item) => (
                  <div key={item.label}>
                    {item.subItems ? (
                      <>
                        <div className="flex items-center py-2 px-4 font-semibold text-foreground">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </div>
                        {item.subItems.map((subItem) => (
                          <Link 
                            key={subItem.href} 
                            href={subItem.href}
                            className={`flex items-center py-2 px-8 rounded-md transition-all duration-300 ${
                              pathname === subItem.href 
                                ? 'bg-primary text-primary-foreground font-semibold' 
                                : 'hover:bg-secondary text-foreground'
                            }`}
                          >
                            <subItem.icon className="mr-2 h-4 w-4" />
                            {subItem.label}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <Link 
                        href={item.href}
                        className={`flex items-center py-2 px-4 rounded-md transition-all duration-300 ${
                          pathname === item.href 
                            ? 'bg-primary text-primary-foreground font-semibold' 
                            : 'hover:bg-secondary text-foreground'
                        }`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                {session ? (
                  <>
                    <Link href="/user/dashboard" className="flex items-center py-2 px-4 hover:bg-secondary rounded-md transition-all duration-300 text-foreground">
                      <User className="mr-2 h-4 w-4" />
                      Mon Profil
                    </Link>
                    <Link href="/default" className="flex items-center py-2 px-4 hover:bg-secondary rounded-md transition-all duration-300 text-foreground">
                      Mes Quizzes
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left flex items-center py-2 px-4 hover:bg-secondary rounded-md transition-all duration-300 text-foreground"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => signIn()}
                      className="w-full text-left flex items-center py-2 px-4 hover:bg-secondary rounded-md transition-all duration-300 text-foreground"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Connexion
                    </button>
                    <Link href="/register" className="flex items-center py-2 px-4 hover:bg-secondary rounded-md transition-all duration-300 text-foreground">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Inscription
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.label}>
                {item.subItems ? (
                  <>
                    <NavigationMenuTrigger>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="flex items-center">
                                  <subItem.icon className="h-4 w-4 mr-2" />
                                  <div className="text-sm font-medium leading-none">{subItem.label}</div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {subItem.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
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
                          <Link href="/user/dashboard" className="block py-2 px-4 hover:bg-secondary rounded-md">
                            Mon Profil
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/default" className="block py-2 px-4 hover:bg-secondary rounded-md">
                            Mes Quizzes
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <button
                          onClick={() => signOut()}
                          className="w-full text-left py-2 px-4 hover:bg-secondary rounded-md flex items-center"
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
                          className="w-full text-left py-2 px-4 hover:bg-secondary rounded-md flex items-center"
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Connexion
                        </button>
                      </li>
                      <li>
                        <button className="w-full text-left py-2 px-4 hover:bg-secondary rounded-md flex items-center">
                          <UserPlus className="mr-2 h-4 w-4" />
                          <Link href="/register" className="block">
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
    </header>
  );
}