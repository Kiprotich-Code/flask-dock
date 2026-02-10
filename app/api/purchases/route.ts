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

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDb()
    const user = await db.get('SELECT id FROM users WHERE email = ?', session.user.email)

    const purchases = await db.all(
      `SELECT p.*, c.title as course_title, c.price FROM purchases p
       JOIN courses c ON p.course_id = c.id
       WHERE p.user_id = ? ORDER BY p.created_at DESC`,
      user?.id
    )

    return NextResponse.json(purchases)
  } catch (error) {
    console.error('[v0] Purchases GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId } = body

    if (!courseId) {
      return NextResponse.json(
        { error: 'Missing course ID' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const user = await db.get('SELECT id FROM users WHERE email = ?', session.user.email)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already purchased
    const existing = await db.get(
      'SELECT id FROM purchases WHERE user_id = ? AND course_id = ?',
      [user.id, courseId]
    )

    if (existing) {
      return NextResponse.json(
        { error: 'You have already purchased this course' },
        { status: 400 }
      )
    }

    // Get course price
    const course = await db.get('SELECT price FROM courses WHERE id = ?', courseId)
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Create purchase
    const result = await db.run(
      `INSERT INTO purchases (user_id, course_id, price_paid, created_at)
       VALUES (?, ?, ?, datetime('now'))`,
      [user.id, courseId, course.price]
    )

    return NextResponse.json({ id: result.lastID }, { status: 201 })
  } catch (error) {
    console.error('[v0] Purchases POST error:', error)
    return NextResponse.json(
      { error: 'Failed to complete purchase' },
      { status: 500 }
    )
  }
}
