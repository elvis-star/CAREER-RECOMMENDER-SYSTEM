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
  Tabs,
  Tab,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  School as SchoolIcon,
  EmojiEvents as EmojiEventsIcon,
  Work as WorkIcon,
  AttachMoney as AttachMoneyIcon,
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

function Resources({ toggleColorMode }) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const resources = {
    kuccps: [
      {
        title: 'KUCCPS Student Portal',
        description:
          'Official portal for university and college placement applications',
        link: 'https://students.kuccps.net/',
      },
      {
        title: 'KUCCPS Course Requirements',
        description:
          'Detailed information on subject cluster requirements for various courses',
        link: 'https://www.kuccps.ac.ke/',
      },
      {
        title: 'KUCCPS Application Guide',
        description:
          'Step-by-step guide on how to apply for university placement',
        link: 'https://www.kuccps.ac.ke/index.php/career-booklet',
      },
      {
        title: 'KUCCPS Revision Guidelines',
        description: 'Information on how to revise your course choices',
        link: 'https://www.kuccps.ac.ke/',
      },
      {
        title: 'KUCCPS Placement Criteria',
        description: 'Understanding how placement decisions are made',
        link: 'https://www.kuccps.ac.ke/',
      },
    ],
    scholarships: [
      {
        title: 'Higher Education Loans Board (HELB)',
        description:
          'Government loans and bursaries for higher education students',
        link: 'https://www.helb.co.ke/',
      },
      {
        title: 'Equity Foundation Scholarships',
        description:
          'Scholarships for academically talented but financially challenged students',
        link: 'https://equitygroupfoundation.com/our-programmes/education-and-leadership-development/equity-leaders-program-elp/',
      },
      {
        title: 'KCB Foundation Scholarships',
        description: 'Scholarships for bright and needy students across Kenya',
        link: 'https://kcbgroup.com/foundation/programmes/scholarship-programme/',
      },
      {
        title: 'Mastercard Foundation Scholars Program',
        description:
          'Scholarships for academically talented yet economically disadvantaged students',
        link: 'https://mastercardfdn.org/all/scholars/',
      },
      {
        title: 'County Government Bursaries',
        description:
          'Information on how to apply for county-specific education bursaries',
        link: 'https://www.knbs.or.ke/county-governments/',
      },
    ],
    career: [
      {
        title: 'Kenya National Bureau of Statistics',
        description: 'Labor market information and employment statistics',
        link: 'https://www.knbs.or.ke/',
      },
      {
        title: 'Career Point Kenya',
        description: 'Job listings, career advice, and CV writing tips',
        link: 'https://www.careerpointkenya.co.ke/',
      },
      {
        title: 'BrighterMonday Kenya',
        description: 'Job listings and career development resources',
        link: 'https://www.brightermonday.co.ke/',
      },
      {
        title: 'Kenya Association of Professional Counsellors',
        description: 'Career counseling services and resources',
        link: 'https://www.kapc.or.ke/',
      },
      {
        title: 'Ajira Digital Program',
        description:
          'Government initiative to enable Kenyans to access digital job opportunities',
        link: 'https://www.ajiradigital.go.ke/',
      },
    ],
    tvet: [
      {
        title: 'TVET Authority',
        description:
          'Information on technical and vocational education and training in Kenya',
        link: 'https://www.tveta.go.ke/',
      },
      {
        title: 'Kenya National Qualifications Authority',
        description: 'Information on qualifications framework and recognition',
        link: 'https://www.knqa.go.ke/',
      },
      {
        title: 'National Industrial Training Authority',
        description: 'Industrial training programs and apprenticeships',
        link: 'https://www.nita.go.ke/',
      },
      {
        title:
          'Technical and Vocational Education and Training Curriculum Development',
        description: 'Information on TVET curriculum and programs',
        link: 'https://www.tvetcdacc.go.ke/',
      },
      {
        title: 'Kenya Youth Employment and Opportunities Project',
        description: 'Training and job opportunities for youth',
        link: 'https://www.kyeop.go.ke/',
      },
    ],
  };

  const icons = {
    kuccps: <SchoolIcon />,
    scholarships: <AttachMoneyIcon />,
    career: <WorkIcon />,
    tvet: <EmojiEventsIcon />,
  };

  const categories = [
    { value: 0, label: 'KUCCPS', key: 'kuccps', icon: <SchoolIcon /> },
    {
      value: 1,
      label: 'Scholarships',
      key: 'scholarships',
      icon: <AttachMoneyIcon />,
    },
    { value: 2, label: 'Career', key: 'career', icon: <WorkIcon /> },
    { value: 3, label: 'TVET', key: 'tvet', icon: <EmojiEventsIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleColorMode={toggleColorMode} />
      <Container component="main" maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Learning Resources
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Explore these resources to help you navigate your education and
            career journey in Kenya
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="resource categories"
            variant="fullWidth"
          >
            {categories.map((category) => (
              <Tab
                key={category.key}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {category.icon}
                    <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
                      {category.label || ''}
                    </Box>
                  </Box>
                }
                id={`tab-${category.value}`}
                aria-controls={`tabpanel-${category.value}`}
              />
            ))}
          </Tabs>
        </Box>

        {categories.map((category) => (
          <TabPanel key={category.key} value={tabValue} index={category.value}>
            <Grid container spacing={3}>
              {resources[category.key].map((resource, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {icons[category.key]}
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            {resource.title || ''}
                          </Typography>
                        </Box>
                      }
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {resource.description || ''}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="outlined"
                        component="a"
                        href={resource.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<OpenInNewIcon />}
                        startIcon={<MenuBookIcon />}
                      >
                        Visit Resource
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                component={RouterLink}
                to="/kcse-input"
                variant="contained"
                color="primary"
                size="large"
              >
                Get Personalized Recommendations
              </Button>
            </Box>
          </TabPanel>
        ))}

        <Paper sx={{ p: 4, mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Education Pathways in Kenya
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              University Education
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              For students with strong KCSE results (typically C+ and above),
              university education offers degree programs that take 4-6 years
              depending on the field of study. Admission is primarily through
              KUCCPS for public universities.
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Technical and Vocational Education (TVET)
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              TVET institutions offer practical skills training through
              certificate (1-2 years), diploma (2-3 years), and higher diploma
              programs. These are excellent options for students with KCSE
              grades C and below.
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Professional Certifications
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Various professional bodies offer specialized certifications in
              fields like accounting (KASNEB), human resources (IHRM), marketing
              (MSK), and IT. These certifications are recognized by employers
              and can be pursued alongside or after formal education.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

export default Resources;
