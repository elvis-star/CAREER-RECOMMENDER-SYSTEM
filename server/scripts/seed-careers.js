import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Career from '../models/Career.js';

// Load environment variables
dotenv.config();

// Career data to seed
// Career documents generator
// This script generates 50 diverse career documents based on the provided schema

const careers = [
  // TECHNOLOGY CAREERS
  {
    title: 'Software Engineer',
    category: 'Technology',
    description:
      'Design, develop, and maintain software systems and applications using programming languages, frameworks, and software development methodologies to solve complex problems.',
    keySubjects: ['Computer Science', 'Mathematics', 'Physics'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'Very High',
    jobProspects: [
      'Tech Companies',
      'Financial Institutions',
      'Government Agencies',
      'Startups',
      'Consulting Firms',
    ],
    salary: {
      entry: '40000',
      mid: '80000',
      senior: '150000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Programming',
      'Problem Solving',
      'Algorithms',
      'Data Structures',
      'Version Control',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Software Engineer', 'Software Developer I'],
        experience: '0-2 years',
        description:
          'Focus on learning codebases, fixing bugs, and implementing small features under supervision.',
      },
      midLevel: {
        roles: ['Software Engineer II', 'Senior Developer'],
        experience: '3-5 years',
        description:
          'Lead feature development, mentor junior developers, and contribute to architectural decisions.',
      },
      seniorLevel: {
        roles: ['Senior Software Engineer', 'Tech Lead'],
        experience: '6-10 years',
        description:
          'Design system architecture, make critical technical decisions, and lead development teams.',
      },
      executiveLevel: {
        roles: ['Principal Engineer', 'Chief Technology Officer'],
        experience: '10+ years',
        description:
          'Set technical direction for the organization, make strategic decisions, and oversee multiple teams.',
      },
    },
    certifications: [
      {
        name: 'AWS Certified Developer',
        provider: 'Amazon Web Services',
        description:
          'Validates expertise in developing applications for the AWS platform.',
      },
      {
        name: 'Microsoft Certified: Azure Developer Associate',
        provider: 'Microsoft',
        description:
          'Demonstrates proficiency in cloud development using Azure services.',
      },
    ],
    industryTrends: [
      'Cloud Computing',
      'Artificial Intelligence',
      'DevOps',
      'Microservices Architecture',
    ],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: 'Data Scientist',
    category: 'Technology',
    description:
      'Analyze and interpret complex data sets to help organizations make better decisions through statistical analysis, machine learning, and data visualization.',
    keySubjects: ['Statistics', 'Mathematics', 'Computer Science'],
    requiredGrades: {},
    minimumMeanGrade: 'B+',
    marketDemand: 'Very High',
    jobProspects: [
      'Tech Companies',
      'Financial Services',
      'Healthcare',
      'E-commerce',
      'Research Institutions',
    ],
    salary: {
      entry: '50000',
      mid: '90000',
      senior: '160000',
    },
    institutions: [],
    programDuration: '4-5 years',
    skillsRequired: [
      'Statistical Analysis',
      'Machine Learning',
      'Python',
      'R',
      'SQL',
      'Data Visualization',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Data Scientist', 'Data Analyst'],
        experience: '0-2 years',
        description:
          'Work on data cleaning, basic analysis, and implementing established models.',
      },
      midLevel: {
        roles: ['Data Scientist', 'Machine Learning Engineer'],
        experience: '3-5 years',
        description:
          'Develop complex models, lead analysis projects, and translate business problems into data questions.',
      },
      seniorLevel: {
        roles: ['Senior Data Scientist', 'Lead Data Scientist'],
        experience: '6-10 years',
        description:
          'Design data strategy, develop novel algorithms, and lead teams of data professionals.',
      },
      executiveLevel: {
        roles: ['Chief Data Officer', 'Director of Data Science'],
        experience: '10+ years',
        description:
          'Set data strategy for the organization, oversee multiple teams, and align data initiatives with business goals.',
      },
    },
    certifications: [
      {
        name: 'TensorFlow Developer Certificate',
        provider: 'Google',
        description:
          'Validates skills in using TensorFlow to build and train models.',
      },
      {
        name: 'Microsoft Certified: Azure Data Scientist Associate',
        provider: 'Microsoft',
        description:
          'Demonstrates expertise in applying data science and machine learning on Azure.',
      },
    ],
    industryTrends: [
      'Big Data',
      'Deep Learning',
      'Natural Language Processing',
      'Automated Machine Learning',
    ],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: 'Cybersecurity Analyst',
    category: 'Technology',
    description:
      'Protect computer systems and networks from information disclosure, theft, and damage to hardware, software, or electronic data through implementation of security measures.',
    keySubjects: ['Computer Science', 'Information Technology', 'Cryptography'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'Very High',
    jobProspects: [
      'Government Agencies',
      'Financial Institutions',
      'Healthcare Organizations',
      'Tech Companies',
      'Consulting Firms',
    ],
    salary: {
      entry: '45000',
      mid: '85000',
      senior: '140000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Network Security',
      'Penetration Testing',
      'Security Protocols',
      'Risk Assessment',
      'Incident Response',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Security Analyst', 'Information Security Specialist'],
        experience: '0-2 years',
        description:
          'Monitor security systems, respond to alerts, and implement security controls.',
      },
      midLevel: {
        roles: ['Cybersecurity Consultant', 'Security Engineer'],
        experience: '3-5 years',
        description:
          'Design security solutions, conduct vulnerability assessments, and lead security projects.',
      },
      seniorLevel: {
        roles: ['Security Architect', 'Cybersecurity Manager'],
        experience: '6-10 years',
        description:
          'Develop security strategies, oversee security operations, and manage security teams.',
      },
      executiveLevel: {
        roles: ['Chief Information Security Officer', 'Director of Security'],
        experience: '10+ years',
        description:
          'Set security vision, develop security policies, and ensure organizational compliance with regulations.',
      },
    },
    certifications: [
      {
        name: 'Certified Information Systems Security Professional (CISSP)',
        provider: 'ISC²',
        description:
          'Demonstrates expertise in designing, implementing, and managing cybersecurity programs.',
      },
      {
        name: 'Certified Ethical Hacker (CEH)',
        provider: 'EC-Council',
        description:
          'Validates skills in identifying vulnerabilities in target systems using the same methods as hackers.',
      },
    ],
    industryTrends: [
      'Zero Trust Security',
      'Cloud Security',
      'AI in Cybersecurity',
      'IoT Security',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'UX/UI Designer',
    category: 'Technology',
    description:
      'Create intuitive, accessible, and enjoyable digital experiences by combining user research, visual design, and interaction design principles to improve user satisfaction.',
    keySubjects: ['Design', 'Psychology', 'Computer Science'],
    requiredGrades: {},
    minimumMeanGrade: 'C+',
    marketDemand: 'High',
    jobProspects: [
      'Tech Companies',
      'Design Agencies',
      'E-commerce',
      'Media Companies',
      'Startups',
    ],
    salary: {
      entry: '35000',
      mid: '70000',
      senior: '120000',
    },
    institutions: [],
    programDuration: '3-4 years',
    skillsRequired: [
      'User Research',
      'Wireframing',
      'Prototyping',
      'Visual Design',
      'Usability Testing',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior UX Designer', 'UI Designer'],
        experience: '0-2 years',
        description:
          'Create wireframes, assist with user research, and design interface elements.',
      },
      midLevel: {
        roles: ['UX/UI Designer', 'Product Designer'],
        experience: '3-5 years',
        description:
          'Lead design projects, conduct user research, and create comprehensive design systems.',
      },
      seniorLevel: {
        roles: ['Senior UX Designer', 'Design Lead'],
        experience: '6-10 years',
        description:
          'Define design strategy, mentor junior designers, and collaborate with product and engineering leaders.',
      },
      executiveLevel: {
        roles: ['Design Director', 'VP of Design'],
        experience: '10+ years',
        description:
          'Set design vision, build design teams, and align design with business objectives.',
      },
    },
    certifications: [
      {
        name: 'Certified User Experience Professional (CUXP)',
        provider: 'Nielsen Norman Group',
        description:
          'Validates expertise in user experience research and design.',
      },
    ],
    industryTrends: [
      'Design Systems',
      'Voice User Interfaces',
      'Augmented Reality',
      'Accessibility Design',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Cloud Solutions Architect',
    category: 'Technology',
    description:
      'Design and implement cloud computing solutions for organizations, ensuring scalability, security, and cost-effectiveness while aligning with business objectives.',
    keySubjects: [
      'Computer Science',
      'Information Technology',
      'Systems Engineering',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'Very High',
    jobProspects: [
      'Cloud Service Providers',
      'Tech Companies',
      'Financial Institutions',
      'Consulting Firms',
      'Healthcare Organizations',
    ],
    salary: {
      entry: '60000',
      mid: '110000',
      senior: '180000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Cloud Platforms',
      'Network Architecture',
      'Security',
      'Infrastructure as Code',
      'Containerization',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Cloud Engineer', 'Solutions Engineer'],
        experience: '1-3 years',
        description:
          'Implement cloud solutions, assist with migrations, and support cloud infrastructure.',
      },
      midLevel: {
        roles: ['Cloud Architect', 'DevOps Engineer'],
        experience: '4-7 years',
        description:
          'Design cloud architectures, optimize cloud resources, and implement best practices.',
      },
      seniorLevel: {
        roles: ['Senior Cloud Architect', 'Cloud Strategy Lead'],
        experience: '8-12 years',
        description:
          'Develop cloud strategies, lead complex migrations, and design enterprise-scale solutions.',
      },
      executiveLevel: {
        roles: ['Chief Cloud Architect', 'VP of Cloud Engineering'],
        experience: '12+ years',
        description:
          'Set cloud vision, develop cloud governance frameworks, and lead digital transformation initiatives.',
      },
    },
    certifications: [
      {
        name: 'AWS Certified Solutions Architect - Professional',
        provider: 'Amazon Web Services',
        description:
          'Validates expertise in designing distributed applications and systems on AWS.',
      },
      {
        name: 'Google Cloud Professional Cloud Architect',
        provider: 'Google',
        description:
          'Demonstrates ability to design, develop, and manage robust, secure, scalable cloud solutions.',
      },
    ],
    industryTrends: [
      'Multi-cloud Strategy',
      'Serverless Computing',
      'Edge Computing',
      'FinOps',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  // ENGINEERING CAREERS
  {
    title: 'Civil Engineer',
    category: 'Engineering',
    description:
      'Design, develop, and supervise infrastructure projects such as roads, buildings, airports, tunnels, dams, bridges, and water supply systems while ensuring safety and sustainability.',
    keySubjects: [
      'Mathematics',
      'Physics',
      'Structural Analysis',
      'Materials Science',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'High',
    jobProspects: [
      'Construction Companies',
      'Government Agencies',
      'Engineering Consultancies',
      'Urban Planning Firms',
      'Research Institutions',
    ],
    salary: {
      entry: '35000',
      mid: '65000',
      senior: '110000',
    },
    institutions: [],
    programDuration: '4-5 years',
    skillsRequired: [
      'AutoCAD',
      'Structural Analysis',
      'Project Management',
      'Technical Drawing',
      'Building Codes',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Civil Engineer', 'Site Engineer'],
        experience: '0-3 years',
        description:
          'Assist with designs, conduct site inspections, and prepare technical documentation.',
      },
      midLevel: {
        roles: ['Civil Engineer', 'Project Engineer'],
        experience: '4-8 years',
        description:
          'Lead design projects, manage construction activities, and ensure compliance with regulations.',
      },
      seniorLevel: {
        roles: ['Senior Civil Engineer', 'Project Manager'],
        experience: '8-15 years',
        description:
          'Oversee multiple projects, develop engineering standards, and mentor junior engineers.',
      },
      executiveLevel: {
        roles: ['Engineering Director', 'Chief Engineer'],
        experience: '15+ years',
        description:
          'Set engineering strategy, lead large-scale projects, and manage engineering departments.',
      },
    },
    certifications: [
      {
        name: 'Professional Engineer (PE)',
        provider: 'State Licensing Board',
        description:
          'Required license to offer services directly to the public.',
      },
      {
        name: 'Leadership in Energy and Environmental Design (LEED)',
        provider: 'U.S. Green Building Council',
        description:
          'Validates expertise in sustainable building design and construction.',
      },
    ],
    industryTrends: [
      'Sustainable Infrastructure',
      'Smart Cities',
      'Building Information Modeling (BIM)',
      'Resilient Design',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Mechanical Engineer',
    category: 'Engineering',
    description:
      'Design, develop, build, and test mechanical devices, including tools, engines, and machines, applying principles of motion, energy, and force to solve problems.',
    keySubjects: [
      'Mathematics',
      'Physics',
      'Thermodynamics',
      'Materials Science',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'High',
    jobProspects: [
      'Manufacturing Companies',
      'Automotive Industry',
      'Aerospace',
      'Energy Sector',
      'Research and Development',
    ],
    salary: {
      entry: '40000',
      mid: '70000',
      senior: '120000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'CAD Software',
      'Finite Element Analysis',
      'Thermodynamics',
      'Fluid Mechanics',
      'Manufacturing Processes',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Mechanical Engineer', 'Design Engineer'],
        experience: '0-3 years',
        description:
          'Create technical drawings, assist with product development, and conduct testing.',
      },
      midLevel: {
        roles: ['Mechanical Engineer', 'Product Development Engineer'],
        experience: '4-8 years',
        description:
          'Lead design projects, develop new products, and optimize manufacturing processes.',
      },
      seniorLevel: {
        roles: ['Senior Mechanical Engineer', 'Engineering Manager'],
        experience: '8-15 years',
        description:
          'Oversee engineering teams, develop technical strategies, and lead complex projects.',
      },
      executiveLevel: {
        roles: ['Director of Engineering', 'Chief Mechanical Engineer'],
        experience: '15+ years',
        description:
          'Set engineering direction, manage multiple departments, and drive innovation initiatives.',
      },
    },
    certifications: [
      {
        name: 'Professional Engineer (PE)',
        provider: 'State Licensing Board',
        description:
          'Required license for engineers who offer services directly to the public.',
      },
      {
        name: 'Certified Manufacturing Engineer (CMfgE)',
        provider: 'Society of Manufacturing Engineers',
        description:
          'Validates expertise in manufacturing processes and technologies.',
      },
    ],
    industryTrends: [
      'Additive Manufacturing',
      'Robotics',
      'Sustainable Design',
      'Digital Twins',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Electrical Engineer',
    category: 'Engineering',
    description:
      'Design, develop, test, and supervise the manufacturing of electrical equipment, systems, and components, from small microchips to large power station generators.',
    keySubjects: ['Mathematics', 'Physics', 'Circuit Theory', 'Electronics'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'High',
    jobProspects: [
      'Power Companies',
      'Electronics Manufacturers',
      'Telecommunications',
      'Automotive Industry',
      'Aerospace',
    ],
    salary: {
      entry: '45000',
      mid: '75000',
      senior: '125000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Circuit Design',
      'Power Systems',
      'Electronics',
      'Programming',
      'Signal Processing',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Electrical Engineer', 'Electronics Engineer'],
        experience: '0-3 years',
        description:
          'Design and test circuits, assist with product development, and troubleshoot electrical systems.',
      },
      midLevel: {
        roles: ['Electrical Engineer', 'Power Systems Engineer'],
        experience: '4-8 years',
        description:
          'Lead design projects, develop electrical systems, and implement technical solutions.',
      },
      seniorLevel: {
        roles: ['Senior Electrical Engineer', 'Lead Engineer'],
        experience: '8-15 years',
        description:
          'Oversee engineering teams, develop technical standards, and lead complex projects.',
      },
      executiveLevel: {
        roles: ['Engineering Director', 'Chief Electrical Engineer'],
        experience: '15+ years',
        description:
          'Set engineering strategy, manage departments, and drive technological innovation.',
      },
    },
    certifications: [
      {
        name: 'Professional Engineer (PE)',
        provider: 'State Licensing Board',
        description:
          'Required license for engineers who offer services directly to the public.',
      },
      {
        name: 'Certified Electrical Safety Compliance Professional (CESCP)',
        provider: 'National Fire Protection Association',
        description:
          'Validates expertise in electrical safety standards and compliance.',
      },
    ],
    industryTrends: [
      'Renewable Energy',
      'Smart Grid Technology',
      'Electric Vehicles',
      'IoT Devices',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Aerospace Engineer',
    category: 'Engineering',
    description:
      'Design, develop, and test aircraft, spacecraft, satellites, and missiles, applying principles of aerodynamics, propulsion, and materials science to create cutting-edge aerospace technology.',
    keySubjects: [
      'Mathematics',
      'Physics',
      'Aerodynamics',
      'Propulsion Systems',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'A-',
    marketDemand: 'Medium',
    jobProspects: [
      'Aerospace Companies',
      'Defense Contractors',
      'Space Agencies',
      'Airlines',
      'Research Institutions',
    ],
    salary: {
      entry: '60000',
      mid: '95000',
      senior: '150000',
    },
    institutions: [],
    programDuration: '4-5 years',
    skillsRequired: [
      'CAD/CAM Software',
      'Fluid Dynamics',
      'Structural Analysis',
      'Propulsion Systems',
      'Materials Science',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Aerospace Engineer', 'Design Engineer'],
        experience: '0-3 years',
        description:
          'Assist with aircraft or spacecraft design, conduct testing, and analyze performance data.',
      },
      midLevel: {
        roles: ['Aerospace Engineer', 'Propulsion Engineer'],
        experience: '4-8 years',
        description:
          'Lead design projects, develop aerospace systems, and solve complex engineering problems.',
      },
      seniorLevel: {
        roles: ['Senior Aerospace Engineer', 'Technical Lead'],
        experience: '8-15 years',
        description:
          'Oversee engineering teams, develop technical standards, and lead major aerospace projects.',
      },
      executiveLevel: {
        roles: ['Chief Engineer', 'Director of Aerospace Engineering'],
        experience: '15+ years',
        description:
          'Set engineering strategy, manage multiple departments, and drive aerospace innovation.',
      },
    },
    certifications: [
      {
        name: 'Professional Engineer (PE)',
        provider: 'State Licensing Board',
        description:
          'Required license for engineers who offer services directly to the public.',
      },
      {
        name: 'Certified Systems Engineering Professional (CSEP)',
        provider: 'International Council on Systems Engineering',
        description:
          'Validates expertise in systems engineering principles and practices.',
      },
    ],
    industryTrends: [
      'Commercial Space Travel',
      'Unmanned Aerial Vehicles',
      'Sustainable Aviation',
      'Hypersonic Technology',
    ],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: 'Chemical Engineer',
    category: 'Engineering',
    description:
      'Apply principles of chemistry, biology, physics, and mathematics to design and develop processes for manufacturing chemicals, fuels, drugs, food, and many other products.',
    keySubjects: ['Chemistry', 'Mathematics', 'Physics', 'Biology'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'Medium',
    jobProspects: [
      'Chemical Manufacturing',
      'Pharmaceutical Companies',
      'Food Processing',
      'Energy Sector',
      'Environmental Firms',
    ],
    salary: {
      entry: '50000',
      mid: '80000',
      senior: '130000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Process Design',
      'Thermodynamics',
      'Reaction Kinetics',
      'Fluid Dynamics',
      'Process Control',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Chemical Engineer', 'Process Engineer'],
        experience: '0-3 years',
        description:
          'Monitor production processes, troubleshoot equipment issues, and assist with process improvements.',
      },
      midLevel: {
        roles: ['Chemical Engineer', 'Production Engineer'],
        experience: '4-8 years',
        description:
          'Design chemical processes, optimize production efficiency, and lead improvement projects.',
      },
      seniorLevel: {
        roles: ['Senior Chemical Engineer', 'Process Design Manager'],
        experience: '8-15 years',
        description:
          'Oversee engineering teams, develop technical standards, and lead major facility projects.',
      },
      executiveLevel: {
        roles: ['Engineering Director', 'Chief Process Engineer'],
        experience: '15+ years',
        description:
          'Set engineering strategy, manage multiple departments, and drive innovation initiatives.',
      },
    },
    certifications: [
      {
        name: 'Professional Engineer (PE)',
        provider: 'State Licensing Board',
        description:
          'Required license for engineers who offer services directly to the public.',
      },
      {
        name: 'Certified Process Safety Professional (CCPSC)',
        provider: 'Board of Certified Safety Professionals',
        description: 'Validates expertise in process safety management.',
      },
    ],
    industryTrends: [
      'Green Chemistry',
      'Biofuels',
      'Nanotechnology',
      'Sustainable Manufacturing',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  // HEALTHCARE CAREERS
  {
    title: 'Medical Doctor',
    category: 'Healthcare',
    description:
      'Diagnose and treat illnesses, injuries, and other health conditions in patients through examination, testing, and prescribing medications or other treatments to promote wellness.',
    keySubjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
    requiredGrades: {},
    minimumMeanGrade: 'A-',
    marketDemand: 'Very High',
    jobProspects: [
      'Hospitals',
      'Private Practice',
      'Research Institutions',
      'Public Health Agencies',
      'International Organizations',
    ],
    salary: {
      entry: '60000',
      mid: '150000',
      senior: '300000',
    },
    institutions: [],
    programDuration: '6-7 years',
    skillsRequired: [
      'Clinical Skills',
      'Diagnostic Reasoning',
      'Patient Communication',
      'Medical Knowledge',
      'Critical Thinking',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Medical Intern', 'Resident'],
        experience: '1-5 years',
        description:
          'Complete supervised clinical training in a hospital setting, rotating through different specialties.',
      },
      midLevel: {
        roles: ['Attending Physician', 'Specialist'],
        experience: '5-10 years',
        description:
          'Practice independently, treat patients, and may supervise residents and medical students.',
      },
      seniorLevel: {
        roles: ['Senior Physician', 'Department Head'],
        experience: '10-20 years',
        description:
          'Lead medical teams, develop treatment protocols, and contribute to medical research.',
      },
      executiveLevel: {
        roles: ['Chief Medical Officer', 'Medical Director'],
        experience: '20+ years',
        description:
          'Set medical policy, oversee clinical operations, and ensure quality of care across the organization.',
      },
    },
    certifications: [
      {
        name: 'Board Certification',
        provider: 'American Board of Medical Specialties',
        description:
          'Validates expertise in a medical specialty through rigorous examination.',
      },
      {
        name: 'Advanced Cardiac Life Support (ACLS)',
        provider: 'American Heart Association',
        description: 'Certifies ability to manage cardiovascular emergencies.',
      },
    ],
    industryTrends: [
      'Telemedicine',
      'Precision Medicine',
      'AI in Diagnostics',
      'Value-Based Care',
    ],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: 'Registered Nurse',
    category: 'Healthcare',
    description:
      'Provide and coordinate patient care, educate patients about health conditions, and provide advice and emotional support to patients and their families.',
    keySubjects: ['Biology', 'Chemistry', 'Psychology', 'Anatomy'],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'Very High',
    jobProspects: [
      'Hospitals',
      'Clinics',
      'Schools',
      'Home Health Agencies',
      'Long-term Care Facilities',
    ],
    salary: {
      entry: '35000',
      mid: '60000',
      senior: '90000',
    },
    institutions: [],
    programDuration: '3-4 years',
    skillsRequired: [
      'Patient Care',
      'Clinical Procedures',
      'Medical Documentation',
      'Critical Thinking',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Staff Nurse', 'Graduate Nurse'],
        experience: '0-2 years',
        description:
          'Provide direct patient care, administer medications, and assist with medical procedures.',
      },
      midLevel: {
        roles: ['Charge Nurse', 'Specialized Nurse'],
        experience: '3-7 years',
        description:
          'Oversee nursing units, coordinate patient care, and specialize in specific areas of medicine.',
      },
      seniorLevel: {
        roles: ['Nurse Manager', 'Clinical Nurse Specialist'],
        experience: '8-15 years',
        description:
          'Manage nursing staff, develop care protocols, and serve as clinical experts.',
      },
      executiveLevel: {
        roles: ['Chief Nursing Officer', 'Director of Nursing'],
        experience: '15+ years',
        description:
          'Set nursing strategy, oversee nursing operations, and ensure quality of care across the organization.',
      },
    },
    certifications: [
      {
        name: 'Basic Life Support (BLS)',
        provider: 'American Heart Association',
        description:
          'Certifies ability to perform CPR and manage choking emergencies.',
      },
      {
        name: 'Certified Critical Care Nurse (CCRN)',
        provider: 'American Association of Critical-Care Nurses',
        description: 'Validates expertise in critical care nursing.',
      },
    ],
    industryTrends: [
      'Telehealth Nursing',
      'Specialized Care',
      'Evidence-Based Practice',
      'Nurse Practitioners',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Pharmacist',
    category: 'Healthcare',
    description:
      'Dispense prescription medications, advise patients on proper medication use, and monitor drug interactions to ensure safe and effective treatment.',
    keySubjects: ['Chemistry', 'Biology', 'Pharmacology', 'Mathematics'],
    requiredGrades: {},
    minimumMeanGrade: 'B+',
    marketDemand: 'High',
    jobProspects: [
      'Retail Pharmacies',
      'Hospitals',
      'Pharmaceutical Companies',
      'Government Agencies',
      'Research Institutions',
    ],
    salary: {
      entry: '80000',
      mid: '110000',
      senior: '140000',
    },
    institutions: [],
    programDuration: '6 years',
    skillsRequired: [
      'Pharmaceutical Knowledge',
      'Patient Counseling',
      'Medication Management',
      'Attention to Detail',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Staff Pharmacist', 'Pharmacy Resident'],
        experience: '0-3 years',
        description:
          'Dispense medications, counsel patients, and ensure prescription accuracy.',
      },
      midLevel: {
        roles: ['Clinical Pharmacist', 'Pharmacy Manager'],
        experience: '4-8 years',
        description:
          'Provide specialized medication therapy, manage pharmacy operations, and collaborate with healthcare teams.',
      },
      seniorLevel: {
        roles: ['Senior Pharmacist', 'Pharmacy Director'],
        experience: '8-15 years',
        description:
          'Oversee pharmacy departments, develop medication protocols, and ensure regulatory compliance.',
      },
      executiveLevel: {
        roles: ['Chief Pharmacy Officer', 'VP of Pharmacy Services'],
        experience: '15+ years',
        description:
          'Set pharmacy strategy, manage multiple departments, and drive pharmaceutical innovation.',
      },
    },
    certifications: [
      {
        name: 'Board Certified Pharmacotherapy Specialist (BCPS)',
        provider: 'Board of Pharmacy Specialties',
        description:
          'Validates expertise in optimizing medication therapy and improving patient outcomes.',
      },
      {
        name: 'Certified Diabetes Educator (CDE)',
        provider: 'National Certification Board for Diabetes Educators',
        description:
          'Certifies ability to educate and support people with diabetes.',
      },
    ],
    industryTrends: [
      'Medication Therapy Management',
      'Pharmacogenomics',
      'Telepharmacy',
      'Specialty Pharmaceuticals',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Physical Therapist',
    category: 'Healthcare',
    description:
      'Help injured or ill people improve movement and manage pain through exercises, stretches, hands-on therapy, and patient education to enhance physical function and mobility.',
    keySubjects: ['Anatomy', 'Physiology', 'Kinesiology', 'Biology'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'High',
    jobProspects: [
      'Hospitals',
      'Outpatient Clinics',
      'Sports Teams',
      'Schools',
      'Home Health Services',
    ],
    salary: {
      entry: '65000',
      mid: '85000',
      senior: '110000',
    },
    institutions: [],
    programDuration: '3 years (DPT)',
    skillsRequired: [
      'Manual Therapy',
      'Exercise Prescription',
      'Patient Assessment',
      'Rehabilitation Techniques',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Staff Physical Therapist', 'Rehabilitation Specialist'],
        experience: '0-3 years',
        description:
          'Provide direct patient care, implement treatment plans, and document patient progress.',
      },
      midLevel: {
        roles: ['Senior Physical Therapist', 'Clinical Specialist'],
        experience: '4-8 years',
        description:
          'Develop specialized treatment approaches, mentor junior therapists, and manage complex cases.',
      },
      seniorLevel: {
        roles: ['Lead Physical Therapist', 'Clinic Director'],
        experience: '8-15 years',
        description:
          'Oversee therapy departments, develop clinical protocols, and ensure quality of care.',
      },
      executiveLevel: {
        roles: ['Director of Rehabilitation', 'Chief Clinical Officer'],
        experience: '15+ years',
        description:
          'Set therapy strategy, manage multiple departments, and drive clinical innovation.',
      },
    },
    certifications: [
      {
        name: 'Orthopedic Certified Specialist (OCS)',
        provider: 'American Board of Physical Therapy Specialties',
        description: 'Validates expertise in orthopedic physical therapy.',
      },
      {
        name: 'Certified Hand Therapist (CHT)',
        provider: 'Hand Therapy Certification Commission',
        description:
          'Certifies specialized knowledge in upper extremity rehabilitation.',
      },
    ],
    industryTrends: [
      'Telerehabilitation',
      'Wearable Technology',
      'Preventive Care',
      'Specialized Therapy',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Dentist',
    category: 'Healthcare',
    description:
      "Diagnose and treat problems with patients' teeth, gums, and related parts of the mouth, providing advice and instruction on taking care of teeth and gums to prevent future problems.",
    keySubjects: ['Biology', 'Chemistry', 'Anatomy', 'Physics'],
    requiredGrades: {},
    minimumMeanGrade: 'A-',
    marketDemand: 'High',
    jobProspects: [
      'Private Practice',
      'Dental Clinics',
      'Hospitals',
      'Public Health Services',
      'Research Institutions',
    ],
    salary: {
      entry: '100000',
      mid: '150000',
      senior: '200000',
    },
    institutions: [],
    programDuration: '4 years (after undergraduate)',
    skillsRequired: [
      'Clinical Skills',
      'Manual Dexterity',
      'Patient Management',
      'Diagnostic Ability',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Associate Dentist', 'General Dentist'],
        experience: '0-3 years',
        description:
          'Perform routine dental procedures, diagnose oral conditions, and develop treatment plans.',
      },
      midLevel: {
        roles: ['Established Dentist', 'Specialist'],
        experience: '4-10 years',
        description:
          'Manage complex cases, perform specialized procedures, and may own a dental practice.',
      },
      seniorLevel: {
        roles: ['Senior Dentist', 'Practice Owner'],
        experience: '10-20 years',
        description:
          'Lead dental teams, develop treatment protocols, and manage business operations.',
      },
      executiveLevel: {
        roles: ['Dental Director', 'Chief Dental Officer'],
        experience: '20+ years',
        description:
          'Set dental policy, oversee multiple practices, and ensure quality of care across the organization.',
      },
    },
    certifications: [
      {
        name: 'Board Certification in Dental Specialty',
        provider: 'American Board of Dental Specialties',
        description:
          'Validates expertise in a dental specialty through rigorous examination.',
      },
      {
        name: 'Advanced Cardiac Life Support (ACLS)',
        provider: 'American Heart Association',
        description:
          'Certifies ability to manage cardiovascular emergencies in dental settings.',
      },
    ],
    industryTrends: [
      'Digital Dentistry',
      '3D Printing',
      'Minimally Invasive Techniques',
      'Cosmetic Dentistry',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  // BUSINESS CAREERS
  {
    title: 'Marketing Manager',
    category: 'Business',
    description:
      'Plan, direct, and coordinate marketing strategies and campaigns to promote products, services, or brands, analyzing market trends and competitor activities to identify opportunities.',
    keySubjects: ['Marketing', 'Business', 'Psychology', 'Statistics'],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'High',
    jobProspects: [
      'Corporations',
      'Marketing Agencies',
      'Non-profit Organizations',
      'Startups',
      'Consulting Firms',
    ],
    salary: {
      entry: '40000',
      mid: '75000',
      senior: '120000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Market Research',
      'Campaign Management',
      'Digital Marketing',
      'Analytics',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Marketing Coordinator', 'Marketing Specialist'],
        experience: '0-3 years',
        description:
          'Assist with marketing campaigns, create content, and analyze marketing metrics.',
      },
      midLevel: {
        roles: ['Marketing Manager', 'Brand Manager'],
        experience: '4-8 years',
        description:
          'Develop marketing strategies, manage campaigns, and oversee marketing teams.',
      },
      seniorLevel: {
        roles: ['Senior Marketing Manager', 'Marketing Director'],
        experience: '8-15 years',
        description:
          'Set marketing direction, manage budgets, and align marketing with business objectives.',
      },
      executiveLevel: {
        roles: ['Chief Marketing Officer', 'VP of Marketing'],
        experience: '15+ years',
        description:
          'Define marketing vision, lead marketing organization, and drive business growth through marketing.',
      },
    },
    certifications: [
      {
        name: 'Professional Certified Marketer (PCM)',
        provider: 'American Marketing Association',
        description:
          'Validates expertise in marketing principles and practices.',
      },
      {
        name: 'Digital Marketing Certification',
        provider: 'Google',
        description:
          'Certifies proficiency in digital marketing tools and strategies.',
      },
    ],
    industryTrends: [
      'Content Marketing',
      'Influencer Marketing',
      'Data-Driven Marketing',
      'Personalization',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Human Resources Manager',
    category: 'Business',
    description:
      'Plan, direct, and coordinate the administrative functions of an organization, overseeing recruitment, interviewing, hiring, and employee relations to maximize workforce potential.',
    keySubjects: ['Business', 'Psychology', 'Sociology', 'Law'],
    requiredGrades: {},
    minimumMeanGrade: 'C+',
    marketDemand: 'High',
    jobProspects: [
      'Corporations',
      'Government Agencies',
      'Non-profit Organizations',
      'Educational Institutions',
      'Healthcare Organizations',
    ],
    salary: {
      entry: '45000',
      mid: '70000',
      senior: '110000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Recruitment',
      'Employee Relations',
      'Conflict Resolution',
      'Labor Laws',
      'Organizational Development',
    ],
    careerPath: {
      entryLevel: {
        roles: ['HR Assistant', 'HR Coordinator'],
        experience: '0-3 years',
        description:
          'Assist with recruitment, onboarding, and HR administration.',
      },
      midLevel: {
        roles: ['HR Manager', 'Talent Acquisition Manager'],
        experience: '4-8 years',
        description:
          'Manage HR functions, develop HR policies, and oversee employee relations.',
      },
      seniorLevel: {
        roles: ['Senior HR Manager', 'HR Director'],
        experience: '8-15 years',
        description:
          'Set HR strategy, manage HR teams, and align HR with business objectives.',
      },
      executiveLevel: {
        roles: ['Chief Human Resources Officer', 'VP of Human Resources'],
        experience: '15+ years',
        description:
          'Define HR vision, lead HR organization, and drive organizational effectiveness.',
      },
    },
    certifications: [
      {
        name: 'Professional in Human Resources (PHR)',
        provider: 'HR Certification Institute',
        description: 'Validates expertise in HR management and strategy.',
      },
      {
        name: 'SHRM Certified Professional (SHRM-CP)',
        provider: 'Society for Human Resource Management',
        description: 'Certifies knowledge of HR principles and practices.',
      },
    ],
    industryTrends: [
      'Remote Work Policies',
      'Employee Experience',
      'HR Analytics',
      'Diversity and Inclusion',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Management Consultant',
    category: 'Business',
    description:
      'Analyze business problems and develop solutions to help organizations improve performance, enhance efficiency, reduce costs, and increase profitability through expert advice.',
    keySubjects: ['Business', 'Economics', 'Statistics', 'Psychology'],
    requiredGrades: {},
    minimumMeanGrade: 'B+',
    marketDemand: 'High',
    jobProspects: [
      'Consulting Firms',
      'Corporations',
      'Government Agencies',
      'Non-profit Organizations',
      'Startups',
    ],
    salary: {
      entry: '65000',
      mid: '110000',
      senior: '180000',
    },
    institutions: [],
    programDuration: '4 years (often with MBA)',
    skillsRequired: [
      'Problem Solving',
      'Business Analysis',
      'Project Management',
      'Communication',
      'Strategic Thinking',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Associate Consultant', 'Business Analyst'],
        experience: '0-3 years',
        description:
          'Gather and analyze data, prepare presentations, and support consulting projects.',
      },
      midLevel: {
        roles: ['Consultant', 'Project Manager'],
        experience: '4-7 years',
        description:
          'Lead consulting projects, develop solutions, and manage client relationships.',
      },
      seniorLevel: {
        roles: ['Senior Consultant', 'Engagement Manager'],
        experience: '8-12 years',
        description:
          'Oversee multiple projects, develop consulting methodologies, and mentor junior consultants.',
      },
      executiveLevel: {
        roles: ['Partner', 'Director'],
        experience: '12+ years',
        description:
          'Set consulting strategy, develop new business, and lead practice areas.',
      },
    },
    certifications: [
      {
        name: 'Certified Management Consultant (CMC)',
        provider: 'Institute of Management Consultants',
        description:
          'Validates expertise in management consulting principles and ethics.',
      },
      {
        name: 'Project Management Professional (PMP)',
        provider: 'Project Management Institute',
        description:
          'Certifies knowledge of project management principles and practices.',
      },
    ],
    industryTrends: [
      'Digital Transformation',
      'Sustainability Consulting',
      'Agile Methodologies',
      'Data-Driven Consulting',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Entrepreneur',
    category: 'Business',
    description:
      'Create and run new businesses, taking on financial risks in the hope of profit, identifying market opportunities, securing resources, and building organizations from the ground up.',
    keySubjects: ['Business', 'Economics', 'Marketing', 'Finance'],
    requiredGrades: {},
    minimumMeanGrade: 'C',
    marketDemand: 'Medium',
    jobProspects: [
      'Startups',
      'Small Businesses',
      'Franchises',
      'Social Enterprises',
      'Tech Companies',
    ],
    salary: {
      entry: 'Variable',
      mid: 'Variable',
      senior: 'Variable',
    },
    institutions: [],
    programDuration: 'Variable',
    skillsRequired: [
      'Business Planning',
      'Financial Management',
      'Leadership',
      'Problem Solving',
      'Resilience',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Founder', 'Small Business Owner'],
        experience: '0-3 years',
        description:
          'Launch and operate a small business, handling multiple functions from operations to sales.',
      },
      midLevel: {
        roles: ['Established Entrepreneur', 'CEO of Growing Business'],
        experience: '4-7 years',
        description:
          'Scale business operations, build teams, and secure additional funding or resources.',
      },
      seniorLevel: {
        roles: ['Serial Entrepreneur', 'Business Leader'],
        experience: '8-15 years',
        description:
          'Launch multiple successful ventures, mentor other entrepreneurs, and possibly invest in startups.',
      },
      executiveLevel: {
        roles: ['Angel Investor', 'Venture Capitalist'],
        experience: '15+ years',
        description:
          'Fund and advise multiple businesses, serve on boards, and shape entrepreneurial ecosystems.',
      },
    },
    certifications: [
      {
        name: 'Certified Entrepreneur',
        provider: 'Entrepreneurship and Small Business Certification',
        description:
          'Validates knowledge of entrepreneurship principles and small business management.',
      },
    ],
    industryTrends: [
      'Lean Startup Methodology',
      'Social Entrepreneurship',
      'Digital Business Models',
      'Crowdfunding',
    ],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: 'Supply Chain Manager',
    category: 'Business',
    description:
      'Oversee and coordinate all activities involved in sourcing, procurement, conversion, and logistics management, ensuring efficient flow of goods, services, and information from point of origin to consumption.',
    keySubjects: [
      'Business',
      'Logistics',
      'Operations Management',
      'Statistics',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'High',
    jobProspects: [
      'Manufacturing Companies',
      'Retail Corporations',
      'Logistics Providers',
      'E-commerce',
      'Consulting Firms',
    ],
    salary: {
      entry: '45000',
      mid: '75000',
      senior: '120000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Logistics Management',
      'Inventory Control',
      'Procurement',
      'Supplier Management',
      'Analytics',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Supply Chain Analyst', 'Logistics Coordinator'],
        experience: '0-3 years',
        description:
          'Analyze supply chain data, coordinate shipments, and support procurement activities.',
      },
      midLevel: {
        roles: ['Supply Chain Manager', 'Procurement Manager'],
        experience: '4-8 years',
        description:
          'Manage supply chain operations, develop supplier relationships, and implement process improvements.',
      },
      seniorLevel: {
        roles: ['Senior Supply Chain Manager', 'Director of Operations'],
        experience: '8-15 years',
        description:
          'Set supply chain strategy, manage global operations, and lead continuous improvement initiatives.',
      },
      executiveLevel: {
        roles: ['Chief Supply Chain Officer', 'VP of Operations'],
        experience: '15+ years',
        description:
          'Define supply chain vision, lead operations organization, and drive operational excellence.',
      },
    },
    certifications: [
      {
        name: 'Certified Supply Chain Professional (CSCP)',
        provider: 'Association for Supply Chain Management',
        description:
          'Validates expertise in supply chain management principles and practices.',
      },
      {
        name: 'Certified Professional in Supply Management (CPSM)',
        provider: 'Institute for Supply Management',
        description:
          'Certifies knowledge of procurement and supply management.',
      },
    ],
    industryTrends: [
      'Supply Chain Digitization',
      'Sustainable Supply Chains',
      'Blockchain in Logistics',
      'Predictive Analytics',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  // FINANCE CAREERS
  {
    title: 'Financial Analyst',
    category: 'Finance',
    description:
      'Evaluate financial data, market trends, and investment opportunities to help businesses and individuals make informed investment decisions and develop financial strategies.',
    keySubjects: ['Finance', 'Economics', 'Accounting', 'Statistics'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'High',
    jobProspects: [
      'Investment Banks',
      'Financial Services Firms',
      'Corporations',
      'Consulting Firms',
      'Government Agencies',
    ],
    salary: {
      entry: '50000',
      mid: '80000',
      senior: '120000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Financial Modeling',
      'Data Analysis',
      'Financial Statement Analysis',
      'Valuation',
      'Excel',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Financial Analyst', 'Research Associate'],
        experience: '0-3 years',
        description:
          'Gather and analyze financial data, prepare reports, and support investment decisions.',
      },
      midLevel: {
        roles: ['Financial Analyst', 'Investment Analyst'],
        experience: '4-7 years',
        description:
          'Develop financial models, conduct in-depth analysis, and make investment recommendations.',
      },
      seniorLevel: {
        roles: ['Senior Financial Analyst', 'Portfolio Manager'],
        experience: '8-12 years',
        description:
          'Lead financial analysis teams, develop investment strategies, and manage client portfolios.',
      },
      executiveLevel: {
        roles: ['Director of Finance', 'Chief Investment Officer'],
        experience: '12+ years',
        description:
          'Set financial strategy, oversee investment decisions, and lead financial organizations.',
      },
    },
    certifications: [
      {
        name: 'Chartered Financial Analyst (CFA)',
        provider: 'CFA Institute',
        description:
          'Validates expertise in investment analysis and portfolio management.',
      },
      {
        name: 'Financial Risk Manager (FRM)',
        provider: 'Global Association of Risk Professionals',
        description:
          'Certifies knowledge of financial risk management principles.',
      },
    ],
    industryTrends: [
      'Algorithmic Trading',
      'ESG Investing',
      'Alternative Data',
      'Fintech Integration',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Accountant',
    category: 'Finance',
    description:
      'Prepare and examine financial records, ensuring accuracy and compliance with laws and regulations, while also providing financial advice to clients or organizations.',
    keySubjects: ['Accounting', 'Finance', 'Business', 'Economics'],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'High',
    jobProspects: [
      'Accounting Firms',
      'Corporations',
      'Government Agencies',
      'Non-profit Organizations',
      'Financial Institutions',
    ],
    salary: {
      entry: '45000',
      mid: '70000',
      senior: '100000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Financial Reporting',
      'Tax Preparation',
      'Auditing',
      'Bookkeeping',
      'Accounting Software',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Staff Accountant', 'Junior Auditor'],
        experience: '0-3 years',
        description:
          'Prepare financial statements, assist with audits, and maintain accounting records.',
      },
      midLevel: {
        roles: ['Senior Accountant', 'Audit Manager'],
        experience: '4-8 years',
        description:
          'Manage accounting functions, lead audits, and provide financial analysis.',
      },
      seniorLevel: {
        roles: ['Accounting Manager', 'Controller'],
        experience: '8-15 years',
        description:
          'Oversee accounting departments, develop financial policies, and ensure regulatory compliance.',
      },
      executiveLevel: {
        roles: ['Chief Financial Officer', 'Partner in Accounting Firm'],
        experience: '15+ years',
        description:
          'Set financial strategy, lead financial organizations, and make high-level financial decisions.',
      },
    },
    certifications: [
      {
        name: 'Certified Public Accountant (CPA)',
        provider: 'State Board of Accountancy',
        description:
          'Required license for accountants who file reports with the Securities and Exchange Commission.',
      },
      {
        name: 'Certified Management Accountant (CMA)',
        provider: 'Institute of Management Accountants',
        description:
          'Validates expertise in financial planning, analysis, and strategic management.',
      },
    ],
    industryTrends: [
      'Automation in Accounting',
      'Cloud Accounting',
      'Data Analytics',
      'Blockchain for Auditing',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Investment Banker',
    category: 'Finance',
    description:
      'Assist organizations in raising capital, executing mergers and acquisitions, and providing financial advisory services to help clients achieve their strategic and financial objectives.',
    keySubjects: ['Finance', 'Economics', 'Accounting', 'Mathematics'],
    requiredGrades: {},
    minimumMeanGrade: 'A-',
    marketDemand: 'Medium',
    jobProspects: [
      'Investment Banks',
      'Financial Institutions',
      'Private Equity Firms',
      'Hedge Funds',
      'Corporate Finance Departments',
    ],
    salary: {
      entry: '85000',
      mid: '150000',
      senior: '300000',
    },
    institutions: [],
    programDuration: '4 years (often with MBA)',
    skillsRequired: [
      'Financial Modeling',
      'Valuation',
      'Deal Structuring',
      'Negotiation',
      'Client Management',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Analyst', 'Associate'],
        experience: '0-4 years',
        description:
          'Build financial models, conduct company and industry research, and prepare client presentations.',
      },
      midLevel: {
        roles: ['Vice President', 'Senior Associate'],
        experience: '5-8 years',
        description:
          'Lead deal execution, manage client relationships, and supervise junior bankers.',
      },
      seniorLevel: {
        roles: ['Director', 'Executive Director'],
        experience: '9-12 years',
        description:
          'Originate deals, develop client strategies, and lead banking teams.',
      },
      executiveLevel: {
        roles: ['Managing Director', 'Partner'],
        experience: '12+ years',
        description:
          'Set banking strategy, bring in major clients, and lead investment banking divisions.',
      },
    },
    certifications: [
      {
        name: 'Chartered Financial Analyst (CFA)',
        provider: 'CFA Institute',
        description:
          'Validates expertise in investment analysis and portfolio management.',
      },
      {
        name: 'Series 79',
        provider: 'Financial Industry Regulatory Authority',
        description: 'Required license for investment banking representatives.',
      },
    ],
    industryTrends: [
      'Boutique Investment Banking',
      'Technology M&A',
      'SPACs',
      'ESG-Focused Deals',
    ],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: 'Actuary',
    category: 'Finance',
    description:
      'Analyze financial costs of risk and uncertainty using mathematics, statistics, and financial theory to assess the risk of potential events and help businesses develop policies to minimize costs.',
    keySubjects: ['Mathematics', 'Statistics', 'Economics', 'Finance'],
    requiredGrades: {},
    minimumMeanGrade: 'A-',
    marketDemand: 'High',
    jobProspects: [
      'Insurance Companies',
      'Consulting Firms',
      'Government Agencies',
      'Financial Institutions',
      'Healthcare Organizations',
    ],
    salary: {
      entry: '60000',
      mid: '100000',
      senior: '150000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Statistical Analysis',
      'Risk Assessment',
      'Financial Modeling',
      'Probability Theory',
      'Programming',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Actuarial Analyst', 'Actuarial Assistant'],
        experience: '0-3 years',
        description:
          'Analyze data, assist with actuarial calculations, and prepare reports while pursuing actuarial exams.',
      },
      midLevel: {
        roles: ['Actuary', 'Pricing Actuary'],
        experience: '4-8 years',
        description:
          'Develop actuarial models, assess risks, and make pricing recommendations.',
      },
      seniorLevel: {
        roles: ['Senior Actuary', 'Actuarial Manager'],
        experience: '8-15 years',
        description:
          'Lead actuarial teams, develop methodologies, and provide strategic risk management advice.',
      },
      executiveLevel: {
        roles: ['Chief Actuary', 'Director of Actuarial Services'],
        experience: '15+ years',
        description:
          'Set actuarial strategy, oversee risk management, and lead actuarial organizations.',
      },
    },
    certifications: [
      {
        name: 'Associate of the Society of Actuaries (ASA)',
        provider: 'Society of Actuaries',
        description: 'First level of professional certification for actuaries.',
      },
      {
        name: 'Fellow of the Society of Actuaries (FSA)',
        provider: 'Society of Actuaries',
        description:
          'Highest level of professional certification for actuaries.',
      },
    ],
    industryTrends: [
      'Predictive Analytics',
      'Catastrophe Modeling',
      'Insurtech',
      'Climate Risk Assessment',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Financial Planner',
    category: 'Finance',
    description:
      'Help individuals and families manage their finances, set financial goals, and develop comprehensive plans for investments, tax planning, retirement, and estate planning.',
    keySubjects: ['Finance', 'Economics', 'Accounting', 'Psychology'],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'High',
    jobProspects: [
      'Financial Planning Firms',
      'Banks',
      'Insurance Companies',
      'Investment Firms',
      'Self-Employment',
    ],
    salary: {
      entry: '40000',
      mid: '70000',
      senior: '120000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Financial Analysis',
      'Investment Planning',
      'Tax Planning',
      'Client Relationship Management',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Financial Planning Assistant', 'Junior Financial Advisor'],
        experience: '0-3 years',
        description:
          'Support senior advisors, prepare financial plans, and assist with client meetings.',
      },
      midLevel: {
        roles: ['Financial Planner', 'Financial Advisor'],
        experience: '4-8 years',
        description:
          'Develop comprehensive financial plans, manage client portfolios, and build client relationships.',
      },
      seniorLevel: {
        roles: ['Senior Financial Planner', 'Wealth Manager'],
        experience: '8-15 years',
        description:
          'Manage high-net-worth clients, develop complex financial strategies, and lead planning teams.',
      },
      executiveLevel: {
        roles: ['Partner', 'Practice Owner'],
        experience: '15+ years',
        description:
          'Own financial planning practices, set business strategy, and mentor other advisors.',
      },
    },
    certifications: [
      {
        name: 'Certified Financial Planner (CFP)',
        provider: 'Certified Financial Planner Board of Standards',
        description: 'Validates expertise in comprehensive financial planning.',
      },
      {
        name: 'Chartered Financial Consultant (ChFC)',
        provider: 'American College of Financial Services',
        description:
          'Certifies knowledge of advanced financial planning concepts.',
      },
    ],
    industryTrends: [
      'Robo-Advisors',
      'Fee-Based Planning',
      'Holistic Financial Wellness',
      'Digital Client Engagement',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  // EDUCATION CAREERS
  {
    title: 'Teacher',
    category: 'Education',
    description:
      'Educate students in various subjects, develop lesson plans, assess student progress, and create a positive learning environment to foster intellectual and social development.',
    keySubjects: ['Education', 'Psychology', 'Subject Specialization'],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'High',
    jobProspects: [
      'Public Schools',
      'Private Schools',
      'International Schools',
      'Online Education Platforms',
      'Tutoring Services',
    ],
    salary: {
      entry: '30000',
      mid: '50000',
      senior: '75000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Curriculum Development',
      'Classroom Management',
      'Assessment',
      'Communication',
      'Adaptability',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Teacher', 'Teaching Assistant'],
        experience: '0-5 years',
        description:
          'Develop and deliver lessons, assess student learning, and manage classroom environments.',
      },
      midLevel: {
        roles: ['Lead Teacher', 'Department Head'],
        experience: '6-10 years',
        description:
          'Mentor new teachers, develop curriculum, and lead subject departments.',
      },
      seniorLevel: {
        roles: ['Instructional Coach', 'Curriculum Specialist'],
        experience: '11-15 years',
        description:
          'Design school-wide curriculum, train teachers, and implement educational initiatives.',
      },
      executiveLevel: {
        roles: ['Principal', 'Education Director'],
        experience: '15+ years',
        description:
          'Lead educational institutions, set educational vision, and manage school operations.',
      },
    },
    certifications: [
      {
        name: 'Teaching License/Certification',
        provider: 'State Education Department',
        description: 'Required credential to teach in public schools.',
      },
      {
        name: 'National Board Certification',
        provider: 'National Board for Professional Teaching Standards',
        description:
          'Advanced certification demonstrating accomplished teaching practice.',
      },
    ],
    industryTrends: [
      'Blended Learning',
      'Social-Emotional Learning',
      'Personalized Education',
      'Technology Integration',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'School Counselor',
    category: 'Education',
    description:
      "Support students' academic, social, and emotional development, helping them navigate educational and personal challenges while preparing for college and career success.",
    keySubjects: ['Psychology', 'Counseling', 'Education', 'Sociology'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'Medium',
    jobProspects: [
      'Public Schools',
      'Private Schools',
      'Colleges',
      'Community Centers',
      'Youth Organizations',
    ],
    salary: {
      entry: '40000',
      mid: '60000',
      senior: '80000',
    },
    institutions: [],
    programDuration: "6 years (including Master's)",
    skillsRequired: [
      'Counseling Techniques',
      'Assessment',
      'Career Guidance',
      'Crisis Intervention',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['School Counselor', 'Guidance Counselor'],
        experience: '0-5 years',
        description:
          'Provide individual and group counseling, support academic planning, and assist with college applications.',
      },
      midLevel: {
        roles: ['Lead Counselor', 'Counseling Department Chair'],
        experience: '6-10 years',
        description:
          'Coordinate counseling programs, mentor new counselors, and develop counseling initiatives.',
      },
      seniorLevel: {
        roles: ['Director of Counseling', 'Student Services Coordinator'],
        experience: '11-15 years',
        description:
          'Lead counseling departments, develop comprehensive guidance programs, and collaborate with school leadership.',
      },
      executiveLevel: {
        roles: [
          'District Counseling Supervisor',
          'Director of Student Services',
        ],
        experience: '15+ years',
        description:
          'Set counseling vision for multiple schools, develop district-wide programs, and advocate for student support services.',
      },
    },
    certifications: [
      {
        name: 'School Counselor Certification/License',
        provider: 'State Education Department',
        description:
          'Required credential to work as a school counselor in public schools.',
      },
      {
        name: 'National Certified Counselor (NCC)',
        provider: 'National Board for Certified Counselors',
        description:
          'Validates expertise in counseling principles and practices.',
      },
    ],
    industryTrends: [
      'Trauma-Informed Counseling',
      'Virtual Counseling',
      'Data-Driven Interventions',
      'College and Career Readiness',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'University Professor',
    category: 'Education',
    description:
      'Teach courses in their area of expertise at the college level, conduct research, publish scholarly works, and contribute to their academic field while mentoring students.',
    keySubjects: [
      'Subject Specialization',
      'Research Methodology',
      'Education',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'A-',
    marketDemand: 'Medium',
    jobProspects: [
      'Universities',
      'Colleges',
      'Research Institutions',
      'Think Tanks',
      'Government Agencies',
    ],
    salary: {
      entry: '60000',
      mid: '85000',
      senior: '130000',
    },
    institutions: [],
    programDuration: '8-10 years (including PhD)',
    skillsRequired: [
      'Research',
      'Teaching',
      'Grant Writing',
      'Publishing',
      'Mentoring',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Assistant Professor', 'Lecturer'],
        experience: '0-6 years',
        description:
          'Teach undergraduate courses, establish research agenda, and begin publishing scholarly work.',
      },
      midLevel: {
        roles: ['Associate Professor', 'Research Professor'],
        experience: '7-12 years',
        description:
          'Teach graduate courses, secure research funding, and publish significant research.',
      },
      seniorLevel: {
        roles: ['Full Professor', 'Department Chair'],
        experience: '13-20 years',
        description:
          'Lead academic departments, mentor junior faculty, and contribute major works to their field.',
      },
      executiveLevel: {
        roles: ['Dean', 'Provost'],
        experience: '20+ years',
        description:
          'Set academic vision for colleges or universities, oversee multiple departments, and shape institutional policy.',
      },
    },
    certifications: [
      {
        name: 'PhD in Subject Area',
        provider: 'Accredited University',
        description: 'Terminal degree required for most professor positions.',
      },
    ],
    industryTrends: [
      'Online Education',
      'Interdisciplinary Research',
      'Open Access Publishing',
      'Alternative Academic Careers',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Educational Administrator',
    category: 'Education',
    description:
      'Plan, direct, and coordinate educational activities in schools, colleges, or universities, overseeing curriculum, staff, budgets, and policies to ensure effective educational programs.',
    keySubjects: ['Education', 'Administration', 'Leadership', 'Policy'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'Medium',
    jobProspects: [
      'Schools',
      'School Districts',
      'Colleges',
      'Universities',
      'Education Departments',
    ],
    salary: {
      entry: '60000',
      mid: '90000',
      senior: '130000',
    },
    institutions: [],
    programDuration: "6-8 years (including Master's)",
    skillsRequired: [
      'Leadership',
      'Budget Management',
      'Policy Development',
      'Staff Supervision',
      'Strategic Planning',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Assistant Principal', 'Program Coordinator'],
        experience: '3-5 years',
        description:
          'Support school operations, supervise staff, and implement educational programs.',
      },
      midLevel: {
        roles: ['Principal', 'Department Director'],
        experience: '6-10 years',
        description:
          'Lead educational institutions, develop school policies, and manage educational programs.',
      },
      seniorLevel: {
        roles: ['Superintendent', 'Dean'],
        experience: '11-15 years',
        description:
          'Oversee multiple schools or college departments, set educational vision, and manage large budgets.',
      },
      executiveLevel: {
        roles: ['Chief Academic Officer', 'University President'],
        experience: '15+ years',
        description:
          'Lead educational systems, shape educational policy, and manage complex educational organizations.',
      },
    },
    certifications: [
      {
        name: 'Administrative License/Certification',
        provider: 'State Education Department',
        description:
          'Required credential for school administrators in public schools.',
      },
      {
        name: 'Superintendent Certification',
        provider: 'State Education Department',
        description: 'Required credential for district superintendents.',
      },
    ],
    industryTrends: [
      'Data-Driven Decision Making',
      'Equity-Focused Leadership',
      'Community Partnerships',
      'Digital Transformation',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Special Education Teacher',
    category: 'Education',
    description:
      'Work with students who have a wide range of learning, mental, emotional, and physical disabilities, adapting general education lessons and teaching various subjects to students with mild to moderate disabilities.',
    keySubjects: [
      'Special Education',
      'Psychology',
      'Child Development',
      'Education',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'Very High',
    jobProspects: [
      'Public Schools',
      'Private Schools',
      'Special Education Centers',
      'Hospitals',
      'Residential Facilities',
    ],
    salary: {
      entry: '40000',
      mid: '60000',
      senior: '80000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Individualized Education Plans',
      'Adaptive Teaching',
      'Behavior Management',
      'Assessment',
      'Collaboration',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Special Education Teacher', 'Resource Teacher'],
        experience: '0-5 years',
        description:
          'Develop and implement IEPs, adapt curriculum, and provide specialized instruction to students with disabilities.',
      },
      midLevel: {
        roles: [
          'Lead Special Education Teacher',
          'Special Education Coordinator',
        ],
        experience: '6-10 years',
        description:
          'Coordinate special education programs, mentor new teachers, and develop specialized curriculum.',
      },
      seniorLevel: {
        roles: ['Special Education Specialist', 'Program Director'],
        experience: '11-15 years',
        description:
          'Design district-wide special education initiatives, train teachers, and ensure compliance with regulations.',
      },
      executiveLevel: {
        roles: [
          'Director of Special Education',
          'Special Education Administrator',
        ],
        experience: '15+ years',
        description:
          'Set special education vision, manage special education departments, and advocate for inclusive policies.',
      },
    },
    certifications: [
      {
        name: 'Special Education Teaching License',
        provider: 'State Education Department',
        description:
          'Required credential to teach special education in public schools.',
      },
      {
        name: 'Board Certified Behavior Analyst (BCBA)',
        provider: 'Behavior Analyst Certification Board',
        description:
          'Validates expertise in behavior analysis for students with behavioral challenges.',
      },
    ],
    industryTrends: [
      'Inclusive Education',
      'Assistive Technology',
      'Universal Design for Learning',
      'Positive Behavioral Interventions',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
];

// Function to seed the database
async function seedCareers() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Check if careers already exist
    const existingCareersCount = await Career.countDocuments();
    console.log(
      `Found ${existingCareersCount} existing careers in the database.`
    );

    if (existingCareersCount > 0) {
      const shouldContinue = process.argv.includes('--force');
      if (!shouldContinue) {
        console.log(
          'Careers already exist in the database. To overwrite, run with --force flag.'
        );
        await mongoose.disconnect();
        return;
      }
      console.log('Force flag detected. Proceeding with seeding...');
    }

    // Delete existing careers if any
    if (existingCareersCount > 0) {
      console.log('Deleting existing careers...');
      await Career.deleteMany({});
      console.log('Existing careers deleted.');
    }

    // Insert careers
    console.log(`Inserting ${careers.length} careers...`);
    const result = await Career.insertMany(careers);
    console.log(`Successfully inserted ${result.length} careers!`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedCareers();
