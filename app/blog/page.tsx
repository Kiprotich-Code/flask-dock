import { Navigation } from '@/components/navigation'
import { BlogList } from '@/components/blog-list'

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
        
        <BlogList />
      </main>
    </div>
  )
}
