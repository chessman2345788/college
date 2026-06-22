import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CITIES = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'New Delhi', state: 'Delhi' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Vellore', state: 'Tamil Nadu' },
  { city: 'Pilani', state: 'Rajasthan' },
  { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Trichy', state: 'Tamil Nadu' },
  { city: 'Surathkal', state: 'Karnataka' },
  { city: 'Warangal', state: 'Telangana' },
  { city: 'Rourkela', state: 'Odisha' },
  { city: 'Allahabad', state: 'Uttar Pradesh' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
];

const CAMPUS_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1607237138185-eedd996c5c0c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&q=80&w=600',
];

const COLLEGE_IMAGES: Record<string, string> = {
  'IIT Bombay': '/univer/8637680.jpg',
  'IIT Delhi': '/univer/8411017.jpg',
  'IIT Madras': '/univer/1488171142phpcUJ7yi.jpeg',
  'NIT Trichy': '/univer/GFDFDGSFGGHDDF.avif',
  'NIT Surathkal': '/univer/jee-main-2026-nit-surathkal-btech-cut-offs-josaa-closing-ranks-featured-image.avif',
  'NIT Warangal': '/univer/Nit_primary.avif',
  'IIIT Hyderabad': '/univer/IIIT-Hyderbad.webp',
  'IIIT Bangalore': '/univer/25604_IIITB_APP.webp',
  'BITS Pilani': '/univer/birla_institute_of_technology_and_science_pilani_cover.jpg',
  'VIT Vellore': '/univer/VIT_Vellore_b048d11820.webp',
};

const STUDENT_NAMES = [
  'Aarav Sharma', 'Aditya Patel', 'Amit Verma', 'Ananya Iyer', 'Arjun Rao',
  'Devendra Singh', 'Ishaan Gupta', 'Kabir Mehta', 'Karan Johar', 'Neha Reddy',
  'Pooja Nair', 'Priya Das', 'Rahul Mishra', 'Rohan Sen', 'Siddharth Joshi',
  'Sneha Kulkarni', 'Tanvi Bhat', 'Vikram Chaudhary', 'Yash Raj', 'Zoya Khan'
];

const REVIEW_COMMENTS = [
  'Outstanding academic rigor. The coding culture is second to none, and placements for CSE are incredible.',
  'Great campus life with state-of-the-art laboratory facilities. Professors are highly supportive and research-driven.',
  'Excellent infrastructure, green campus, and vibrant student-run clubs. Placements are quite decent across all branches.',
  'Rigorous curriculum but it pays off. The alumni network is massive and very helpful for off-campus opportunities.',
  'A hub of innovation and learning. Fests are energetic, and peer group is extremely competitive and inspiring.',
  'Good facilities, but the academic load can be a bit overwhelming sometimes. Hostels are well-maintained.',
  'Placement cells are active, and average package has been growing steadily every year. Recommended!',
  'High tuition fees but justified by the excellent labs, global partnerships, and modern library resources.',
  'Outstanding industry exposure. We get to work on real-world projects and secure good research internships.'
];

async function main() {
  console.log('Cleaning up existing database records...');
  await prisma.savedCollege.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding database with 10 colleges...');

  // Create default admin / user
  const hashedPassword = '$2a$12$L7R2Q5n8z9C/k3f4O5r6ue/zVd1C3hG7Jt0e9m1n2o3p4q5r6s7t8'; // "password123"
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'demo@collegecompass.com',
      password: hashedPassword,
    }
  });

  const collegesData = [];

  // 1. Generate IITs (3 colleges)
  const iits = [
    'IIT Bombay', 'IIT Delhi', 'IIT Madras'
  ];

  for (let i = 0; i < iits.length; i++) {
    const name = iits[i];
    const loc = CITIES[i % CITIES.length];
    const rating = parseFloat((4.5 + Math.random() * 0.49).toFixed(1)); // 4.5 to 4.9
    const fees = Math.round(200000 + Math.random() * 50000); // 2L to 2.5L
    const avgPackage = parseFloat((18.5 + Math.random() * 9.5).toFixed(1)); // 18.5 to 28.0 LPA
    const highestPackage = parseFloat((55.0 + Math.random() * 95.0).toFixed(1)); // 55.0 to 150.0 LPA

    collegesData.push({
      type: 'IIT',
      name,
      location: `${name.replace('IIT ', '')}, ${loc.state}`,
      description: `${name} is a premier public technical and research university. Established as an Institute of National Importance, it is consistently ranked among the top engineering institutions globally, offering world-class labs, outstanding coding culture, and a highly competitive peer ecosystem.`,
      fees,
      rating,
      imageUrl: COLLEGE_IMAGES[name] || CAMPUS_IMAGES[i % CAMPUS_IMAGES.length],
      avgPackage,
      highestPackage,
    });
  }

  // 2. Generate NITs (3 colleges)
  const nits = [
    'NIT Trichy', 'NIT Surathkal', 'NIT Warangal'
  ];

  for (let i = 0; i < nits.length; i++) {
    const name = nits[i];
    const loc = CITIES[(i + 3) % CITIES.length];
    const rating = parseFloat((4.0 + Math.random() * 0.59).toFixed(1)); // 4.0 to 4.5
    const fees = Math.round(120000 + Math.random() * 40000); // 1.2L to 1.6L
    const avgPackage = parseFloat((9.5 + Math.random() * 5.5).toFixed(1)); // 9.5 to 15.0 LPA
    const highestPackage = parseFloat((25.0 + Math.random() * 25.0).toFixed(1)); // 25.0 to 50.0 LPA

    collegesData.push({
      type: 'NIT',
      name,
      location: `${name.replace('NIT ', '').replace('MNNIT ', '')}, ${loc.state}`,
      description: `${name} is one of India's leading public engineering institutes under the NIT Council. It is renowned for its excellent academic records, highly structured curriculum, dedicated training and placement cells, and affordable high-quality education.`,
      fees,
      rating,
      imageUrl: COLLEGE_IMAGES[name] || CAMPUS_IMAGES[(i + 2) % CAMPUS_IMAGES.length],
      avgPackage,
      highestPackage,
    });
  }

  // 3. Generate IIITs (2 colleges)
  const iiits = [
    'IIIT Hyderabad', 'IIIT Bangalore'
  ];

  for (let i = 0; i < iiits.length; i++) {
    const name = iiits[i];
    const loc = CITIES[(i + 5) % CITIES.length];
    const rating = parseFloat((4.2 + Math.random() * 0.69).toFixed(1)); // 4.2 to 4.8
    const fees = Math.round(220000 + Math.random() * 100000); // 2.2L to 3.2L
    const avgPackage = parseFloat((12.5 + Math.random() * 12.5).toFixed(1)); // 12.5 to 25.0 LPA
    const highestPackage = parseFloat((35.0 + Math.random() * 50.0).toFixed(1)); // 35.0 to 85.0 LPA

    collegesData.push({
      type: 'IIIT',
      name,
      location: `${name.replace('IIIT ', '')}, ${loc.state}`,
      description: `${name} specializes in Information Technology, Computer Science, and Electronics. It is highly recognized for its state-of-the-art research laboratories, close industry ties, and exceptional coding/hackathon culture, resulting in excellent placement statistics.`,
      fees,
      rating,
      imageUrl: COLLEGE_IMAGES[name] || CAMPUS_IMAGES[(i + 4) % CAMPUS_IMAGES.length],
      avgPackage,
      highestPackage,
    });
  }

  // 4. Generate Private Universities & State Colleges (2 colleges)
  const privateNames = [
    'BITS Pilani', 'VIT Vellore'
  ];

  for (let i = 0; i < privateNames.length; i++) {
    const name = privateNames[i];
    const loc = CITIES[i % CITIES.length];
    const isTopGovt = ['DTU Delhi', 'NSUT Delhi', 'VJTI Mumbai', 'COEP Technological University', 'Jadavpur University', 'PSG College of Technology'].includes(name);

    const rating = parseFloat((isTopGovt ? (4.3 + Math.random() * 0.49) : (3.5 + Math.random() * 0.89)).toFixed(1)); // Gov: 4.3-4.7, Priv: 3.5-4.3
    const fees = isTopGovt 
      ? Math.round(90000 + Math.random() * 60000) // Government fees (90k-1.5L)
      : Math.round(200000 + Math.random() * 250000); // Private fees (2L-4.5L)

    const avgPackage = parseFloat((isTopGovt ? (11.0 + Math.random() * 6.5) : (4.5 + Math.random() * 6.0)).toFixed(1)); // Gov: 11-17L, Priv: 4.5-10.5L
    const highestPackage = parseFloat((isTopGovt ? (35.0 + Math.random() * 45.0) : (12.0 + Math.random() * 28.0)).toFixed(1)); // Gov: 35-80L, Priv: 12-40L

    collegesData.push({
      type: 'Private/Other',
      name,
      location: `${loc.city}, ${loc.state}`,
      description: `${name} is highly regarded for its diverse curriculum, comprehensive personal development programs, and modern infrastructure. It features extensive industry interactions, foreign exchange programs, and a dedicated career enhancement cell helping students transition smoothly into leading corporate roles.`,
      fees,
      rating,
      imageUrl: COLLEGE_IMAGES[name] || CAMPUS_IMAGES[(i + 1) % CAMPUS_IMAGES.length],
      avgPackage,
      highestPackage,
    });
  }

  // Insert into Database
  for (const col of collegesData) {
    const createdCollege = await prisma.college.create({
      data: {
        name: col.name,
        location: col.location,
        description: col.description,
        fees: col.fees,
        rating: col.rating,
        imageUrl: col.imageUrl,
      }
    });

    // Seed Courses
    const numCourses = 3 + Math.floor(Math.random() * 4); // 3 to 6 courses
    const courseOptions = [
      'B.Tech Computer Science & Engineering',
      'B.Tech Electronics & Communication',
      'B.Tech Information Technology',
      'B.Tech Electrical & Electronics',
      'B.Tech Mechanical Engineering',
      'B.Tech Civil Engineering',
      'B.Tech Artificial Intelligence & Machine Learning',
      'B.Tech Data Science',
      'M.Tech Computer Science',
      'MBA Finance & Marketing'
    ];

    const chosenCourses: string[] = [];
    while (chosenCourses.length < numCourses) {
      const randomCourse = courseOptions[Math.floor(Math.random() * courseOptions.length)];
      if (!chosenCourses.includes(randomCourse)) {
        chosenCourses.push(randomCourse);
      }
    }

    for (const cName of chosenCourses) {
      await prisma.course.create({
        data: {
          name: cName,
          duration: cName.startsWith('M.Tech') || cName.startsWith('MBA') ? '2 Years' : '4 Years',
          collegeId: createdCollege.id,
        }
      });
    }

    // Seed Placement
    await prisma.placement.create({
      data: {
        avgPackage: col.avgPackage,
        highestPackage: col.highestPackage,
        collegeId: createdCollege.id,
      }
    });

    // Seed Reviews
    const numReviews = 2 + Math.floor(Math.random() * 4); // 2 to 5 reviews
    for (let r = 0; r < numReviews; r++) {
      const reviewer = STUDENT_NAMES[Math.floor(Math.random() * STUDENT_NAMES.length)];
      const rating = parseFloat((3.0 + Math.random() * 2.0).toFixed(1)); // 3.0 to 5.0
      const comment = REVIEW_COMMENTS[Math.floor(Math.random() * REVIEW_COMMENTS.length)];

      await prisma.review.create({
        data: {
          rating,
          comment,
          userName: reviewer,
          collegeId: createdCollege.id,
        }
      });
    }
  }

  console.log('Successfully seeded database with 10 colleges, courses, placements, and reviews.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
