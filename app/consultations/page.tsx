import { Navigation } from '@/components/navigation'

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
        
        {/* Consultations list will be populated here */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">Consultation {i}</h3>
              <p className="text-muted-foreground mb-4">Coming soon...</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
