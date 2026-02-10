import { Navigation } from '@/components/navigation'

export const metadata = {
  title: 'Events | Wakamiru Consulting',
  description: 'Browse and register for our industry events and networking opportunities.',
}

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Join our professional events to network with industry leaders and stay updated on market trends.
        </p>
        
        {/* Events list will be populated here */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">Event {i}</h3>
              <p className="text-muted-foreground mb-4">Coming soon...</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
