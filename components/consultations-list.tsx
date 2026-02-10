'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, FileText } from 'lucide-react'

interface Consultation {
  id: string
  topic: string
  date: string
  duration: number
  notes: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function ConsultationsList() {
  const { data: session } = useSession()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return

    fetch('/api/consultations')
      .then(res => res.json())
      .then(data => {
        setConsultations(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('[v0] Error fetching consultations:', error)
        setLoading(false)
      })
  }, [session])

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please sign in to view your consultations</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return <div className="text-center py-12">Loading consultations...</div>
  }

  if (consultations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No consultations booked yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {consultations.map(consultation => (
        <Card key={consultation.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{consultation.topic}</CardTitle>
              <Badge className={statusColors[consultation.status]}>
                {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{new Date(consultation.date).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{consultation.duration} minutes</span>
              </div>
            </div>

            {consultation.notes && (
              <div className="flex gap-3 text-sm">
                <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                <p className="text-muted-foreground">{consultation.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
