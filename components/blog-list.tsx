'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowRight } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  published_at: string
}

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('[v0] Error fetching posts:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading posts...</div>
  }

  if (posts.length === 0) {
    return <div className="text-center py-12">No blog posts yet</div>
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <Card key={post.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            <CardDescription>{post.excerpt}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

            <Link href={`/blog/${post.id}`}>
              <Button variant="ghost" className="gap-2">
                Read More <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
