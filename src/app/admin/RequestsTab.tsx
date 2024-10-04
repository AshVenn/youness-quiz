'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search,CircleCheckBig,CircleX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'


type Request = {
  _id: string
  user: {
    _id: string
    username: string
    email: string
  }
  type: string
  message: string
  status: string
  createdAt: string
}

export default function RequestsTab() {
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetching the requests
  const { data: requests, isLoading, error } = useQuery<Request[]>({
    queryKey: ['admin-requests'],
    queryFn: async () => {
      const res = await fetch('/api/admin/requests')
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des demandes')
      }
      return res.json()
    },
  })

  const updateRequestStatusMutation = useMutation({
    mutationFn: async ({
      requestId,
      newStatus,
    }: {
      requestId: string
      newStatus: string
    }) => {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour de la demande')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] })
      toast({
        title: 'Demande mise à jour',
        description: 'Le statut de la demande a été mis à jour avec succès.',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la demande. Veuillez réessayer.',
        variant: 'destructive',
      })
    },
  })
  
  

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur lors du chargement des demandes</div>
  }

  const filteredRequests = requests?.filter(
    (req) =>
      req.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demandes des Utilisateurs</CardTitle>
        <CardDescription>
          Consultez et gérez les demandes soumises par les utilisateurs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full sm:w-64 mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une demande..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests?.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>{req.user.username}</TableCell>
                  <TableCell>{req.type}</TableCell>
                  <TableCell>{req.message}</TableCell>
                  <TableCell>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell>
                    {req.status === 'Pending' ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateRequestStatusMutation.mutate({
                              requestId: req._id,
                              newStatus: 'Resolved',
                            })
                          }
                        >
                          <CircleCheckBig className="h-4 w-4"/>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateRequestStatusMutation.mutate({
                              requestId: req._id,
                              newStatus: 'Rejected',
                            })
                            
                          }
                          className="ml-2"
                        >
                          <CircleX className="h-4 w-4"/>
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" disabled>
                        {req.status === 'Resolved' ? 'Résolu' : 'Rejeté'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
