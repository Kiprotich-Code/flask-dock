import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import hashlib from 'crypto'
import { v4 as uuidv4 } from 'uuid'

const db = new sqlite3.Database('/home/user/dev.db')

function promiseDb(fn: (db: any) => void) {
  return new Promise((resolve, reject) => {
    fn({
      run: (sql: string, params: any[], callback: any) =>
        db.run(sql, params, callback),
      get: (sql: string, params: any[], callback: any) =>
        db.get(sql, params, callback),
      all: (sql: string, params: any[], callback: any) =>
        db.all(sql, params, callback),
    })
      .then(resolve)
      .catch(reject)
  })
}

function hashPassword(password: string) {
  return hashlib.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM "User" WHERE email = ?',
        [email],
        (err, row) => {
          if (err) reject(err)
          resolve(row)
        }
      )
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      )
    }

    // Create new user
    const userId = uuidv4()
    const hashedPassword = hashPassword(password)
    const now = new Date()

    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO "User" (id, email, name, password, role, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, email, name, hashedPassword, 'USER', now, now],
        (err) => {
          if (err) reject(err)
          resolve(null)
        }
      )
    })

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
