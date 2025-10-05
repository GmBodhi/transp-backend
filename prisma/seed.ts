import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      roles: ['admin', 'user'],
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      email: 'staff@example.com',
      name: 'Staff User',
      password: hashedPassword,
      roles: ['staff', 'user'],
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: hashedPassword,
      roles: ['user'],
    },
  });

  console.log('✓ Users seeded:', { user1: user1.email, user2: user2.email, user3: user3.email });

  // Seed Movies
  const movie1 = await prisma.movie.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'The Matrix',
      director: 'The Wachowskis',
      description: 'A computer hacker learns about the true nature of reality.',
      releaseDate: new Date('1999-03-31'),
      genre: 'Action, Sci-Fi',
      duration: 136,
      language: 'English',
      userId: user1.id,
    },
  });

  const movie2 = await prisma.movie.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Inception',
      director: 'Christopher Nolan',
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
      releaseDate: new Date('2010-07-16'),
      genre: 'Action, Sci-Fi, Thriller',
      duration: 148,
      language: 'English',
      userId: user1.id,
    },
  });

  const movie3 = await prisma.movie.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Interstellar',
      director: 'Christopher Nolan',
      description: 'A team of explorers travel through a wormhole in space.',
      releaseDate: new Date('2014-11-07'),
      genre: 'Sci-Fi, Drama',
      duration: 169,
      language: 'English',
      userId: user1.id,
    },
  });

  console.log('✓ Movies seeded:', { movie1: movie1.name, movie2: movie2.name, movie3: movie3.name });

  // Seed Distributors with tax and commission
  const distributor1 = await prisma.distributor.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      name: 'Warner Bros Distribution',
      tax: 18.5,
      commission: 15.0,
      email: 'warner@example.com',
      phone: '+1-555-0001',
      movieId: movie1.id,
    },
  });

  const distributor2 = await prisma.distributor.upsert({
    where: { id: '00000000-0000-0000-0000-000000000202' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000202',
      name: 'Paramount Pictures India',
      tax: 18.5,
      commission: 12.5,
      email: 'paramount@example.com',
      phone: '+1-555-0002',
      movieId: movie2.id,
    },
  });

  const distributor3 = await prisma.distributor.upsert({
    where: { id: '00000000-0000-0000-0000-000000000203' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000203',
      name: 'Universal Pictures Distribution',
      tax: 18.5,
      commission: 14.0,
      movieId: movie3.id,
    },
  });

  console.log('✓ Distributors seeded:', { distributor1: distributor1.name, distributor2: distributor2.name, distributor3: distributor3.name });

  // Seed Theatres
  const theatre1 = await prisma.theatre.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      title: 'PVR Phoenix',
      region: 'Mumbai',
      data: {
        amenities: ['Parking', 'Food Court', 'Wheelchair Access', 'Dolby Atmos'],
        openingHours: '10:00 AM - 11:00 PM',
        priceRange: { min: 200, max: 500 },
      },
      name: 'PVR Phoenix',
      location: 'Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400013',
      screenCount: 8,
      distributorId: distributor1.id,
    },
  });

  const theatre2 = await prisma.theatre.upsert({
    where: { id: '00000000-0000-0000-0000-000000000102' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000102',
      title: 'INOX Nehru Place',
      region: 'Delhi',
      data: {
        amenities: ['Parking', 'IMAX', 'Dolby Atmos', 'Food Court'],
        openingHours: '9:00 AM - 12:00 AM',
        priceRange: { min: 250, max: 600 },
      },
      name: 'INOX Nehru Place',
      location: 'Nehru Place',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110019',
      screenCount: 6,
      distributorId: distributor2.id,
    },
  });

  const theatre3 = await prisma.theatre.upsert({
    where: { id: '00000000-0000-0000-0000-000000000103' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000103',
      title: 'Cinepolis Royal Meenakshi',
      region: 'Bangalore',
      data: {
        amenities: ['Parking', 'Food Court', '4DX', 'Recliner Seats'],
        openingHours: '10:00 AM - 11:30 PM',
        priceRange: { min: 180, max: 450 },
      },
      name: 'Cinepolis Royal Meenakshi Mall',
      location: 'Bannerghatta Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560076',
      screenCount: 10,
      distributorId: distributor1.id,
    },
  });

  const theatre4 = await prisma.theatre.upsert({
    where: { id: '00000000-0000-0000-0000-000000000104' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000104',
      title: 'PVR Forum Mall',
      region: 'Bangalore',
      data: {
        amenities: ['Parking', 'Food Court', 'Dolby Atmos'],
        openingHours: '10:00 AM - 11:00 PM',
        priceRange: { min: 200, max: 500 },
      },
      name: 'PVR Forum Mall',
      location: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560095',
      screenCount: 7,
      distributorId: distributor3.id,
    },
  });

  const theatre5 = await prisma.theatre.upsert({
    where: { id: '00000000-0000-0000-0000-000000000105' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000105',
      title: 'PVR Select City Walk',
      region: 'Delhi',
      data: {
        amenities: ['Parking', 'Premium Lounge', 'Dolby Atmos', 'IMAX'],
        openingHours: '9:00 AM - 12:00 AM',
        priceRange: { min: 300, max: 700 },
      },
      name: 'PVR Select City Walk',
      location: 'Saket',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017',
      screenCount: 9,
      distributorId: distributor2.id,
    },
  });

  console.log('✓ Theatres seeded:', { theatre1: theatre1.title, theatre2: theatre2.title, theatre3: theatre3.title, theatre4: theatre4.title, theatre5: theatre5.title });

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\nSeeded data summary:');
  console.log('- 3 Users (admin@example.com, staff@example.com, user@example.com)');
  console.log('- 3 Movies (The Matrix, Inception, Interstellar)');
  console.log('- 3 Distributors with tax and commission rates');
  console.log('- 5 Theatres across Mumbai, Delhi, and Bangalore');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
