import { Navigation } from '@/components/navigation'

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
        
        {/* Courses list will be populated here */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">Course {i}</h3>
              <p className="text-muted-foreground mb-4">Coming soon...</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
