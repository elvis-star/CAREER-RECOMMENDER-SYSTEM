import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Institution from '../models/Institution.js'; // Adjust path as needed

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const additionalInstitutions = [
  {
    name: 'Dedan Kimathi University of Technology',
    type: 'University',
    location: {
      address: 'Nyeri-Mweiga Road',
      city: 'Nyeri',
      county: 'Nyeri',
      country: 'Kenya',
      coordinates: {
        latitude: -0.3981,
        longitude: 36.9628,
      },
    },
    description:
      'Dedan Kimathi University of Technology (DeKUT) is a public technological university located in Nyeri County. The university focuses on science, technology, engineering, and mathematics (STEM) education and is known for its strong programs in engineering and computer science.',
    website: 'https://www.dkut.ac.ke/',
    contact: {
      email: 'info@dkut.ac.ke',
      phone: '+254 713 835 965',
      socialMedia: {
        facebook: 'https://www.facebook.com/DeKUTKenya/',
        twitter: 'https://twitter.com/DeKUTKenya',
        instagram: 'https://www.instagram.com/dekutkenya/',
        linkedin:
          'https://www.linkedin.com/school/dedan-kimathi-university-of-technology/',
      },
    },
    programs: [
      {
        name: 'Bachelor of Science in Mechatronic Engineering',
        level: 'Bachelors',
        duration: '5 years',
        description:
          'A program that integrates mechanical, electronic, and computer engineering to design and develop automated systems and robotics.',
        entryRequirements: {
          minimumGrade: 'B+',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'B+' },
            { subject: 'Physics', grade: 'B+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 180,000 per year',
      },
      {
        name: 'Bachelor of Science in Leather Technology',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A specialized program focusing on leather processing, product development, and quality control in the leather industry.',
        entryRequirements: {
          minimumGrade: 'B-',
          specificSubjects: [
            { subject: 'Chemistry', grade: 'C+' },
            { subject: 'Biology/Physics', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 150,000 per year',
      },
    ],
    rankings: {
      national: 9,
      international: 2800,
      year: 2024,
    },
    facilities: [
      'Engineering laboratories',
      'Computer labs',
      'Innovation hub',
      'Library',
      'Student hostels',
      'Sports facilities',
      'Coffee technology center',
    ],
    accreditation: [
      'Commission for University Education (CUE)',
      'Engineers Board of Kenya (EBK)',
    ],
    establishedYear: 2012,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/dekut_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/dekut_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Mount Kenya University',
    type: 'University',
    location: {
      address: 'General Kago Road',
      city: 'Thika',
      county: 'Kiambu',
      country: 'Kenya',
      coordinates: {
        latitude: -1.0396,
        longitude: 37.09,
      },
    },
    description:
      'Mount Kenya University (MKU) is one of the largest private universities in Kenya with multiple campuses across the country and in neighboring countries. The university offers a wide range of programs in health sciences, business, education, and technology.',
    website: 'https://www.mku.ac.ke/',
    contact: {
      email: 'info@mku.ac.ke',
      phone: '+254 709 153 000',
      socialMedia: {
        facebook: 'https://www.facebook.com/MountKenyaUniversity/',
        twitter: 'https://twitter.com/MountKenyaUni',
        instagram: 'https://www.instagram.com/mountkenyauniversity/',
        linkedin: 'https://www.linkedin.com/school/mount-kenya-university/',
      },
    },
    programs: [
      {
        name: 'Bachelor of Pharmacy',
        level: 'Bachelors',
        duration: '5 years',
        description:
          'A program that prepares students for careers in pharmacy, focusing on drug development, dispensing, and patient care.',
        entryRequirements: {
          minimumGrade: 'B',
          specificSubjects: [
            { subject: 'Chemistry', grade: 'B' },
            { subject: 'Biology', grade: 'B' },
            { subject: 'Mathematics/Physics', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate', 'Interview'],
        },
        tuitionFees: 'KES 220,000 per year',
      },
      {
        name: 'Bachelor of Science in Nursing',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that prepares students for careers in nursing, focusing on patient care, health promotion, and disease prevention.',
        entryRequirements: {
          minimumGrade: 'B-',
          specificSubjects: [
            { subject: 'Biology', grade: 'B-' },
            { subject: 'Chemistry', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate', 'Interview'],
        },
        tuitionFees: 'KES 180,000 per year',
      },
    ],
    rankings: {
      national: 10,
      international: 3000,
      year: 2024,
    },
    facilities: [
      'Health sciences laboratories',
      'Teaching hospital',
      'Library',
      'Computer labs',
      'Student hostels',
      'Sports facilities',
      'Recreation center',
    ],
    accreditation: [
      'Commission for University Education (CUE)',
      'Pharmacy and Poisons Board',
      'Nursing Council of Kenya',
    ],
    establishedYear: 2008,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/mku_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/mku_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'United States International University - Africa',
    type: 'University',
    location: {
      address: 'Thika Road, Kasarani',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.2178,
        longitude: 36.8844,
      },
    },
    description:
      'United States International University - Africa (USIU-Africa) is a private university that offers American-style education in Kenya. The university has a diverse student body from over 70 countries and focuses on global education, leadership, and entrepreneurship.',
    website: 'https://www.usiu.ac.ke/',
    contact: {
      email: 'admissions@usiu.ac.ke',
      phone: '+254 730 116 000',
      socialMedia: {
        facebook: 'https://www.facebook.com/USIU.Africa/',
        twitter: 'https://twitter.com/USIU_Africa',
        instagram: 'https://www.instagram.com/usiuafrica/',
        linkedin: 'https://www.linkedin.com/school/usiu-africa/',
      },
    },
    programs: [
      {
        name: 'Bachelor of Science in International Business Administration',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that prepares students for careers in global business, focusing on international trade, finance, and management.',
        entryRequirements: {
          minimumGrade: 'B',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'B-' },
            { subject: 'English', grade: 'B-' },
          ],
          additionalRequirements: [
            'KCSE Certificate',
            'SAT/ACT Scores (for international students)',
          ],
        },
        tuitionFees: 'KES 450,000 per year',
      },
      {
        name: 'Master of Science in Information Systems and Technology',
        level: 'Masters',
        duration: '2 years',
        description:
          'An advanced program focusing on information systems management, cybersecurity, and digital transformation.',
        entryRequirements: {
          minimumGrade: 'Second Class Upper Division',
          specificSubjects: [],
          additionalRequirements: [
            "Bachelor's Degree in IT or related field",
            'Work experience preferred',
          ],
        },
        tuitionFees: 'KES 550,000 per year',
      },
    ],
    rankings: {
      national: 8,
      international: 2500,
      year: 2024,
    },
    facilities: [
      'Modern library',
      'Computer labs',
      'Business incubation center',
      'Student center',
      'Sports complex',
      'Auditorium',
      'Media studio',
    ],
    accreditation: [
      'Commission for University Education (CUE)',
      'WASC Senior College and University Commission (USA)',
    ],
    establishedYear: 1969,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/usiu_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/usiu_campus.jpg',
    ],
    featured: true,
    views: 2,
  },
  {
    name: 'Multimedia University of Kenya',
    type: 'University',
    location: {
      address: 'Magadi Road',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.3667,
        longitude: 36.7333,
      },
    },
    description:
      'Multimedia University of Kenya (MMU) evolved from the Kenya College of Communications Technology and specializes in media, communication, and information technology education. The university is known for its strong programs in journalism, film, and multimedia production.',
    website: 'https://www.mmu.ac.ke/',
    contact: {
      email: 'info@mmu.ac.ke',
      phone: '+254 20 2071391',
      socialMedia: {
        facebook: 'https://www.facebook.com/MultimediaUniversityofKenya/',
        twitter: 'https://twitter.com/MMU_Kenya',
      },
    },
    programs: [
      {
        name: 'Bachelor of Science in Film and Animation',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that focuses on film production, animation techniques, and visual storytelling.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate', 'Portfolio submission'],
        },
        tuitionFees: 'KES 140,000 per year',
      },
      {
        name: 'Bachelor of Science in Software Engineering',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that focuses on software development, programming, and systems design.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'C+' },
            { subject: 'Physics', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 150,000 per year',
      },
    ],
    rankings: {
      national: 15,
      international: null,
      year: 2024,
    },
    facilities: [
      'Media studios',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
      'Auditorium',
    ],
    accreditation: ['Commission for University Education (CUE)'],
    establishedYear: 2013,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/mmu_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/mmu_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Kabarak University',
    type: 'University',
    location: {
      address: 'Nakuru-Eldama Ravine Road',
      city: 'Nakuru',
      county: 'Nakuru',
      country: 'Kenya',
      coordinates: {
        latitude: 0.0167,
        longitude: 35.9667,
      },
    },
    description:
      'Kabarak University is a private Christian university founded by former President Daniel Arap Moi. The university offers programs in business, education, law, and health sciences, with a strong emphasis on Christian values and ethics.',
    website: 'https://www.kabarak.ac.ke/',
    contact: {
      email: 'info@kabarak.ac.ke',
      phone: '+254 51 343234',
      socialMedia: {
        facebook: 'https://www.facebook.com/KabarakUniversity/',
        twitter: 'https://twitter.com/KabarakUni',
        instagram: 'https://www.instagram.com/kabarakuniversity/',
      },
    },
    programs: [
      {
        name: 'Bachelor of Laws (LLB)',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that prepares students for careers in law, focusing on legal principles, research, and advocacy.',
        entryRequirements: {
          minimumGrade: 'B+',
          specificSubjects: [{ subject: 'English', grade: 'B+' }],
          additionalRequirements: ['KCSE Certificate', 'Interview'],
        },
        tuitionFees: 'KES 280,000 per year',
      },
      {
        name: 'Bachelor of Medicine and Bachelor of Surgery',
        level: 'Bachelors',
        duration: '6 years',
        description:
          'A comprehensive medical program that prepares students for careers in medicine and surgery.',
        entryRequirements: {
          minimumGrade: 'A-',
          specificSubjects: [
            { subject: 'Biology', grade: 'A-' },
            { subject: 'Chemistry', grade: 'A-' },
            { subject: 'Mathematics/Physics', grade: 'B+' },
          ],
          additionalRequirements: ['KCSE Certificate', 'Interview'],
        },
        tuitionFees: 'KES 600,000 per year',
      },
    ],
    rankings: {
      national: 11,
      international: 3200,
      year: 2024,
    },
    facilities: [
      'Modern library',
      'Computer labs',
      'Medical teaching hospital',
      'Moot court',
      'Student hostels',
      'Sports facilities',
      'Chapel',
    ],
    accreditation: [
      'Commission for University Education (CUE)',
      'Kenya Medical Practitioners and Dentists Council',
    ],
    establishedYear: 2002,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kabarak_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kabarak_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Kenya Coast National Polytechnic',
    type: 'Technical Institute',
    location: {
      address: 'Kisauni Road',
      city: 'Mombasa',
      county: 'Mombasa',
      country: 'Kenya',
      coordinates: {
        latitude: -4.0435,
        longitude: 39.6682,
      },
    },
    description:
      'Kenya Coast National Polytechnic is a leading technical and vocational education institution in the coastal region of Kenya. The polytechnic offers training in engineering, maritime studies, hospitality, and business.',
    website: 'https://www.kenyacoastpoly.ac.ke/',
    contact: {
      email: 'info@kenyacoastpoly.ac.ke',
      phone: '+254 41 2492222',
      socialMedia: {
        facebook: 'https://www.facebook.com/KenyaCoastNationalPolytechnic/',
        twitter: 'https://twitter.com/KCNPoly',
      },
    },
    programs: [
      {
        name: 'Diploma in Maritime Transport and Logistics',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A program that focuses on maritime operations, shipping, and logistics management in the maritime industry.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'D+' },
            { subject: 'English', grade: 'D+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 80,000 per year',
      },
      {
        name: 'Certificate in Automotive Engineering',
        level: 'Certificate',
        duration: '2 years',
        description:
          'A program that provides students with skills in vehicle mechanics, diagnostics, and repair.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 60,000 per year',
      },
    ],
    rankings: {
      national: 4,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Maritime training center',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
    ],
    establishedYear: 1952,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kcnp_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kcnp_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Eldoret National Polytechnic',
    type: 'Technical Institute',
    location: {
      address: 'Eldoret-Kapsabet Road',
      city: 'Eldoret',
      county: 'Uasin Gishu',
      country: 'Kenya',
      coordinates: {
        latitude: 0.5167,
        longitude: 35.2833,
      },
    },
    description:
      'Eldoret National Polytechnic is a leading technical and vocational education institution in the North Rift region of Kenya. The polytechnic offers training in engineering, building and construction, business, and hospitality.',
    website: 'https://www.tnp.ac.ke/',
    contact: {
      email: 'info@tnp.ac.ke',
      phone: '+254 53 2063000',
      socialMedia: {
        facebook: 'https://www.facebook.com/EldoretNationalPolytechnic/',
        twitter: 'https://twitter.com/ENPoly',
      },
    },
    programs: [
      {
        name: 'Diploma in Building and Construction',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A program that provides students with skills in building construction, project management, and quantity surveying.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'D+' },
            { subject: 'Physics', grade: 'D+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 75,000 per year',
      },
      {
        name: 'Certificate in Food and Beverage Service',
        level: 'Certificate',
        duration: '1 year',
        description:
          'A program that trains students in food service, customer service, and hospitality operations.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 50,000',
      },
    ],
    rankings: {
      national: 5,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Building and construction workshops',
      'Training restaurant',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
    ],
    establishedYear: 1965,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/enp_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/enp_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Kenya Institute of Mass Communication',
    type: 'College',
    location: {
      address: 'Nairobi West',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.3,
        longitude: 36.8167,
      },
    },
    description:
      'Kenya Institute of Mass Communication (KIMC) is a leading media training institution in East Africa. The institute offers training in journalism, film production, electronic media, and public relations.',
    website: 'https://www.kimc.ac.ke/',
    contact: {
      email: 'info@kimc.ac.ke',
      phone: '+254 20 2150320',
      socialMedia: {
        facebook: 'https://www.facebook.com/KIMCKenya/',
        twitter: 'https://twitter.com/KIMC_Kenya',
      },
    },
    programs: [
      {
        name: 'Diploma in Journalism',
        level: 'Diploma',
        duration: '2 years',
        description:
          'A program that trains students in news reporting, writing, editing, and media ethics.',
        entryRequirements: {
          minimumGrade: 'C',
          specificSubjects: [{ subject: 'English', grade: 'C+' }],
          additionalRequirements: ['KCSE Certificate', 'Interview'],
        },
        tuitionFees: 'KES 90,000 per year',
      },
      {
        name: 'Diploma in Film Production',
        level: 'Diploma',
        duration: '2 years',
        description:
          'A program that trains students in film directing, cinematography, editing, and production management.',
        entryRequirements: {
          minimumGrade: 'C',
          specificSubjects: [],
          additionalRequirements: [
            'KCSE Certificate',
            'Interview',
            'Portfolio submission',
          ],
        },
        tuitionFees: 'KES 95,000 per year',
      },
    ],
    rankings: {
      national: 1,
      international: null,
      year: 2024,
    },
    facilities: [
      'TV studios',
      'Radio studios',
      'Film production equipment',
      'Computer labs',
      'Library',
      'Student hostels',
      'Auditorium',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
      'Media Council of Kenya',
    ],
    establishedYear: 1965,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kimc_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kimc_campus.jpg',
    ],
    featured: true,
    views: 3,
  },
  {
    name: 'Kenya Utalii College',
    type: 'College',
    location: {
      address: 'Thika Road',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.2333,
        longitude: 36.8833,
      },
    },
    description:
      'Kenya Utalii College is a leading hospitality and tourism training institution in Africa. The college offers training in hotel management, culinary arts, tour guiding, and travel operations.',
    website: 'https://www.utalii.ac.ke/',
    contact: {
      email: 'info@utalii.ac.ke',
      phone: '+254 20 8563540',
      socialMedia: {
        facebook: 'https://www.facebook.com/KenyaUtaliiCollege/',
        twitter: 'https://twitter.com/KenyaUtalii',
        instagram: 'https://www.instagram.com/kenyautalii/',
      },
    },
    programs: [
      {
        name: 'Diploma in Hotel Management',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A comprehensive program that trains students in hotel operations, food and beverage management, and hospitality service.',
        entryRequirements: {
          minimumGrade: 'C',
          specificSubjects: [
            { subject: 'English', grade: 'C' },
            { subject: 'Mathematics', grade: 'C-' },
          ],
          additionalRequirements: ['KCSE Certificate', 'Interview'],
        },
        tuitionFees: 'KES 120,000 per year',
      },
      {
        name: 'Certificate in Tour Guiding and Travel Operations',
        level: 'Certificate',
        duration: '1 year',
        description:
          'A program that trains students in tour guiding, travel arrangements, and customer service in the tourism industry.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [{ subject: 'English', grade: 'C-' }],
          additionalRequirements: ['KCSE Certificate', 'Interview'],
        },
        tuitionFees: 'KES 80,000',
      },
    ],
    rankings: {
      national: 1,
      international: null,
      year: 2024,
    },
    facilities: [
      'Training hotel',
      'Training restaurants',
      'Training kitchens',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
      'Tourism Regulatory Authority',
    ],
    establishedYear: 1975,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/utalii_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/utalii_campus.jpg',
    ],
    featured: true,
    views: 4,
  },
  {
    name: 'Railway Training Institute',
    type: 'Technical Institute',
    location: {
      address: 'South C',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.3167,
        longitude: 36.8333,
      },
    },
    description:
      'Railway Training Institute (RTI) is a specialized technical institution that offers training in railway operations, engineering, and management. The institute plays a key role in developing human resources for the railway sector in Kenya and East Africa.',
    website: 'https://www.rti.ac.ke/',
    contact: {
      email: 'info@rti.ac.ke',
      phone: '+254 20 2606586',
      socialMedia: {
        facebook: 'https://www.facebook.com/RailwayTrainingInstitute/',
        twitter: 'https://twitter.com/RTI_Kenya',
      },
    },
    programs: [
      {
        name: 'Diploma in Railway Engineering',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A specialized program focusing on railway infrastructure, signaling systems, and rolling stock maintenance.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'C-' },
            { subject: 'Physics', grade: 'C-' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 90,000 per year',
      },
      {
        name: 'Certificate in Railway Operations',
        level: 'Certificate',
        duration: '1 year',
        description:
          'A program that trains students in train operations, safety procedures, and customer service in the railway sector.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 60,000',
      },
    ],
    rankings: {
      national: 6,
      international: null,
      year: 2024,
    },
    facilities: [
      'Railway workshops',
      'Signaling laboratory',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
    ],
    establishedYear: 1956,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/rti_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/rti_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Kisumu National Polytechnic',
    type: 'Technical Institute',
    location: {
      address: 'Kisumu-Kakamega Road',
      city: 'Kisumu',
      county: 'Kisumu',
      country: 'Kenya',
      coordinates: {
        latitude: -0.1,
        longitude: 34.75,
      },
    },
    description:
      'Kisumu National Polytechnic is a leading technical and vocational education institution in western Kenya. The polytechnic offers training in engineering, business, hospitality, and applied sciences.',
    website: 'https://www.kisumupoly.ac.ke/',
    contact: {
      email: 'info@kisumupoly.ac.ke',
      phone: '+254 57 2020502',
      socialMedia: {
        facebook: 'https://www.facebook.com/KisumuNationalPolytechnic/',
        twitter: 'https://twitter.com/KisumuPoly',
      },
    },
    programs: [
      {
        name: 'Diploma in Water Engineering',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A program focusing on water resource management, water supply systems, and wastewater treatment.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'D+' },
            { subject: 'Physics/Chemistry', grade: 'D+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 75,000 per year',
      },
      {
        name: 'Certificate in Fashion Design and Garment Making',
        level: 'Certificate',
        duration: '2 years',
        description:
          'A program that trains students in clothing design, pattern making, and garment production.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 55,000 per year',
      },
    ],
    rankings: {
      national: 7,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Fashion design studio',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
    ],
    establishedYear: 1967,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kisumu_poly_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kisumu_poly_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Machakos University',
    type: 'University',
    location: {
      address: 'Machakos-Wote Road',
      city: 'Machakos',
      county: 'Machakos',
      country: 'Kenya',
      coordinates: {
        latitude: -1.5167,
        longitude: 37.2667,
      },
    },
    description:
      'Machakos University is a public university that evolved from Machakos Technical Institute. The university offers programs in education, engineering, business, and agriculture, with a focus on sustainable development and innovation.',
    website: 'https://www.mksu.ac.ke/',
    contact: {
      email: 'info@mksu.ac.ke',
      phone: '+254 44 2021433',
      socialMedia: {
        facebook: 'https://www.facebook.com/MachakosUniversity/',
        twitter: 'https://twitter.com/MachakosUni',
      },
    },
    programs: [
      {
        name: 'Bachelor of Science in Agricultural Education and Extension',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that prepares students for careers in agricultural education, extension services, and rural development.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [
            { subject: 'Biology', grade: 'C+' },
            { subject: 'Chemistry', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 130,000 per year',
      },
      {
        name: 'Bachelor of Technology in Mechanical Engineering',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program focusing on mechanical systems design, manufacturing processes, and maintenance engineering.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'C+' },
            { subject: 'Physics', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 150,000 per year',
      },
    ],
    rankings: {
      national: 14,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Agricultural demonstration farm',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: ['Commission for University Education (CUE)'],
    establishedYear: 2016,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/machakos_uni_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/machakos_uni_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Zetech University',
    type: 'University',
    location: {
      address: 'Thika Road, Ruiru',
      city: 'Nairobi',
      county: 'Kiambu',
      country: 'Kenya',
      coordinates: {
        latitude: -1.1833,
        longitude: 36.9667,
      },
    },
    description:
      'Zetech University is a private university that evolved from Zetech College. The university offers programs in business, ICT, hospitality, and engineering, with a focus on practical skills and industry relevance.',
    website: 'https://www.zetech.ac.ke/',
    contact: {
      email: 'info@zetech.ac.ke',
      phone: '+254 719 034000',
      socialMedia: {
        facebook: 'https://www.facebook.com/ZetechUniversity/',
        twitter: 'https://twitter.com/ZetechU',
        instagram: 'https://www.instagram.com/zetechuniversity/',
      },
    },
    programs: [
      {
        name: 'Bachelor of Science in Information Technology',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that focuses on computer systems, programming, networking, and IT management.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [{ subject: 'Mathematics', grade: 'C+' }],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 180,000 per year',
      },
      {
        name: 'Diploma in Hospitality Management',
        level: 'Diploma',
        duration: '2 years',
        description:
          'A program that trains students in hotel operations, food and beverage service, and hospitality management.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 90,000 per year',
      },
    ],
    rankings: {
      national: 20,
      international: null,
      year: 2024,
    },
    facilities: [
      'Computer labs',
      'Training restaurant',
      'Library',
      'Student hostels',
      'Sports facilities',
      'Business incubation center',
    ],
    accreditation: ['Commission for University Education (CUE)'],
    establishedYear: 2014,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/zetech_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/zetech_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Kirinyaga University',
    type: 'University',
    location: {
      address: 'Kerugoya-Kutus Road',
      city: 'Kerugoya',
      county: 'Kirinyaga',
      country: 'Kenya',
      coordinates: {
        latitude: -0.5,
        longitude: 37.2833,
      },
    },
    description:
      'Kirinyaga University is a public university that evolved from Kirinyaga University College. The university offers programs in business, computing, engineering, and health sciences, with a focus on innovation and entrepreneurship.',
    website: 'https://www.kyu.ac.ke/',
    contact: {
      email: 'info@kyu.ac.ke',
      phone: '+254 20 2088220',
      socialMedia: {
        facebook: 'https://www.facebook.com/KirinyagaUniversity/',
        twitter: 'https://twitter.com/KirinyagaUni',
      },
    },
    programs: [
      {
        name: 'Bachelor of Science in Computer Science',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program focusing on computer theory, programming, algorithms, and software development.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'C+' },
            { subject: 'Physics', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 140,000 per year',
      },
      {
        name: 'Bachelor of Commerce',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that prepares students for careers in business management, accounting, and finance.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [{ subject: 'Mathematics', grade: 'C+' }],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 130,000 per year',
      },
    ],
    rankings: {
      national: 18,
      international: null,
      year: 2024,
    },
    facilities: [
      'Computer labs',
      'Business incubation center',
      'Library',
      'Student hostels',
      'Sports facilities',
      'Health center',
    ],
    accreditation: ['Commission for University Education (CUE)'],
    establishedYear: 2016,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kirinyaga_uni_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kirinyaga_uni_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: "Murang'a University of Technology",
    type: 'University',
    location: {
      address: "Murang'a-Sagana Road",
      city: "Murang'a",
      county: "Murang'a",
      country: 'Kenya',
      coordinates: {
        latitude: -0.7167,
        longitude: 37.15,
      },
    },
    description:
      "Murang'a University of Technology is a public university that focuses on technology, engineering, and applied sciences. The university aims to produce graduates who can contribute to technological advancement and industrial development in Kenya.",
    website: 'https://www.mut.ac.ke/',
    contact: {
      email: 'info@mut.ac.ke',
      phone: '+254 724 304 524',
      socialMedia: {
        facebook: 'https://www.facebook.com/MurangaUniversityofTechnology/',
        twitter: 'https://twitter.com/MUT_Kenya',
      },
    },
    programs: [
      {
        name: 'Bachelor of Technology in Electrical and Electronic Engineering',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program focusing on electrical systems, electronic devices, and power systems engineering.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'C+' },
            { subject: 'Physics', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 150,000 per year',
      },
      {
        name: 'Bachelor of Science in Information Technology',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that focuses on computer systems, programming, networking, and IT management.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [{ subject: 'Mathematics', grade: 'C+' }],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 140,000 per year',
      },
    ],
    rankings: {
      national: 17,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering laboratories',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
      'Innovation hub',
    ],
    accreditation: ['Commission for University Education (CUE)'],
    establishedYear: 2016,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/muranga_uni_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/muranga_uni_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Nairobi Technical Training Institute',
    type: 'Technical Institute',
    location: {
      address: 'Ngara Road',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.2833,
        longitude: 36.8167,
      },
    },
    description:
      'Nairobi Technical Training Institute (NTTI) is a public technical and vocational education institution located in the heart of Nairobi. The institute offers training in engineering, business, hospitality, and applied sciences.',
    website: 'https://www.ntti.ac.ke/',
    contact: {
      email: 'info@ntti.ac.ke',
      phone: '+254 20 2245581',
      socialMedia: {
        facebook: 'https://www.facebook.com/NairobiTechnicalTrainingInstitute/',
        twitter: 'https://twitter.com/NTTI_Kenya',
      },
    },
    programs: [
      {
        name: 'Diploma in Electrical and Electronic Engineering',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A program that provides students with skills in electrical installation, electronic systems, and power systems.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'D+' },
            { subject: 'Physics', grade: 'D+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 85,000 per year',
      },
      {
        name: 'Certificate in Secretarial Studies',
        level: 'Certificate',
        duration: '1 year',
        description:
          'A program that trains students in office administration, document management, and customer service.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [{ subject: 'English', grade: 'D+' }],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 50,000',
      },
    ],
    rankings: {
      national: 8,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
      'Business incubation center',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
    ],
    establishedYear: 1964,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/ntti_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/ntti_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Meru National Polytechnic',
    type: 'Technical Institute',
    location: {
      address: 'Meru-Maua Road',
      city: 'Meru',
      county: 'Meru',
      country: 'Kenya',
      coordinates: {
        latitude: 0.05,
        longitude: 37.65,
      },
    },
    description:
      'Meru National Polytechnic is a public technical and vocational education institution located in Meru County. The polytechnic offers training in engineering, business, hospitality, and applied sciences.',
    website: 'https://www.merupoly.ac.ke/',
    contact: {
      email: 'info@merupoly.ac.ke',
      phone: '+254 64 3130901',
      socialMedia: {
        facebook: 'https://www.facebook.com/MeruNationalPolytechnic/',
        twitter: 'https://twitter.com/MeruPoly',
      },
    },
    programs: [
      {
        name: 'Diploma in Agriculture and Biotechnology',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A program focusing on agricultural production, biotechnology applications, and sustainable farming practices.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [
            { subject: 'Biology', grade: 'D+' },
            { subject: 'Chemistry', grade: 'D+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 80,000 per year',
      },
      {
        name: 'Certificate in Plumbing and Pipe Fitting',
        level: 'Certificate',
        duration: '2 years',
        description:
          'A program that trains students in plumbing installation, maintenance, and repair of water and drainage systems.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 55,000 per year',
      },
    ],
    rankings: {
      national: 9,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Agricultural demonstration farm',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
    ],
    establishedYear: 1979,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/meru_poly_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/meru_poly_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Sigalagala National Polytechnic',
    type: 'Technical Institute',
    location: {
      address: 'Kakamega-Kisumu Road',
      city: 'Kakamega',
      county: 'Kakamega',
      country: 'Kenya',
      coordinates: {
        latitude: 0.1667,
        longitude: 34.7833,
      },
    },
    description:
      'Sigalagala National Polytechnic is a public technical and vocational education institution located in Kakamega County. The polytechnic offers training in engineering, business, hospitality, and applied sciences.',
    website: 'https://www.sigalagala.ac.ke/',
    contact: {
      email: 'info@sigalagala.ac.ke',
      phone: '+254 56 2030268',
      socialMedia: {
        facebook: 'https://www.facebook.com/SigalagalaNationalPolytechnic/',
        twitter: 'https://twitter.com/SigalagalaPoly',
      },
    },
    programs: [
      {
        name: 'Diploma in Building and Construction',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A program that provides students with skills in building construction, project management, and quantity surveying.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'D+' },
            { subject: 'Physics', grade: 'D+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 75,000 per year',
      },
      {
        name: 'Certificate in Welding and Fabrication',
        level: 'Certificate',
        duration: '2 years',
        description:
          'A program that trains students in metal welding, fabrication, and structural metalwork.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 55,000 per year',
      },
    ],
    rankings: {
      national: 10,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Building and construction workshops',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
    ],
    establishedYear: 1977,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/sigalagala_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/sigalagala_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Kenya Water Institute',
    type: 'Technical Institute',
    location: {
      address: 'South C',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.3167,
        longitude: 36.8333,
      },
    },
    description:
      'Kenya Water Institute (KEWI) is a specialized technical institution that offers training in water technology, water resource management, and water supply services. The institute plays a key role in developing human resources for the water sector in Kenya.',
    website: 'https://www.kewi.or.ke/',
    contact: {
      email: 'info@kewi.or.ke',
      phone: '+254 20 6003893',
      socialMedia: {
        facebook: 'https://www.facebook.com/KenyaWaterInstitute/',
        twitter: 'https://twitter.com/KEWI_Kenya',
      },
    },
    programs: [
      {
        name: 'Diploma in Water Technology',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A program focusing on water treatment, distribution systems, and quality control.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'D+' },
            { subject: 'Chemistry', grade: 'D+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 85,000 per year',
      },
      {
        name: 'Certificate in Water Supply Services',
        level: 'Certificate',
        duration: '2 years',
        description:
          'A program that trains students in water supply operations, maintenance, and customer service.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 60,000 per year',
      },
    ],
    rankings: {
      national: 11,
      international: null,
      year: 2024,
    },
    facilities: [
      'Water laboratories',
      'Water treatment plant',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
      'Water Services Regulatory Board',
    ],
    establishedYear: 2001,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kewi_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kewi_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Nyeri National Polytechnic',
    type: 'Technical Institute',
    location: {
      address: 'Mumbi Road',
      city: 'Nyeri',
      county: 'Nyeri',
      country: 'Kenya',
      coordinates: {
        latitude: -0.4167,
        longitude: 36.95,
      },
    },
    description:
      'Nyeri National Polytechnic is a public technical and vocational education institution located in Nyeri County. The polytechnic offers training in engineering, business, hospitality, and applied sciences.',
    website: 'https://www.thenyeripoly.ac.ke/',
    contact: {
      email: 'info@thenyeripoly.ac.ke',
      phone: '+254 61 2032330',
      socialMedia: {
        facebook: 'https://www.facebook.com/NyeriNationalPolytechnic/',
        twitter: 'https://twitter.com/NyeriPoly',
      },
    },
    programs: [
      {
        name: 'Diploma in Automotive Engineering',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A program that provides students with skills in vehicle mechanics, diagnostics, and repair.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'D+' },
            { subject: 'Physics', grade: 'D+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 80,000 per year',
      },
      {
        name: 'Certificate in Food Processing',
        level: 'Certificate',
        duration: '2 years',
        description:
          'A program that trains students in food processing, preservation, and quality control.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [{ subject: 'Chemistry', grade: 'D+' }],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 55,000 per year',
      },
    ],
    rankings: {
      national: 12,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Food processing plant',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
    ],
    establishedYear: 1978,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/nyeri_poly_logo.png',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/nyeri_poly_campus.jpg',
    ],
    featured: false,
    views: 0,
  },
];
// Array of institution data
const institutions = [
  {
    name: 'University of Nairobi',
    type: 'University',
    location: {
      address: 'University Way, Nairobi',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.2800945,
        longitude: 36.8219462,
      },
    },
    description:
      'The University of Nairobi (UoN), the oldest and largest university in Kenya, evolved from the Royal Technical College in 1956 and became an independent university in 1970, offering a wide range of academic programs across multiple campuses and colleges.',
    website: 'https://www.uonbi.ac.ke/',
    contact: {
      email: 'vc@uonbi.ac.ke',
      phone: '+254 20 4910000',
      socialMedia: {
        facebook: 'https://www.facebook.com/uonbi.ac.ke/',
        twitter: 'https://twitter.com/uonbi',
        instagram: 'https://www.instagram.com/uonbi/',
        linkedin: 'https://www.linkedin.com/school/university-of-nairobi/',
      },
    },
    programs: [
      {
        name: 'Bachelor of Medicine and Bachelor of Surgery',
        level: 'Bachelors',
        duration: '6 years',
        description:
          'A comprehensive medical program that prepares students for careers in medicine and surgery.',
        entryRequirements: {
          minimumGrade: 'A-',
          specificSubjects: [
            { subject: 'Biology', grade: 'B+' },
            { subject: 'Chemistry', grade: 'B+' },
            { subject: 'Mathematics', grade: 'B' },
          ],
          additionalRequirements: ['KCSE Certificate', 'Interview'],
        },
        tuitionFees: 'KES 600,000 per year',
      },
      {
        name: 'Bachelor of Science in Computer Science',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that focuses on computer theory, computing problems and solutions, and design of computer systems.',
        entryRequirements: {
          minimumGrade: 'B+',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'B+' },
            { subject: 'Physics', grade: 'B' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 180,000 per year',
      },
    ],
    rankings: {
      national: 1,
      international: 950,
      year: 2024,
    },
    facilities: [
      'Libraries with ICT access',
      'Well-equipped teaching laboratories',
      'Studios for architecture and design',
      'TV rooms',
      'Sports facilities',
      'Student center',
      'Medical center',
    ],
    accreditation: ['Commission for University Education (CUE)'],
    establishedYear: 1970,
    logo: 'https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/xjwgjofdlxh4n89t6peo.gif',
    images: [
      'https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/sf14nmypznr0p3faevm0.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/uon_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/uon_library.jpg',
    ],
    featured: true,
    views: 2,
  },
  {
    name: 'Kenyatta University',
    type: 'University',
    location: {
      address: 'Thika Road, Nairobi',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.1801,
        longitude: 36.9352,
      },
    },
    description:
      'Kenyatta University is one of the leading public research universities in Kenya, known for its strong programs in education, humanities, and sciences. The university has expanded significantly since its establishment and now offers a wide range of undergraduate and postgraduate programs.',
    website: 'https://www.ku.ac.ke/',
    contact: {
      email: 'info@ku.ac.ke',
      phone: '+254 20 8710901',
      socialMedia: {
        facebook: 'https://www.facebook.com/KenyattaUniversity/',
        twitter: 'https://twitter.com/KenyattaUni',
        instagram: 'https://www.instagram.com/kenyattauniversity/',
      },
    },
    programs: [
      {
        name: 'Bachelor of Education (Arts)',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program designed to prepare students for teaching careers in secondary schools, focusing on arts subjects.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [{ subject: 'English', grade: 'C+' }],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 120,000 per year',
      },
      {
        name: 'Master of Business Administration',
        level: 'Masters',
        duration: '2 years',
        description:
          'An advanced business program that prepares students for leadership roles in various organizations.',
        entryRequirements: {
          minimumGrade: 'Second Class Upper Division',
          specificSubjects: [],
          additionalRequirements: [
            "Bachelor's Degree",
            'Work Experience (2 years preferred)',
          ],
        },
        tuitionFees: 'KES 250,000 per year',
      },
    ],
    rankings: {
      national: 2,
      international: 1200,
      year: 2024,
    },
    facilities: [
      'Modern library',
      'Computer labs',
      'Sports complex',
      'Student hostels',
      'Recreation center',
      'Health center',
      'Business incubation center',
    ],
    accreditation: ['Commission for University Education (CUE)'],
    establishedYear: 1985,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/ku_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/ku_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/ku_library.jpg',
    ],
    featured: true,
    views: 1,
  },
  {
    name: 'Strathmore University',
    type: 'University',
    location: {
      address: 'Ole Sangale Road, Madaraka Estate',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.3106,
        longitude: 36.812,
      },
    },
    description:
      'Strathmore University is a leading private university in Kenya known for its excellence in business, IT, and law education. The university emphasizes ethical leadership, professional competence, and service to society.',
    website: 'https://strathmore.edu/',
    contact: {
      email: 'admissions@strathmore.edu',
      phone: '+254 703 034000',
      socialMedia: {
        facebook: 'https://www.facebook.com/StrathmoreUniversity/',
        twitter: 'https://twitter.com/StrathU',
        instagram: 'https://www.instagram.com/strathmore_university/',
        linkedin: 'https://www.linkedin.com/school/strathmore-university/',
      },
    },
    programs: [
      {
        name: 'Bachelor of Business Science',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A rigorous program that combines business theory with mathematical and statistical analysis.',
        entryRequirements: {
          minimumGrade: 'B+',
          specificSubjects: [{ subject: 'Mathematics', grade: 'B+' }],
          additionalRequirements: [
            'KCSE Certificate',
            'Entrance Exam',
            'Interview',
          ],
        },
        tuitionFees: 'KES 500,000 per year',
      },
      {
        name: 'Bachelor of Laws (LLB)',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A comprehensive legal education program that prepares students for careers in law.',
        entryRequirements: {
          minimumGrade: 'A-',
          specificSubjects: [{ subject: 'English', grade: 'B+' }],
          additionalRequirements: [
            'KCSE Certificate',
            'Entrance Exam',
            'Interview',
          ],
        },
        tuitionFees: 'KES 550,000 per year',
      },
    ],
    rankings: {
      national: 3,
      international: 1500,
      year: 2024,
    },
    facilities: [
      'Modern library',
      'Computer labs',
      'Moot court',
      'Sports facilities',
      'Student center',
      'Cafeteria',
      'Innovation center',
    ],
    accreditation: ['Commission for University Education (CUE)'],
    establishedYear: 1961,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/strathmore_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/strathmore_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/strathmore_library.jpg',
    ],
    featured: true,
    views: 3,
  },
  {
    name: 'Jomo Kenyatta University of Agriculture and Technology',
    type: 'University',
    location: {
      address: 'Thika Road, Juja',
      city: 'Juja',
      county: 'Kiambu',
      country: 'Kenya',
      coordinates: {
        latitude: -1.0918,
        longitude: 37.0144,
      },
    },
    description:
      'JKUAT is a public university focused on agriculture, engineering, technology, and science education. The university is known for its strong emphasis on research and innovation in these fields.',
    website: 'https://www.jkuat.ac.ke/',
    contact: {
      email: 'info@jkuat.ac.ke',
      phone: '+254 67 5870001',
      socialMedia: {
        facebook: 'https://www.facebook.com/JKUAT/',
        twitter: 'https://twitter.com/JKUATOfficial',
      },
    },
    programs: [
      {
        name: 'Bachelor of Science in Civil Engineering',
        level: 'Bachelors',
        duration: '5 years',
        description:
          'A program that prepares students for careers in civil engineering, focusing on design, construction, and maintenance of infrastructure.',
        entryRequirements: {
          minimumGrade: 'B+',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'B+' },
            { subject: 'Physics', grade: 'B+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 180,000 per year',
      },
      {
        name: 'Bachelor of Science in Agriculture',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that focuses on agricultural science and technology, preparing students for careers in farming, agribusiness, and agricultural research.',
        entryRequirements: {
          minimumGrade: 'B',
          specificSubjects: [
            { subject: 'Biology', grade: 'B' },
            { subject: 'Chemistry', grade: 'B' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 160,000 per year',
      },
    ],
    rankings: {
      national: 4,
      international: 1800,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Agricultural demonstration farms',
      'Research laboratories',
      'Library',
      'Computer labs',
      'Sports facilities',
      'Student hostels',
    ],
    accreditation: [
      'Commission for University Education (CUE)',
      'Engineers Board of Kenya (EBK)',
    ],
    establishedYear: 1994,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/jkuat_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/jkuat_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/jkuat_engineering.jpg',
    ],
    featured: true,
    views: 1,
  },
  {
    name: 'Moi University',
    type: 'University',
    location: {
      address: 'Eldoret-Nakuru Highway',
      city: 'Eldoret',
      county: 'Uasin Gishu',
      country: 'Kenya',
      coordinates: {
        latitude: 0.5118,
        longitude: 35.2698,
      },
    },
    description:
      'Moi University is a public university established in 1984 as the second public university in Kenya. It offers a wide range of programs across various disciplines and has multiple campuses across the country.',
    website: 'https://www.mu.ac.ke/',
    contact: {
      email: 'info@mu.ac.ke',
      phone: '+254 53 2211000',
      socialMedia: {
        facebook: 'https://www.facebook.com/MoiUniversity/',
        twitter: 'https://twitter.com/Moi_University',
      },
    },
    programs: [
      {
        name: 'Bachelor of Education (Science)',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program designed to prepare students for teaching careers in secondary schools, focusing on science subjects.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'C+' },
            { subject: 'Biology/Physics/Chemistry', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 120,000 per year',
      },
      {
        name: 'Bachelor of Tourism Management',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that prepares students for careers in the tourism and hospitality industry.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 130,000 per year',
      },
    ],
    rankings: {
      national: 5,
      international: 2000,
      year: 2024,
    },
    facilities: [
      'Library',
      'Computer labs',
      'Sports facilities',
      'Student hostels',
      'Health center',
      'Recreation center',
    ],
    accreditation: ['Commission for University Education (CUE)'],
    establishedYear: 1984,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/moi_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/moi_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/moi_library.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Kenya Medical Training College',
    type: 'College',
    location: {
      address: 'Off Ngong Road',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.2999,
        longitude: 36.8057,
      },
    },
    description:
      'Kenya Medical Training College (KMTC) is a state corporation established in 1927 and is the leading medical training institution in Kenya with over 70 campuses across the country. KMTC offers training in various medical and paramedical fields.',
    website: 'https://www.kmtc.ac.ke/',
    contact: {
      email: 'info@kmtc.ac.ke',
      phone: '+254 20 2725711',
      socialMedia: {
        facebook: 'https://www.facebook.com/KMTCofficial/',
        twitter: 'https://twitter.com/Kmtc_official',
      },
    },
    programs: [
      {
        name: 'Diploma in Clinical Medicine and Surgery',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A program that trains clinical officers who provide primary healthcare services in various healthcare settings.',
        entryRequirements: {
          minimumGrade: 'C',
          specificSubjects: [
            { subject: 'Biology', grade: 'C+' },
            { subject: 'Chemistry', grade: 'C+' },
            { subject: 'English/Kiswahili', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 92,000 per year',
      },
      {
        name: 'Diploma in Nursing',
        level: 'Diploma',
        duration: '3.5 years',
        description:
          'A program that trains nurses to provide comprehensive nursing care in various healthcare settings.',
        entryRequirements: {
          minimumGrade: 'C',
          specificSubjects: [
            { subject: 'Biology', grade: 'C+' },
            { subject: 'Chemistry/Physics', grade: 'C+' },
            { subject: 'English/Kiswahili', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 90,000 per year',
      },
    ],
    rankings: {
      national: 1,
      international: null,
      year: 2024,
    },
    facilities: [
      'Skills laboratories',
      'Library',
      'Computer labs',
      'Student hostels',
      'Recreation facilities',
      'Demonstration rooms',
    ],
    accreditation: [
      'Ministry of Health',
      'Nursing Council of Kenya',
      'Clinical Officers Council',
    ],
    establishedYear: 1927,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/kmtc_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/kmtc_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/kmtc_lab.jpg',
    ],
    featured: true,
    views: 5,
  },
  {
    name: 'Technical University of Kenya',
    type: 'University',
    location: {
      address: 'Haile Selassie Avenue',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.2921,
        longitude: 36.8219,
      },
    },
    description:
      'The Technical University of Kenya (TU-K) evolved from the Kenya Polytechnic and was chartered as a university in 2013. It focuses on technical and vocational education, offering programs in engineering, applied sciences, and technology.',
    website: 'https://www.tukenya.ac.ke/',
    contact: {
      email: 'info@tukenya.ac.ke',
      phone: '+254 20 2219929',
      socialMedia: {
        facebook: 'https://www.facebook.com/TechnicalUniversityofKenya/',
        twitter: 'https://twitter.com/TU_Kenya',
      },
    },
    programs: [
      {
        name: 'Bachelor of Technology in Mechanical Engineering',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that focuses on the design, development, and maintenance of mechanical systems and equipment.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'C+' },
            { subject: 'Physics', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 150,000 per year',
      },
      {
        name: 'Diploma in Information Technology',
        level: 'Diploma',
        duration: '2 years',
        description:
          'A program that provides students with skills in computer systems, programming, and IT support.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [{ subject: 'Mathematics', grade: 'D+' }],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 80,000 per year',
      },
    ],
    rankings: {
      national: 8,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Computer labs',
      'Library',
      'Student center',
      'Sports facilities',
      'Auditorium',
    ],
    accreditation: [
      'Commission for University Education (CUE)',
      'Engineers Board of Kenya (EBK)',
    ],
    establishedYear: 2013,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/tuk_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/tuk_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/tuk_workshop.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Kenya Institute of Management',
    type: 'College',
    location: {
      address: 'Mara Road, Upper Hill',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.2964,
        longitude: 36.8101,
      },
    },
    description:
      'Kenya Institute of Management (KIM) is a leading management development institution that offers training, research, and consultancy services. It focuses on business and management education at certificate, diploma, and degree levels.',
    website: 'https://www.kim.ac.ke/',
    contact: {
      email: 'info@kim.ac.ke',
      phone: '+254 20 2714054',
      socialMedia: {
        facebook: 'https://www.facebook.com/KenyaInstituteofManagement/',
        twitter: 'https://twitter.com/KIMKenya',
      },
    },
    programs: [
      {
        name: 'Diploma in Business Management',
        level: 'Diploma',
        duration: '2 years',
        description:
          'A program that provides students with knowledge and skills in business management, marketing, and entrepreneurship.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 85,000 per year',
      },
      {
        name: 'Certificate in Project Management',
        level: 'Certificate',
        duration: '6 months',
        description:
          'A short program that equips students with skills in project planning, execution, and monitoring.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 45,000',
      },
    ],
    rankings: {
      national: 2,
      international: null,
      year: 2024,
    },
    facilities: [
      'Computer labs',
      'Library',
      'Conference rooms',
      'Student lounge',
      'Cafeteria',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
    ],
    establishedYear: 1954,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/kim_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/kim_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/kim_library.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Maseno University',
    type: 'University',
    location: {
      address: 'Kisumu-Busia Road',
      city: 'Kisumu',
      county: 'Kisumu',
      country: 'Kenya',
      coordinates: {
        latitude: -0.0075,
        longitude: 34.5997,
      },
    },
    description:
      'Maseno University is a public university located at the equator in western Kenya. It offers a wide range of programs in arts, sciences, education, and business, and is known for its strong programs in education and health sciences.',
    website: 'https://www.maseno.ac.ke/',
    contact: {
      email: 'info@maseno.ac.ke',
      phone: '+254 57 2351620',
      socialMedia: {
        facebook: 'https://www.facebook.com/MasenoUniversity/',
        twitter: 'https://twitter.com/MasenoUni',
      },
    },
    programs: [
      {
        name: 'Bachelor of Education (Arts)',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that prepares students for teaching careers in secondary schools, focusing on arts subjects.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [{ subject: 'English', grade: 'C+' }],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 120,000 per year',
      },
      {
        name: 'Bachelor of Science in Nursing',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that prepares students for careers in nursing, focusing on patient care, health promotion, and disease prevention.',
        entryRequirements: {
          minimumGrade: 'B-',
          specificSubjects: [
            { subject: 'Biology', grade: 'B-' },
            { subject: 'Chemistry', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 150,000 per year',
      },
    ],
    rankings: {
      national: 6,
      international: 2200,
      year: 2024,
    },
    facilities: [
      'Library',
      'Computer labs',
      'Science laboratories',
      'Student hostels',
      'Sports facilities',
      'Health center',
    ],
    accreditation: ['Commission for University Education (CUE)'],
    establishedYear: 1991,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/maseno_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/maseno_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/maseno_library.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Egerton University',
    type: 'University',
    location: {
      address: 'Njoro',
      city: 'Nakuru',
      county: 'Nakuru',
      country: 'Kenya',
      coordinates: {
        latitude: -0.3667,
        longitude: 35.9333,
      },
    },
    description:
      'Egerton University is one of the oldest institutions of higher learning in Kenya, established in 1939 as a farm school. It has grown to become a leading agricultural university in East Africa, offering programs in agriculture, natural resources, and related fields.',
    website: 'https://www.egerton.ac.ke/',
    contact: {
      email: 'info@egerton.ac.ke',
      phone: '+254 51 2217781',
      socialMedia: {
        facebook: 'https://www.facebook.com/EgertonUniversity/',
        twitter: 'https://twitter.com/EgertonUni',
      },
    },
    programs: [
      {
        name: 'Bachelor of Science in Agricultural Economics',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that combines agricultural science with economics, preparing students for careers in agricultural policy, agribusiness, and rural development.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [{ subject: 'Mathematics', grade: 'C+' }],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 130,000 per year',
      },
      {
        name: 'Bachelor of Science in Animal Science',
        level: 'Bachelors',
        duration: '4 years',
        description:
          'A program that focuses on the scientific principles of animal production, health, and management.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [
            { subject: 'Biology', grade: 'C+' },
            { subject: 'Chemistry', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 130,000 per year',
      },
    ],
    rankings: {
      national: 7,
      international: 2300,
      year: 2024,
    },
    facilities: [
      'Agricultural demonstration farms',
      'Research laboratories',
      'Library',
      'Computer labs',
      'Student hostels',
      'Sports facilities',
      'Health center',
    ],
    accreditation: ['Commission for University Education (CUE)'],
    establishedYear: 1987,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/egerton_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/egerton_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/egerton_farm.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Kenya School of Law',
    type: 'College',
    location: {
      address: 'Karen',
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        latitude: -1.3333,
        longitude: 36.7167,
      },
    },
    description:
      'The Kenya School of Law (KSL) is a postgraduate law school that provides professional legal training for law graduates preparing to be admitted to the Kenyan bar. It is the only institution authorized to offer the Advocates Training Program in Kenya.',
    website: 'https://www.ksl.ac.ke/',
    contact: {
      email: 'info@ksl.ac.ke',
      phone: '+254 20 2020836',
      socialMedia: {
        facebook: 'https://www.facebook.com/KenyaSchoolofLaw/',
        twitter: 'https://twitter.com/KSL_Kenya',
      },
    },
    programs: [
      {
        name: 'Advocates Training Program',
        level: 'Certificate',
        duration: '1 year',
        description:
          'A mandatory program for law graduates seeking admission to the bar as advocates of the High Court of Kenya.',
        entryRequirements: {
          minimumGrade: 'Second Class Upper Division',
          specificSubjects: [],
          additionalRequirements: [
            'Bachelor of Laws (LLB) Degree',
            'Council of Legal Education Exam',
          ],
        },
        tuitionFees: 'KES 180,000',
      },
      {
        name: 'Paralegal Training Program',
        level: 'Certificate',
        duration: '6 months',
        description:
          'A program that trains paralegals to assist lawyers in legal research, document preparation, and client management.',
        entryRequirements: {
          minimumGrade: 'C',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 60,000',
      },
    ],
    rankings: {
      national: 1,
      international: null,
      year: 2024,
    },
    facilities: [
      'Law library',
      'Moot court',
      'Computer labs',
      'Student hostels',
      'Conference center',
      'Cafeteria',
    ],
    accreditation: ['Council of Legal Education'],
    establishedYear: 1963,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/ksl_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/ksl_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/ksl_moot_court.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Technical University of Mombasa',
    type: 'University',
    location: {
      address: 'Tom Mboya Street',
      city: 'Mombasa',
      county: 'Mombasa',
      country: 'Kenya',
      coordinates: {
        latitude: -4.0435,
        longitude: 39.6682,
      },
    },
    description:
      'Technical University of Mombasa (TUM) is a public technical university located in the coastal city of Mombasa. It evolved from Mombasa Technical Institute and focuses on technical education in engineering, maritime studies, and applied sciences.',
    website: 'https://www.tum.ac.ke/',
    contact: {
      email: 'info@tum.ac.ke',
      phone: '+254 41 2492222',
      socialMedia: {
        facebook: 'https://www.facebook.com/TechnicalUniversityofMombasa/',
        twitter: 'https://twitter.com/TUM_Kenya',
      },
    },
    programs: [
      {
        name: 'Bachelor of Engineering in Marine Engineering',
        level: 'Bachelors',
        duration: '5 years',
        description:
          'A program that focuses on the design, operation, and maintenance of marine vessels and their propulsion systems.',
        entryRequirements: {
          minimumGrade: 'C+',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'C+' },
            { subject: 'Physics', grade: 'C+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 150,000 per year',
      },
      {
        name: 'Diploma in Building and Construction',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A program that provides students with skills in building construction, project management, and quantity surveying.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [{ subject: 'Mathematics', grade: 'D+' }],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 90,000 per year',
      },
    ],
    rankings: {
      national: 12,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Maritime training center',
      'Computer labs',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: [
      'Commission for University Education (CUE)',
      'Engineers Board of Kenya (EBK)',
    ],
    establishedYear: 2013,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/tum_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/tum_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/tum_workshop.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Rift Valley Institute of Science and Technology',
    type: 'Technical Institute',
    location: {
      address: 'Nakuru-Eldoret Highway',
      city: 'Nakuru',
      county: 'Nakuru',
      country: 'Kenya',
      coordinates: {
        latitude: -0.2833,
        longitude: 36.0667,
      },
    },
    description:
      'Rift Valley Institute of Science and Technology (RVIST) is a technical and vocational education institution that offers training in various technical fields, including engineering, business, and hospitality.',
    website: 'https://www.rvist.ac.ke/',
    contact: {
      email: 'info@rvist.ac.ke',
      phone: '+254 51 2215813',
      socialMedia: {
        facebook: 'https://www.facebook.com/RVIST/',
      },
    },
    programs: [
      {
        name: 'Diploma in Electrical and Electronic Engineering',
        level: 'Diploma',
        duration: '3 years',
        description:
          'A program that provides students with skills in electrical installation, electronic systems, and power systems.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [
            { subject: 'Mathematics', grade: 'D+' },
            { subject: 'Physics', grade: 'D+' },
          ],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 85,000 per year',
      },
      {
        name: 'Certificate in Food and Beverage Production',
        level: 'Certificate',
        duration: '1 year',
        description:
          'A program that trains students in culinary arts, food preparation, and kitchen management.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 50,000',
      },
    ],
    rankings: {
      national: 3,
      international: null,
      year: 2024,
    },
    facilities: [
      'Engineering workshops',
      'Computer labs',
      'Training kitchen',
      'Library',
      'Student hostels',
      'Sports facilities',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
    ],
    establishedYear: 1974,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/rvist_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/rvist_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/rvist_workshop.jpg',
    ],
    featured: false,
    views: 0,
  },
  {
    name: 'Nairobi Institute of Business Studies',
    type: 'College',
    location: {
      address: 'Ruiru-Kiambu Road',
      city: 'Ruiru',
      county: 'Kiambu',
      country: 'Kenya',
      coordinates: {
        latitude: -1.1833,
        longitude: 36.9667,
      },
    },
    description:
      'Nairobi Institute of Business Studies (NIBS) is a private business college that offers training in business, ICT, and media studies. It is known for its practical approach to education and industry connections.',
    website: 'https://www.nibs.ac.ke/',
    contact: {
      email: 'info@nibs.ac.ke',
      phone: '+254 20 2088310',
      socialMedia: {
        facebook: 'https://www.facebook.com/NIBSKenya/',
        twitter: 'https://twitter.com/NIBSKenya',
        instagram: 'https://www.instagram.com/nibskenya/',
      },
    },
    programs: [
      {
        name: 'Diploma in Business Management',
        level: 'Diploma',
        duration: '2 years',
        description:
          'A program that provides students with knowledge and skills in business management, marketing, and entrepreneurship.',
        entryRequirements: {
          minimumGrade: 'C-',
          specificSubjects: [],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 90,000 per year',
      },
      {
        name: 'Certificate in Journalism and Mass Communication',
        level: 'Certificate',
        duration: '1 year',
        description:
          'A program that trains students in news reporting, media production, and communication skills.',
        entryRequirements: {
          minimumGrade: 'D+',
          specificSubjects: [{ subject: 'English', grade: 'C-' }],
          additionalRequirements: ['KCSE Certificate'],
        },
        tuitionFees: 'KES 60,000',
      },
    ],
    rankings: {
      national: 5,
      international: null,
      year: 2024,
    },
    facilities: [
      'Computer labs',
      'Media studio',
      'Library',
      'Student hostels',
      'Cafeteria',
      'Sports facilities',
    ],
    accreditation: [
      'Technical and Vocational Education and Training Authority (TVETA)',
    ],
    establishedYear: 2000,
    logo: 'https://res.cloudinary.com/example/image/upload/institutions/nibs_logo.png',
    images: [
      'https://res.cloudinary.com/example/image/upload/institutions/nibs_campus.jpg',
      'https://res.cloudinary.com/example/image/upload/institutions/nibs_lab.jpg',
    ],
    featured: false,
    views: 0,
  },
  ...additionalInstitutions,
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Institution.deleteMany({});
    console.log('Cleared existing institution data');

    // Insert new data
    const result = await Institution.insertMany(institutions);
    console.log(`Successfully seeded ${result.length} institutions`);

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
