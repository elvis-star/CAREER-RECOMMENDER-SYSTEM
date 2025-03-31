'use client';

import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Grid,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Event as EventIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';

import Header from '../components/Header';
import Footer from '../components/Footer';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function Universities({ toggleColorMode }) {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const universities = {
    public: [
      {
        name: 'University of Nairobi',
        location: 'Nairobi',
        established: '1970',
        description:
          'The oldest and largest university in Kenya, offering a wide range of programs across multiple disciplines.',
        website: 'https://www.uonbi.ac.ke/',
        cutoffPoints: '67.5+',
        popularCourses: [
          'Medicine',
          'Law',
          'Engineering',
          'Architecture',
          'Computer Science',
        ],
      },
      {
        name: 'Kenyatta University',
        location: 'Nairobi',
        established: '1985',
        description:
          "One of Kenya's leading universities known for education, sciences, and humanities programs.",
        website: 'https://www.ku.ac.ke/',
        cutoffPoints: '63.5+',
        popularCourses: [
          'Education',
          'Nursing',
          'Business',
          'Environmental Studies',
          'Communication',
        ],
      },
      {
        name: 'Jomo Kenyatta University of Agriculture and Technology (JKUAT)',
        location: 'Juja',
        established: '1994',
        description:
          'Specializes in agriculture, engineering, technology, and science programs.',
        website: 'https://www.jkuat.ac.ke/',
        cutoffPoints: '61.5+',
        popularCourses: [
          'Engineering',
          'Information Technology',
          'Agriculture',
          'Food Science',
          'Actuarial Science',
        ],
      },
      {
        name: 'Moi University',
        location: 'Eldoret',
        established: '1984',
        description:
          'A comprehensive university offering diverse programs with strengths in education and technology.',
        website: 'https://www.mu.ac.ke/',
        cutoffPoints: '60.5+',
        popularCourses: [
          'Education',
          'Engineering',
          'Medicine',
          'Information Sciences',
          'Tourism Management',
        ],
      },
      {
        name: 'Egerton University',
        location: 'Nakuru',
        established: '1987',
        description:
          "Kenya's oldest institution of higher learning with a strong focus on agriculture and related sciences.",
        website: 'https://www.egerton.ac.ke/',
        cutoffPoints: '59.5+',
        popularCourses: [
          'Agriculture',
          'Environmental Science',
          'Education',
          'Economics',
          'Animal Science',
        ],
      },
      {
        name: 'Maseno University',
        location: 'Kisumu',
        established: '1991',
        description:
          'Located on the equator, offering diverse programs with strengths in education and health sciences.',
        website: 'https://www.maseno.ac.ke/',
        cutoffPoints: '58.5+',
        popularCourses: [
          'Education',
          'Health Sciences',
          'Business',
          'ICT',
          'Agriculture',
        ],
      },
    ],
    private: [
      {
        name: 'Strathmore University',
        location: 'Nairobi',
        established: '2002',
        description:
          'A leading private university known for business, IT, and law programs with strong industry connections.',
        website: 'https://www.strathmore.edu/',
        cutoffPoints: 'Varies (Private)',
        popularCourses: [
          'Commerce',
          'Law',
          'Information Technology',
          'Hospitality Management',
          'Financial Economics',
        ],
      },
      {
        name: 'United States International University (USIU)',
        location: 'Nairobi',
        established: '1969',
        description:
          "Kenya's oldest private secular university offering American-style education.",
        website: 'https://www.usiu.ac.ke/',
        cutoffPoints: 'Varies (Private)',
        popularCourses: [
          'International Relations',
          'Psychology',
          'Business Administration',
          'Journalism',
          'Hotel Management',
        ],
      },
      {
        name: 'Daystar University',
        location: 'Nairobi',
        established: '1974',
        description:
          'A Christian university known for communication and business programs.',
        website: 'https://www.daystar.ac.ke/',
        cutoffPoints: 'Varies (Private)',
        popularCourses: [
          'Communication',
          'Business Administration',
          'Psychology',
          'Education',
          'Peace and International Studies',
        ],
      },
      {
        name: 'KCA University',
        location: 'Nairobi',
        established: '2007',
        description:
          'Formerly Kenya College of Accountancy, specializing in business and technology programs.',
        website: 'https://www.kca.ac.ke/',
        cutoffPoints: 'Varies (Private)',
        popularCourses: [
          'Accounting',
          'Finance',
          'Economics',
          'Information Technology',
          'Business Administration',
        ],
      },
    ],
    technical: [
      {
        name: 'Technical University of Kenya',
        location: 'Nairobi',
        established: '2013',
        description:
          'Evolved from Kenya Polytechnic, focusing on technical and vocational education.',
        website: 'https://www.tukenya.ac.ke/',
        cutoffPoints: '56.5+',
        popularCourses: [
          'Engineering',
          'Applied Sciences',
          'Architecture',
          'Technical Education',
          'Surveying',
        ],
      },
      {
        name: 'Technical University of Mombasa',
        location: 'Mombasa',
        established: '2013',
        description:
          'Formerly Mombasa Polytechnic, specializing in technical and maritime education.',
        website: 'https://www.tum.ac.ke/',
        cutoffPoints: '55.5+',
        popularCourses: [
          'Marine Engineering',
          'Maritime Studies',
          'Engineering',
          'Applied Sciences',
          'Business Studies',
        ],
      },
      {
        name: 'Cooperative University of Kenya',
        location: 'Nairobi',
        established: '2015',
        description:
          'Specializes in cooperative management and business studies.',
        website: 'https://www.cuk.ac.ke/',
        cutoffPoints: '54.5+',
        popularCourses: [
          'Cooperative Management',
          'Entrepreneurship',
          'Agribusiness',
          'Banking and Finance',
          'Marketing',
        ],
      },
      {
        name: 'Machakos University',
        location: 'Machakos',
        established: '2016',
        description:
          'A growing institution with diverse programs and a focus on technology and education.',
        website: 'https://www.mksu.ac.ke/',
        cutoffPoints: '54+',
        popularCourses: [
          'Education',
          'Computer Science',
          'Business Management',
          'Agriculture',
          'Environmental Studies',
        ],
      },
    ],
  };

  const categories = [
    { value: 0, label: 'Public Universities', key: 'public' },
    { value: 1, label: 'Private Universities', key: 'private' },
    { value: 2, label: 'Technical Universities', key: 'technical' },
  ];

  const filteredUniversities = universities[categories[tabValue].key].filter(
    (university) =>
      university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.popularCourses.some((course) =>
        course.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleColorMode={toggleColorMode} />
      <Container component="main" sx={{ py: 8, flexGrow: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Kenyan Universities Guide
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Explore universities and colleges in Kenya to find the right
            institution for your career path
          </Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="Search for universities..."
          variant="outlined"
          value={searchQuery || ''}
          onChange={handleSearchChange}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="university categories"
            variant="fullWidth"
          >
            {categories.map((category) => (
              <Tab
                key={category.key}
                label={category.label || ''}
                id={`tab-${category.value}`}
                aria-controls={`tabpanel-${category.value}`}
              />
            ))}
          </Tabs>
        </Box>

        {categories.map((category) => (
          <TabPanel key={category.key} value={tabValue} index={category.value}>
            {filteredUniversities.length > 0 ? (
              <Grid container spacing={3}>
                {filteredUniversities.map((university, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <CardHeader
                        title={university.name || ''}
                        subheader={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                            }}
                          >
                            <LocationIcon fontSize="small" color="action" />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 0.5 }}
                            >
                              {university.location || ''}
                            </Typography>
                          </Box>
                        }
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" paragraph>
                          {university.description || ''}
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <SchoolIcon
                                fontSize="small"
                                color="action"
                                sx={{ mr: 1 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Cut-off: {university.cutoffPoints || ''}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EventIcon
                                fontSize="small"
                                color="action"
                                sx={{ mr: 1 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Est: {university.established || ''}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Typography variant="subtitle2" gutterBottom>
                          Popular Courses:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {university.popularCourses.map((course, idx) => (
                            <Chip key={idx} label={course || ''} size="small" />
                          ))}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          fullWidth
                          variant="outlined"
                          component="a"
                          href={university.website || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          endIcon={<OpenInNewIcon />}
                        >
                          Visit Website
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No universities found matching your search.
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                component={RouterLink}
                to="/kcse-input"
                variant="contained"
                color="primary"
                size="large"
              >
                Get Personalized University Recommendations
              </Button>
            </Box>
          </TabPanel>
        ))}

        <Paper sx={{ p: 4, mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Understanding University Admission in Kenya
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              KUCCPS Placement
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The Kenya Universities and Colleges Central Placement Service
              (KUCCPS) manages admissions to public universities and colleges.
              They use a points-based system where your KCSE performance
              determines your eligibility for various courses.
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cluster Subjects
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Different courses require specific subject combinations
              (clusters). For example, Engineering programs typically require
              strong performance in Mathematics, Physics, and Chemistry.
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cut-off Points
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Each program has minimum cut-off points that vary annually based
              on performance and available slots. Competitive programs like
              Medicine and Engineering typically have higher cut-off points.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

export default Universities;
