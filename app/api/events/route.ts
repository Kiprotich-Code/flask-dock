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
    const db = await getDb()
    const events = await db.all('SELECT * FROM events ORDER BY date ASC')
    return NextResponse.json(events)
  } catch (error) {
    console.error('[v0] Events GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, date, location, capacity, price } = body

    if (!title || !date || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await db.run(
      `INSERT INTO events (title, description, date, location, capacity, price, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [title, description, date, location, capacity || 100, price || 0]
    )

    return NextResponse.json({ id: result.lastID }, { status: 201 })
  } catch (error) {
    console.error('[v0] Events POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
