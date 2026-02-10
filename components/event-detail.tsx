'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  capacity: number
  price: number
}

export function EventDetail() {
  const params = useParams()
  const { data: session } = useSession()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [ticketCount, setTicketCount] = useState(1)

  useEffect(() => {
    fetch(`/api/events/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('[v0] Error fetching event:', error)
        setLoading(false)
      })
  }, [params.id])

  const handleBooking = async () => {
    if (!session) {
      toast.error('Please sign in to book an event')
      return
    }

    setBooking(true)
    try {
      const response = await fetch(`/api/events/${params.id}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numberOfTickets: ticketCount }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to book event')
        return
      }

      toast.success(`Successfully booked ${ticketCount} ticket(s)!`)
      setTicketCount(1)
    } catch (error) {
      console.error('[v0] Booking error:', error)
      toast.error('Failed to book event')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading event...</div>
  }

  if (!event) {
    return <div className="text-center py-12">Event not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">{event.description}</p>

          <div className="space-y-4 bg-secondary p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Date & Time</p>
                <p>{new Date(event.date).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Location</p>
                <p>{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Capacity</p>
                <p>{event.capacity} seats available</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">${event.price}</span>
              <span className="text-sm text-muted-foreground">per person</span>
            </div>

            {session ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold">Number of Tickets:</label>
                  <input
                    type="number"
                    min="1"
                    value={ticketCount}
                    onChange={e => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 border rounded"
                  />
                </div>
                <Button
                  onClick={handleBooking}
                  disabled={booking}
                  className="w-full"
                  size="lg"
                >
                  {booking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    `Book Now - $${event.price * ticketCount}`
                  )}
                </Button>
              </div>
            ) : (
              <Button className="w-full" size="lg">
                Sign in to Book
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
