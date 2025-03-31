'use client';

import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Grid,
  Avatar,
} from '@mui/material';
import { PersonAddOutlined as PersonAddOutlinedIcon } from '@mui/icons-material';

import Header from '../components/Header';
import Footer from '../components/Footer';

function SignUp({ toggleColorMode }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would handle registration here
    console.log('Sign up with:', { name, email, password, agreeTerms });
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleColorMode={toggleColorMode} />
      <Container component="main" maxWidth="xs" sx={{ py: 8, flexGrow: 1 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <PersonAddOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" gutterBottom>
            Create an account
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: 'center' }}
          >
            Enter your information to create an account
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name || ''}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email || ''}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password || ''}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Password must be at least 8 characters long"
            />
            <FormControlLabel
              control={
                <Checkbox
                  required
                  value="agree"
                  color="primary"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link component={RouterLink} to="/terms">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link component={RouterLink} to="/privacy">
                    Privacy Policy
                  </Link>
                </Typography>
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={!agreeTerms}
            >
              Create account
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2" align="center">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/sign-in" variant="body2">
                    Sign in
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

export default SignUp;
