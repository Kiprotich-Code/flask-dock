import { Navigation } from '@/components/navigation'
import { CoursesList } from '@/components/courses-list'

export const metadata = {
  title: 'Courses | Wakamiru Consulting',
  description: 'Explore our professional courses designed for business growth and skill development.',
}

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-4">Professional Courses</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Advance your skills with our comprehensive selection of business and strategy courses.
        </p>
        
        <CoursesList />
      </main>
    </div>
  )
}
