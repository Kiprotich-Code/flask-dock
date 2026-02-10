'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {session?.user?.name || session?.user?.email}</h1>
          <p className="text-lg text-muted-foreground">
            Your personal dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Dashboard stats */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Enrolled Courses</h3>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Upcoming Events</h3>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Consultations</h3>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Profile Completion</h3>
            <p className="text-3xl font-bold">0%</p>
          </div>
        </div>

        <div className="bg-secondary rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <p className="text-muted-foreground mb-6">
            Explore our services and start your professional journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/courses">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Browse Courses
              </Button>
            </a>
            <a href="/events">
              <Button variant="outline">
                View Events
              </Button>
            </a>
            <a href="/consultations">
              <Button variant="outline">
                Book Consultation
              </Button>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
