'use client'

import React from "react"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const consultationTopics = [
  'Business Strategy',
  'Market Analysis',
  'Financial Planning',
  'Operations Optimization',
  'Digital Transformation',
  'Risk Management',
  'Other',
]

export function ConsultationForm() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    preferredDate: '',
    duration: '60',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast.error('Please sign in to book a consultation')
      router.push('/login')
      return
    }

    if (!formData.topic || !formData.preferredDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to book consultation')
        return
      }

      toast.success('Consultation request submitted! We will contact you soon.')
      setFormData({ topic: '', preferredDate: '', duration: '60', notes: '' })
      router.push('/consultations')
    } catch (error) {
      console.error('[v0] Booking error:', error)
      toast.error('Failed to book consultation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Book a Consultation</CardTitle>
        <CardDescription>Schedule a session with our expert consultants</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Topic *</label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-background"
              required
            >
              <option value="">Select a topic</option>
              {consultationTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Preferred Date *</label>
              <Input
                type="datetime-local"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Duration (minutes)</label>
              <Input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="30"
                max="180"
                step="30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Additional Notes</label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tell us more about your consultation needs..."
              className="min-h-32"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              'Request Consultation'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
