import { Navigation } from '@/components/navigation'
import { CourseDetail } from '@/components/course-detail'

export const metadata = {
  title: 'Course Details | Wakamiru Consulting',
  description: 'View course details and enroll in our professional courses.',
}

export default function CourseDetailPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-20">
        <CourseDetail />
      </main>
    </div>
  )
}
