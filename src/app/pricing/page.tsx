'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const plans = [
  {
    name: 'Gratuit',
    price: { monthly: 0, annually: 0 },
    features: [
      '2 tentatives de quiz par jour',
      'Accès aux quizzes publics',
      'Création de quizzes limités',
    ],
    notIncluded: [
      'Tentatives illimitées',
      'Création de quizzes privés',
      'Analyses avancées',
    ],
  },
  {
    name: 'Premium',
    price: { monthly: 9.99, annually: 99.99 },
    features: [
      'Tentatives illimitées',
      'Création de quizzes privés',
      'Analyses avancées',
      'Support prioritaire',
    ],
    notIncluded: [
      'Fonctionnalités entreprise',
    ],
  },
  {
    name: 'Entreprise',
    price: { monthly: 29.99, annually: 299.99 },
    features: [
      'Toutes les fonctionnalités Premium',
      'Gestion d\'équipe',
      'Personnalisation avancée',
      'API d\'intégration',
      'Support dédié',
    ],
    notIncluded: [],
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <motion.h1 
          className="mt-10 text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Nos Tarifs
        </motion.h1>
        <div className="flex justify-center items-center">
          <Label htmlFor="billing-toggle" className="mr-2">Mensuel</Label>
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <Label htmlFor="billing-toggle" className="ml-2">Annuel</Label>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="flex flex-col h-full">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-3xl font-bold">
                  {isAnnual ? `${plan.price.annually}€/an` : `${plan.price.monthly}€/mois`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-center text-muted-foreground">
                      <X className="h-5 w-5 text-destructive mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Choisir ce plan
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}