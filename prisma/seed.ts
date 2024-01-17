import { PrismaClient, Role } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Seed User data
  const john = await prisma.user.create({
    data: {
      email: 'john@example.com',
      hash: await argon.hash('Password@1234'),
      firstName: 'John',
      lastName: 'Doe',
      image: 'https://example.com/john.jpg',
      roles: [Role.Admin, Role.Agent],
      bookmarks: {
        create: [
          {
            title: 'Favorite Website',
            description: 'A cool website',
            link: 'https://example.com',
          },
          {
            title: 'Tech Blog',
            description: 'Interesting tech articles',
            link: 'https://techblog.com',
          },
        ],
      },
    },
  });

  const jane = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      hash: await argon.hash('Password@1234'),
      firstName: 'Jane',
      lastName: 'Smith',
      roles: [Role.Agent],
      bookmarks: {
        create: [
          {
            title: 'News Portal',
            description: 'Daily news updates',
            link: 'https://newsportal.com',
          },
        ],
      },
    },
  });

  console.log(`Seeded users: ${john.email}, ${jane.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
