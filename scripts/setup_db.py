import sqlite3
import uuid
from datetime import datetime, timedelta
import json
import hashlib
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)

# Ensure directory exists
db_dir = os.path.join(project_root, "prisma")
os.makedirs(db_dir, exist_ok=True)

db_path = os.path.join(db_dir, "dev.db")
init_sql_path = os.path.join(db_dir, "init.sql")

print(f"[v0] Database path: {db_path}")
print(f"[v0] SQL file path: {init_sql_path}")

def hash_password(password):
    """Simple password hashing using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def get_db():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    print("[v0] Initializing database...")
    conn = get_db()
    cursor = conn.cursor()
    
    # Read and execute migration SQL
    with open(init_sql_path, "r") as f:
        sql = f.read()
        cursor.executescript(sql)
    
    conn.commit()
    print("[v0] Database schema created")
    
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
    print("[v0] Created 3 users (1 admin, 2 regular)")
    
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
    post1_id = str(uuid.uuid4())
    post2_id = str(uuid.uuid4())
    
    cursor.execute("""
        INSERT INTO "BlogPost" (id, title, slug, content, excerpt, authorId, status, publishedAt, views, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (post1_id, "5 Key Strategies for Business Growth", "5-key-strategies-business-growth", 
          "In this comprehensive guide, we explore the five most effective strategies for accelerating your business growth...", 
          "Discover the five most effective strategies for business growth", admin_id, "PUBLISHED", datetime.now(), 1250, datetime.now(), datetime.now()))
    
    pub_date = datetime.now() - timedelta(days=7)
    cursor.execute("""
        INSERT INTO "BlogPost" (id, title, slug, content, excerpt, authorId, status, publishedAt, views, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (post2_id, "The Future of Digital Transformation", "future-digital-transformation", 
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
    print("[v0] Created survey template with questions and responses")
    
    # Create market data (12 months)
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

if __name__ == "__main__":
    init_db()
