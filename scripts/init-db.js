const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("[v0] Starting database initialization...");

  // Clean existing data
  await prisma.marketData.deleteMany({});
  await prisma.surveyResponse.deleteMany({});
  await prisma.surveyQuestion.deleteMany({});
  await prisma.surveyTemplate.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.courseEnrollment.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.consultationBooking.deleteMany({});
  await prisma.eventAttendee.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("[v0] Creating admin user...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@wakamiru.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("[v0] Admin user created:", adminUser.email);

  // Create regular users
  const userPassword = await bcrypt.hash("user123", 10);
  const user1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      name: "John Doe",
      password: userPassword,
      role: "USER",
      emailVerified: new Date(),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane@example.com",
      name: "Jane Smith",
      password: userPassword,
      role: "USER",
      emailVerified: new Date(),
    },
  });

  console.log("[v0] Created 2 regular users");

  // Create events
  console.log("[v0] Creating events...");
  const event1 = await prisma.event.create({
    data: {
      title: "Digital Transformation Workshop",
      description:
        "Learn how to transform your business with digital technologies",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      location: "New York City",
      maxAttendees: 50,
      price: 299,
      status: "OPEN",
      createdBy: adminUser.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Business Analytics Masterclass",
      description:
        "Master data-driven decision making for your organization",
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      location: "San Francisco",
      maxAttendees: 30,
      price: 399,
      status: "OPEN",
      createdBy: adminUser.id,
    },
  });

  console.log("[v0] Created 2 events");

  // Add attendees
  await prisma.eventAttendee.create({
    data: {
      eventId: event1.id,
      userId: user1.id,
      status: "REGISTERED",
    },
  });

  await prisma.eventAttendee.create({
    data: {
      eventId: event2.id,
      userId: user2.id,
      status: "REGISTERED",
    },
  });

  console.log("[v0] Added event attendees");

  // Create courses
  console.log("[v0] Creating courses...");
  const course1 = await prisma.course.create({
    data: {
      title: "Strategic Business Planning",
      description:
        "Learn how to create effective business strategies that drive growth",
      instructor: "Michael Johnson",
      price: 199,
      duration: 8,
      level: "INTERMEDIATE",
      category: "Strategy",
      createdBy: adminUser.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "Leadership Essentials",
      description:
        "Develop essential leadership skills for the modern workplace",
      instructor: "Sarah Williams",
      price: 149,
      duration: 6,
      level: "BEGINNER",
      category: "Leadership",
      createdBy: adminUser.id,
    },
  });

  console.log("[v0] Created 2 courses");

  // Enroll users in courses
  await prisma.courseEnrollment.create({
    data: {
      userId: user1.id,
      courseId: course1.id,
      status: "ACTIVE",
      progress: 45,
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      userId: user2.id,
      courseId: course2.id,
      status: "COMPLETED",
      progress: 100,
      completedAt: new Date(),
    },
  });

  console.log("[v0] Added course enrollments");

  // Create consultation bookings
  console.log("[v0] Creating consultation bookings...");
  await prisma.consultationBooking.create({
    data: {
      userId: user1.id,
      consultantId: adminUser.id,
      title: "Strategic Planning Session",
      description: "One-on-one consultation for business strategy",
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      duration: 60,
      status: "CONFIRMED",
      price: 250,
    },
  });

  console.log("[v0] Created consultation booking");

  // Create blog posts
  console.log("[v0] Creating blog posts...");
  const post1 = await prisma.blogPost.create({
    data: {
      title: "5 Key Strategies for Business Growth",
      slug: "5-key-strategies-business-growth",
      content:
        "In this comprehensive guide, we explore the five most effective strategies for accelerating your business growth...",
      excerpt: "Discover the five most effective strategies for business growth",
      authorId: adminUser.id,
      status: "PUBLISHED",
      publishedAt: new Date(),
      views: 1250,
    },
  });

  const post2 = await prisma.blogPost.create({
    data: {
      title: "The Future of Digital Transformation",
      slug: "future-digital-transformation",
      content:
        "As we move deeper into the digital age, organizations must adapt or risk falling behind...",
      excerpt: "How organizations are preparing for the future of digital transformation",
      authorId: adminUser.id,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      views: 2840,
    },
  });

  console.log("[v0] Created 2 blog posts");

  // Create survey templates
  console.log("[v0] Creating survey templates...");
  const survey = await prisma.surveyTemplate.create({
    data: {
      title: "Customer Satisfaction Survey",
      description:
        "Help us improve our services by sharing your feedback",
      createdBy: adminUser.id,
    },
  });

  // Add survey questions
  await prisma.surveyQuestion.create({
    data: {
      surveyId: survey.id,
      question: "How satisfied are you with our services?",
      type: "RATING",
      order: 1,
      options: ["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"],
    },
  });

  await prisma.surveyQuestion.create({
    data: {
      surveyId: survey.id,
      question: "What could we improve?",
      type: "TEXT",
      order: 2,
    },
  });

  console.log("[v0] Created survey template with questions");

  // Add survey responses
  await prisma.surveyResponse.create({
    data: {
      surveyId: survey.id,
      userId: user1.id,
      responses: {
        q1: "Very Satisfied",
        q2: "Great service and support",
      },
    },
  });

  console.log("[v0] Added survey response");

  // Create market data
  console.log("[v0] Creating market data...");
  const marketData = [];
  for (let i = 0; i < 12; i++) {
    marketData.push(
      await prisma.marketData.create({
        data: {
          month: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000),
          revenue: Math.floor(Math.random() * 50000) + 20000,
          clients: Math.floor(Math.random() * 50) + 20,
          projects: Math.floor(Math.random() * 30) + 10,
          satisfaction: Math.floor(Math.random() * 40) + 60,
        },
      })
    );
  }

  console.log("[v0] Created 12 months of market data");

  console.log("[v0] Database initialization completed successfully!");
}

main()
  .catch((e) => {
    console.error("[v0] Error during initialization:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
