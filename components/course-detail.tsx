'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, User, BarChart3, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Course {
  id: string
  title: string
  description: string
  price: number
  instructor: string
  duration: number
  level: string
}

export function CourseDetail() {
  const params = useParams()
  const { data: session } = useSession()
  const [course, setCourse] = useState<Course | null>(null)
  const [isPurchased, setIsPurchased] = useState(false)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/courses/${params.id}`).then(res => res.json()),
      session ? fetch('/api/purchases').then(res => res.json()) : Promise.resolve([]),
    ])
      .then(([courseData, purchasesData]) => {
        setCourse(courseData)
        if (Array.isArray(purchasesData)) {
          setIsPurchased(purchasesData.some((p: any) => p.course_id === courseData.id))
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('[v0] Error fetching data:', error)
        setLoading(false)
      })
  }, [params.id, session])

  const handlePurchase = async () => {
    if (!session) {
      toast.error('Please sign in to enroll')
      return
    }

    setPurchasing(true)
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: params.id }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to enroll in course')
        return
      }

      toast.success('Successfully enrolled in course!')
      setIsPurchased(true)
    } catch (error) {
      console.error('[v0] Purchase error:', error)
      toast.error('Failed to enroll in course')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading course...</div>
  }

  if (!course) {
    return <div className="text-center py-12">Course not found</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{course.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">{course.description}</p>

          <div className="space-y-4 bg-secondary p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Instructor</p>
                <p>{course.instructor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Duration</p>
                <p>{course.duration} hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Level</p>
                <p>{course.level}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">${course.price}</span>
            </div>

            {isPurchased ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="font-semibold text-green-800">You are enrolled in this course</p>
                <p className="text-sm text-green-700">Access the course content in your dashboard</p>
              </div>
            ) : (
              <Button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full"
                size="lg"
              >
                {purchasing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  'Enroll Now'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
