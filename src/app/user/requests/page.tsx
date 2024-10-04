'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Send, RefreshCw } from 'lucide-react'

type Request = {
  _id: string
  type: string
  message: string
  status: 'Pending' | 'Resolved' | 'Rejected'
  createdAt: string
}

export default function RequestsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [newRequest, setNewRequest] = useState({ type: '', message: '' })

  const { data: requests, isLoading, isError, refetch } = useQuery<Request[]>({
    queryKey: ['requests'],
    queryFn: async () => {
      const response = await fetch('/api/requests')
      if (!response.ok) {
        throw new Error('La réponse du réseau n\'était pas correcte')  // French error message
      }
      return response.json()
    },
    enabled: !!session
  })

  const createRequestMutation = useMutation({
    mutationFn: async (newRequest: { type: string; message: string }) => {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
      })
      if (!response.ok) {
        throw new Error('La réponse du réseau n\'était pas correcte')  // French error message
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
      toast({
        title: "Demande envoyée",
        description: "Votre demande a été soumise avec succès.",
      })
      setNewRequest({ type: '', message: '' })
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre demande. Veuillez réessayer.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRequest.type && newRequest.message) {
      createRequestMutation.mutate(newRequest)
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500'
      case 'Resolved': return 'bg-green-500'
      case 'Rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  if (isError) return <div className="text-center text-red-500">Une erreur s'est produite lors du chargement des demandes.</div>  // French error message

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Vos demandes</h1>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle demande</CardTitle>
              <CardDescription>Soumettez une nouvelle demande ici</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                  value={newRequest.type}
                  onValueChange={(value) => setNewRequest({ ...newRequest, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de demande" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Support technique</SelectItem>
                    <SelectItem value="feature">Nouvelle fonctionnalité</SelectItem>
                    <SelectItem value="bug">Signalement de bug</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Votre message"
                  value={newRequest.message}
                  onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
                  className="min-h-[100px]"
                />
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={createRequestMutation.isPending}>
                {createRequestMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Envoyer la demande
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Historique des demandes</CardTitle>
              <CardDescription>Vos demandes précédentes et leur statut</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={() => refetch()} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Actualiser
                </Button>
                <AnimatePresence>
                  {requests && requests.map((request) => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">{request.type}</CardTitle>
                          <CardDescription>{new Date(request.createdAt).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">{request.message}</p>
                        </CardContent>
                        <CardFooter>
                          <Badge className={`${getStatusColor(request.status)} text-white`}>
                            {request.status === 'Pending' ? 'En attente' : request.status === 'Resolved' ? 'Résolu' : 'Rejeté'} {/* Translated statuses */}
                          </Badge>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
