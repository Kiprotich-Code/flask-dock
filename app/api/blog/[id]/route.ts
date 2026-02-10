import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db: any = null

async function getDb() {
  if (!db) {
    db = await open({
      filename: '/home/user/dev.db',
      driver: sqlite3.Database,
    })
  }
  return db
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb()
    const post = await db.get('SELECT * FROM blog_posts WHERE id = ?', params.id)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if post is published or if user is admin
    const session = await getServerSession()
    if (post.status !== 'published' && session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('[v0] Blog GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, excerpt, author, status } = body

    const db = await getDb()
    await db.run(
      `UPDATE blog_posts SET title = ?, content = ?, excerpt = ?, author = ?, status = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [title, content, excerpt, author, status, params.id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Blog PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDb()
    await db.run('DELETE FROM blog_posts WHERE id = ?', params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Blog DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
