'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, User, BarChart3 } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  price: number
  instructor: string
  duration: number
  level: string
}

export function CoursesList() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/courses').then(res => res.json()),
      session ? fetch('/api/purchases').then(res => res.json()) : Promise.resolve([]),
    ])
      .then(([coursesData, purchasesData]) => {
        setCourses(coursesData)
        if (Array.isArray(purchasesData)) {
          setPurchasedCourseIds(new Set(purchasesData.map((p: any) => p.course_id)))
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('[v0] Error fetching data:', error)
        setLoading(false)
      })
  }, [session])

  if (loading) {
    return <div className="text-center py-12">Loading courses...</div>
  }

  if (courses.length === 0) {
    return <div className="text-center py-12">No courses available</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map(course => (
        <Card key={course.id} className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-2 text-sm text-muted-foreground flex-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{course.duration} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <Badge variant="outline" className="ml-auto">{course.level}</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="font-semibold text-primary">${course.price}</span>
              {purchasedCourseIds.has(course.id) ? (
                <Button disabled variant="outline" size="sm">
                  Enrolled
                </Button>
              ) : (
                <Link href={`/courses/${course.id}`}>
                  <Button size="sm">Enroll</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
