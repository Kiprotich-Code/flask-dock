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
    const db = await getDb()

    let consultations
    if (session?.user?.role === 'admin') {
      consultations = await db.all('SELECT * FROM consultations ORDER BY date DESC')
    } else if (session?.user?.email) {
      const user = await db.get('SELECT id FROM users WHERE email = ?', session.user.email)
      consultations = await db.all(
        'SELECT * FROM consultations WHERE user_id = ? ORDER BY date DESC',
        user?.id
      )
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(consultations)
  } catch (error) {
    console.error('[v0] Consultations GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
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
    const { topic, preferredDate, duration, notes } = body

    if (!topic || !preferredDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    const result = await db.run(
      `INSERT INTO consultations (user_id, topic, date, duration, notes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [user.id, topic, preferredDate, duration || 60, notes || '', 'pending']
    )

    return NextResponse.json({ id: result.lastID }, { status: 201 })
  } catch (error) {
    console.error('[v0] Consultations POST error:', error)
    return NextResponse.json(
      { error: 'Failed to book consultation' },
      { status: 500 }
    )
  }
}
