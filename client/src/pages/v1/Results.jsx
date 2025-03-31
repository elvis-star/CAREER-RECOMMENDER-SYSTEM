'use client';

import { useState } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardHeader,
  CardActions,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
} from '@mui/material';
import {
  Check as CheckIcon,
  MenuBook as MenuBookIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  EmojiEvents as EmojiEventsIcon,
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Results({ toggleColorMode }) {
  const [searchParams] = useSearchParams();
  const meanGrade = searchParams.get('meanGrade') || 'B';
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Career recommendations based on KCSE mean grade
  const getCareerRecommendations = (grade) => {
    const recommendations = {
      A: {
        title: 'High Achievement Path',
        description:
          'Your excellent KCSE performance opens doors to competitive programs in Kenya and internationally.',
        careers: [
          'Medicine & Surgery',
          'Engineering',
          'Actuarial Science',
          'Law',
          'Architecture',
        ],
        universities: [
          'University of Nairobi',
          'Kenyatta University',
          'Jomo Kenyatta University (JKUAT)',
          'Moi University',
          'Strathmore University',
        ],
        courses: [
          'Bachelor of Medicine and Bachelor of Surgery (MBBS)',
          'Bachelor of Engineering (Various specializations)',
          'Bachelor of Science in Actuarial Science',
          'Bachelor of Laws (LLB)',
          'Bachelor of Architecture',
        ],
        skills: [
          'Critical thinking',
          'Research methodology',
          'Advanced problem-solving',
          'Leadership',
          'Scientific reasoning',
        ],
      },
      'A-': {
        title: 'High Achievement Path',
        description:
          'Your excellent KCSE performance opens doors to competitive programs in Kenya.',
        careers: [
          'Medicine & Surgery',
          'Engineering',
          'Actuarial Science',
          'Law',
          'Pharmacy',
        ],
        universities: [
          'University of Nairobi',
          'Kenyatta University',
          'Jomo Kenyatta University (JKUAT)',
          'Moi University',
          'Strathmore University',
        ],
        courses: [
          'Bachelor of Medicine and Bachelor of Surgery (MBBS)',
          'Bachelor of Engineering (Various specializations)',
          'Bachelor of Science in Actuarial Science',
          'Bachelor of Laws (LLB)',
          'Bachelor of Pharmacy',
        ],
        skills: [
          'Critical thinking',
          'Research methodology',
          'Advanced problem-solving',
          'Leadership',
          'Scientific reasoning',
        ],
      },
      'B+': {
        title: 'Strong Academic Path',
        description:
          'Your strong KCSE performance qualifies you for competitive programs at top Kenyan universities.',
        careers: [
          'Computer Science',
          'Economics',
          'Clinical Medicine',
          'Nursing',
          'Education (Science)',
        ],
        universities: [
          'University of Nairobi',
          'Kenyatta University',
          'Jomo Kenyatta University (JKUAT)',
          'Moi University',
          'Egerton University',
        ],
        courses: [
          'Bachelor of Science in Computer Science',
          'Bachelor of Economics',
          'Bachelor of Science in Clinical Medicine',
          'Bachelor of Science in Nursing',
          'Bachelor of Education (Science)',
        ],
        skills: [
          'Analytical thinking',
          'Problem-solving',
          'Technical skills',
          'Communication',
          'Teamwork',
        ],
      },
      B: {
        title: 'Solid Academic Path',
        description:
          'Your good KCSE performance qualifies you for various degree programs at Kenyan universities.',
        careers: [
          'Business Administration',
          'Information Technology',
          'Agriculture',
          'Education',
          'Public Health',
        ],
        universities: [
          'Kenyatta University',
          'Jomo Kenyatta University (JKUAT)',
          'Moi University',
          'Egerton University',
          'Maseno University',
        ],
        courses: [
          'Bachelor of Business Administration',
          'Bachelor of Science in Information Technology',
          'Bachelor of Science in Agriculture',
          'Bachelor of Education',
          'Bachelor of Science in Public Health',
        ],
        skills: [
          'Business acumen',
          'Technical skills',
          'Communication',
          'Project management',
          'Critical thinking',
        ],
      },
      'B-': {
        title: 'Promising Academic Path',
        description:
          'Your KCSE performance qualifies you for various degree programs at Kenyan universities.',
        careers: [
          'Business Management',
          'Information Technology',
          'Agriculture',
          'Education',
          'Tourism Management',
        ],
        universities: [
          'Kenyatta University',
          'Moi University',
          'Egerton University',
          'Maseno University',
          'Technical University of Kenya',
        ],
        courses: [
          'Bachelor of Business Management',
          'Bachelor of Science in Information Technology',
          'Bachelor of Science in Agriculture',
          'Bachelor of Education',
          'Bachelor of Tourism Management',
        ],
        skills: [
          'Business skills',
          'Technical knowledge',
          'Communication',
          'Project management',
          'Problem-solving',
        ],
      },
      'C+': {
        title: 'Practical Academic Path',
        description:
          'Your KCSE performance qualifies you for diploma programs and some degree courses.',
        careers: [
          'Accounting',
          'Marketing',
          'Human Resource Management',
          'Hospitality Management',
          'Supply Chain Management',
        ],
        universities: [
          'Technical University of Kenya',
          'Technical University of Mombasa',
          'Kenya Technical Trainers College',
          'Masinde Muliro University',
          'Cooperative University of Kenya',
        ],
        courses: [
          'Diploma in Business Management',
          'Diploma in Information Technology',
          'Diploma in Human Resource Management',
          'Diploma in Hospitality Management',
          'Diploma in Supply Chain Management',
        ],
        skills: [
          'Practical skills',
          'Communication',
          'Customer service',
          'Technical knowledge',
          'Teamwork',
        ],
      },
      C: {
        title: 'Vocational Path',
        description:
          'Your KCSE performance qualifies you for certificate and diploma programs at technical institutions.',
        careers: [
          'Accounting Technician',
          'ICT Technician',
          'Electrical Technician',
          'Hospitality',
          'Administrative Assistant',
        ],
        universities: [
          'Kenya Technical Trainers College',
          'Technical and Vocational Colleges',
          'Kenya Institute of Management',
          'Kenya School of Government',
          'National Industrial Training Authority Institutions',
        ],
        courses: [
          'Certificate in Business Management',
          'Certificate in Information Technology',
          'Certificate in Electrical Engineering',
          'Certificate in Food & Beverage',
          'Certificate in Office Administration',
        ],
        skills: [
          'Technical skills',
          'Practical knowledge',
          'Communication',
          'Problem-solving',
          'Customer service',
        ],
      },
      default: {
        title: 'Vocational Training Path',
        description:
          'There are many valuable vocational training opportunities available to build practical skills.',
        careers: [
          'Skilled Trades',
          'Entrepreneurship',
          'Administrative Support',
          'Sales Representative',
          'Artisan',
        ],
        universities: [
          'Technical and Vocational Colleges',
          'Youth Polytechnics',
          'National Industrial Training Authority Institutions',
          'Kenya Youth Employment Opportunities Project Centers',
          'Vocational Training Centers',
        ],
        courses: [
          'Certificate in Carpentry & Joinery',
          'Certificate in Masonry',
          'Certificate in Plumbing',
          'Certificate in Tailoring',
          'Certificate in Electrical Installation',
        ],
        skills: [
          'Practical skills',
          'Hands-on techniques',
          'Customer service',
          'Basic business skills',
          'Problem-solving',
        ],
      },
    };

    // Map grades to recommendation categories
    const gradeMap = {
      A: 'A',
      'A-': 'A-',
      'B+': 'B+',
      B: 'B',
      'B-': 'B-',
      'C+': 'C+',
      C: 'C',
      'C-': 'default',
      'D+': 'default',
      D: 'default',
      'D-': 'default',
      E: 'default',
    };

    return recommendations[gradeMap[grade] || 'default'];
  };

  const result = getCareerRecommendations(meanGrade);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleColorMode={toggleColorMode} />
      <Container component="main" maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Your Career Recommendations
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Based on your KCSE mean grade of{' '}
            <Box
              component="span"
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              {meanGrade || ''}
            </Box>
            , here are personalized career recommendations
          </Typography>
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardHeader
            title={result.title || ''}
            subheader={result.description || ''}
            sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
          />

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="recommendation tabs"
              centered
            >
              <Tab label="Careers" id="tab-0" aria-controls="tabpanel-0" />
              <Tab label="Education" id="tab-1" aria-controls="tabpanel-1" />
              <Tab label="Skills" id="tab-2" aria-controls="tabpanel-2" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recommended Careers</Typography>
              </Box>
              <List>
                {result.careers.map((career, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={career || ''} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recommended Universities</Typography>
              </Box>
              <List>
                {result.universities.map((university, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={university || ''} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MenuBookIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recommended Courses</Typography>
              </Box>
              <List>
                {result.courses.map((course, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={course || ''} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Skills to Develop</Typography>
              </Box>
              <List>
                {result.skills.map((skill, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={skill || ''} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </TabPanel>

          <CardActions sx={{ p: 3, bgcolor: 'background.default' }}>
            <Button
              component={RouterLink}
              to="/universities"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mr: 1 }}
            >
              Explore Universities
            </Button>
            <Button
              component={RouterLink}
              to="/resources"
              variant="outlined"
              fullWidth
              sx={{ mx: 1 }}
            >
              Learning Resources
            </Button>
            <Button
              component={RouterLink}
              to="/kcse-input"
              variant="outlined"
              fullWidth
              sx={{ ml: 1 }}
            >
              Enter Different Results
            </Button>
          </CardActions>
        </Card>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Next Steps
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>1.</ListItemIcon>
              <ListItemText primary="Research the recommended universities and courses in detail" />
            </ListItem>
            <ListItem>
              <ListItemIcon>2.</ListItemIcon>
              <ListItemText primary="Check the KUCCPS application deadlines and requirements" />
            </ListItem>
            <ListItem>
              <ListItemIcon>3.</ListItemIcon>
              <ListItemText primary="Explore scholarship opportunities for your chosen field" />
            </ListItem>
            <ListItem>
              <ListItemIcon>4.</ListItemIcon>
              <ListItemText primary="Connect with professionals in your desired career path" />
            </ListItem>
            <ListItem>
              <ListItemIcon>5.</ListItemIcon>
              <ListItemText primary="Develop the recommended skills through online courses and workshops" />
            </ListItem>
          </List>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

export default Results;
