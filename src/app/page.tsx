'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import { useRouter } from 'next/navigation';
import SmartQAnimated from '@/components/SmartQAnimated';

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  useEffect(() => {
    if (session) {
      fetch(`/api/user/${session.user.id}/remaining-attempts`)
        .then(res => res.json())
        .then(data => {
          setRemainingAttempts(data.remainingAttempts);
        })
        .catch(err => {
          console.error(err);
          setRemainingAttempts(0);
        });
    } else {
      setRemainingAttempts(null);
    }
  }, [session]);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!session) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour générer un quiz.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (remainingAttempts !== null && remainingAttempts <= 0) {
      toast({
        title: 'Limite atteinte',
        description: "Vous n'avez plus de tentatives restantes.",
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const quizResponse = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!quizResponse.ok) {
        const quizError = await quizResponse.json();
        throw new Error(quizError.message || 'Erreur lors de la génération du quiz.');
      }

      const quizData = await quizResponse.json();

      if (remainingAttempts !== null) {
        setRemainingAttempts(remainingAttempts - 1);
      }

      router.push(`/user/takequiz/${quizData.quizId}`);
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : "Une erreur s'est produite. Veuillez réessayer.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-background">
      <BackgroundBeamsWithCollision>
        <main className="flex-grow flex flex-col justify-center items-center h-full relative z-10">
          <SmartQAnimated
            className="w-[300px] h-[60px] sm:w-[400px] sm:h-[80px] md:w-[500px] md:h-[100px] lg:w-[600px] lg:h-[120px] mb-8"
          />

          <p className="max-w-xl mx-auto text-sm md:text-lg text-foreground text-center mb-4">
            Générez des quiz intelligents sur n'importe quel sujet, instantanément.
          </p>

          <p className="text-sm text-black dark:text-foreground flex justify-center items-center mb-6">
            Powered by{' '}
            <span className="text-primary font-semibold mx-1">Google Gemini Pro</span>{' '}
            <Sparkles className="text-primary w-5 h-5 ml-2" />
          </p>

          <Card className="w-full max-w-md backdrop-blur-sm bg-background/80 shadow-lg mx-auto border-primary/20">
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
                  className="mb-4 bg-background text-foreground border-input placeholder-muted-foreground"
                  disabled={!session || (remainingAttempts !== null && remainingAttempts <= 0)}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !prompt || !session || (remainingAttempts !== null && remainingAttempts <= 0)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Générer le Quiz'}
                </Button>

                {session && remainingAttempts !== null && (
                  <motion.p
                    className="mt-2 text-center text-sm text-muted-foreground"
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
        </main>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
