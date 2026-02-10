import { Navigation } from '@/components/navigation'
import { ConsultationForm } from '@/components/consultation-form'
import { ConsultationsList } from '@/components/consultations-list'

export const metadata = {
  title: 'Consultations | Wakamiru Consulting',
  description: 'Book personalized consultations with our expert business consultants.',
}

export default function ConsultationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-4">Expert Consultations</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Get personalized guidance from experienced business consultants for your specific needs.
        </p>
        
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <ConsultationForm />
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Consultations</h2>
            <ConsultationsList />
          </div>
        </div>
      </main>
    </div>
  )
}
