'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { FaLinkedin } from 'react-icons/fa';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'

export default function About() {
  const [showMore, setShowMore] = React.useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <BackgroundBeamsWithCollision>
    <motion.div 
      className="min-h-screen p-6 md:p-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-center mb-12"
        variants={itemVariants}
      >
        À Propos de SmartQ
      </motion.h1>

      <div className="max-w-4xl mx-auto space-y-12">
        <motion.section variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Le Créateur: Youness Zouhairi</h2>
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <motion.img 
                  src="/images/ynszhr.jpg" 
                  alt="Photo du créateur"
                  className="rounded-full w-32 h-32 object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <div>
                  <p className="text-lg mb-4">
                    Passionné par la technologie et l'éducation, j'ai créé SmartQ pour révolutionner la façon dont nous apprenons et nous évaluons. Avec une expérience en développement web et en pédagogie, je m'efforce de créer des outils qui rendent l'apprentissage plus engageant et efficace.
                  </p>
                  <Link href="https://www.linkedin.com/in/youness-zouhairi-14127a2b9" passHref>
                    <Button variant="outline" className="mr-4">
                      <FaLinkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Button>
                  </Link>
                  <Link href="https://ynszhr-portfolio.vercel.app/" passHref>
                    <Button variant="outline">
                      <Globe className="mr-2 h-4 w-4" />
                      Portfolio
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">L'Application</h2>
              <p className="text-lg mb-4">
                SmartQ est une plateforme innovante de quiz en ligne conçue pour rendre l'apprentissage interactif et amusant. Que vous soyez étudiant, enseignant ou simplement curieux, SmartQ vous offre une expérience d'apprentissage unique.
              </p>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: showMore ? 'auto' : 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <p className="text-lg mb-4">
                  Avec des fonctionnalités telles que la création de quiz personnalisés, le suivi des progrès et des tableaux de bord intuitifs, SmartQ s'adapte à tous les styles d'apprentissage. Notre système de recommandation intelligent vous propose des quiz adaptés à votre niveau et à vos intérêts, vous permettant de progresser à votre rythme.
                </p>
                <p className="text-lg">
                  Rejoignez notre communauté grandissante d'apprenants et découvrez une nouvelle façon d'acquérir des connaissances !
                </p>
              </motion.div>
              <Button 
                variant="ghost" 
                onClick={() => setShowMore(!showMore)}
                className="mt-4"
              >
                {showMore ? 'Voir moins' : 'En savoir plus'}
                <motion.div
                  animate={{ rotate: showMore ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="ml-2 h-4 w-4" />
                </motion.div>
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section 
          variants={itemVariants}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Prêt à commencer ?</h2>
          <Link href="/signup" passHref>
            <Button size="lg" className="mt-4">
              Rejoignez SmartQ aujourd'hui
            </Button>
          </Link>
        </motion.section>
      </div>
    </motion.div>
    </BackgroundBeamsWithCollision>
  )
}