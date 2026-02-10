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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const drafts = searchParams.get('drafts') === 'true'

    const db = await getDb()
    let query = 'SELECT * FROM blog_posts'
    const params: any[] = []

    // Only show published posts publicly, unless admin requesting drafts
    const session = await getServerSession()
    if (session?.user?.role === 'admin' && drafts) {
      query += ' WHERE status = ?'
      params.push('draft')
    } else {
      query += ' WHERE status = ?'
      params.push('published')
    }

    query += ' ORDER BY published_at DESC'

    const posts = await db.all(query, params)
    return NextResponse.json(posts)
  } catch (error) {
    console.error('[v0] Blog GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await db.run(
      `INSERT INTO blog_posts (title, content, excerpt, author, status, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))`,
      [title, content, excerpt || '', author || '', status || 'draft']
    )

    return NextResponse.json({ id: result.lastID }, { status: 201 })
  } catch (error) {
    console.error('[v0] Blog POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
