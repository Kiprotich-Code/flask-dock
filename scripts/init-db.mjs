import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = join(__dirname, '..');

async function initDb() {
  try {
    console.log('Step 1: Generating Prisma client...');
    await execAsync('npx prisma generate', { cwd: projectDir });
    console.log('✓ Prisma client generated');

    console.log('Step 2: Running database migrations...');
    await execAsync('npx prisma migrate deploy', { cwd: projectDir });
    console.log('✓ Database migrations completed');

    console.log('Step 3: Seeding database with initial data...');
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Check if data already exists
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      // Create admin user
      const admin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@wakamiru.com',
          password: '$2b$10$YOixghI7/M6.6YVEu/gYZOCJqUxM.UuHwUc5w5K9.h8vhQ6J.6yem', // password123
          role: 'ADMIN',
        },
      });
      console.log('✓ Admin user created');

      // Create regular user
      const user = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'user@example.com',
          password: '$2b$10$YOixghI7/M6.6YVEu/gYZOCJqUxM.UuHwUc5w5K9.h8vhQ6J.6yem', // password123
          role: 'USER',
        },
      });
      console.log('✓ Regular user created');

      // Create sample events
      const event1 = await prisma.event.create({
        data: {
          title: 'Business Strategy Workshop',
          description: 'Learn advanced business strategies from industry experts',
          date: new Date('2026-03-15'),
          location: 'New York, NY',
          capacity: 50,
          registered: 12,
          status: 'UPCOMING',
        },
      });

      const event2 = await prisma.event.create({
        data: {
          title: 'Digital Marketing Masterclass',
          description: 'Master the latest digital marketing techniques',
          date: new Date('2026-03-22'),
          location: 'San Francisco, CA',
          capacity: 30,
          registered: 8,
          status: 'UPCOMING',
        },
      });
      console.log('✓ Sample events created');

      // Create courses
      const course1 = await prisma.course.create({
        data: {
          title: 'Executive Leadership Program',
          description: 'Comprehensive program for aspiring executives',
          price: 499.99,
          duration: '12 weeks',
          level: 'ADVANCED',
          students: 45,
        },
      });

      const course2 = await prisma.course.create({
        data: {
          title: 'Financial Planning Basics',
          description: 'Learn the fundamentals of personal finance',
          price: 299.99,
          duration: '8 weeks',
          level: 'BEGINNER',
          students: 120,
        },
      });
      console.log('✓ Sample courses created');

      // Create blog posts
      await prisma.blogPost.create({
        data: {
          title: 'The Future of Business Consulting',
          slug: 'future-of-consulting',
          excerpt: 'Exploring how technology is reshaping the consulting industry',
          content: 'In this comprehensive article, we explore the major trends shaping the future of business consulting...',
          author: admin.id,
          published: true,
          createdAt: new Date('2026-02-01'),
        },
      });

      await prisma.blogPost.create({
        data: {
          title: 'Top 5 Leadership Skills for 2026',
          slug: 'top-leadership-skills-2026',
          excerpt: 'Essential leadership competencies in the modern workplace',
          content: 'Modern leaders need a diverse set of skills to navigate today\'s complex business landscape...',
          author: admin.id,
          published: true,
          createdAt: new Date('2026-02-05'),
        },
      });
      console.log('✓ Sample blog posts created');

      // Create survey
      await prisma.survey.create({
        data: {
          title: 'Customer Satisfaction Survey',
          description: 'Help us improve our services',
          questions: [
            {
              id: '1',
              text: 'How satisfied are you with our services?',
              type: 'RATING',
              options: ['1', '2', '3', '4', '5'],
            },
            {
              id: '2',
              text: 'What areas could we improve?',
              type: 'TEXT',
              options: [],
            },
          ],
          status: 'ACTIVE',
          responses: [],
        },
      });
      console.log('✓ Sample survey created');

      console.log('\n✓ Database initialized successfully!');
    } else {
      console.log('✓ Database already seeded with data');
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
}

initDb();
