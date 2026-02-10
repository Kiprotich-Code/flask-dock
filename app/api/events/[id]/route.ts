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
    const event = await db.get('SELECT * FROM events WHERE id = ?', params.id)

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('[v0] Event GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
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
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, date, location, capacity, price } = body

    const db = await getDb()
    await db.run(
      `UPDATE events SET title = ?, description = ?, date = ?, location = ?, capacity = ?, price = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [title, description, date, location, capacity, price, params.id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Event PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
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
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDb()
    await db.run('DELETE FROM events WHERE id = ?', params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Event DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
