import { Navigation } from '@/components/navigation'
import { EventDetail } from '@/components/event-detail'

export const metadata = {
  title: 'Event Details | Wakamiru Consulting',
  description: 'View event details and book your tickets.',
}

export default function EventDetailPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-20">
        <EventDetail />
      </main>
    </div>
  )
}
