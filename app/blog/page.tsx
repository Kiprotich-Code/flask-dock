import { Navigation } from '@/components/navigation'

export const metadata = {
  title: 'Blog | Wakamiru Consulting',
  description: 'Read insights about business strategy, market trends, and consulting advice.',
}

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-4">Market Insights & Articles</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Stay informed with our latest articles on business strategy, market trends, and industry insights.
        </p>
        
        {/* Blog posts will be populated here */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <article key={i} className="border-b pb-8 hover:shadow-lg transition p-6 rounded-lg bg-secondary">
              <h3 className="text-2xl font-bold mb-2">Blog Post {i}</h3>
              <p className="text-muted-foreground mb-4">Coming soon...</p>
              <a href="#" className="text-accent font-semibold">Read More →</a>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
