#!/usr/bin/env python3
import sqlite3
import uuid
from datetime import datetime, timedelta
import json
import hashlib
import os

# Database path
db_path = "/home/user/dev.db"

# Create database file
print("[v0] Creating database at:", db_path)
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# SQL schema
schema_sql = """
-- CreateTable User
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" DATETIME,
    "name" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable Account
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE("provider", "providerAccountId")
);

-- CreateTable Session
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable Event
CREATE TABLE IF NOT EXISTS "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "location" TEXT,
    "maxAttendees" INTEGER,
    "price" REAL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON UPDATE CASCADE
);

-- CreateTable EventAttendee
CREATE TABLE IF NOT EXISTS "EventAttendee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE("eventId", "userId")
);

-- CreateTable ConsultationBooking
CREATE TABLE IF NOT EXISTS "ConsultationBooking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "consultantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledDate" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "price" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ConsultationBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ConsultationBooking_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "User" ("id") ON UPDATE CASCADE
);

-- CreateTable Course
CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructor" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'BEGINNER',
    "category" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Course_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON UPDATE CASCADE
);

-- CreateTable CourseEnrollment
CREATE TABLE IF NOT EXISTS "CourseEnrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE("userId", "courseId")
);

-- CreateTable BlogPost
CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "authorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON UPDATE CASCADE
);

-- CreateTable SurveyTemplate
CREATE TABLE IF NOT EXISTS "SurveyTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SurveyTemplate_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON UPDATE CASCADE
);

-- CreateTable SurveyQuestion
CREATE TABLE IF NOT EXISTS "SurveyQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surveyId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "order" INTEGER NOT NULL,
    "options" TEXT,
    CONSTRAINT "SurveyQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "SurveyTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable SurveyResponse
CREATE TABLE IF NOT EXISTS "SurveyResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surveyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "responses" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "SurveyTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SurveyResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable MarketData
CREATE TABLE IF NOT EXISTS "MarketData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" DATETIME NOT NULL,
    "revenue" INTEGER NOT NULL,
    "clients" INTEGER NOT NULL,
    "projects" INTEGER NOT NULL,
    "satisfaction" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "Event_createdBy_idx" ON "Event"("createdBy");
CREATE INDEX IF NOT EXISTS "EventAttendee_eventId_idx" ON "EventAttendee"("eventId");
CREATE INDEX IF NOT EXISTS "EventAttendee_userId_idx" ON "EventAttendee"("userId");
CREATE INDEX IF NOT EXISTS "ConsultationBooking_userId_idx" ON "ConsultationBooking"("userId");
CREATE INDEX IF NOT EXISTS "ConsultationBooking_consultantId_idx" ON "ConsultationBooking"("consultantId");
CREATE INDEX IF NOT EXISTS "Course_createdBy_idx" ON "Course"("createdBy");
CREATE INDEX IF NOT EXISTS "CourseEnrollment_userId_idx" ON "CourseEnrollment"("userId");
CREATE INDEX IF NOT EXISTS "CourseEnrollment_courseId_idx" ON "CourseEnrollment"("courseId");
CREATE INDEX IF NOT EXISTS "BlogPost_authorId_idx" ON "BlogPost"("authorId");
CREATE INDEX IF NOT EXISTS "BlogPost_slug_idx" ON "BlogPost"("slug");
CREATE INDEX IF NOT EXISTS "SurveyTemplate_createdBy_idx" ON "SurveyTemplate"("createdBy");
CREATE INDEX IF NOT EXISTS "SurveyQuestion_surveyId_idx" ON "SurveyQuestion"("surveyId");
CREATE INDEX IF NOT EXISTS "SurveyResponse_surveyId_idx" ON "SurveyResponse"("surveyId");
CREATE INDEX IF NOT EXISTS "SurveyResponse_userId_idx" ON "SurveyResponse"("userId");
CREATE INDEX IF NOT EXISTS "MarketData_month_idx" ON "MarketData"("month");
"""

print("[v0] Creating database schema...")
cursor.executescript(schema_sql)
conn.commit()
print("[v0] Schema created successfully")

# Helper function
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Create users
print("[v0] Creating users...")
admin_id = str(uuid.uuid4())
user1_id = str(uuid.uuid4())
user2_id = str(uuid.uuid4())

admin_password = hash_password("admin123")
user_password = hash_password("user123")

cursor.execute("""
    INSERT INTO "User" (id, email, name, password, role, emailVerified, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", (admin_id, "admin@wakamiru.com", "Admin", admin_password, "ADMIN", datetime.now(), datetime.now(), datetime.now()))

cursor.execute("""
    INSERT INTO "User" (id, email, name, password, role, emailVerified, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", (user1_id, "john@example.com", "John Doe", user_password, "USER", datetime.now(), datetime.now(), datetime.now()))

cursor.execute("""
    INSERT INTO "User" (id, email, name, password, role, emailVerified, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", (user2_id, "jane@example.com", "Jane Smith", user_password, "USER", datetime.now(), datetime.now(), datetime.now()))

conn.commit()
print("[v0] Created 3 users")

# Create events
print("[v0] Creating events...")
event1_id = str(uuid.uuid4())
event2_id = str(uuid.uuid4())

start_date = datetime.now() + timedelta(days=7)
end_date = datetime.now() + timedelta(days=8)

cursor.execute("""
    INSERT INTO "Event" (id, title, description, startDate, endDate, location, maxAttendees, price, status, createdBy, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (event1_id, "Digital Transformation Workshop", "Learn how to transform your business with digital technologies", 
      start_date, end_date, "New York City", 50, 299, "OPEN", admin_id, datetime.now(), datetime.now()))

start_date = datetime.now() + timedelta(days=14)
end_date = datetime.now() + timedelta(days=15)

cursor.execute("""
    INSERT INTO "Event" (id, title, description, startDate, endDate, location, maxAttendees, price, status, createdBy, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (event2_id, "Business Analytics Masterclass", "Master data-driven decision making for your organization", 
      start_date, end_date, "San Francisco", 30, 399, "OPEN", admin_id, datetime.now(), datetime.now()))

# Add event attendees
cursor.execute("""
    INSERT INTO "EventAttendee" (id, eventId, userId, status, createdAt)
    VALUES (?, ?, ?, ?, ?)
""", (str(uuid.uuid4()), event1_id, user1_id, "REGISTERED", datetime.now()))

cursor.execute("""
    INSERT INTO "EventAttendee" (id, eventId, userId, status, createdAt)
    VALUES (?, ?, ?, ?, ?)
""", (str(uuid.uuid4()), event2_id, user2_id, "REGISTERED", datetime.now()))

conn.commit()
print("[v0] Created 2 events with attendees")

# Create courses
print("[v0] Creating courses...")
course1_id = str(uuid.uuid4())
course2_id = str(uuid.uuid4())

cursor.execute("""
    INSERT INTO "Course" (id, title, description, instructor, price, duration, level, category, createdBy, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (course1_id, "Strategic Business Planning", "Learn how to create effective business strategies that drive growth", 
      "Michael Johnson", 199, 8, "INTERMEDIATE", "Strategy", admin_id, datetime.now(), datetime.now()))

cursor.execute("""
    INSERT INTO "Course" (id, title, description, instructor, price, duration, level, category, createdBy, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (course2_id, "Leadership Essentials", "Develop essential leadership skills for the modern workplace", 
      "Sarah Williams", 149, 6, "BEGINNER", "Leadership", admin_id, datetime.now(), datetime.now()))

# Add course enrollments
cursor.execute("""
    INSERT INTO "CourseEnrollment" (id, userId, courseId, status, progress, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
""", (str(uuid.uuid4()), user1_id, course1_id, "ACTIVE", 45, datetime.now(), datetime.now()))

cursor.execute("""
    INSERT INTO "CourseEnrollment" (id, userId, courseId, status, progress, completedAt, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", (str(uuid.uuid4()), user2_id, course2_id, "COMPLETED", 100, datetime.now(), datetime.now(), datetime.now()))

conn.commit()
print("[v0] Created 2 courses with enrollments")

# Create consultation booking
print("[v0] Creating consultation bookings...")
scheduled_date = datetime.now() + timedelta(days=3)
cursor.execute("""
    INSERT INTO "ConsultationBooking" (id, userId, consultantId, title, description, scheduledDate, duration, status, price, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (str(uuid.uuid4()), user1_id, admin_id, "Strategic Planning Session", "One-on-one consultation for business strategy", 
      scheduled_date, 60, "CONFIRMED", 250, datetime.now(), datetime.now()))

conn.commit()
print("[v0] Created consultation booking")

# Create blog posts
print("[v0] Creating blog posts...")
cursor.execute("""
    INSERT INTO "BlogPost" (id, title, slug, content, excerpt, authorId, status, publishedAt, views, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (str(uuid.uuid4()), "5 Key Strategies for Business Growth", "5-key-strategies-business-growth", 
      "In this comprehensive guide, we explore the five most effective strategies for accelerating your business growth...", 
      "Discover the five most effective strategies for business growth", admin_id, "PUBLISHED", datetime.now(), 1250, datetime.now(), datetime.now()))

pub_date = datetime.now() - timedelta(days=7)
cursor.execute("""
    INSERT INTO "BlogPost" (id, title, slug, content, excerpt, authorId, status, publishedAt, views, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (str(uuid.uuid4()), "The Future of Digital Transformation", "future-digital-transformation", 
      "As we move deeper into the digital age, organizations must adapt or risk falling behind...", 
      "How organizations are preparing for the future of digital transformation", admin_id, "PUBLISHED", pub_date, 2840, datetime.now(), datetime.now()))

conn.commit()
print("[v0] Created 2 blog posts")

# Create survey template
print("[v0] Creating survey templates...")
survey_id = str(uuid.uuid4())

cursor.execute("""
    INSERT INTO "SurveyTemplate" (id, title, description, createdBy, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
""", (survey_id, "Customer Satisfaction Survey", "Help us improve our services by sharing your feedback", 
      admin_id, datetime.now(), datetime.now()))

# Add survey questions
options_str = json.dumps(["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"])
cursor.execute("""
    INSERT INTO "SurveyQuestion" (id, surveyId, question, type, "order", options)
    VALUES (?, ?, ?, ?, ?, ?)
""", (str(uuid.uuid4()), survey_id, "How satisfied are you with our services?", "RATING", 1, options_str))

cursor.execute("""
    INSERT INTO "SurveyQuestion" (id, surveyId, question, type, "order")
    VALUES (?, ?, ?, ?, ?)
""", (str(uuid.uuid4()), survey_id, "What could we improve?", "TEXT", 2))

# Add survey response
response_data = json.dumps({"q1": "Very Satisfied", "q2": "Great service and support"})
cursor.execute("""
    INSERT INTO "SurveyResponse" (id, surveyId, userId, responses, createdAt)
    VALUES (?, ?, ?, ?, ?)
""", (str(uuid.uuid4()), survey_id, user1_id, response_data, datetime.now()))

conn.commit()
print("[v0] Created survey template")

# Create market data
print("[v0] Creating market data...")
import random
for i in range(12):
    month = datetime.now() - timedelta(days=(11-i)*30)
    revenue = random.randint(20000, 70000)
    clients = random.randint(20, 70)
    projects = random.randint(10, 40)
    satisfaction = random.randint(60, 100)
    
    cursor.execute("""
        INSERT INTO "MarketData" (id, month, revenue, clients, projects, satisfaction, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (str(uuid.uuid4()), month, revenue, clients, projects, satisfaction, datetime.now()))

conn.commit()
print("[v0] Created 12 months of market data")

conn.close()
print("[v0] Database initialization completed successfully!")
print(f"[v0] Database saved at: {db_path}")
