import { Navigation } from '@/components/navigation'
import { Homepage } from '@/components/homepage'

export const metadata = {
  title: 'Wakamiru Consulting | Strategic Business Solutions',
  description: 'Transform your business with expert consulting, professional courses, industry events, and market insights.',
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <Homepage />
    </div>
  )
}
