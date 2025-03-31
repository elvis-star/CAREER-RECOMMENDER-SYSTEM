'use client';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Storage as StorageIcon,
  MenuBook as MenuBookIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  EmojiEvents as EmojiEventsIcon,
  ArrowBack,
} from '@mui/icons-material';

import Header from '../components/Header';
import Footer from '../components/Footer';

// Hero Section
function Hero() {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              component="h1"
              variant="h3"
              color="text.primary"
              gutterBottom
              fontWeight="bold"
            >
              Discover Your Ideal Career Path Based on KCSE Results
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Our data-driven system analyzes your KCSE performance to recommend
              careers that match your academic strengths and Kenya's job market
              needs.
            </Typography>
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Button
                component={RouterLink}
                to="/kcse-input"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                Enter Your KCSE Results
              </Button>
              <Button
                component={RouterLink}
                to="/resources"
                variant="outlined"
                size="large"
              >
                Explore Resources
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/placeholder.svg?height=400&width=600"
              alt="KCSE Career Guide illustration"
              sx={{
                width: '100%',
                maxWidth: 550,
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// Features Section
function Features() {
  const theme = useTheme();

  const features = [
    {
      icon: <StorageIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Data-Driven Analysis',
      description:
        'Our system analyzes your KCSE subject performance to identify your academic strengths and potential career paths.',
    },
    {
      icon: <ArrowBack sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Personalized Recommendations',
      description:
        "Get career suggestions tailored to your specific KCSE results and aligned with Kenya's job market demands.",
    },
    {
      icon: <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'University & Course Guidance',
      description:
        'Discover which Kenyan universities and courses are best suited for your academic profile and career goals.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Market-Aligned Careers',
      description:
        'Our recommendations consider current and projected job market trends in Kenya to ensure future employability.',
    },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            component="h2"
            variant="h4"
            color="text.primary"
            gutterBottom
            fontWeight="bold"
          >
            How It Works
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            Our career recommendation system uses a comprehensive approach to
            match your KCSE performance with the perfect career path
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title || ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description || ''}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// Statistics Section
function Statistics() {
  const stats = [
    {
      icon: <PeopleIcon />,
      value: '10,000+',
      label: 'Students Guided',
      description:
        'Kenyan students have received personalized career recommendations',
    },
    {
      icon: <SchoolIcon />,
      value: '85%',
      label: 'University Placement',
      description: 'Of our users successfully secured university admissions',
    },
    {
      icon: <BusinessIcon />,
      value: '90+',
      label: 'Career Paths',
      description: 'Detailed career paths analyzed and recommended',
    },
    {
      icon: <EmojiEventsIcon />,
      value: '95%',
      label: 'Satisfaction Rate',
      description: 'Students satisfied with their career recommendations',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            component="h2"
            variant="h4"
            color="text.primary"
            gutterBottom
            fontWeight="bold"
          >
            Our Impact
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            Helping Kenyan students make informed career decisions based on
            their KCSE performance
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', boxShadow: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {stat.value || ''}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {stat.label || ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.description || ''}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// Testimonials Section
function Testimonials() {
  const testimonials = [
    {
      name: 'David Kamau',
      school: 'Alliance High School',
      content:
        "After receiving my KCSE results, I was unsure which career path to take. This system analyzed my strengths in Mathematics and Sciences and recommended Engineering. I'm now studying Civil Engineering at the University of Nairobi and loving it!",
      avatar: 'DK',
    },
    {
      name: 'Faith Wanjiku',
      school: 'Kenya High School',
      content:
        "The career recommendations were spot-on! Based on my performance in Biology and Chemistry, the system suggested Medicine. The guidance on university selection and admission requirements was invaluable. Now I'm pursuing Medicine at Kenyatta University.",
      avatar: 'FW',
    },
    {
      name: 'Brian Ochieng',
      school: 'Maseno School',
      content:
        "I was torn between different career options after my KCSE. The system analyzed my results and recommended Computer Science based on my strong performance in Mathematics and Physics. I'm now at JKUAT and already developing mobile apps!",
      avatar: 'BO',
    },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            component="h2"
            variant="h4"
            color="text.primary"
            gutterBottom
            fontWeight="bold"
          >
            Success Stories
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            See how our KCSE-based career recommendation system has helped
            Kenyan students find their perfect career path
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ fontStyle: 'italic' }}
                  >
                    "{testimonial.content || ''}"
                  </Typography>
                </CardContent>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', px: 3, pb: 3 }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {testimonial.avatar || ''}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" component="div">
                      {testimonial.name || ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.school || ''}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// Partners Section
function Partners() {
  const partners = [
    {
      category: 'Universities',
      logos: [
        { name: 'University of Nairobi', abbr: 'UoN' },
        { name: 'Kenyatta University', abbr: 'KU' },
        { name: 'Jomo Kenyatta University', abbr: 'JKUAT' },
        { name: 'Moi University', abbr: 'MU' },
      ],
    },
    {
      category: 'Government',
      logos: [
        { name: 'Ministry of Education', abbr: 'MoE' },
        {
          name: 'Kenya Universities and Colleges Central Placement Service',
          abbr: 'KUCCPS',
        },
        {
          name: 'Technical and Vocational Education and Training Authority',
          abbr: 'TVETA',
        },
      ],
    },
    {
      category: 'Industry',
      logos: [
        { name: 'Kenya Association of Manufacturers', abbr: 'KAM' },
        { name: 'Kenya Private Sector Alliance', abbr: 'KEPSA' },
        { name: 'Federation of Kenya Employers', abbr: 'FKE' },
      ],
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            component="h2"
            variant="h4"
            color="text.primary"
            gutterBottom
            fontWeight="bold"
          >
            Our Partners
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto' }}
          >
            Working together with leading institutions to provide accurate and
            relevant career guidance
          </Typography>
        </Box>

        <Box sx={{ mb: 8 }}>
          {partners.map((category, idx) => (
            <Box key={idx} sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                component="h3"
                align="center"
                gutterBottom
              >
                {category.category || ''}
              </Typography>
              <Grid container spacing={3}>
                {category.logos.map((logo, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Card
                      sx={{
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        bgcolor: 'background.default',
                      }}
                    >
                      <Typography
                        variant="h5"
                        color="primary.main"
                        fontWeight="bold"
                      >
                        {logo.abbr || ''}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

function Home({ toggleColorMode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleColorMode={toggleColorMode} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Hero />
        <Features />
        <Statistics />
        <Testimonials />
        <Partners />
      </Box>
      <Footer />
    </Box>
  );
}

export default Home;
