import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Avatar,
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  EmojiEvents as EmojiEventsIcon,
  ArrowBack,
} from '@mui/icons-material';

import Header from '../components/Header';
import Footer from '../components/Footer';

function About({ toggleColorMode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleColorMode={toggleColorMode} />
      <Container component="main" sx={{ py: 8, flexGrow: 1 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', mb: 8, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            About KCSE CareerGuide
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Bridging the gap between KCSE performance and informed career
            decisions for Kenyan students
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowBack color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h5">Our Mission</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  To provide data-driven career guidance to Kenyan students
                  based on their KCSE performance, helping them make informed
                  decisions about their educational and professional futures.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h5">Our Vision</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  To become the leading career guidance platform in Kenya,
                  ensuring every student has access to personalized career
                  recommendations that align with their academic strengths and
                  market demands.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 4, mb: 8 }}>
          <Typography variant="h4" gutterBottom>
            The Problem We're Solving
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Many KCSE graduates in Kenya struggle with career selection due to a
            lack of personalized guidance, leading to misaligned choices and
            underemployment. The lack of structured career guidance leads to
            students making uninformed decisions about higher education and
            professional training.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            As a result, they often select courses that do not align with their
            academic strengths or the demands of the job market. This mismatch
            between students' abilities and their chosen careers contributes to
            dissatisfaction, poor academic performance in tertiary institutions,
            and increased underemployment.
          </Typography>
        </Paper>

        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Our Approach
        </Typography>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuBookIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Data-Driven Analysis</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  We analyze the relationship between KCSE subject performance
                  and career suitability, using educational data and labor
                  market information to provide accurate recommendations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Personalized Guidance</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Our system provides tailored career recommendations based on
                  individual KCSE results, ensuring students receive guidance
                  aligned with their academic strengths.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Comprehensive Resources
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  We provide information on universities, courses, scholarships,
                  and career development resources to support students
                  throughout their educational journey.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowBack color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Market Alignment</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Our recommendations consider current and projected job market
                  trends in Kenya to ensure students pursue careers with strong
                  employment prospects.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 4, mb: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            About the Developer
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SchoolIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Avatar>

            <Box>
              <Typography variant="h5" gutterBottom>
                Timothy Tubula Nkaya
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Computer Science Student at Machakos University
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Passionate about leveraging technology to solve educational
                challenges in Kenya. This project was developed as part of a
                commitment to improve career guidance for Kenyan students and
                help bridge the gap between education and employment.
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 4, mb: 8 }}>
          <Typography variant="h4" gutterBottom>
            Research Methodology
          </Typography>
          <Typography variant="body1" paragraph>
            This system was developed using a comprehensive research approach
            that included:
          </Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Analysis of KCSE performance data and its correlation with
                success in various fields
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Interviews with career counselors, educators, and industry
                professionals
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Review of existing literature on career guidance in Kenya
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Survey of students' experiences with career selection after KCSE
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Analysis of labor market trends and employment opportunities in
                Kenya
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            For inquiries, feedback, or collaboration opportunities:
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Email: info@kcsecareerguide.co.ke
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Phone: +254 700 000 000
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Address: Machakos University, Machakos, Kenya
          </Typography>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

export default About;
