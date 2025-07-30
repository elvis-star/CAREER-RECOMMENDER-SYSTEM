import mongoose from "mongoose"
import dotenv from "dotenv"
import Career from "../models/Career.js"
import Institution from "../models/Institution.js"

// Load environment variables
dotenv.config()

// --- Career Data (Copied from seed-careers-SE1LfSaJ3M8lzOP8GJgimLK8vQtO6d.js) ---
const careersData = [
  // TECHNOLOGY CAREERS
  {
    title: "Software Engineer",
    category: "Technology",
    description:
      "Design, develop, and maintain software systems and applications using programming languages, frameworks, and software development methodologies to solve complex problems.",
    keySubjects: ["Computer Science", "Mathematics", "Physics"],
    requiredGrades: {},
    minimumMeanGrade: "B",
    marketDemand: "Very High",
    jobProspects: ["Tech Companies", "Financial Institutions", "Government Agencies", "Startups", "Consulting Firms"],
    salary: {
      entry: "40000",
      mid: "80000",
      senior: "150000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: ["Programming", "Problem Solving", "Algorithms", "Data Structures", "Version Control"],
    careerPath: {
      entryLevel: {
        roles: ["Junior Software Engineer", "Software Developer I"],
        experience: "0-2 years",
        description: "Focus on learning codebases, fixing bugs, and implementing small features under supervision.",
      },
      midLevel: {
        roles: ["Software Engineer II", "Senior Developer"],
        experience: "3-5 years",
        description: "Lead feature development, mentor junior developers, and contribute to architectural decisions.",
      },
      seniorLevel: {
        roles: ["Senior Software Engineer", "Tech Lead"],
        experience: "6-10 years",
        description: "Design system architecture, make critical technical decisions, and lead development teams.",
      },
      executiveLevel: {
        roles: ["Principal Engineer", "Chief Technology Officer"],
        experience: "10+ years",
        description:
          "Set technical direction for the organization, make strategic decisions, and oversee multiple teams.",
      },
    },
    certifications: [
      {
        name: "AWS Certified Developer",
        provider: "Amazon Web Services",
        description: "Validates expertise in developing applications for the AWS platform.",
      },
      {
        name: "Microsoft Certified: Azure Developer Associate",
        provider: "Microsoft",
        description: "Demonstrates proficiency in cloud development using Azure services.",
      },
    ],
    industryTrends: ["Cloud Computing", "Artificial Intelligence", "DevOps", "Microservices Architecture"],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: "Data Scientist",
    category: "Technology",
    description:
      "Analyze and interpret complex data sets to help organizations make better decisions through statistical analysis, machine learning, and data visualization.",
    keySubjects: ["Statistics", "Mathematics", "Computer Science"],
    requiredGrades: {},
    minimumMeanGrade: "B+",
    marketDemand: "Very High",
    jobProspects: ["Tech Companies", "Financial Services", "Healthcare", "E-commerce", "Research Institutions"],
    salary: {
      entry: "50000",
      mid: "90000",
      senior: "160000",
    },
    institutions: [], // Will be populated later
    programDuration: "4-5 years",
    skillsRequired: ["Statistical Analysis", "Machine Learning", "Python", "R", "SQL", "Data Visualization"],
    careerPath: {
      entryLevel: {
        roles: ["Junior Data Scientist", "Data Analyst"],
        experience: "0-2 years",
        description: "Work on data cleaning, basic analysis, and implementing established models.",
      },
      midLevel: {
        roles: ["Data Scientist", "Machine Learning Engineer"],
        experience: "3-5 years",
        description:
          "Develop complex models, lead analysis projects, and translate business problems into data questions.",
      },
      seniorLevel: {
        roles: ["Senior Data Scientist", "Lead Data Scientist"],
        experience: "6-10 years",
        description: "Design data strategy, develop novel algorithms, and lead teams of data professionals.",
      },
      executiveLevel: {
        roles: ["Chief Data Officer", "Director of Data Science"],
        experience: "10+ years",
        description:
          "Set data strategy for the organization, oversee multiple teams, and align data initiatives with business goals.",
      },
    },
    certifications: [
      {
        name: "TensorFlow Developer Certificate",
        provider: "Google",
        description: "Validates skills in using TensorFlow to build and train models.",
      },
      {
        name: "Microsoft Certified: Azure Data Scientist Associate",
        provider: "Microsoft",
        description: "Demonstrates expertise in applying data science and machine learning on Azure.",
      },
    ],
    industryTrends: ["Big Data", "Deep Learning", "Natural Language Processing", "Automated Machine Learning"],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: "Cybersecurity Analyst",
    category: "Technology",
    description:
      "Protect computer systems and networks from information disclosure, theft, and damage to hardware, software, or electronic data through implementation of security measures.",
    keySubjects: ["Computer Science", "Information Technology", "Cryptography"],
    requiredGrades: {},
    minimumMeanGrade: "B",
    marketDemand: "Very High",
    jobProspects: [
      "Government Agencies",
      "Financial Institutions",
      "Healthcare Organizations",
      "Tech Companies",
      "Consulting Firms",
    ],
    salary: {
      entry: "45000",
      mid: "85000",
      senior: "140000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: [
      "Network Security",
      "Penetration Testing",
      "Security Protocols",
      "Risk Assessment",
      "Incident Response",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Security Analyst", "Information Security Specialist"],
        experience: "0-2 years",
        description: "Monitor security systems, respond to alerts, and implement security controls.",
      },
      midLevel: {
        roles: ["Cybersecurity Consultant", "Security Engineer"],
        experience: "3-5 years",
        description: "Design security solutions, conduct vulnerability assessments, and lead security projects.",
      },
      seniorLevel: {
        roles: ["Security Architect", "Cybersecurity Manager"],
        experience: "6-10 years",
        description: "Develop security strategies, oversee security operations, and manage security teams.",
      },
      executiveLevel: {
        roles: ["Chief Information Security Officer", "Director of Security"],
        experience: "10+ years",
        description:
          "Set security vision, develop security policies, and ensure organizational compliance with regulations.",
      },
    },
    certifications: [
      {
        name: "Certified Information Systems Security Professional (CISSP)",
        provider: "ISC²",
        description: "Demonstrates expertise in designing, implementing, and managing cybersecurity programs.",
      },
      {
        name: "Certified Ethical Hacker (CEH)",
        provider: "EC-Council",
        description:
          "Validates skills in identifying vulnerabilities in target systems using the same methods as hackers.",
      },
    ],
    industryTrends: ["Zero Trust Security", "Cloud Security", "AI in Cybersecurity", "IoT Security"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "UX/UI Designer",
    category: "Technology",
    description:
      "Create intuitive, accessible, and enjoyable digital experiences by combining user research, visual design, and interaction design principles to improve user satisfaction.",
    keySubjects: ["Design", "Psychology", "Computer Science"],
    requiredGrades: {},
    minimumMeanGrade: "C+",
    marketDemand: "High",
    jobProspects: ["Tech Companies", "Design Agencies", "E-commerce", "Media Companies", "Startups"],
    salary: {
      entry: "35000",
      mid: "70000",
      senior: "120000",
    },
    institutions: [], // Will be populated later
    programDuration: "3-4 years",
    skillsRequired: ["User Research", "Wireframing", "Prototyping", "Visual Design", "Usability Testing"],
    careerPath: {
      entryLevel: {
        roles: ["Junior UX Designer", "UI Designer"],
        experience: "0-2 years",
        description: "Create wireframes, assist with user research, and design interface elements.",
      },
      midLevel: {
        roles: ["UX/UI Designer", "Product Designer"],
        experience: "3-5 years",
        description: "Lead design projects, conduct user research, and create comprehensive design systems.",
      },
      seniorLevel: {
        roles: ["Senior UX Designer", "Design Lead"],
        experience: "6-10 years",
        description:
          "Define design strategy, mentor junior designers, and collaborate with product and engineering leaders.",
      },
      executiveLevel: {
        roles: ["Design Director", "VP of Design"],
        experience: "10+ years",
        description: "Set design vision, build design teams, and align design with business objectives.",
      },
    },
    certifications: [
      {
        name: "Certified User Experience Professional (CUXP)",
        provider: "Nielsen Norman Group",
        description: "Validates expertise in user experience research and design.",
      },
    ],
    industryTrends: ["Design Systems", "Voice User Interfaces", "Augmented Reality", "Accessibility Design"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Cloud Solutions Architect",
    category: "Technology",
    description:
      "Design and implement cloud computing solutions for organizations, ensuring scalability, security, and cost-effectiveness while aligning with business objectives.",
    keySubjects: ["Computer Science", "Information Technology", "Systems Engineering"],
    requiredGrades: {},
    minimumMeanGrade: "B",
    marketDemand: "Very High",
    jobProspects: [
      "Cloud Service Providers",
      "Tech Companies",
      "Financial Institutions",
      "Consulting Firms",
      "Healthcare Organizations",
    ],
    salary: {
      entry: "60000",
      mid: "110000",
      senior: "180000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: [
      "Cloud Platforms",
      "Network Architecture",
      "Security",
      "Infrastructure as Code",
      "Containerization",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Cloud Engineer", "Solutions Engineer"],
        experience: "1-3 years",
        description: "Implement cloud solutions, assist with migrations, and support cloud infrastructure.",
      },
      midLevel: {
        roles: ["Cloud Architect", "DevOps Engineer"],
        experience: "4-7 years",
        description: "Design cloud architectures, optimize cloud resources, and implement best practices.",
      },
      seniorLevel: {
        roles: ["Senior Cloud Architect", "Cloud Strategy Lead"],
        experience: "8-12 years",
        description: "Develop cloud strategies, lead complex migrations, and design enterprise-scale solutions.",
      },
      executiveLevel: {
        roles: ["Chief Cloud Architect", "VP of Cloud Engineering"],
        experience: "12+ years",
        description:
          "Set cloud vision, develop cloud governance frameworks, and lead digital transformation initiatives.",
      },
    },
    certifications: [
      {
        name: "AWS Certified Solutions Architect - Professional",
        provider: "Amazon Web Services",
        description: "Validates expertise in designing distributed applications and systems on AWS.",
      },
      {
        name: "Google Cloud Professional Cloud Architect",
        provider: "Google",
        description: "Demonstrates ability to design, develop, and manage robust, secure, scalable cloud solutions.",
      },
    ],
    industryTrends: ["Multi-cloud Strategy", "Serverless Computing", "Edge Computing", "FinOps"],
    featured: false,
    views: 0,
    saves: 0,
  },

  // ENGINEERING CAREERS
  {
    title: "Civil Engineer",
    category: "Engineering",
    description:
      "Design, develop, and supervise infrastructure projects such as roads, buildings, airports, tunnels, dams, bridges, and water supply systems while ensuring safety and sustainability.",
    keySubjects: ["Mathematics", "Physics", "Structural Analysis", "Materials Science"],
    requiredGrades: {},
    minimumMeanGrade: "B-",
    marketDemand: "High",
    jobProspects: [
      "Construction Companies",
      "Government Agencies",
      "Engineering Consultancies",
      "Urban Planning Firms",
      "Research Institutions",
    ],
    salary: {
      entry: "35000",
      mid: "65000",
      senior: "110000",
    },
    institutions: [], // Will be populated later
    programDuration: "4-5 years",
    skillsRequired: ["AutoCAD", "Structural Analysis", "Project Management", "Technical Drawing", "Building Codes"],
    careerPath: {
      entryLevel: {
        roles: ["Junior Civil Engineer", "Site Engineer"],
        experience: "0-3 years",
        description: "Assist with designs, conduct site inspections, and prepare technical documentation.",
      },
      midLevel: {
        roles: ["Civil Engineer", "Project Engineer"],
        experience: "4-8 years",
        description: "Lead design projects, manage construction activities, and ensure compliance with regulations.",
      },
      seniorLevel: {
        roles: ["Senior Civil Engineer", "Project Manager"],
        experience: "8-15 years",
        description: "Oversee multiple projects, develop engineering standards, and mentor junior engineers.",
      },
      executiveLevel: {
        roles: ["Engineering Director", "Chief Engineer"],
        experience: "15+ years",
        description: "Set engineering strategy, lead large-scale projects, and manage engineering departments.",
      },
    },
    certifications: [
      {
        name: "Professional Engineer (PE)",
        provider: "State Licensing Board",
        description: "Required license to offer services directly to the public.",
      },
      {
        name: "Leadership in Energy and Environmental Design (LEED)",
        provider: "U.S. Green Building Council",
        description: "Validates expertise in sustainable building design and construction.",
      },
    ],
    industryTrends: [
      "Sustainable Infrastructure",
      "Smart Cities",
      "Building Information Modeling (BIM)",
      "Resilient Design",
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Mechanical Engineer",
    category: "Engineering",
    description:
      "Design, develop, build, and test mechanical devices, including tools, engines, and machines, applying principles of motion, energy, and force to solve problems.",
    keySubjects: ["Mathematics", "Physics", "Thermodynamics", "Materials Science"],
    requiredGrades: {},
    minimumMeanGrade: "B-",
    marketDemand: "High",
    jobProspects: [
      "Manufacturing Companies",
      "Automotive Industry",
      "Aerospace",
      "Energy Sector",
      "Research and Development",
    ],
    salary: {
      entry: "40000",
      mid: "70000",
      senior: "120000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: [
      "CAD Software",
      "Finite Element Analysis",
      "Thermodynamics",
      "Fluid Mechanics",
      "Manufacturing Processes",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Junior Mechanical Engineer", "Design Engineer"],
        experience: "0-3 years",
        description: "Create technical drawings, assist with product development, and conduct testing.",
      },
      midLevel: {
        roles: ["Mechanical Engineer", "Product Development Engineer"],
        experience: "4-8 years",
        description: "Lead design projects, develop new products, and optimize manufacturing processes.",
      },
      seniorLevel: {
        roles: ["Senior Mechanical Engineer", "Engineering Manager"],
        experience: "8-15 years",
        description: "Oversee engineering teams, develop technical strategies, and lead complex projects.",
      },
      executiveLevel: {
        roles: ["Director of Engineering", "Chief Mechanical Engineer"],
        experience: "15+ years",
        description: "Set engineering direction, manage multiple departments, and drive innovation initiatives.",
      },
    },
    certifications: [
      {
        name: "Professional Engineer (PE)",
        provider: "State Licensing Board",
        description: "Required license for engineers who offer services directly to the public.",
      },
      {
        name: "Certified Manufacturing Engineer (CMfgE)",
        provider: "Society of Manufacturing Engineers",
        description: "Validates expertise in manufacturing processes and technologies.",
      },
    ],
    industryTrends: ["Additive Manufacturing", "Robotics", "Sustainable Design", "Digital Twins"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Electrical Engineer",
    category: "Engineering",
    description:
      "Design, develop, test, and supervise the manufacturing of electrical equipment, systems, and components, from small microchips to large power station generators.",
    keySubjects: ["Mathematics", "Physics", "Circuit Theory", "Electronics"],
    requiredGrades: {},
    minimumMeanGrade: "B",
    marketDemand: "High",
    jobProspects: [
      "Power Companies",
      "Electronics Manufacturers",
      "Telecommunications",
      "Automotive Industry",
      "Aerospace",
    ],
    salary: {
      entry: "45000",
      mid: "75000",
      senior: "125000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: ["Circuit Design", "Power Systems", "Electronics", "Programming", "Signal Processing"],
    careerPath: {
      entryLevel: {
        roles: ["Junior Electrical Engineer", "Electronics Engineer"],
        experience: "0-3 years",
        description: "Design and test circuits, assist with product development, and troubleshoot electrical systems.",
      },
      midLevel: {
        roles: ["Electrical Engineer", "Power Systems Engineer"],
        experience: "4-8 years",
        description: "Lead design projects, develop electrical systems, and implement technical solutions.",
      },
      seniorLevel: {
        roles: ["Senior Electrical Engineer", "Lead Engineer"],
        experience: "8-15 years",
        description: "Oversee engineering teams, develop technical standards, and lead complex projects.",
      },
      executiveLevel: {
        roles: ["Engineering Director", "Chief Electrical Engineer"],
        experience: "15+ years",
        description: "Set engineering strategy, manage departments, and drive technological innovation.",
      },
    },
    certifications: [
      {
        name: "Professional Engineer (PE)",
        provider: "State Licensing Board",
        description: "Required license for engineers who offer services directly to the public.",
      },
      {
        name: "Certified Electrical Safety Compliance Professional (CESCP)",
        provider: "National Fire Protection Association",
        description: "Validates expertise in electrical safety standards and compliance.",
      },
    ],
    industryTrends: ["Renewable Energy", "Smart Grid Technology", "Electric Vehicles", "IoT Devices"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Aerospace Engineer",
    category: "Engineering",
    description:
      "Design, develop, and test aircraft, spacecraft, satellites, and missiles, applying principles of aerodynamics, propulsion, and materials science to create cutting-edge aerospace technology.",
    keySubjects: ["Mathematics", "Physics", "Aerodynamics", "Propulsion Systems"],
    requiredGrades: {},
    minimumMeanGrade: "A-",
    marketDemand: "Medium",
    jobProspects: ["Aerospace Companies", "Defense Contractors", "Space Agencies", "Airlines", "Research Institutions"],
    salary: {
      entry: "60000",
      mid: "95000",
      senior: "150000",
    },
    institutions: [], // Will be populated later
    programDuration: "4-5 years",
    skillsRequired: [
      "CAD/CAM Software",
      "Fluid Dynamics",
      "Structural Analysis",
      "Propulsion Systems",
      "Materials Science",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Junior Aerospace Engineer", "Design Engineer"],
        experience: "0-3 years",
        description: "Assist with aircraft or spacecraft design, conduct testing, and analyze performance data.",
      },
      midLevel: {
        roles: ["Aerospace Engineer", "Propulsion Engineer"],
        experience: "4-8 years",
        description: "Lead design projects, develop aerospace systems, and solve complex engineering problems.",
      },
      seniorLevel: {
        roles: ["Senior Aerospace Engineer", "Technical Lead"],
        experience: "8-15 years",
        description: "Oversee engineering teams, develop technical standards, and lead major aerospace projects.",
      },
      executiveLevel: {
        roles: ["Chief Engineer", "Director of Aerospace Engineering"],
        experience: "15+ years",
        description: "Set engineering strategy, manage multiple departments, and drive aerospace innovation.",
      },
    },
    certifications: [
      {
        name: "Professional Engineer (PE)",
        provider: "State Licensing Board",
        description: "Required license for engineers who offer services directly to the public.",
      },
      {
        name: "Certified Systems Engineering Professional (CSEP)",
        provider: "International Council on Systems Engineering",
        description: "Validates expertise in systems engineering principles and practices.",
      },
    ],
    industryTrends: [
      "Commercial Space Travel",
      "Unmanned Aerial Vehicles",
      "Sustainable Aviation",
      "Hypersonic Technology",
    ],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: "Chemical Engineer",
    category: "Engineering",
    description:
      "Apply principles of chemistry, biology, physics, and mathematics to design and develop processes for manufacturing chemicals, fuels, drugs, food, and many other products.",
    keySubjects: ["Chemistry", "Mathematics", "Physics", "Biology"],
    requiredGrades: {},
    minimumMeanGrade: "B",
    marketDemand: "Medium",
    jobProspects: [
      "Chemical Manufacturing",
      "Pharmaceutical Companies",
      "Food Processing",
      "Energy Sector",
      "Environmental Firms",
    ],
    salary: {
      entry: "50000",
      mid: "80000",
      senior: "130000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: ["Process Design", "Thermodynamics", "Reaction Kinetics", "Fluid Dynamics", "Process Control"],
    careerPath: {
      entryLevel: {
        roles: ["Junior Chemical Engineer", "Process Engineer"],
        experience: "0-3 years",
        description:
          "Monitor production processes, troubleshoot equipment issues, and assist with process improvements.",
      },
      midLevel: {
        roles: ["Chemical Engineer", "Production Engineer"],
        experience: "4-8 years",
        description: "Design chemical processes, optimize production efficiency, and lead improvement projects.",
      },
      seniorLevel: {
        roles: ["Senior Chemical Engineer", "Process Design Manager"],
        experience: "8-15 years",
        description: "Oversee engineering teams, develop technical standards, and lead major facility projects.",
      },
      executiveLevel: {
        roles: ["Engineering Director", "Chief Process Engineer"],
        experience: "15+ years",
        description: "Set engineering strategy, manage multiple departments, and drive innovation initiatives.",
      },
    },
    certifications: [
      {
        name: "Professional Engineer (PE)",
        provider: "State Licensing Board",
        description: "Required license for engineers who offer services directly to the public.",
      },
      {
        name: "Certified Process Safety Professional (CCPSC)",
        provider: "Board of Certified Safety Professionals",
        description: "Validates expertise in process safety management.",
      },
    ],
    industryTrends: ["Green Chemistry", "Biofuels", "Nanotechnology", "Sustainable Manufacturing"],
    featured: false,
    views: 0,
    saves: 0,
  },

  // HEALTHCARE CAREERS
  {
    title: "Medical Doctor",
    category: "Healthcare",
    description:
      "Diagnose and treat illnesses, injuries, and other health conditions in patients through examination, testing, and prescribing medications or other treatments to promote wellness.",
    keySubjects: ["Biology", "Chemistry", "Physics", "Mathematics"],
    requiredGrades: {},
    minimumMeanGrade: "A-",
    marketDemand: "Very High",
    jobProspects: [
      "Hospitals",
      "Private Practice",
      "Research Institutions",
      "Public Health Agencies",
      "International Organizations",
    ],
    salary: {
      entry: "60000",
      mid: "150000",
      senior: "300000",
    },
    institutions: [], // Will be populated later
    programDuration: "6-7 years",
    skillsRequired: [
      "Clinical Skills",
      "Diagnostic Reasoning",
      "Patient Communication",
      "Medical Knowledge",
      "Critical Thinking",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Medical Intern", "Resident"],
        experience: "1-5 years",
        description:
          "Complete supervised clinical training in a hospital setting, rotating through different specialties.",
      },
      midLevel: {
        roles: ["Attending Physician", "Specialist"],
        experience: "5-10 years",
        description: "Practice independently, treat patients, and may supervise residents and medical students.",
      },
      seniorLevel: {
        roles: ["Senior Physician", "Department Head"],
        experience: "10-20 years",
        description: "Lead medical teams, develop treatment protocols, and contribute to medical research.",
      },
      executiveLevel: {
        roles: ["Chief Medical Officer", "Medical Director"],
        experience: "20+ years",
        description:
          "Set medical policy, oversee clinical operations, and ensure quality of care across the organization.",
      },
    },
    certifications: [
      {
        name: "Board Certification",
        provider: "American Board of Medical Specialties",
        description: "Validates expertise in a medical specialty through rigorous examination.",
      },
      {
        name: "Advanced Cardiac Life Support (ACLS)",
        provider: "American Heart Association",
        description: "Certifies ability to manage cardiovascular emergencies.",
      },
    ],
    industryTrends: ["Telemedicine", "Precision Medicine", "AI in Diagnostics", "Value-Based Care"],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: "Registered Nurse",
    category: "Healthcare",
    description:
      "Provide and coordinate patient care, educate patients about health conditions, and provide advice and emotional support to patients and their families.",
    keySubjects: ["Biology", "Chemistry", "Psychology", "Anatomy"],
    requiredGrades: {},
    minimumMeanGrade: "B-",
    marketDemand: "Very High",
    jobProspects: ["Hospitals", "Clinics", "Schools", "Home Health Agencies", "Long-term Care Facilities"],
    salary: {
      entry: "35000",
      mid: "60000",
      senior: "90000",
    },
    institutions: [], // Will be populated later
    programDuration: "3-4 years",
    skillsRequired: [
      "Patient Care",
      "Clinical Procedures",
      "Medical Documentation",
      "Critical Thinking",
      "Communication",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Staff Nurse", "Graduate Nurse"],
        experience: "0-2 years",
        description: "Provide direct patient care, administer medications, and assist with medical procedures.",
      },
      midLevel: {
        roles: ["Charge Nurse", "Specialized Nurse"],
        experience: "3-7 years",
        description: "Oversee nursing units, coordinate patient care, and specialize in specific areas of medicine.",
      },
      seniorLevel: {
        roles: ["Nurse Manager", "Clinical Nurse Specialist"],
        experience: "8-15 years",
        description: "Manage nursing staff, develop care protocols, and serve as clinical experts.",
      },
      executiveLevel: {
        roles: ["Chief Nursing Officer", "Director of Nursing"],
        experience: "15+ years",
        description:
          "Set nursing strategy, oversee nursing operations, and ensure quality of care across the organization.",
      },
    },
    certifications: [
      {
        name: "Basic Life Support (BLS)",
        provider: "American Heart Association",
        description: "Certifies ability to perform CPR and manage choking emergencies.",
      },
      {
        name: "Certified Critical Care Nurse (CCRN)",
        provider: "American Association of Critical-Care Nurses",
        description: "Validates expertise in critical care nursing.",
      },
    ],
    industryTrends: ["Telehealth Nursing", "Specialized Care", "Evidence-Based Practice", "Nurse Practitioners"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Pharmacist",
    category: "Healthcare",
    description:
      "Dispense prescription medications, advise patients on proper medication use, and monitor drug interactions to ensure safe and effective treatment.",
    keySubjects: ["Chemistry", "Biology", "Pharmacology", "Mathematics"],
    requiredGrades: {},
    minimumMeanGrade: "B+",
    marketDemand: "High",
    jobProspects: [
      "Retail Pharmacies",
      "Hospitals",
      "Pharmaceutical Companies",
      "Government Agencies",
      "Research Institutions",
    ],
    salary: {
      entry: "80000",
      mid: "110000",
      senior: "140000",
    },
    institutions: [], // Will be populated later
    programDuration: "6 years",
    skillsRequired: [
      "Pharmaceutical Knowledge",
      "Patient Counseling",
      "Medication Management",
      "Attention to Detail",
      "Communication",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Staff Pharmacist", "Pharmacy Resident"],
        experience: "0-3 years",
        description: "Dispense medications, counsel patients, and ensure prescription accuracy.",
      },
      midLevel: {
        roles: ["Clinical Pharmacist", "Pharmacy Manager"],
        experience: "4-8 years",
        description:
          "Provide specialized medication therapy, manage pharmacy operations, and collaborate with healthcare teams.",
      },
      seniorLevel: {
        roles: ["Senior Pharmacist", "Pharmacy Director"],
        experience: "8-15 years",
        description: "Oversee pharmacy departments, develop medication protocols, and ensure regulatory compliance.",
      },
      executiveLevel: {
        roles: ["Chief Pharmacy Officer", "VP of Pharmacy Services"],
        experience: "15+ years",
        description: "Set pharmacy strategy, manage multiple departments, and drive pharmaceutical innovation.",
      },
    },
    certifications: [
      {
        name: "Board Certified Pharmacotherapy Specialist (BCPS)",
        provider: "Board of Pharmacy Specialties",
        description: "Validates expertise in optimizing medication therapy and improving patient outcomes.",
      },
      {
        name: "Certified Diabetes Educator (CDE)",
        provider: "National Certification Board for Diabetes Educators",
        description: "Certifies ability to educate and support people with diabetes.",
      },
    ],
    industryTrends: ["Medication Therapy Management", "Pharmacogenomics", "Telepharmacy", "Specialty Pharmaceuticals"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Physical Therapist",
    category: "Healthcare",
    description:
      "Help injured or ill people improve movement and manage pain through exercises, stretches, hands-on therapy, and patient education to enhance physical function and mobility.",
    keySubjects: ["Anatomy", "Physiology", "Kinesiology", "Biology"],
    requiredGrades: {},
    minimumMeanGrade: "B",
    marketDemand: "High",
    jobProspects: ["Hospitals", "Outpatient Clinics", "Sports Teams", "Schools", "Home Health Services"],
    salary: {
      entry: "65000",
      mid: "85000",
      senior: "110000",
    },
    institutions: [], // Will be populated later
    programDuration: "3 years (DPT)",
    skillsRequired: [
      "Manual Therapy",
      "Exercise Prescription",
      "Patient Assessment",
      "Rehabilitation Techniques",
      "Communication",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Staff Physical Therapist", "Rehabilitation Specialist"],
        experience: "0-3 years",
        description: "Provide direct patient care, implement treatment plans, and document patient progress.",
      },
      midLevel: {
        roles: ["Senior Physical Therapist", "Clinical Specialist"],
        experience: "4-8 years",
        description: "Develop specialized treatment approaches, mentor junior therapists, and manage complex cases.",
      },
      seniorLevel: {
        roles: ["Lead Physical Therapist", "Clinic Director"],
        experience: "8-15 years",
        description: "Oversee therapy departments, develop clinical protocols, and ensure quality of care.",
      },
      executiveLevel: {
        roles: ["Director of Rehabilitation", "Chief Clinical Officer"],
        experience: "15+ years",
        description: "Set therapy strategy, manage multiple departments, and drive clinical innovation.",
      },
    },
    certifications: [
      {
        name: "Orthopedic Certified Specialist (OCS)",
        provider: "American Board of Physical Therapy Specialties",
        description: "Validates expertise in orthopedic physical therapy.",
      },
      {
        name: "Certified Hand Therapist (CHT)",
        provider: "Hand Therapy Certification Commission",
        description: "Certifies specialized knowledge in upper extremity rehabilitation.",
      },
    ],
    industryTrends: ["Telerehabilitation", "Wearable Technology", "Preventive Care", "Specialized Therapy"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Dentist",
    category: "Healthcare",
    description:
      "Diagnose and treat problems with patients' teeth, gums, and related parts of the mouth, providing advice and instruction on taking care of teeth and gums to prevent future problems.",
    keySubjects: ["Biology", "Chemistry", "Anatomy", "Physics"],
    requiredGrades: {},
    minimumMeanGrade: "A-",
    marketDemand: "High",
    jobProspects: [
      "Private Practice",
      "Dental Clinics",
      "Hospitals",
      "Public Health Services",
      "Research Institutions",
    ],
    salary: {
      entry: "100000",
      mid: "150000",
      senior: "200000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years (after undergraduate)",
    skillsRequired: [
      "Clinical Skills",
      "Manual Dexterity",
      "Patient Management",
      "Diagnostic Ability",
      "Communication",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Associate Dentist", "General Dentist"],
        experience: "0-3 years",
        description: "Perform routine dental procedures, diagnose oral conditions, and develop treatment plans.",
      },
      midLevel: {
        roles: ["Established Dentist", "Specialist"],
        experience: "4-10 years",
        description: "Manage complex cases, perform specialized procedures, and may own a dental practice.",
      },
      seniorLevel: {
        roles: ["Senior Dentist", "Practice Owner"],
        experience: "10-20 years",
        description: "Lead dental teams, develop treatment protocols, and manage business operations.",
      },
      executiveLevel: {
        roles: ["Dental Director", "Chief Dental Officer"],
        experience: "20+ years",
        description:
          "Set dental policy, oversee multiple practices, and ensure quality of care across the organization.",
      },
    },
    certifications: [
      {
        name: "Board Certification in Dental Specialty",
        provider: "American Board of Dental Specialties",
        description: "Validates expertise in a dental specialty through rigorous examination.",
      },
      {
        name: "Advanced Cardiac Life Support (ACLS)",
        provider: "American Heart Association",
        description: "Certifies ability to manage cardiovascular emergencies in dental settings.",
      },
    ],
    industryTrends: ["Digital Dentistry", "3D Printing", "Minimally Invasive Techniques", "Cosmetic Dentistry"],
    featured: false,
    views: 0,
    saves: 0,
  },

  // BUSINESS CAREERS
  {
    title: "Marketing Manager",
    category: "Business",
    description:
      "Plan, direct, and coordinate marketing strategies and campaigns to promote products, services, or brands, analyzing market trends and competitor activities to identify opportunities.",
    keySubjects: ["Marketing", "Business", "Psychology", "Statistics"],
    requiredGrades: {},
    minimumMeanGrade: "B-",
    marketDemand: "High",
    jobProspects: ["Corporations", "Marketing Agencies", "Non-profit Organizations", "Startups", "Consulting Firms"],
    salary: {
      entry: "40000",
      mid: "75000",
      senior: "120000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: ["Market Research", "Campaign Management", "Digital Marketing", "Analytics", "Communication"],
    careerPath: {
      entryLevel: {
        roles: ["Marketing Coordinator", "Marketing Specialist"],
        experience: "0-3 years",
        description: "Assist with marketing campaigns, create content, and analyze marketing metrics.",
      },
      midLevel: {
        roles: ["Marketing Manager", "Brand Manager"],
        experience: "4-8 years",
        description: "Develop marketing strategies, manage campaigns, and oversee marketing teams.",
      },
      seniorLevel: {
        roles: ["Senior Marketing Manager", "Marketing Director"],
        experience: "8-15 years",
        description: "Set marketing direction, manage budgets, and align marketing with business objectives.",
      },
      executiveLevel: {
        roles: ["Chief Marketing Officer", "VP of Marketing"],
        experience: "15+ years",
        description:
          "Define marketing vision, lead marketing organization, and drive business growth through marketing.",
      },
    },
    certifications: [
      {
        name: "Professional Certified Marketer (PCM)",
        provider: "American Marketing Association",
        description: "Validates expertise in marketing principles and practices.",
      },
      {
        name: "Digital Marketing Certification",
        provider: "Google",
        description: "Certifies proficiency in digital marketing tools and strategies.",
      },
    ],
    industryTrends: ["Content Marketing", "Influencer Marketing", "Data-Driven Marketing", "Personalization"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Human Resources Manager",
    category: "Business",
    description:
      "Plan, direct, and coordinate the administrative functions of an organization, overseeing recruitment, interviewing, hiring, and employee relations to maximize workforce potential.",
    keySubjects: ["Business", "Psychology", "Sociology", "Law"],
    requiredGrades: {},
    minimumMeanGrade: "C+",
    marketDemand: "High",
    jobProspects: [
      "Corporations",
      "Government Agencies",
      "Non-profit Organizations",
      "Educational Institutions",
      "Healthcare Organizations",
    ],
    salary: {
      entry: "45000",
      mid: "70000",
      senior: "110000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: [
      "Recruitment",
      "Employee Relations",
      "Conflict Resolution",
      "Labor Laws",
      "Organizational Development",
    ],
    careerPath: {
      entryLevel: {
        roles: ["HR Assistant", "HR Coordinator"],
        experience: "0-3 years",
        description: "Assist with recruitment, onboarding, and HR administration.",
      },
      midLevel: {
        roles: ["HR Manager", "Talent Acquisition Manager"],
        experience: "4-8 years",
        description: "Manage HR functions, develop HR policies, and oversee employee relations.",
      },
      seniorLevel: {
        roles: ["Senior HR Manager", "HR Director"],
        experience: "8-15 years",
        description: "Set HR strategy, manage HR teams, and align HR with business objectives.",
      },
      executiveLevel: {
        roles: ["Chief Human Resources Officer", "VP of Human Resources"],
        experience: "15+ years",
        description: "Define HR vision, lead HR organization, and drive organizational effectiveness.",
      },
    },
    certifications: [
      {
        name: "Professional in Human Resources (PHR)",
        provider: "HR Certification Institute",
        description: "Validates expertise in HR management and strategy.",
      },
      {
        name: "SHRM Certified Professional (SHRM-CP)",
        provider: "Society for Human Resource Management",
        description: "Certifies knowledge of HR principles and practices.",
      },
    ],
    industryTrends: ["Remote Work Policies", "Employee Experience", "HR Analytics", "Diversity and Inclusion"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Management Consultant",
    category: "Business",
    description:
      "Analyze business problems and develop solutions to help organizations improve performance, enhance efficiency, reduce costs, and increase profitability through expert advice.",
    keySubjects: ["Business", "Economics", "Statistics", "Psychology"],
    requiredGrades: {},
    minimumMeanGrade: "B+",
    marketDemand: "High",
    jobProspects: ["Consulting Firms", "Corporations", "Government Agencies", "Non-profit Organizations", "Startups"],
    salary: {
      entry: "65000",
      mid: "110000",
      senior: "180000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years (often with MBA)",
    skillsRequired: [
      "Problem Solving",
      "Business Analysis",
      "Project Management",
      "Communication",
      "Strategic Thinking",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Associate Consultant", "Business Analyst"],
        experience: "0-3 years",
        description: "Gather and analyze data, prepare presentations, and support consulting projects.",
      },
      midLevel: {
        roles: ["Consultant", "Project Manager"],
        experience: "4-7 years",
        description: "Lead consulting projects, develop solutions, and manage client relationships.",
      },
      seniorLevel: {
        roles: ["Senior Consultant", "Engagement Manager"],
        experience: "8-12 years",
        description: "Oversee multiple projects, develop consulting methodologies, and mentor junior consultants.",
      },
      executiveLevel: {
        roles: ["Partner", "Director"],
        experience: "12+ years",
        description: "Set consulting strategy, develop new business, and lead practice areas.",
      },
    },
    certifications: [
      {
        name: "Certified Management Consultant (CMC)",
        provider: "Institute of Management Consultants",
        description: "Validates expertise in management consulting principles and ethics.",
      },
      {
        name: "Project Management Professional (PMP)",
        provider: "Project Management Institute",
        description: "Certifies knowledge of project management principles and practices.",
      },
    ],
    industryTrends: [
      "Digital Transformation",
      "Sustainability Consulting",
      "Agile Methodologies",
      "Data-Driven Consulting",
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Entrepreneur",
    category: "Business",
    description:
      "Create and run new businesses, taking on financial risks in the hope of profit, identifying market opportunities, securing resources, and building organizations from the ground up.",
    keySubjects: ["Business", "Economics", "Marketing", "Finance"],
    requiredGrades: {},
    minimumMeanGrade: "C",
    marketDemand: "Medium",
    jobProspects: ["Startups", "Small Businesses", "Franchises", "Social Enterprises", "Tech Companies"],
    salary: {
      entry: "10000",
      mid: "70000",
      senior: "Variable",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: ["Business Planning", "Financial Management", "Leadership", "Problem Solving", "Resilience"],
    careerPath: {
      entryLevel: {
        roles: ["Founder", "Small Business Owner"],
        experience: "0-3 years",
        description: "Launch and operate a small business, handling multiple functions from operations to sales.",
      },
      midLevel: {
        roles: ["Established Entrepreneur", "CEO of Growing Business"],
        experience: "4-7 years",
        description: "Scale business operations, build teams, and secure additional funding or resources.",
      },
      seniorLevel: {
        roles: ["Serial Entrepreneur", "Business Leader"],
        experience: "8-15 years",
        description:
          "Launch multiple successful ventures, mentor other entrepreneurs, and possibly invest in startups.",
      },
      executiveLevel: {
        roles: ["Angel Investor", "Venture Capitalist"],
        experience: "15+ years",
        description: "Fund and advise multiple businesses, serve on boards, and shape entrepreneurial ecosystems.",
      },
    },
    certifications: [
      {
        name: "Certified Entrepreneur",
        provider: "Entrepreneurship and Small Business Certification",
        description: "Validates knowledge of entrepreneurship principles and small business management.",
      },
    ],
    industryTrends: ["Lean Startup Methodology", "Social Entrepreneurship", "Digital Business Models", "Crowdfunding"],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: "Supply Chain Manager",
    category: "Business",
    description:
      "Oversee and coordinate all activities involved in sourcing, procurement, conversion, and logistics management, ensuring efficient flow of goods, services, and information from point of origin to consumption.",
    keySubjects: ["Business", "Logistics", "Operations Management", "Statistics"],
    requiredGrades: {},
    minimumMeanGrade: "B-",
    marketDemand: "High",
    jobProspects: [
      "Manufacturing Companies",
      "Retail Corporations",
      "Logistics Providers",
      "E-commerce",
      "Consulting Firms",
    ],
    salary: {
      entry: "45000",
      mid: "75000",
      senior: "120000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: ["Logistics Management", "Inventory Control", "Procurement", "Supplier Management", "Analytics"],
    careerPath: {
      entryLevel: {
        roles: ["Supply Chain Analyst", "Logistics Coordinator"],
        experience: "0-3 years",
        description: "Analyze supply chain data, coordinate shipments, and support procurement activities.",
      },
      midLevel: {
        roles: ["Supply Chain Manager", "Procurement Manager"],
        experience: "4-8 years",
        description:
          "Manage supply chain operations, develop supplier relationships, and implement process improvements.",
      },
      seniorLevel: {
        roles: ["Senior Supply Chain Manager", "Director of Operations"],
        experience: "8-15 years",
        description:
          "Set supply chain strategy, manage global operations, and lead continuous improvement initiatives.",
      },
      executiveLevel: {
        roles: ["Chief Supply Chain Officer", "VP of Operations"],
        experience: "15+ years",
        description: "Define supply chain vision, lead operations organization, and drive operational excellence.",
      },
    },
    certifications: [
      {
        name: "Certified Supply Chain Professional (CSCP)",
        provider: "Association for Supply Chain Management",
        description: "Validates expertise in supply chain management principles and practices.",
      },
      {
        name: "Certified Professional in Supply Management (CPSM)",
        provider: "Institute for Supply Management",
        description: "Certifies knowledge of procurement and supply management.",
      },
    ],
    industryTrends: [
      "Supply Chain Digitization",
      "Sustainable Supply Chains",
      "Blockchain in Logistics",
      "Predictive Analytics",
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  // FINANCE CAREERS
  {
    title: "Financial Analyst",
    category: "Finance",
    description:
      "Evaluate financial data, market trends, and investment opportunities to help businesses and individuals make informed investment decisions and develop financial strategies.",
    keySubjects: ["Finance", "Economics", "Accounting", "Statistics"],
    requiredGrades: {},
    minimumMeanGrade: "B",
    marketDemand: "High",
    jobProspects: [
      "Investment Banks",
      "Financial Services Firms",
      "Corporations",
      "Consulting Firms",
      "Government Agencies",
    ],
    salary: {
      entry: "50000",
      mid: "80000",
      senior: "120000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: ["Financial Modeling", "Data Analysis", "Financial Statement Analysis", "Valuation", "Excel"],
    careerPath: {
      entryLevel: {
        roles: ["Junior Financial Analyst", "Research Associate"],
        experience: "0-3 years",
        description: "Gather and analyze financial data, prepare reports, and support investment decisions.",
      },
      midLevel: {
        roles: ["Financial Analyst", "Investment Analyst"],
        experience: "4-7 years",
        description: "Develop financial models, conduct in-depth analysis, and make investment recommendations.",
      },
      seniorLevel: {
        roles: ["Senior Financial Analyst", "Portfolio Manager"],
        experience: "8-12 years",
        description: "Lead financial analysis teams, develop investment strategies, and manage client portfolios.",
      },
      executiveLevel: {
        roles: ["Director of Finance", "Chief Investment Officer"],
        experience: "12+ years",
        description: "Set financial strategy, oversee investment decisions, and lead financial organizations.",
      },
    },
    certifications: [
      {
        name: "Chartered Financial Analyst (CFA)",
        provider: "CFA Institute",
        description: "Validates expertise in investment analysis and portfolio management.",
      },
      {
        name: "Financial Risk Manager (FRM)",
        provider: "Global Association of Risk Professionals",
        description: "Certifies knowledge of financial risk management principles.",
      },
    ],
    industryTrends: ["Algorithmic Trading", "ESG Investing", "Alternative Data", "Fintech Integration"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Accountant",
    category: "Finance",
    description:
      "Prepare and examine financial records, ensuring accuracy and compliance with laws and regulations, while also providing financial advice to clients or organizations.",
    keySubjects: ["Accounting", "Finance", "Business", "Economics"],
    requiredGrades: {},
    minimumMeanGrade: "B-",
    marketDemand: "High",
    jobProspects: [
      "Accounting Firms",
      "Corporations",
      "Government Agencies",
      "Non-profit Organizations",
      "Financial Institutions",
    ],
    salary: {
      entry: "45000",
      mid: "70000",
      senior: "100000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: ["Financial Reporting", "Tax Preparation", "Auditing", "Bookkeeping", "Accounting Software"],
    careerPath: {
      entryLevel: {
        roles: ["Staff Accountant", "Junior Auditor"],
        experience: "0-3 years",
        description: "Prepare financial statements, assist with audits, and maintain accounting records.",
      },
      midLevel: {
        roles: ["Senior Accountant", "Audit Manager"],
        experience: "4-8 years",
        description: "Manage accounting functions, lead audits, and provide financial analysis.",
      },
      seniorLevel: {
        roles: ["Accounting Manager", "Controller"],
        experience: "8-15 years",
        description: "Oversee accounting departments, develop financial policies, and ensure regulatory compliance.",
      },
      executiveLevel: {
        roles: ["Chief Financial Officer", "Partner in Accounting Firm"],
        experience: "15+ years",
        description: "Set financial strategy, lead financial organizations, and make high-level financial decisions.",
      },
    },
    certifications: [
      {
        name: "Certified Public Accountant (CPA)",
        provider: "State Board of Accountancy",
        description: "Required license for accountants who file reports with the Securities and Exchange Commission.",
      },
      {
        name: "Certified Management Accountant (CMA)",
        provider: "Institute of Management Accountants",
        description: "Validates expertise in financial planning, analysis, and strategic management.",
      },
    ],
    industryTrends: ["Automation in Accounting", "Cloud Accounting", "Data Analytics", "Blockchain for Auditing"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Investment Banker",
    category: "Finance",
    description:
      "Assist organizations in raising capital, executing mergers and acquisitions, and providing financial advisory services to help clients achieve their strategic and financial objectives.",
    keySubjects: ["Finance", "Economics", "Accounting", "Mathematics"],
    requiredGrades: {},
    minimumMeanGrade: "A-",
    marketDemand: "Medium",
    jobProspects: [
      "Investment Banks",
      "Financial Institutions",
      "Private Equity Firms",
      "Hedge Funds",
      "Corporate Finance Departments",
    ],
    salary: {
      entry: "85000",
      mid: "150000",
      senior: "300000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years (often with MBA)",
    skillsRequired: ["Financial Modeling", "Valuation", "Deal Structuring", "Negotiation", "Client Management"],
    careerPath: {
      entryLevel: {
        roles: ["Analyst", "Associate"],
        experience: "0-4 years",
        description: "Build financial models, conduct company and industry research, and prepare client presentations.",
      },
      midLevel: {
        roles: ["Vice President", "Senior Associate"],
        experience: "5-8 years",
        description: "Lead deal execution, manage client relationships, and supervise junior bankers.",
      },
      seniorLevel: {
        roles: ["Director", "Executive Director"],
        experience: "9-12 years",
        description: "Originate deals, develop client strategies, and lead banking teams.",
      },
      executiveLevel: {
        roles: ["Managing Director", "Partner"],
        experience: "12+ years",
        description: "Set banking strategy, bring in major clients, and lead investment banking divisions.",
      },
    },
    certifications: [
      {
        name: "Chartered Financial Analyst (CFA)",
        provider: "CFA Institute",
        description: "Validates expertise in investment analysis and portfolio management.",
      },
      {
        name: "Series 79",
        provider: "Financial Industry Regulatory Authority",
        description: "Required license for investment banking representatives.",
      },
    ],
    industryTrends: ["Boutique Investment Banking", "Technology M&A", "SPACs", "ESG-Focused Deals"],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: "Actuary",
    category: "Finance",
    description:
      "Analyze financial costs of risk and uncertainty using mathematics, statistics, and financial theory to assess the risk of potential events and help businesses develop policies to minimize costs.",
    keySubjects: ["Mathematics", "Statistics", "Economics", "Finance"],
    requiredGrades: {},
    minimumMeanGrade: "A-",
    marketDemand: "High",
    jobProspects: [
      "Insurance Companies",
      "Consulting Firms",
      "Government Agencies",
      "Financial Institutions",
      "Healthcare Organizations",
    ],
    salary: {
      entry: "60000",
      mid: "100000",
      senior: "150000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: [
      "Statistical Analysis",
      "Risk Assessment",
      "Financial Modeling",
      "Probability Theory",
      "Programming",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Actuarial Analyst", "Actuarial Assistant"],
        experience: "0-3 years",
        description:
          "Analyze data, assist with actuarial calculations, and prepare reports while pursuing actuarial exams.",
      },
      midLevel: {
        roles: ["Actuary", "Pricing Actuary"],
        experience: "4-8 years",
        description: "Develop actuarial models, assess risks, and make pricing recommendations.",
      },
      seniorLevel: {
        roles: ["Senior Actuary", "Actuarial Manager"],
        experience: "8-15 years",
        description: "Lead actuarial teams, develop methodologies, and provide strategic risk management advice.",
      },
      executiveLevel: {
        roles: ["Chief Actuary", "Director of Actuarial Services"],
        experience: "15+ years",
        description: "Set actuarial strategy, oversee risk management, and lead actuarial organizations.",
      },
    },
    certifications: [
      {
        name: "Associate of the Society of Actuaries (ASA)",
        provider: "Society of Actuaries",
        description: "First level of professional certification for actuaries.",
      },
      {
        name: "Fellow of the Society of Actuaries (FSA)",
        provider: "Society of Actuaries",
        description: "Highest level of professional certification for actuaries.",
      },
    ],
    industryTrends: ["Predictive Analytics", "Catastrophe Modeling", "Insurtech", "Climate Risk Assessment"],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Financial Planner",
    category: "Finance",
    description:
      "Help individuals and families manage their finances, set financial goals, and develop comprehensive plans for investments, tax planning, retirement, and estate planning.",
    keySubjects: ["Finance", "Economics", "Accounting", "Psychology"],
    requiredGrades: {},
    minimumMeanGrade: "B-",
    marketDemand: "High",
    jobProspects: ["Financial Planning Firms", "Banks", "Insurance Companies", "Investment Firms", "Self-Employment"],
    salary: {
      entry: "40000",
      mid: "70000",
      senior: "120000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: [
      "Financial Analysis",
      "Investment Planning",
      "Tax Planning",
      "Client Relationship Management",
      "Communication",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Financial Planning Assistant", "Junior Financial Advisor"],
        experience: "0-3 years",
        description: "Support senior advisors, prepare financial plans, and assist with client meetings.",
      },
      midLevel: {
        roles: ["Financial Planner", "Financial Advisor"],
        experience: "4-8 years",
        description: "Develop comprehensive financial plans, manage client portfolios, and build client relationships.",
      },
      seniorLevel: {
        roles: ["Senior Financial Planner", "Wealth Manager"],
        experience: "8-15 years",
        description: "Manage high-net-worth clients, develop complex financial strategies, and lead planning teams.",
      },
      executiveLevel: {
        roles: ["Partner", "Practice Owner"],
        experience: "15+ years",
        description: "Own financial planning practices, set business strategy, and mentor other advisors.",
      },
    },
    certifications: [
      {
        name: "Certified Financial Planner (CFP)",
        provider: "Certified Financial Planner Board of Standards",
        description: "Validates expertise in comprehensive financial planning.",
      },
      {
        name: "Chartered Financial Consultant (ChFC)",
        provider: "American College of Financial Services",
        description: "Certifies knowledge of advanced financial planning concepts.",
      },
    ],
    industryTrends: ["Robo-Advisors", "Fee-Based Planning", "Holistic Financial Wellness", "Digital Client Engagement"],
    featured: false,
    views: 0,
    saves: 0,
  },

  // EDUCATION CAREERS
  {
    title: "Teacher",
    category: "Education",
    description:
      "Educate students in various subjects, develop lesson plans, assess student progress, and create a positive learning environment to foster intellectual and social development.",
    keySubjects: ["Education", "Psychology", "Subject Specialization"],
    requiredGrades: {},
    minimumMeanGrade: "B-",
    marketDemand: "High",
    jobProspects: [
      "Public Schools",
      "Private Schools",
      "International Schools",
      "Online Education Platforms",
      "Tutoring Services",
    ],
    salary: {
      entry: "30000",
      mid: "50000",
      senior: "75000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: ["Curriculum Development", "Classroom Management", "Assessment", "Communication", "Adaptability"],
    careerPath: {
      entryLevel: {
        roles: ["Teacher", "Teaching Assistant"],
        experience: "0-5 years",
        description: "Develop and deliver lessons, assess student learning, and manage classroom environments.",
      },
      midLevel: {
        roles: ["Lead Teacher", "Department Head"],
        experience: "6-10 years",
        description: "Mentor new teachers, develop curriculum, and lead subject departments.",
      },
      seniorLevel: {
        roles: ["Instructional Coach", "Curriculum Specialist"],
        experience: "11-15 years",
        description: "Design school-wide curriculum, train teachers, and implement educational initiatives.",
      },
      executiveLevel: {
        roles: ["Principal", "Education Director"],
        experience: "15+ years",
        description: "Lead educational institutions, set educational vision, and manage school operations.",
      },
    },
    certifications: [
      {
        name: "Teaching License/Certification",
        provider: "State Education Department",
        description: "Required credential to teach in public schools.",
      },
      {
        name: "National Board Certification",
        provider: "National Board for Professional Teaching Standards",
        description: "Advanced certification demonstrating accomplished teaching practice.",
      },
    ],
    industryTrends: [
      "Blended Learning",
      "Social-Emotional Learning",
      "Personalized Education",
      "Technology Integration",
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "School Counselor",
    category: "Education",
    description:
      "Support students' academic, social, and emotional development, helping them navigate educational and personal challenges while preparing for college and career success.",
    keySubjects: ["Psychology", "Counseling", "Education", "Sociology"],
    requiredGrades: {},
    minimumMeanGrade: "B",
    marketDemand: "Medium",
    jobProspects: ["Public Schools", "Private Schools", "Colleges", "Community Centers", "Youth Organizations"],
    salary: {
      entry: "40000",
      mid: "60000",
      senior: "80000",
    },
    institutions: [], // Will be populated later
    programDuration: "6 years (including Master's)",
    skillsRequired: ["Counseling Techniques", "Assessment", "Career Guidance", "Crisis Intervention", "Communication"],
    careerPath: {
      entryLevel: {
        roles: ["School Counselor", "Guidance Counselor"],
        experience: "0-5 years",
        description:
          "Provide individual and group counseling, support academic planning, and assist with college applications.",
      },
      midLevel: {
        roles: ["Lead Counselor", "Counseling Department Chair"],
        experience: "6-10 years",
        description: "Coordinate counseling programs, mentor new counselors, and develop counseling initiatives.",
      },
      seniorLevel: {
        roles: ["Director of Counseling", "Student Services Coordinator"],
        experience: "11-15 years",
        description:
          "Lead counseling departments, develop comprehensive guidance programs, and collaborate with school leadership.",
      },
      executiveLevel: {
        roles: ["District Counseling Supervisor", "Director of Student Services"],
        experience: "15+ years",
        description:
          "Set counseling vision for multiple schools, develop district-wide programs, and advocate for student support services.",
      },
    },
    certifications: [
      {
        name: "School Counselor Certification/License",
        provider: "State Education Department",
        description: "Required credential to work as a school counselor in public schools.",
      },
      {
        name: "National Certified Counselor (NCC)",
        provider: "National Board for Certified Counselors",
        description: "Validates expertise in counseling principles and practices.",
      },
    ],
    industryTrends: [
      "Trauma-Informed Counseling",
      "Virtual Counseling",
      "Data-Driven Interventions",
      "College and Career Readiness",
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "University Professor",
    category: "Education",
    description:
      "Teach courses in their area of expertise at the college level, conduct research, publish scholarly works, and contribute to their academic field while mentoring students.",
    keySubjects: ["Subject Specialization", "Research Methodology", "Education"],
    requiredGrades: {},
    minimumMeanGrade: "A-",
    marketDemand: "Medium",
    jobProspects: ["Universities", "Colleges", "Research Institutions", "Think Tanks", "Government Agencies"],
    salary: {
      entry: "60000",
      mid: "85000",
      senior: "130000",
    },
    institutions: [], // Will be populated later
    programDuration: "8-10 years (including PhD)",
    skillsRequired: ["Research", "Teaching", "Grant Writing", "Publishing", "Mentoring"],
    careerPath: {
      entryLevel: {
        roles: ["Assistant Professor", "Lecturer"],
        experience: "0-6 years",
        description: "Teach undergraduate courses, establish research agenda, and begin publishing scholarly work.",
      },
      midLevel: {
        roles: ["Associate Professor", "Research Professor"],
        experience: "7-12 years",
        description: "Teach graduate courses, secure research funding, and publish significant research.",
      },
      seniorLevel: {
        roles: ["Full Professor", "Department Chair"],
        experience: "13-20 years",
        description: "Lead academic departments, mentor junior faculty, and contribute major works to their field.",
      },
      executiveLevel: {
        roles: ["Dean", "Provost"],
        experience: "20+ years",
        description:
          "Set academic vision for colleges or universities, oversee multiple departments, and shape institutional policy.",
      },
    },
    certifications: [
      {
        name: "PhD in Subject Area",
        provider: "Accredited University",
        description: "Terminal degree required for most professor positions.",
      },
    ],
    industryTrends: [
      "Online Education",
      "Interdisciplinary Research",
      "Open Access Publishing",
      "Alternative Academic Careers",
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Educational Administrator",
    category: "Education",
    description:
      "Plan, direct, and coordinate educational activities in schools, colleges, or universities, overseeing curriculum, staff, budgets, and policies to ensure effective educational programs.",
    keySubjects: ["Education", "Administration", "Leadership", "Policy"],
    requiredGrades: {},
    minimumMeanGrade: "B",
    marketDemand: "Medium",
    jobProspects: ["Schools", "School Districts", "Colleges", "Universities", "Education Departments"],
    salary: {
      entry: "60000",
      mid: "90000",
      senior: "130000",
    },
    institutions: [], // Will be populated later
    programDuration: "6-8 years (including Master's)",
    skillsRequired: [
      "Leadership",
      "Budget Management",
      "Policy Development",
      "Staff Supervision",
      "Strategic Planning",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Assistant Principal", "Program Coordinator"],
        experience: "3-5 years",
        description: "Support school operations, supervise staff, and implement educational programs.",
      },
      midLevel: {
        roles: ["Principal", "Department Director"],
        experience: "6-10 years",
        description: "Lead educational institutions, develop school policies, and manage educational programs.",
      },
      seniorLevel: {
        roles: ["Superintendent", "Dean"],
        experience: "11-15 years",
        description:
          "Oversee multiple schools or college departments, set educational vision, and manage large budgets.",
      },
      executiveLevel: {
        roles: ["Chief Academic Officer", "University President"],
        experience: "15+ years",
        description:
          "Lead educational systems, shape educational policy, and manage complex educational organizations.",
      },
    },
    certifications: [
      {
        name: "Administrative License/Certification",
        provider: "State Education Department",
        description: "Required credential for school administrators in public schools.",
      },
      {
        name: "Superintendent Certification",
        provider: "State Education Department",
        description: "Required credential for district superintendents.",
      },
    ],
    industryTrends: [
      "Data-Driven Decision Making",
      "Equity-Focused Leadership",
      "Community Partnerships",
      "Digital Transformation",
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: "Special Education Teacher",
    category: "Education",
    description:
      "Work with students who have a wide range of learning, mental, emotional, and physical disabilities, adapting general education lessons and teaching various subjects to students with mild to moderate disabilities.",
    keySubjects: ["Special Education", "Psychology", "Child Development", "Education"],
    requiredGrades: {},
    minimumMeanGrade: "B-",
    marketDemand: "Very High",
    jobProspects: [
      "Public Schools",
      "Private Schools",
      "Special Education Centers",
      "Hospitals",
      "Residential Facilities",
    ],
    salary: {
      entry: "40000",
      mid: "60000",
      senior: "80000",
    },
    institutions: [], // Will be populated later
    programDuration: "4 years",
    skillsRequired: [
      "Individualized Education Plans",
      "Adaptive Teaching",
      "Behavior Management",
      "Assessment",
      "Collaboration",
    ],
    careerPath: {
      entryLevel: {
        roles: ["Special Education Teacher", "Resource Teacher"],
        experience: "0-5 years",
        description:
          "Develop and implement IEPs, adapt curriculum, and provide specialized instruction to students with disabilities.",
      },
      midLevel: {
        roles: ["Lead Special Education Teacher", "Special Education Coordinator"],
        experience: "6-10 years",
        description: "Coordinate special education programs, mentor new teachers, and develop specialized curriculum.",
      },
      seniorLevel: {
        roles: ["Special Education Specialist", "Program Director"],
        experience: "11-15 years",
        description:
          "Design district-wide special education initiatives, train teachers, and ensure compliance with regulations.",
      },
      executiveLevel: {
        roles: ["Director of Special Education", "Special Education Administrator"],
        experience: "15+ years",
        description:
          "Set special education vision, manage special education departments, and advocate for inclusive policies.",
      },
    },
    certifications: [
      {
        name: "Special Education Teaching License",
        provider: "State Education Department",
        description: "Required credential to teach special education in public schools.",
      },
      {
        name: "Board Certified Behavior Analyst (BCBA)",
        provider: "Behavior Analyst Certification Board",
        description: "Validates expertise in behavior analysis for students with behavioral challenges.",
      },
    ],
    industryTrends: [
      "Inclusive Education",
      "Assistive Technology",
      "Universal Design for Learning",
      "Positive Behavioral Interventions",
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
]

// --- Institution Data (Copied and augmented from seedInstitutions-3aNVwa9gZPAQW5Sz7vMB7ubimPvoPw.js) ---
// Added 'linkedCareerTitles' to programs for easier mapping during seeding
const institutionsData = [
  {
    name: "University of Nairobi",
    type: "University",
    location: {
      address: "University Way, Nairobi",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.2800945,
        longitude: 36.8219462,
      },
    },
    description:
      "The University of Nairobi (UoN), the oldest and largest university in Kenya, evolved from the Royal Technical College in 1956 and became an independent university in 1970, offering a wide range of academic programs across multiple campuses and colleges.",
    website: "https://www.uonbi.ac.ke/",
    contact: {
      email: "vc@uonbi.ac.ke",
      phone: "+254 20 4910000",
      socialMedia: {
        facebook: "https://www.facebook.com/uonbi.ac.ke/",
        twitter: "https://twitter.com/uonbi",
        instagram: "https://www.instagram.com/uonbi/",
        linkedin: "https://www.linkedin.com/school/university-of-nairobi/",
      },
    },
    programs: [
      {
        name: "Bachelor of Medicine and Bachelor of Surgery",
        level: "Bachelors",
        duration: "6 years",
        description: "A comprehensive medical program that prepares students for careers in medicine and surgery.",
        linkedCareerTitles: ["Medical Doctor"], // Added for seeding
        entryRequirements: {
          minimumGrade: "A-",
          specificSubjects: [
            { subject: "Biology", grade: "B+" },
            { subject: "Chemistry", grade: "B+" },
            { subject: "Mathematics", grade: "B" },
          ],
          additionalRequirements: ["KCSE Certificate", "Interview"],
        },
        tuitionFees: "KES 600,000 per year",
      },
      {
        name: "Bachelor of Science in Computer Science",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program that focuses on computer theory, computing problems and solutions, and design of computer systems.",
        linkedCareerTitles: [
          "Software Engineer",
          "Data Scientist",
          "Cybersecurity Analyst",
          "UX/UI Designer",
          "Cloud Solutions Architect",
        ], // Added for seeding
        entryRequirements: {
          minimumGrade: "B+",
          specificSubjects: [
            { subject: "Mathematics", grade: "B+" },
            { subject: "Physics", grade: "B" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 180,000 per year",
      },
    ],
    rankings: {
      national: 1,
      international: 950,
      year: 2024,
    },
    facilities: [
      "Libraries with ICT access",
      "Well-equipped teaching laboratories",
      "Studios for architecture and design",
      "TV rooms",
      "Sports facilities",
      "Student center",
      "Medical center",
    ],
    accreditation: ["Commission for University Education (CUE)"],
    establishedYear: 1970,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/xjwgjofdlxh4n89t6peo.gif",
    images: [
      "https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/sf14nmypznr0p3faevm0.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/uon_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/uon_library.jpg",
    ],
    featured: true,
    views: 2,
  },
  {
    name: "Kenyatta University",
    type: "University",
    location: {
      address: "Thika Road, Nairobi",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.1801,
        longitude: 36.9352,
      },
    },
    description:
      "Kenyatta University is one of the leading public research universities in Kenya, known for its strong programs in education, humanities, and sciences. The university has expanded significantly since its establishment and now offers a wide range of undergraduate and postgraduate programs.",
    website: "https://www.ku.ac.ke/",
    contact: {
      email: "info@ku.ac.ke",
      phone: "+254 20 8710901",
      socialMedia: {
        facebook: "https://www.facebook.com/KenyattaUniversity/",
        twitter: "https://twitter.com/KenyattaUni",
        instagram: "https://www.instagram.com/kenyattauniversity/",
      },
    },
    programs: [
      {
        name: "Bachelor of Education (Arts)",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program designed to prepare students for teaching careers in secondary schools, focusing on arts subjects.",
        linkedCareerTitles: ["Teacher", "School Counselor", "Educational Administrator"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [{ subject: "English", grade: "C+" }],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 120,000 per year",
      },
      {
        name: "Master of Business Administration",
        level: "Masters",
        duration: "2 years",
        description:
          "An advanced business program that prepares students for leadership roles in various organizations.",
        linkedCareerTitles: [
          "Marketing Manager",
          "Human Resources Manager",
          "Management Consultant",
          "Entrepreneur",
          "Supply Chain Manager",
          "Financial Analyst",
          "Accountant",
          "Investment Banker",
          "Actuary",
          "Financial Planner",
        ], // Added for seeding
        entryRequirements: {
          minimumGrade: "Second Class Upper Division",
          specificSubjects: [],
          additionalRequirements: ["Bachelor's Degree", "Work Experience (2 years preferred)"],
        },
        tuitionFees: "KES 250,000 per year",
      },
    ],
    rankings: {
      national: 2,
      international: 1200,
      year: 2024,
    },
    facilities: [
      "Modern library",
      "Computer labs",
      "Sports complex",
      "Student hostels",
      "Recreation center",
      "Health center",
      "Business incubation center",
    ],
    accreditation: ["Commission for University Education (CUE)"],
    establishedYear: 1985,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/ku_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/ku_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/ku_library.jpg",
    ],
    featured: true,
    views: 1,
  },
  {
    name: "Strathmore University",
    type: "University",
    location: {
      address: "Ole Sangale Road, Madaraka Estate",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.3106,
        longitude: 36.812,
      },
    },
    description:
      "Strathmore University is a leading private university in Kenya known for its excellence in business, IT, and law education. The university emphasizes ethical leadership, professional competence, and service to society.",
    website: "https://strathmore.edu/",
    contact: {
      email: "admissions@strathmore.edu",
      phone: "+254 703 034000",
      socialMedia: {
        facebook: "https://www.facebook.com/StrathmoreUniversity/",
        twitter: "https://twitter.com/StrathU",
        instagram: "https://www.instagram.com/strathmore_university/",
        linkedin: "https://www.linkedin.com/school/strathmore-university/",
      },
    },
    programs: [
      {
        name: "Bachelor of Business Science",
        level: "Bachelors",
        duration: "4 years",
        description: "A rigorous program that combines business theory with mathematical and statistical analysis.",
        linkedCareerTitles: [
          "Financial Analyst",
          "Accountant",
          "Management Consultant",
          "Entrepreneur",
          "Supply Chain Manager",
        ], // Added for seeding
        entryRequirements: {
          minimumGrade: "B+",
          specificSubjects: [{ subject: "Mathematics", grade: "B+" }],
          additionalRequirements: ["KCSE Certificate", "Entrance Exam", "Interview"],
        },
        tuitionFees: "KES 500,000 per year",
      },
      {
        name: "Bachelor of Laws (LLB)",
        level: "Bachelors",
        duration: "4 years",
        description: "A comprehensive legal education program that prepares students for careers in law.",
        linkedCareerTitles: ["Investment Banker", "Management Consultant"], // Added for seeding (assuming law can lead to these)
        entryRequirements: {
          minimumGrade: "A-",
          specificSubjects: [{ subject: "English", grade: "B+" }],
          additionalRequirements: ["KCSE Certificate", "Entrance Exam", "Interview"],
        },
        tuitionFees: "KES 550,000 per year",
      },
    ],
    rankings: {
      national: 3,
      international: 1500,
      year: 2024,
    },
    facilities: [
      "Modern library",
      "Computer labs",
      "Moot court",
      "Sports facilities",
      "Student center",
      "Cafeteria",
      "Innovation center",
    ],
    accreditation: ["Commission for University Education (CUE)"],
    establishedYear: 1961,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/strathmore_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/strathmore_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/strathmore_library.jpg",
    ],
    featured: true,
    views: 3,
  },
  {
    name: "Jomo Kenyatta University of Agriculture and Technology",
    type: "University",
    location: {
      address: "Thika Road, Juja",
      city: "Juja",
      county: "Kiambu",
      country: "Kenya",
      coordinates: {
        latitude: -1.0918,
        longitude: 37.0144,
      },
    },
    description:
      "JKUAT is a public university focused on agriculture, engineering, technology, and science education. The university is known for its strong emphasis on research and innovation in these fields.",
    website: "https://www.jkuat.ac.ke/",
    contact: {
      email: "info@jkuat.ac.ke",
      phone: "+254 67 5870001",
      socialMedia: {
        facebook: "https://www.facebook.com/JKUAT/",
        twitter: "https://twitter.com/JKUATOfficial",
      },
    },
    programs: [
      {
        name: "Bachelor of Science in Civil Engineering",
        level: "Bachelors",
        duration: "5 years",
        description:
          "A program that prepares students for careers in civil engineering, focusing on design, construction, and maintenance of infrastructure.",
        linkedCareerTitles: ["Civil Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "B+",
          specificSubjects: [
            { subject: "Mathematics", grade: "B+" },
            { subject: "Physics", grade: "B+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 180,000 per year",
      },
      {
        name: "Bachelor of Science in Agriculture",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program that focuses on agricultural science and technology, preparing students for careers in farming, agribusiness, and agricultural research.",
        linkedCareerTitles: ["Chemical Engineer"], // Added for seeding (assuming some overlap)
        entryRequirements: {
          minimumGrade: "B",
          specificSubjects: [
            { subject: "Biology", grade: "B" },
            { subject: "Chemistry", grade: "B" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 160,000 per year",
      },
    ],
    rankings: {
      national: 4,
      international: 1800,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Agricultural demonstration farms",
      "Research laboratories",
      "Library",
      "Computer labs",
      "Sports facilities",
      "Student hostels",
    ],
    accreditation: ["Commission for University Education (CUE)", "Engineers Board of Kenya (EBK)"],
    establishedYear: 1994,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/jkuat_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/jkuat_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/jkuat_engineering.jpg",
    ],
    featured: true,
    views: 1,
  },
  {
    name: "Moi University",
    type: "University",
    location: {
      address: "Eldoret-Nakuru Highway",
      city: "Eldoret",
      county: "Uasin Gishu",
      country: "Kenya",
      coordinates: {
        latitude: 0.5118,
        longitude: 35.2698,
      },
    },
    description:
      "Moi University is a public university established in 1984 as the second public university in Kenya. It offers a wide range of programs across various disciplines and has multiple campuses across the country.",
    website: "https://www.mu.ac.ke/",
    contact: {
      email: "info@mu.ac.ke",
      phone: "+254 53 2211000",
      socialMedia: {
        facebook: "https://www.facebook.com/MoiUniversity/",
        twitter: "https://twitter.com/Moi_University",
      },
    },
    programs: [
      {
        name: "Bachelor of Education (Science)",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program designed to prepare students for teaching careers in secondary schools, focusing on science subjects.",
        linkedCareerTitles: ["Teacher", "Special Education Teacher", "University Professor"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [
            { subject: "Mathematics", grade: "C+" },
            { subject: "Biology/Physics/Chemistry", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 120,000 per year",
      },
      {
        name: "Bachelor of Tourism Management",
        level: "Bachelors",
        duration: "4 years",
        description: "A program that prepares students for careers in the tourism and hospitality industry.",
        linkedCareerTitles: ["Marketing Manager", "Management Consultant"], // Added for seeding (general business relevance)
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 130,000 per year",
      },
    ],
    rankings: {
      national: 5,
      international: 2000,
      year: 2024,
    },
    facilities: [
      "Library",
      "Computer labs",
      "Sports facilities",
      "Student hostels",
      "Health center",
      "Recreation center",
    ],
    accreditation: ["Commission for University Education (CUE)"],
    establishedYear: 1984,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/moi_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/moi_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/moi_library.jpg",
    ],
    featured: false,
    views: 0,
  },
  {
    name: "Kenya Medical Training College",
    type: "College",
    location: {
      address: "Off Ngong Road",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.2999,
        longitude: 36.8057,
      },
    },
    description:
      "Kenya Medical Training College (KMTC) is a state corporation established in 1927 and is the leading medical training institution in Kenya with over 70 campuses across the country. KMTC offers training in various medical and paramedical fields.",
    website: "https://www.kmtc.ac.ke/",
    contact: {
      email: "info@kmtc.ac.ke",
      phone: "+254 20 2725711",
      socialMedia: {
        facebook: "https://www.facebook.com/KMTCofficial/",
        twitter: "https://twitter.com/Kmtc_official",
      },
    },
    programs: [
      {
        name: "Diploma in Clinical Medicine and Surgery",
        level: "Diploma",
        duration: "3 years",
        description:
          "A program that trains clinical officers who provide primary healthcare services in various healthcare settings.",
        linkedCareerTitles: ["Medical Doctor", "Registered Nurse"], // Added for seeding (related fields)
        entryRequirements: {
          minimumGrade: "C",
          specificSubjects: [
            { subject: "Biology", grade: "C+" },
            { subject: "Chemistry", grade: "C+" },
            { subject: "English/Kiswahili", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 92,000 per year",
      },
      {
        name: "Diploma in Nursing",
        level: "Diploma",
        duration: "3.5 years",
        description:
          "A program that trains nurses to provide comprehensive nursing care in various healthcare settings.",
        linkedCareerTitles: ["Registered Nurse"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C",
          specificSubjects: [
            { subject: "Biology", grade: "C+" },
            { subject: "Chemistry/Physics", grade: "C+" },
            { subject: "English/Kiswahili", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 90,000 per year",
      },
    ],
    rankings: {
      national: 1,
      international: null,
      year: 2024,
    },
    facilities: [
      "Skills laboratories",
      "Library",
      "Computer labs",
      "Student hostels",
      "Recreation facilities",
      "Demonstration rooms",
    ],
    accreditation: ["Ministry of Health", "Nursing Council of Kenya", "Clinical Officers Council"],
    establishedYear: 1927,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/kmtc_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/kmtc_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/kmtc_lab.jpg",
    ],
    featured: true,
    views: 5,
  },
  {
    name: "Technical University of Kenya",
    type: "University",
    location: {
      address: "Haile Selassie Avenue",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.2921,
        longitude: 36.8219,
      },
    },
    description:
      "The Technical University of Kenya (TU-K) evolved from the Kenya Polytechnic and was chartered as a university in 2013. It focuses on technical and vocational education, offering programs in engineering, applied sciences, and technology.",
    website: "https://www.tukenya.ac.ke/",
    contact: {
      email: "info@tukenya.ac.ke",
      phone: "+254 20 2219929",
      socialMedia: {
        facebook: "https://www.facebook.com/TechnicalUniversityofKenya/",
        twitter: "https://twitter.com/TU_Kenya",
      },
    },
    programs: [
      {
        name: "Bachelor of Technology in Mechanical Engineering",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program that focuses on the design, development, and maintenance of mechanical systems and equipment.",
        linkedCareerTitles: ["Mechanical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [
            { subject: "Mathematics", grade: "C+" },
            { subject: "Physics", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 150,000 per year",
      },
      {
        name: "Diploma in Information Technology",
        level: "Diploma",
        duration: "2 years",
        description: "A program that provides students with skills in computer systems, programming, and IT support.",
        linkedCareerTitles: ["Software Engineer", "Cybersecurity Analyst"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [{ subject: "Mathematics", grade: "D+" }],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 80,000 per year",
      },
    ],
    rankings: {
      national: 8,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Computer labs",
      "Library",
      "Student center",
      "Sports facilities",
      "Auditorium",
    ],
    accreditation: ["Commission for University Education (CUE)", "Engineers Board of Kenya (EBK)"],
    establishedYear: 2013,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/tuk_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/tuk_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/tuk_workshop.jpg",
    ],
    featured: false,
    views: 0,
  },
  {
    name: "Kenya Institute of Management",
    type: "College",
    location: {
      address: "Mara Road, Upper Hill",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.2964,
        longitude: 36.8101,
      },
    },
    description:
      "Kenya Institute of Management (KIM) is a leading management development institution that offers training, research, and consultancy services. It focuses on business and management education at certificate, diploma, and degree levels.",
    website: "https://www.kim.ac.ke/",
    contact: {
      email: "info@kim.ac.ke",
      phone: "+254 20 2714054",
      socialMedia: {
        facebook: "https://www.facebook.com/KenyaInstituteofManagement/",
        twitter: "https://twitter.com/KIMKenya",
      },
    },
    programs: [
      {
        name: "Diploma in Business Management",
        level: "Diploma",
        duration: "2 years",
        description:
          "A program that provides students with knowledge and skills in business management, marketing, and entrepreneurship.",
        linkedCareerTitles: [
          "Marketing Manager",
          "Human Resources Manager",
          "Management Consultant",
          "Entrepreneur",
          "Supply Chain Manager",
        ], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 85,000 per year",
      },
      {
        name: "Certificate in Project Management",
        level: "Certificate",
        duration: "6 months",
        description: "A short program that equips students with skills in project planning, execution, and monitoring.",
        linkedCareerTitles: ["Management Consultant", "Supply Chain Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 45,000",
      },
    ],
    rankings: {
      national: 2,
      international: null,
      year: 2024,
    },
    facilities: ["Computer labs", "Library", "Conference rooms", "Student lounge", "Cafeteria"],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)"],
    establishedYear: 1954,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/kim_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/kim_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/kim_library.jpg",
    ],
    featured: false,
    views: 0,
  },
  {
    name: "Maseno University",
    type: "University",
    location: {
      address: "Kisumu-Busia Road",
      city: "Kisumu",
      county: "Kisumu",
      country: "Kenya",
      coordinates: {
        latitude: -0.0075,
        longitude: 34.5997,
      },
    },
    description:
      "Maseno University is a public university located at the equator in western Kenya. It offers a wide range of programs in arts, sciences, education, and business, and is known for its strong programs in education and health sciences.",
    website: "https://www.maseno.ac.ke/",
    contact: {
      email: "info@maseno.ac.ke",
      phone: "+254 57 2351620",
      socialMedia: {
        facebook: "https://www.facebook.com/MasenoUniversity/",
        twitter: "https://twitter.com/MasenoUni",
      },
    },
    programs: [
      {
        name: "Bachelor of Education (Arts)",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program that prepares students for teaching careers in secondary schools, focusing on arts subjects.",
        linkedCareerTitles: ["Teacher", "School Counselor", "Educational Administrator"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [{ subject: "English", grade: "C+" }],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 120,000 per year",
      },
      {
        name: "Bachelor of Science in Nursing",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program that prepares students for careers in nursing, focusing on patient care, health promotion, and disease prevention.",
        linkedCareerTitles: ["Registered Nurse"], // Added for seeding
        entryRequirements: {
          minimumGrade: "B-",
          specificSubjects: [
            { subject: "Biology", grade: "B-" },
            { subject: "Chemistry", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 150,000 per year",
      },
    ],
    rankings: {
      national: 6,
      international: 2200,
      year: 2024,
    },
    facilities: [
      "Library",
      "Computer labs",
      "Science laboratories",
      "Student hostels",
      "Sports facilities",
      "Health center",
    ],
    accreditation: ["Commission for University Education (CUE)"],
    establishedYear: 1991,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/maseno_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/maseno_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/maseno_library.jpg",
    ],
    featured: false,
    views: 0,
  },
  {
    name: "Egerton University",
    type: "University",
    location: {
      address: "Njoro",
      city: "Nakuru",
      county: "Nakuru",
      country: "Kenya",
      coordinates: {
        latitude: -0.3667,
        longitude: 35.9333,
      },
    },
    description:
      "Egerton University is one of the oldest institutions of higher learning in Kenya, established in 1939 as a farm school. It has grown to become a leading agricultural university in East Africa, offering programs in agriculture, natural resources, and related fields.",
    website: "https://www.egerton.ac.ke/",
    contact: {
      email: "info@egerton.ac.ke",
      phone: "+254 51 2217781",
      socialMedia: {
        facebook: "https://www.facebook.com/EgertonUniversity/",
        twitter: "https://twitter.com/EgertonUni",
      },
    },
    programs: [
      {
        name: "Bachelor of Science in Agricultural Economics",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program that combines agricultural science with economics, preparing students for careers in agricultural policy, agribusiness, and rural development.",
        linkedCareerTitles: ["Supply Chain Manager", "Financial Analyst"], // Added for seeding (business/economics relevance)
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [{ subject: "Mathematics", grade: "C+" }],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 130,000 per year",
      },
      {
        name: "Bachelor of Science in Animal Science",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program that focuses on the scientific principles of animal production, health, and management.",
        linkedCareerTitles: ["Medical Doctor", "Registered Nurse"], // Added for seeding (general science/health relevance)
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [
            { subject: "Biology", grade: "C+" },
            { subject: "Chemistry", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 130,000 per year",
      },
    ],
    rankings: {
      national: 7,
      international: 2300,
      year: 2024,
    },
    facilities: [
      "Agricultural demonstration farms",
      "Research laboratories",
      "Library",
      "Computer labs",
      "Student hostels",
      "Sports facilities",
      "Health center",
    ],
    accreditation: ["Commission for University Education (CUE)"],
    establishedYear: 1987,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/egerton_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/egerton_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/egerton_farm.jpg",
    ],
    featured: false,
    views: 0,
  },
  {
    name: "Kenya School of Law",
    type: "College",
    location: {
      address: "Karen",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.3333,
        longitude: 36.7167,
      },
    },
    description:
      "The Kenya School of Law (KSL) is a postgraduate law school that provides professional legal training for law graduates preparing to be admitted to the Kenyan bar. It is the only institution authorized to offer the Advocates Training Program in Kenya.",
    website: "https://www.ksl.ac.ke/",
    contact: {
      email: "info@ksl.ac.ke",
      phone: "+254 20 2020836",
      socialMedia: {
        facebook: "https://www.facebook.com/KenyaSchoolofLaw/",
        twitter: "https://twitter.com/KSL_Kenya",
      },
    },
    programs: [
      {
        name: "Advocates Training Program",
        level: "Certificate",
        duration: "1 year",
        description:
          "A mandatory program for law graduates seeking admission to the bar as advocates of the High Court of Kenya.",
        linkedCareerTitles: ["Investment Banker", "Management Consultant"], // Added for seeding (law-related business careers)
        entryRequirements: {
          minimumGrade: "Second Class Upper Division",
          specificSubjects: [],
          additionalRequirements: ["Bachelor of Laws (LLB) Degree", "Council of Legal Education Exam"],
        },
        tuitionFees: "KES 180,000",
      },
      {
        name: "Paralegal Training Program",
        level: "Certificate",
        duration: "6 months",
        description:
          "A program that trains paralegals to assist lawyers in legal research, document preparation, and client management.",
        linkedCareerTitles: ["Human Resources Manager"], // Added for seeding (general administrative/support roles)
        entryRequirements: {
          minimumGrade: "C",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 60,000",
      },
    ],
    rankings: {
      national: 1,
      international: null,
      year: 2024,
    },
    facilities: ["Law library", "Moot court", "Computer labs", "Student hostels", "Conference center", "Cafeteria"],
    accreditation: ["Council of Legal Education"],
    establishedYear: 1963,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/ksl_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/ksl_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/ksl_moot_court.jpg",
    ],
    featured: false,
    views: 0,
  },
  {
    name: "Technical University of Mombasa",
    type: "University",
    location: {
      address: "Tom Mboya Street",
      city: "Mombasa",
      county: "Mombasa",
      country: "Kenya",
      coordinates: {
        latitude: -4.0435,
        longitude: 39.6682,
      },
    },
    description:
      "Technical University of Mombasa (TUM) is a public technical university located in the coastal city of Mombasa. It evolved from Mombasa Technical Institute and focuses on technical education in engineering, maritime studies, and applied sciences.",
    website: "https://www.tum.ac.ke/",
    contact: {
      email: "info@tum.ac.ke",
      phone: "+254 41 2492222",
      socialMedia: {
        facebook: "https://www.facebook.com/TechnicalUniversityofMombasa/",
        twitter: "https://twitter.com/TUM_Kenya",
      },
    },
    programs: [
      {
        name: "Bachelor of Engineering in Marine Engineering",
        level: "Bachelors",
        duration: "5 years",
        description:
          "A program that focuses on the design, operation, and maintenance of marine vessels and their propulsion systems.",
        linkedCareerTitles: ["Mechanical Engineer", "Electrical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [
            { subject: "Mathematics", grade: "C+" },
            { subject: "Physics", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 150,000 per year",
      },
      {
        name: "Diploma in Building and Construction",
        level: "Diploma",
        duration: "3 years",
        description:
          "A program that provides students with skills in building construction, project management, and quantity surveying.",
        linkedCareerTitles: ["Civil Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [{ subject: "Mathematics", grade: "D+" }],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 90,000 per year",
      },
    ],
    rankings: {
      national: 12,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Maritime training center",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: ["Commission for University Education (CUE)", "Engineers Board of Kenya (EBK)"],
    establishedYear: 2013,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/tum_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/tum_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/tum_workshop.jpg",
    ],
    featured: false,
    views: 0,
  },
  {
    name: "Rift Valley Institute of Science and Technology",
    type: "Technical Institute",
    location: {
      address: "Nakuru-Eldoret Highway",
      city: "Nakuru",
      county: "Nakuru",
      country: "Kenya",
      coordinates: {
        latitude: -0.2833,
        longitude: 36.0667,
      },
    },
    description:
      "Rift Valley Institute of Science and Technology (RVIST) is a technical and vocational education institution that offers training in various technical fields, including engineering, business, and hospitality.",
    website: "https://www.rvist.ac.ke/",
    contact: {
      email: "info@rvist.ac.ke",
      phone: "+254 51 2215813",
      socialMedia: {
        facebook: "https://www.facebook.com/RVIST/",
      },
    },
    programs: [
      {
        name: "Diploma in Electrical and Electronic Engineering",
        level: "Diploma",
        duration: "3 years",
        description:
          "A program that provides students with skills in electrical installation, electronic systems, and power systems.",
        linkedCareerTitles: ["Electrical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [
            { subject: "Mathematics", grade: "D+" },
            { subject: "Physics", grade: "D+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 85,000 per year",
      },
      {
        name: "Certificate in Food and Beverage Production",
        level: "Certificate",
        duration: "1 year",
        description: "A program that trains students in culinary arts, food preparation, and kitchen management.",
        linkedCareerTitles: ["Supply Chain Manager"], // Added for seeding (food industry relevance)
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 50,000",
      },
    ],
    rankings: {
      national: 3,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Computer labs",
      "Training kitchen",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)"],
    establishedYear: 1974,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/rvist_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/rvist_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/rvist_workshop.jpg",
    ],
    featured: false,
    views: 0,
  },
  {
    name: "Nairobi Institute of Business Studies",
    type: "College",
    location: {
      address: "Ruiru-Kiambu Road",
      city: "Ruiru",
      county: "Kiambu",
      country: "Kenya",
      coordinates: {
        latitude: -1.1833,
        longitude: 36.9667,
      },
    },
    description:
      "Nairobi Institute of Business Studies (NIBS) is a private business college that offers training in business, ICT, and media studies. It is known for its practical approach to education and industry connections.",
    website: "https://www.nibs.ac.ke/",
    contact: {
      email: "info@nibs.ac.ke",
      phone: "+254 20 2088310",
      socialMedia: {
        facebook: "https://www.facebook.com/NIBSKenya/",
        twitter: "https://twitter.com/NIBSKenya",
        instagram: "https://www.instagram.com/nibskenya/",
      },
    },
    programs: [
      {
        name: "Diploma in Business Management",
        level: "Diploma",
        duration: "2 years",
        description:
          "A program that provides students with knowledge and skills in business management, marketing, and entrepreneurship.",
        linkedCareerTitles: [
          "Marketing Manager",
          "Human Resources Manager",
          "Management Consultant",
          "Entrepreneur",
          "Supply Chain Manager",
        ], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 90,000 per year",
      },
      {
        name: "Certificate in Journalism and Mass Communication",
        level: "Certificate",
        duration: "1 year",
        description: "A program that trains students in news reporting, media production, and communication skills.",
        linkedCareerTitles: ["Marketing Manager"], // Added for seeding (media/marketing relevance)
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [{ subject: "English", grade: "C-" }],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 60,000",
      },
    ],
    rankings: {
      national: 5,
      international: null,
      year: 2024,
    },
    facilities: ["Computer labs", "Media studio", "Library", "Student hostels", "Cafeteria", "Sports facilities"],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)"],
    establishedYear: 2000,
    logo: "https://res.cloudinary.com/example/image/upload/institutions/nibs_logo.png",
    images: [
      "https://res.cloudinary.com/example/image/upload/institutions/nibs_campus.jpg",
      "https://res.cloudinary.com/example/image/upload/institutions/nibs_lab.jpg",
    ],
    featured: false,
    views: 0,
  },
  {
    name: "Dedan Kimathi University of Technology",
    type: "University",
    location: {
      address: "Nyeri-Mweiga Road",
      city: "Nyeri",
      county: "Nyeri",
      country: "Kenya",
      coordinates: {
        latitude: -0.3981,
        longitude: 36.9628,
      },
    },
    description:
      "Dedan Kimathi University of Technology (DeKUT) is a public technological university located in Nyeri County. The university focuses on science, technology, engineering, and mathematics (STEM) education and is known for its strong programs in engineering and computer science.",
    website: "https://www.dkut.ac.ke/",
    contact: {
      email: "info@dkut.ac.ke",
      phone: "+254 713 835 965",
      socialMedia: {
        facebook: "https://www.facebook.com/DeKUTKenya/",
        twitter: "https://twitter.com/DeKUTKenya",
        instagram: "https://www.instagram.com/dekutkenya/",
        linkedin: "https://www.linkedin.com/school/dedan-kimathi-university-of-technology/",
      },
    },
    programs: [
      {
        name: "Bachelor of Science in Mechatronic Engineering",
        level: "Bachelors",
        duration: "5 years",
        description:
          "A program that integrates mechanical, electronic, and computer engineering to design and develop automated systems and robotics.",
        linkedCareerTitles: ["Mechanical Engineer", "Electrical Engineer", "Software Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "B+",
          specificSubjects: [
            { subject: "Mathematics", grade: "B+" },
            { subject: "Physics", grade: "B+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 180,000 per year",
      },
      {
        name: "Bachelor of Science in Leather Technology",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A specialized program focusing on leather processing, product development, and quality control in the leather industry.",
        linkedCareerTitles: ["Chemical Engineer", "Supply Chain Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "B-",
          specificSubjects: [
            { subject: "Chemistry", grade: "C+" },
            { subject: "Biology/Physics", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 150,000 per year",
      },
    ],
    rankings: {
      national: 9,
      international: 2800,
      year: 2024,
    },
    facilities: [
      "Engineering laboratories",
      "Computer labs",
      "Innovation hub",
      "Library",
      "Student hostels",
      "Sports facilities",
      "Coffee technology center",
    ],
    accreditation: ["Commission for University Education (CUE)", "Engineers Board of Kenya (EBK)"],
    establishedYear: 2012,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/dekut_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/dekut_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Mount Kenya University",
    type: "University",
    location: {
      address: "General Kago Road",
      city: "Thika",
      county: "Kiambu",
      country: "Kenya",
      coordinates: {
        latitude: -1.0396,
        longitude: 37.09,
      },
    },
    description:
      "Mount Kenya University (MKU) is one of the largest private universities in Kenya with multiple campuses across the country and in neighboring countries. The university offers a wide range of programs in health sciences, business, education, and technology.",
    website: "https://www.mku.ac.ke/",
    contact: {
      email: "info@mku.ac.ke",
      phone: "+254 709 153 000",
      socialMedia: {
        facebook: "https://www.facebook.com/MountKenyaUniversity/",
        twitter: "https://twitter.com/MountKenyaUni",
        instagram: "https://www.instagram.com/mountkenyauniversity/",
        linkedin: "https://www.linkedin.com/school/mount-kenya-university/",
      },
    },
    programs: [
      {
        name: "Bachelor of Pharmacy",
        level: "Bachelors",
        duration: "5 years",
        description:
          "A program that prepares students for careers in pharmacy, focusing on drug development, dispensing, and patient care.",
        linkedCareerTitles: ["Pharmacist"], // Added for seeding
        entryRequirements: {
          minimumGrade: "B",
          specificSubjects: [
            { subject: "Chemistry", grade: "B" },
            { subject: "Biology", grade: "B" },
            { subject: "Mathematics/Physics", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate", "Interview"],
        },
        tuitionFees: "KES 220,000 per year",
      },
      {
        name: "Bachelor of Science in Nursing",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program that prepares students for careers in nursing, focusing on patient care, health promotion, and disease prevention.",
        linkedCareerTitles: ["Registered Nurse"], // Added for seeding
        entryRequirements: {
          minimumGrade: "B-",
          specificSubjects: [
            { subject: "Biology", grade: "B-" },
            { subject: "Chemistry", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate", "Interview"],
        },
        tuitionFees: "KES 180,000 per year",
      },
    ],
    rankings: {
      national: 10,
      international: 3000,
      year: 2024,
    },
    facilities: [
      "Health sciences laboratories",
      "Teaching hospital",
      "Library",
      "Computer labs",
      "Student hostels",
      "Sports facilities",
      "Recreation center",
    ],
    accreditation: [
      "Commission for University Education (CUE)",
      "Pharmacy and Poisons Board",
      "Nursing Council of Kenya",
    ],
    establishedYear: 2008,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/mku_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/mku_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "United States International University - Africa",
    type: "University",
    location: {
      address: "Thika Road, Kasarani",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.2178,
        longitude: 36.8844,
      },
    },
    description:
      "United States International University - Africa (USIU-Africa) is a private university that offers American-style education in Kenya. The university has a diverse student body from over 70 countries and focuses on global education, leadership, and entrepreneurship.",
    website: "https://www.usiu.ac.ke/",
    contact: {
      email: "admissions@usiu.ac.ke",
      phone: "+254 730 116 000",
      socialMedia: {
        facebook: "https://www.facebook.com/USIU.Africa/",
        twitter: "https://twitter.com/USIU_Africa",
        instagram: "https://www.instagram.com/usiuafrica/",
        linkedin: "https://www.linkedin.com/school/usiu-africa/",
      },
    },
    programs: [
      {
        name: "Bachelor of Science in International Business Administration",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program that prepares students for careers in global business, focusing on international trade, finance, and management.",
        linkedCareerTitles: [
          "Marketing Manager",
          "Human Resources Manager",
          "Management Consultant",
          "Entrepreneur",
          "Supply Chain Manager",
          "Financial Analyst",
          "Accountant",
          "Investment Banker",
          "Actuary",
          "Financial Planner",
        ], // Added for seeding
        entryRequirements: {
          minimumGrade: "B",
          specificSubjects: [
            { subject: "Mathematics", grade: "B-" },
            { subject: "English", grade: "B-" },
          ],
          additionalRequirements: ["KCSE Certificate", "SAT/ACT Scores (for international students)"],
        },
        tuitionFees: "KES 450,000 per year",
      },
      {
        name: "Master of Science in Information Systems and Technology",
        level: "Masters",
        duration: "2 years",
        description:
          "An advanced program focusing on information systems management, cybersecurity, and digital transformation.",
        linkedCareerTitles: [
          "Software Engineer",
          "Data Scientist",
          "Cybersecurity Analyst",
          "Cloud Solutions Architect",
        ], // Added for seeding
        entryRequirements: {
          minimumGrade: "Second Class Upper Division",
          specificSubjects: [],
          additionalRequirements: ["Bachelor's Degree in IT or related field", "Work experience preferred"],
        },
        tuitionFees: "KES 550,000 per year",
      },
    ],
    rankings: {
      national: 8,
      international: 2500,
      year: 2024,
    },
    facilities: [
      "Modern library",
      "Computer labs",
      "Business incubation center",
      "Student center",
      "Sports complex",
      "Auditorium",
      "Media studio",
    ],
    accreditation: ["Commission for University Education (CUE)", "WASC Senior College and University Commission (USA)"],
    establishedYear: 1969,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/usiu_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/usiu_campus.jpg"],
    featured: true,
    views: 2,
  },
  {
    name: "Multimedia University of Kenya",
    type: "University",
    location: {
      address: "Magadi Road",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.3667,
        longitude: 36.7333,
      },
    },
    description:
      "Multimedia University of Kenya (MMU) evolved from the Kenya College of Communications Technology and specializes in media, communication, and information technology education. The university is known for its strong programs in journalism, film, and multimedia production.",
    website: "https://www.mmu.ac.ke/",
    contact: {
      email: "info@mmu.ac.ke",
      phone: "+254 20 2071391",
      socialMedia: {
        facebook: "https://www.facebook.com/MultimediaUniversityofKenya/",
        twitter: "https://twitter.com/MMU_Kenya",
      },
    },
    programs: [
      {
        name: "Bachelor of Science in Film and Animation",
        level: "Bachelors",
        duration: "4 years",
        description: "A program that focuses on film production, animation techniques, and visual storytelling.",
        linkedCareerTitles: ["UX/UI Designer", "Marketing Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate", "Portfolio submission"],
        },
        tuitionFees: "KES 140,000 per year",
      },
      {
        name: "Bachelor of Science in Software Engineering",
        level: "Bachelors",
        duration: "4 years",
        description: "A program that focuses on software development, programming, and systems design.",
        linkedCareerTitles: ["Software Engineer", "Data Scientist", "Cybersecurity Analyst"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [
            { subject: "Mathematics", grade: "C+" },
            { subject: "Physics", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 150,000 per year",
      },
    ],
    rankings: {
      national: 15,
      international: null,
      year: 2024,
    },
    facilities: ["Media studios", "Computer labs", "Library", "Student hostels", "Sports facilities", "Auditorium"],
    accreditation: ["Commission for University Education (CUE)"],
    establishedYear: 2013,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/mmu_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/mmu_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Kabarak University",
    type: "University",
    location: {
      address: "Nakuru-Eldama Ravine Road",
      city: "Nakuru",
      county: "Nakuru",
      country: "Kenya",
      coordinates: {
        latitude: 0.0167,
        longitude: 35.9667,
      },
    },
    description:
      "Kabarak University is a private Christian university founded by former President Daniel Arap Moi. The university offers programs in business, education, law, and health sciences, with a strong emphasis on Christian values and ethics.",
    website: "https://www.kabarak.ac.ke/",
    contact: {
      email: "info@kabarak.ac.ke",
      phone: "+254 51 343234",
      socialMedia: {
        facebook: "https://www.facebook.com/KabarakUniversity/",
        twitter: "https://twitter.com/KabarakUni",
        instagram: "https://www.instagram.com/kabarakuniversity/",
      },
    },
    programs: [
      {
        name: "Bachelor of Laws (LLB)",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program that prepares students for careers in law, focusing on legal principles, research, and advocacy.",
        linkedCareerTitles: ["Investment Banker", "Management Consultant"], // Added for seeding
        entryRequirements: {
          minimumGrade: "B+",
          specificSubjects: [{ subject: "English", grade: "B+" }],
          additionalRequirements: ["KCSE Certificate", "Interview"],
        },
        tuitionFees: "KES 280,000 per year",
      },
      {
        name: "Bachelor of Medicine and Bachelor of Surgery",
        level: "Bachelors",
        duration: "6 years",
        description: "A comprehensive medical program that prepares students for careers in medicine and surgery.",
        linkedCareerTitles: ["Medical Doctor"], // Added for seeding
        entryRequirements: {
          minimumGrade: "A-",
          specificSubjects: [
            { subject: "Biology", grade: "A-" },
            { subject: "Chemistry", grade: "A-" },
            { subject: "Mathematics/Physics", grade: "B+" },
          ],
          additionalRequirements: ["KCSE Certificate", "Interview"],
        },
        tuitionFees: "KES 600,000 per year",
      },
    ],
    rankings: {
      national: 11,
      international: 3200,
      year: 2024,
    },
    facilities: [
      "Modern library",
      "Computer labs",
      "Medical teaching hospital",
      "Moot court",
      "Student hostels",
      "Sports facilities",
      "Chapel",
    ],
    accreditation: ["Commission for University Education (CUE)", "Kenya Medical Practitioners and Dentists Council"],
    establishedYear: 2002,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kabarak_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kabarak_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Kenya Coast National Polytechnic",
    type: "Technical Institute",
    location: {
      address: "Kisauni Road",
      city: "Mombasa",
      county: "Mombasa",
      country: "Kenya",
      coordinates: {
        latitude: -4.0435,
        longitude: 39.6682,
      },
    },
    description:
      "Kenya Coast National Polytechnic is a leading technical and vocational education institution in the coastal region of Kenya. The polytechnic offers training in engineering, maritime studies, hospitality, and business.",
    website: "https://www.kenyacoastpoly.ac.ke/",
    contact: {
      email: "info@kenyacoastpoly.ac.ke",
      phone: "+254 41 2492222",
      socialMedia: {
        facebook: "https://www.facebook.com/KenyaCoastNationalPolytechnic/",
        twitter: "https://twitter.com/KCNPoly",
      },
    },
    programs: [
      {
        name: "Diploma in Maritime Transport and Logistics",
        level: "Diploma",
        duration: "3 years",
        description:
          "A program that focuses on maritime operations, shipping, and logistics management in the maritime industry.",
        linkedCareerTitles: ["Supply Chain Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [
            { subject: "Mathematics", grade: "D+" },
            { subject: "English", grade: "D+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 80,000 per year",
      },
      {
        name: "Certificate in Automotive Engineering",
        level: "Certificate",
        duration: "2 years",
        description: "A program that provides students with skills in vehicle mechanics, diagnostics, and repair.",
        linkedCareerTitles: ["Mechanical Engineer", "Electrical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 60,000 per year",
      },
    ],
    rankings: {
      national: 4,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Maritime training center",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)"],
    establishedYear: 1952,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kcnp_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kcnp_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Eldoret National Polytechnic",
    type: "Technical Institute",
    location: {
      address: "Eldoret-Kapsabet Road",
      city: "Eldoret",
      county: "Uasin Gishu",
      country: "Kenya",
      coordinates: {
        latitude: 0.5167,
        longitude: 35.2833,
      },
    },
    description:
      "Eldoret National Polytechnic is a leading technical and vocational education institution in the North Rift region of Kenya. The polytechnic offers training in engineering, building and construction, business, and hospitality.",
    website: "https://www.tnp.ac.ke/",
    contact: {
      email: "info@tnp.ac.ke",
      phone: "+254 53 2063000",
      socialMedia: {
        facebook: "https://www.facebook.com/EldoretNationalPolytechnic/",
        twitter: "https://twitter.com/ENPoly",
      },
    },
    programs: [
      {
        name: "Diploma in Building and Construction",
        level: "Diploma",
        duration: "3 years",
        description:
          "A program that provides students with skills in building construction, project management, and quantity surveying.",
        linkedCareerTitles: ["Civil Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [
            { subject: "Mathematics", grade: "D+" },
            { subject: "Physics", grade: "D+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 75,000 per year",
      },
      {
        name: "Certificate in Food and Beverage Service",
        level: "Certificate",
        duration: "1 year",
        description: "A program that trains students in food service, customer service, and hospitality operations.",
        linkedCareerTitles: ["Supply Chain Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 50,000",
      },
    ],
    rankings: {
      national: 5,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Building and construction workshops",
      "Training restaurant",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)"],
    establishedYear: 1965,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/enp_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/enp_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Kenya Institute of Mass Communication",
    type: "College",
    location: {
      address: "Nairobi West",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.3,
        longitude: 36.8167,
      },
    },
    description:
      "Kenya Institute of Mass Communication (KIMC) is a leading media training institution in East Africa. The institute offers training in journalism, film production, electronic media, and public relations.",
    website: "https://www.kimc.ac.ke/",
    contact: {
      email: "info@kimc.ac.ke",
      phone: "+254 20 2150320",
      socialMedia: {
        facebook: "https://www.facebook.com/KIMCKenya/",
        twitter: "https://twitter.com/KIMC_Kenya",
      },
    },
    programs: [
      {
        name: "Diploma in Journalism",
        level: "Diploma",
        duration: "2 years",
        description: "A program that trains students in news reporting, writing, editing, and media ethics.",
        linkedCareerTitles: ["Marketing Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C",
          specificSubjects: [{ subject: "English", grade: "C+" }],
          additionalRequirements: ["KCSE Certificate", "Interview"],
        },
        tuitionFees: "KES 90,000 per year",
      },
      {
        name: "Diploma in Film Production",
        level: "Diploma",
        duration: "2 years",
        description:
          "A program that trains students in film directing, cinematography, editing, and production management.",
        linkedCareerTitles: ["UX/UI Designer", "Marketing Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate", "Interview", "Portfolio submission"],
        },
        tuitionFees: "KES 95,000 per year",
      },
    ],
    rankings: {
      national: 1,
      international: null,
      year: 2024,
    },
    facilities: [
      "TV studios",
      "Radio studios",
      "Film production equipment",
      "Computer labs",
      "Library",
      "Student hostels",
      "Auditorium",
    ],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)", "Media Council of Kenya"],
    establishedYear: 1965,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kimc_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kimc_campus.jpg"],
    featured: true,
    views: 3,
  },
  {
    name: "Kenya Utalii College",
    type: "College",
    location: {
      address: "Thika Road",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.2333,
        longitude: 36.8833,
      },
    },
    description:
      "Kenya Utalii College is a leading hospitality and tourism training institution in Africa. The college offers training in hotel management, culinary arts, tour guiding, and travel operations.",
    website: "https://www.utalii.ac.ke/",
    contact: {
      email: "info@utalii.ac.ke",
      phone: "+254 20 8563540",
      socialMedia: {
        facebook: "https://www.facebook.com/KenyaUtaliiCollege/",
        twitter: "https://twitter.com/KenyaUtalii",
        instagram: "https://www.instagram.com/kenyautalii/",
      },
    },
    programs: [
      {
        name: "Diploma in Hotel Management",
        level: "Diploma",
        duration: "3 years",
        description:
          "A comprehensive program that trains students in hotel operations, food and beverage management, and hospitality service.",
        linkedCareerTitles: ["Marketing Manager", "Human Resources Manager", "Supply Chain Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C",
          specificSubjects: [
            { subject: "English", grade: "C" },
            { subject: "Mathematics", grade: "C-" },
          ],
          additionalRequirements: ["KCSE Certificate", "Interview"],
        },
        tuitionFees: "KES 120,000 per year",
      },
      {
        name: "Certificate in Tour Guiding and Travel Operations",
        level: "Certificate",
        duration: "1 year",
        description:
          "A program that trains students in tour guiding, travel arrangements, and customer service in the tourism industry.",
        linkedCareerTitles: ["Marketing Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [{ subject: "English", grade: "C-" }],
          additionalRequirements: ["KCSE Certificate", "Interview"],
        },
        tuitionFees: "KES 80,000",
      },
    ],
    rankings: {
      national: 1,
      international: null,
      year: 2024,
    },
    facilities: [
      "Training hotel",
      "Training restaurants",
      "Training kitchens",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: [
      "Technical and Vocational Education and Training Authority (TVETA)",
      "Tourism Regulatory Authority",
    ],
    establishedYear: 1975,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/utalii_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/utalii_campus.jpg"],
    featured: true,
    views: 4,
  },
  {
    name: "Railway Training Institute",
    type: "Technical Institute",
    location: {
      address: "South C",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.3167,
        longitude: 36.8333,
      },
    },
    description:
      "Railway Training Institute (RTI) is a specialized technical institution that offers training in railway operations, engineering, and management. The institute plays a key role in developing human resources for the railway sector in Kenya and East Africa.",
    website: "https://www.rti.ac.ke/",
    contact: {
      email: "info@rti.ac.ke",
      phone: "+254 20 2606586",
      socialMedia: {
        facebook: "https://www.facebook.com/RailwayTrainingInstitute/",
        twitter: "https://twitter.com/RTI_Kenya",
      },
    },
    programs: [
      {
        name: "Diploma in Railway Engineering",
        level: "Diploma",
        duration: "3 years",
        description:
          "A specialized program focusing on railway infrastructure, signaling systems, and rolling stock maintenance.",
        linkedCareerTitles: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [
            { subject: "Mathematics", grade: "C-" },
            { subject: "Physics", grade: "C-" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 90,000 per year",
      },
      {
        name: "Certificate in Railway Operations",
        level: "Certificate",
        duration: "1 year",
        description:
          "A program that trains students in train operations, safety procedures, and customer service in the railway sector.",
        linkedCareerTitles: ["Supply Chain Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 60,000",
      },
    ],
    rankings: {
      national: 6,
      international: null,
      year: 2024,
    },
    facilities: [
      "Railway workshops",
      "Signaling laboratory",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)"],
    establishedYear: 1956,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/rti_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/rti_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Kisumu National Polytechnic",
    type: "Technical Institute",
    location: {
      address: "Kisumu-Kakamega Road",
      city: "Kisumu",
      county: "Kisumu",
      country: "Kenya",
      coordinates: {
        latitude: -0.1,
        longitude: 34.75,
      },
    },
    description:
      "Kisumu National Polytechnic is a leading technical and vocational education institution in western Kenya. The polytechnic offers training in engineering, business, hospitality, and applied sciences.",
    website: "https://www.kisumupoly.ac.ke/",
    contact: {
      email: "info@kisumupoly.ac.ke",
      phone: "+254 57 2020502",
      socialMedia: {
        facebook: "https://www.facebook.com/KisumuNationalPolytechnic/",
        twitter: "https://twitter.com/KisumuPoly",
      },
    },
    programs: [
      {
        name: "Diploma in Water Engineering",
        level: "Diploma",
        duration: "3 years",
        description: "A program focusing on water resource management, water supply systems, and wastewater treatment.",
        linkedCareerTitles: ["Civil Engineer", "Chemical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [
            { subject: "Mathematics", grade: "D+" },
            { subject: "Physics/Chemistry", grade: "D+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 75,000 per year",
      },
      {
        name: "Certificate in Fashion Design and Garment Making",
        level: "Certificate",
        duration: "2 years",
        description: "A program that trains students in clothing design, pattern making, and garment production.",
        linkedCareerTitles: ["UX/UI Designer", "Marketing Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 55,000 per year",
      },
    ],
    rankings: {
      national: 7,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Fashion design studio",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)"],
    establishedYear: 1967,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kisumu_poly_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kisumu_poly_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Machakos University",
    type: "University",
    location: {
      address: "Machakos-Wote Road",
      city: "Machakos",
      county: "Machakos",
      country: "Kenya",
      coordinates: {
        latitude: -1.5167,
        longitude: 37.2667,
      },
    },
    description:
      "Machakos University is a public university that evolved from Machakos Technical Institute. The university offers programs in education, engineering, business, and agriculture, with a focus on sustainable development and innovation.",
    website: "https://www.mksu.ac.ke/",
    contact: {
      email: "info@mksu.ac.ke",
      phone: "+254 44 2021433",
      socialMedia: {
        facebook: "https://www.facebook.com/MachakosUniversity/",
        twitter: "https://twitter.com/MachakosUni",
      },
    },
    programs: [
      {
        name: "Bachelor of Science in Agricultural Education and Extension",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program that prepares students for careers in agricultural education, extension services, and rural development.",
        linkedCareerTitles: ["Teacher", "Educational Administrator"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [
            { subject: "Biology", grade: "C+" },
            { subject: "Chemistry", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 130,000 per year",
      },
      {
        name: "Bachelor of Technology in Mechanical Engineering",
        level: "Bachelors",
        duration: "4 years",
        description:
          "A program focusing on mechanical systems design, manufacturing processes, and maintenance engineering.",
        linkedCareerTitles: ["Mechanical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [
            { subject: "Mathematics", grade: "C+" },
            { subject: "Physics", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 150,000 per year",
      },
    ],
    rankings: {
      national: 14,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Agricultural demonstration farm",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: ["Commission for University Education (CUE)"],
    establishedYear: 2016,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/machakos_uni_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/machakos_uni_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Zetech University",
    type: "University",
    location: {
      address: "Thika Road, Ruiru",
      city: "Nairobi",
      county: "Kiambu",
      country: "Kenya",
      coordinates: {
        latitude: -1.1833,
        longitude: 36.9667,
      },
    },
    description:
      "Zetech University is a private university that evolved from Zetech College. The university offers programs in business, ICT, hospitality, and engineering, with a focus on practical skills and industry relevance.",
    website: "https://www.zetech.ac.ke/",
    contact: {
      email: "info@zetech.ac.ke",
      phone: "+254 719 034000",
      socialMedia: {
        facebook: "https://www.facebook.com/ZetechUniversity/",
        twitter: "https://twitter.com/ZetechU",
        instagram: "https://www.instagram.com/zetechuniversity/",
      },
    },
    programs: [
      {
        name: "Bachelor of Science in Information Technology",
        level: "Bachelors",
        duration: "4 years",
        description: "A program that focuses on computer systems, programming, networking, and IT management.",
        linkedCareerTitles: [
          "Software Engineer",
          "Data Scientist",
          "Cybersecurity Analyst",
          "Cloud Solutions Architect",
        ], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [{ subject: "Mathematics", grade: "C+" }],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 180,000 per year",
      },
      {
        name: "Diploma in Hospitality Management",
        level: "Diploma",
        duration: "2 years",
        description:
          "A program that trains students in hotel operations, food and beverage service, and hospitality management.",
        linkedCareerTitles: ["Marketing Manager", "Human Resources Manager", "Supply Chain Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 90,000 per year",
      },
    ],
    rankings: {
      national: 20,
      international: null,
      year: 2024,
    },
    facilities: [
      "Computer labs",
      "Training restaurant",
      "Library",
      "Student hostels",
      "Sports facilities",
      "Business incubation center",
    ],
    accreditation: ["Commission for University Education (CUE)"],
    establishedYear: 2014,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/zetech_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/zetech_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Kirinyaga University",
    type: "University",
    location: {
      address: "Kerugoya-Kutus Road",
      city: "Kerugoya",
      county: "Kirinyaga",
      country: "Kenya",
      coordinates: {
        latitude: -0.5,
        longitude: 37.2833,
      },
    },
    description:
      "Kirinyaga University is a public university that evolved from Kirinyaga University College. The university offers programs in business, computing, engineering, and health sciences, with a focus on innovation and entrepreneurship.",
    website: "https://www.kyu.ac.ke/",
    contact: {
      email: "info@kyu.ac.ke",
      phone: "+254 20 2088220",
      socialMedia: {
        facebook: "https://www.facebook.com/KirinyagaUniversity/",
        twitter: "https://twitter.com/KirinyagaUni",
      },
    },
    programs: [
      {
        name: "Bachelor of Science in Computer Science",
        level: "Bachelors",
        duration: "4 years",
        description: "A program focusing on computer theory, programming, algorithms, and software development.",
        linkedCareerTitles: [
          "Software Engineer",
          "Data Scientist",
          "Cybersecurity Analyst",
          "UX/UI Designer",
          "Cloud Solutions Architect",
        ], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [
            { subject: "Mathematics", grade: "C+" },
            { subject: "Physics", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 140,000 per year",
      },
      {
        name: "Bachelor of Commerce",
        level: "Bachelors",
        duration: "4 years",
        description: "A program that prepares students for careers in business management, accounting, and finance.",
        linkedCareerTitles: [
          "Marketing Manager",
          "Human Resources Manager",
          "Management Consultant",
          "Entrepreneur",
          "Supply Chain Manager",
          "Financial Analyst",
          "Accountant",
          "Investment Banker",
          "Actuary",
          "Financial Planner",
        ], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [{ subject: "Mathematics", grade: "C+" }],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 130,000 per year",
      },
    ],
    rankings: {
      national: 18,
      international: null,
      year: 2024,
    },
    facilities: [
      "Computer labs",
      "Business incubation center",
      "Library",
      "Student hostels",
      "Sports facilities",
      "Health center",
    ],
    accreditation: ["Commission for University Education (CUE)"],
    establishedYear: 2016,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kirinyaga_uni_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kirinyaga_uni_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Murang'a University of Technology",
    type: "University",
    location: {
      address: "Murang'a-Sagana Road",
      city: "Murang'a",
      county: "Murang'a",
      country: "Kenya",
      coordinates: {
        latitude: -0.7167,
        longitude: 37.15,
      },
    },
    description:
      "Murang'a University of Technology is a public university that focuses on technology, engineering, and applied sciences. The university aims to produce graduates who can contribute to technological advancement and industrial development in Kenya.",
    website: "https://www.mut.ac.ke/",
    contact: {
      email: "info@mut.ac.ke",
      phone: "+254 724 304 524",
      socialMedia: {
        facebook: "https://www.facebook.com/MurangaUniversityofTechnology/",
        twitter: "https://twitter.com/MUT_Kenya",
      },
    },
    programs: [
      {
        name: "Bachelor of Technology in Electrical and Electronic Engineering",
        level: "Bachelors",
        duration: "4 years",
        description: "A program focusing on electrical systems, electronic devices, and power systems engineering.",
        linkedCareerTitles: ["Electrical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [
            { subject: "Mathematics", grade: "C+" },
            { subject: "Physics", grade: "C+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 150,000 per year",
      },
      {
        name: "Bachelor of Science in Information Technology",
        level: "Bachelors",
        duration: "4 years",
        description: "A program that focuses on computer systems, programming, networking, and IT management.",
        linkedCareerTitles: [
          "Software Engineer",
          "Data Scientist",
          "Cybersecurity Analyst",
          "Cloud Solutions Architect",
        ], // Added for seeding
        entryRequirements: {
          minimumGrade: "C+",
          specificSubjects: [{ subject: "Mathematics", grade: "C+" }],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 140,000 per year",
      },
    ],
    rankings: {
      national: 17,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering laboratories",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
      "Innovation hub",
    ],
    accreditation: ["Commission for University Education (CUE)"],
    establishedYear: 2016,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/muranga_uni_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/muranga_uni_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Nairobi Technical Training Institute",
    type: "Technical Institute",
    location: {
      address: "Ngara Road",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.2833,
        longitude: 36.8167,
      },
    },
    description:
      "Nairobi Technical Training Institute (NTTI) is a public technical and vocational education institution located in the heart of Nairobi. The institute offers training in engineering, business, hospitality, and applied sciences.",
    website: "https://www.ntti.ac.ke/",
    contact: {
      email: "info@ntti.ac.ke",
      phone: "+254 20 2245581",
      socialMedia: {
        facebook: "https://www.facebook.com/NairobiTechnicalTrainingInstitute/",
        twitter: "https://twitter.com/NTTI_Kenya",
      },
    },
    programs: [
      {
        name: "Diploma in Electrical and Electronic Engineering",
        level: "Diploma",
        duration: "3 years",
        description:
          "A program that provides students with skills in electrical installation, electronic systems, and power systems.",
        linkedCareerTitles: ["Electrical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [
            { subject: "Mathematics", grade: "D+" },
            { subject: "Physics", grade: "D+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 85,000 per year",
      },
      {
        name: "Certificate in Secretarial Studies",
        level: "Certificate",
        duration: "1 year",
        description:
          "A program that trains students in office administration, document management, and customer service.",
        linkedCareerTitles: ["Human Resources Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [{ subject: "English", grade: "D+" }],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 50,000",
      },
    ],
    rankings: {
      national: 8,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
      "Business incubation center",
    ],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)"],
    establishedYear: 1964,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/ntti_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/ntti_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Meru National Polytechnic",
    type: "Technical Institute",
    location: {
      address: "Meru-Maua Road",
      city: "Meru",
      county: "Meru",
      country: "Kenya",
      coordinates: {
        latitude: 0.05,
        longitude: 37.65,
      },
    },
    description:
      "Meru National Polytechnic is a public technical and vocational education institution located in Meru County. The polytechnic offers training in engineering, business, hospitality, and applied sciences.",
    website: "https://www.merupoly.ac.ke/",
    contact: {
      email: "info@merupoly.ac.ke",
      phone: "+254 64 3130901",
      socialMedia: {
        facebook: "https://www.facebook.com/MeruNationalPolytechnic/",
        twitter: "https://twitter.com/MeruPoly",
      },
    },
    programs: [
      {
        name: "Diploma in Agriculture and Biotechnology",
        level: "Diploma",
        duration: "3 years",
        description:
          "A program focusing on agricultural production, biotechnology applications, and sustainable farming practices.",
        linkedCareerTitles: ["Chemical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [
            { subject: "Biology", grade: "D+" },
            { subject: "Chemistry", grade: "D+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 80,000 per year",
      },
      {
        name: "Certificate in Plumbing and Pipe Fitting",
        level: "Certificate",
        duration: "2 years",
        description:
          "A program that trains students in plumbing installation, maintenance, and repair of water and drainage systems.",
        linkedCareerTitles: ["Civil Engineer", "Mechanical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 55,000 per year",
      },
    ],
    rankings: {
      national: 9,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Agricultural demonstration farm",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)"],
    establishedYear: 1979,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/meru_poly_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/meru_poly_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Sigalagala National Polytechnic",
    type: "Technical Institute",
    location: {
      address: "Kakamega-Kisumu Road",
      city: "Kakamega",
      county: "Kakamega",
      country: "Kenya",
      coordinates: {
        latitude: 0.1667,
        longitude: 34.7833,
      },
    },
    description:
      "Sigalagala National Polytechnic is a public technical and vocational education institution located in Kakamega County. The polytechnic offers training in engineering, business, hospitality, and applied sciences.",
    website: "https://www.sigalagala.ac.ke/",
    contact: {
      email: "info@sigalagala.ac.ke",
      phone: "+254 56 2030268",
      socialMedia: {
        facebook: "https://www.facebook.com/SigalagalaNationalPolytechnic/",
        twitter: "https://twitter.com/SigalagalaPoly",
      },
    },
    programs: [
      {
        name: "Diploma in Building and Construction",
        level: "Diploma",
        duration: "3 years",
        description:
          "A program that provides students with skills in building construction, project management, and quantity surveying.",
        linkedCareerTitles: ["Civil Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [
            { subject: "Mathematics", grade: "D+" },
            { subject: "Physics", grade: "D+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 75,000 per year",
      },
      {
        name: "Certificate in Welding and Fabrication",
        level: "Certificate",
        duration: "2 years",
        description: "A program that trains students in metal welding, fabrication, and structural metalwork.",
        linkedCareerTitles: ["Mechanical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 55,000 per year",
      },
    ],
    rankings: {
      national: 10,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Building and construction workshops",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)"],
    establishedYear: 1977,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/sigalagala_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/sigalagala_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Kenya Water Institute",
    type: "Technical Institute",
    location: {
      address: "South C",
      city: "Nairobi",
      county: "Nairobi",
      country: "Kenya",
      coordinates: {
        latitude: -1.3167,
        longitude: 36.8333,
      },
    },
    description:
      "Kenya Water Institute (KEWI) is a specialized technical institution that offers training in water technology, water resource management, and water supply services. The institute plays a key role in developing human resources for the water sector in Kenya.",
    website: "https://www.kewi.or.ke/",
    contact: {
      email: "info@kewi.or.ke",
      phone: "+254 20 6003893",
      socialMedia: {
        facebook: "https://www.facebook.com/KenyaWaterInstitute/",
        twitter: "https://twitter.com/KEWI_Kenya",
      },
    },
    programs: [
      {
        name: "Diploma in Water Technology",
        level: "Diploma",
        duration: "3 years",
        description: "A program focusing on water treatment, distribution systems, and quality control.",
        linkedCareerTitles: ["Civil Engineer", "Chemical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [
            { subject: "Mathematics", grade: "D+" },
            { subject: "Chemistry", grade: "D+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 85,000 per year",
      },
      {
        name: "Certificate in Water Supply Services",
        level: "Certificate",
        duration: "2 years",
        description: "A program that trains students in water supply operations, maintenance, and customer service.",
        linkedCareerTitles: ["Supply Chain Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 60,000 per year",
      },
    ],
    rankings: {
      national: 11,
      international: null,
      year: 2024,
    },
    facilities: [
      "Water laboratories",
      "Water treatment plant",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: [
      "Technical and Vocational Education and Training Authority (TVETA)",
      "Water Services Regulatory Board",
    ],
    establishedYear: 2001,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/kewi_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/kewi_campus.jpg"],
    featured: false,
    views: 0,
  },
  {
    name: "Nyeri National Polytechnic",
    type: "Technical Institute",
    location: {
      address: "Mumbi Road",
      city: "Nyeri",
      county: "Nyeri",
      country: "Kenya",
      coordinates: {
        latitude: -0.4167,
        longitude: 36.95,
      },
    },
    description:
      "Nyeri National Polytechnic is a public technical and vocational education institution located in Nyeri County. The polytechnic offers training in engineering, business, hospitality, and applied sciences.",
    website: "https://www.thenyeripoly.ac.ke/",
    contact: {
      email: "info@thenyeripoly.ac.ke",
      phone: "+254 61 2032330",
      socialMedia: {
        facebook: "https://www.facebook.com/NyeriNationalPolytechnic/",
        twitter: "https://twitter.com/NyeriPoly",
      },
    },
    programs: [
      {
        name: "Diploma in Automotive Engineering",
        level: "Diploma",
        duration: "3 years",
        description: "A program that provides students with skills in vehicle mechanics, diagnostics, and repair.",
        linkedCareerTitles: ["Mechanical Engineer", "Electrical Engineer"], // Added for seeding
        entryRequirements: {
          minimumGrade: "C-",
          specificSubjects: [
            { subject: "Mathematics", grade: "D+" },
            { subject: "Physics", grade: "D+" },
          ],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 80,000 per year",
      },
      {
        name: "Certificate in Food Processing",
        level: "Certificate",
        duration: "2 years",
        description: "A program that trains students in food processing, preservation, and quality control.",
        linkedCareerTitles: ["Chemical Engineer", "Supply Chain Manager"], // Added for seeding
        entryRequirements: {
          minimumGrade: "D+",
          specificSubjects: [{ subject: "Chemistry", grade: "D+" }],
          additionalRequirements: ["KCSE Certificate"],
        },
        tuitionFees: "KES 55,000 per year",
      },
    ],
    rankings: {
      national: 12,
      international: null,
      year: 2024,
    },
    facilities: [
      "Engineering workshops",
      "Food processing plant",
      "Computer labs",
      "Library",
      "Student hostels",
      "Sports facilities",
    ],
    accreditation: ["Technical and Vocational Education and Training Authority (TVETA)"],
    establishedYear: 1978,
    logo: "https://res.cloudinary.com/victorkib/image/upload/v1743416482/institutions/nyeri_poly_logo.png",
    images: ["https://res.cloudinary.com/victorkib/image/upload/v1743416495/institutions/nyeri_poly_campus.jpg"],
    featured: false,
    views: 0,
  },
]

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      console.error("MONGODB_URI is not defined in environment variables.")
      process.exit(1)
    }

    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB successfully!")

    const shouldForce = process.argv.includes("--force")

    // Check if data already exists
    const existingCareersCount = await Career.countDocuments()
    const existingInstitutionsCount = await Institution.countDocuments()

    if (existingCareersCount > 0 || existingInstitutionsCount > 0) {
      if (!shouldForce) {
        console.log("Data already exists in the database. To overwrite, run with --force flag.")
        await mongoose.disconnect()
        return
      }
      console.log("Force flag detected. Proceeding with seeding...")
    }

    // Clear existing data if --force is used or if collections are not empty
    if (shouldForce || existingCareersCount > 0) {
      console.log("Deleting existing careers...")
      await Career.deleteMany({})
      console.log("Existing careers deleted.")
    }
    if (shouldForce || existingInstitutionsCount > 0) {
      console.log("Deleting existing institutions...")
      await Institution.deleteMany({})
      console.log("Existing institutions deleted.")
    }

    // --- Pass 1: Seed Careers ---
    console.log(`Inserting ${careersData.length} careers...`)
    const insertedCareers = await Career.insertMany(careersData)
    console.log(`Successfully inserted ${insertedCareers.length} careers!`)

    // Create a map for career titles to their IDs
    const careerTitleToIdMap = new Map()
    insertedCareers.forEach((career) => {
      careerTitleToIdMap.set(career.title, career._id)
    })
    console.log("Created career title to ID map.")

    // --- Pass 2: Prepare and Seed Institutions ---
    console.log(`Preparing ${institutionsData.length} institutions for insertion...`)
    const institutionsToInsert = institutionsData.map((inst) => {
      const newInst = { ...inst }
      newInst.programs = newInst.programs.map((program) => {
        const newProgram = { ...program }
        if (newProgram.linkedCareerTitles && Array.isArray(newProgram.linkedCareerTitles)) {
          newProgram.careers = newProgram.linkedCareerTitles
            .map((title) => careerTitleToIdMap.get(title))
            .filter(Boolean) // Filter out any undefined IDs if a title wasn't found
        }
        delete newProgram.linkedCareerTitles // Remove the temporary field
        return newProgram
      })
      return newInst
    })

    const insertedInstitutions = await Institution.insertMany(institutionsToInsert)
    console.log(`Successfully inserted ${insertedInstitutions.length} institutions!`)

    // --- Pass 3: Update Career references (Bidirectional Link) ---
    console.log("Updating career references with institution IDs...")
    for (const institution of insertedInstitutions) {
      for (const program of institution.programs) {
        if (program.careers && program.careers.length > 0) {
          for (const careerId of program.careers) {
            await Career.findByIdAndUpdate(
              careerId,
              { $addToSet: { institutions: institution._id } }, // Use $addToSet to avoid duplicates
              { new: true, runValidators: true },
            )
          }
        }
      }
    }
    console.log("Career references updated successfully!")

    // Disconnect from MongoDB
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB.")

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
