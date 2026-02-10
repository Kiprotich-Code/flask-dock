import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Setting up database...')

  // Create sample users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@wakamiru.com' },
    update: {},
    create: {
      email: 'admin@wakamiru.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@wakamiru.com' },
    update: {},
    create: {
      email: 'user@wakamiru.com',
      name: 'John Doe',
      password: userPassword,
      role: 'USER',
    },
  })

  console.log('Created users:')
  console.log(`- Admin: ${admin.email} (password: admin123)`)
  console.log(`- User: ${user.email} (password: user123)`)

  // Create sample events
  const event1 = await prisma.event.create({
    data: {
      title: 'Market Insights Webinar',
      description: 'Learn the latest market trends and investment strategies',
      date: new Date('2026-03-15T14:00:00'),
      location: 'Online',
      price: 49.99,
      isPaid: true,
    },
  })

  const event2 = await prisma.event.create({
    data: {
      title: 'Business Strategy Workshop',
      description: 'Practical workshop on developing winning business strategies',
      date: new Date('2026-03-20T10:00:00'),
      location: 'New York, NY',
      price: 0,
      isPaid: false,
    },
  })

  console.log(`Created ${2} events`)

  // Create sample courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Advanced Financial Analysis',
      description: 'Master financial statements and analysis techniques',
      price: 299.99,
      duration: '6 weeks',
      deliverables: 'Video lessons, worksheets, case studies, certificate',
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Corporate Strategy Mastery',
      description: 'Learn from industry leaders about corporate strategy',
      price: 399.99,
      duration: '8 weeks',
      deliverables: 'Live sessions, 1-on-1 mentoring, templates, certification',
    },
  })

  console.log(`Created ${2} courses`)

  // Create sample blog posts
  const blog1 = await prisma.blogPost.create({
    data: {
      title: 'How to Identify Market Opportunities',
      content: 'In this comprehensive guide, we explore the key indicators and methodologies for identifying lucrative market opportunities in today\'s dynamic business environment.',
      authorId: admin.id,
    },
  })

  console.log(`Created ${1} blog post`)

  console.log('Database setup completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
