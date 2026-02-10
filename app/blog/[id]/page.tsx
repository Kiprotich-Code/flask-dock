import { Navigation } from '@/components/navigation'
import { BlogPost } from '@/components/blog-post'

export const metadata = {
  title: 'Blog Post | Wakamiru Consulting',
  description: 'Read our detailed blog post on business strategy and consulting insights.',
}

export default function BlogPostPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-20">
        <BlogPost />
      </main>
    </div>
  )
}
