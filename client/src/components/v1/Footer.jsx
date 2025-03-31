import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{ py: 6, borderTop: 1, borderColor: 'divider' }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="div" fontWeight="bold">
                KCSE CareerGuide
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Data-driven career guidance for Kenyan students based on KCSE
              results.
            </Typography>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/kcse-input"
                  color="text.secondary"
                  underline="hover"
                >
                  Enter KCSE Results
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/resources"
                  color="text.secondary"
                  underline="hover"
                >
                  Resources
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/universities"
                  color="text.secondary"
                  underline="hover"
                >
                  Universities
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/about"
                  color="text.secondary"
                  underline="hover"
                >
                  About Us
                </Link>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Resources
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/blog"
                  color="text.secondary"
                  underline="hover"
                >
                  Career Blog
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/kuccps"
                  color="text.secondary"
                  underline="hover"
                >
                  KUCCPS Information
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/scholarships"
                  color="text.secondary"
                  underline="hover"
                >
                  Scholarships
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/faq"
                  color="text.secondary"
                  underline="hover"
                >
                  FAQs
                </Link>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Contact
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1, color: 'text.secondary' }}>
                Email: info@kcsecareerguide.co.ke
              </Box>
              <Box component="li" sx={{ mb: 1, color: 'text.secondary' }}>
                Phone: +254 700 000 000
              </Box>
              <Box component="li" sx={{ mb: 1, color: 'text.secondary' }}>
                Machakos University, Machakos, Kenya
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 6, mb: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            align={{ xs: 'center', md: 'left' }}
          >
            © 2025 KCSE CareerGuide. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mt: { xs: 2, md: 0 } }}>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              Terms
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              Privacy
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
