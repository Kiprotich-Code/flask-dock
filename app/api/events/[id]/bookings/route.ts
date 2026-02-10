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
    const bookings = await db.all(
      'SELECT * FROM event_bookings WHERE event_id = ?',
      params.id
    )
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('[v0] Bookings GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { numberOfTickets } = body

    if (!numberOfTickets || numberOfTickets < 1) {
      return NextResponse.json(
        { error: 'Invalid number of tickets' },
        { status: 400 }
      )
    }

    const db = await getDb()

    // Get user
    const user = await db.get('SELECT id FROM users WHERE email = ?', session.user.email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check event capacity
    const event = await db.get('SELECT capacity FROM events WHERE id = ?', params.id)
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const bookedCount = await db.get(
      'SELECT COUNT(*) as count FROM event_bookings WHERE event_id = ?',
      params.id
    )

    if (bookedCount.count + numberOfTickets > event.capacity) {
      return NextResponse.json(
        { error: 'Not enough capacity' },
        { status: 400 }
      )
    }

    // Create booking
    const result = await db.run(
      `INSERT INTO event_bookings (event_id, user_id, number_of_tickets, created_at)
       VALUES (?, ?, ?, datetime('now'))`,
      [params.id, user.id, numberOfTickets]
    )

    return NextResponse.json({ id: result.lastID }, { status: 201 })
  } catch (error) {
    console.error('[v0] Bookings POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
