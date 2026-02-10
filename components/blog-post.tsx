'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, User } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  published_at: string
}

export function BlogPost() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/blog/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('[v0] Error fetching post:', error)
        setLoading(false)
      })
  }, [params.id])

  if (loading) {
    return <div className="text-center py-12">Loading post...</div>
  }

  if (!post) {
    return <div className="text-center py-12">Post not found</div>
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">{post.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
            {post.author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
            {post.published_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
