'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Alert,
  AlertTitle,
  Grid,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
} from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

import Header from '../components/Header';
import Footer from '../components/Footer';

function KcseInput({ toggleColorMode }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      school: '',
      yearOfCompletion: '',
      gender: '',
      county: '',
    },
    compulsorySubjects: {
      english: '',
      kiswahili: '',
      mathematics: '',
    },
    scienceSubjects: {
      biology: 'not_taken',
      chemistry: 'not_taken',
      physics: 'not_taken',
    },
    humanitiesSubjects: {
      history: 'not_taken',
      geography: 'not_taken',
      cre: 'not_taken',
      ire: 'not_taken',
      hre: 'not_taken',
    },
    technicalSubjects: {
      agriculture: 'not_taken',
      businessStudies: 'not_taken',
      computerStudies: 'not_taken',
      homescience: 'not_taken',
      artDesign: 'not_taken',
    },
  });

  const counties = [
    'Mombasa',
    'Kwale',
    'Kilifi',
    'Tana River',
    'Lamu',
    'Taita Taveta',
    'Garissa',
    'Wajir',
    'Mandera',
    'Marsabit',
    'Isiolo',
    'Meru',
    'Tharaka-Nithi',
    'Embu',
    'Kitui',
    'Machakos',
    'Makueni',
    'Nyandarua',
    'Nyeri',
    'Kirinyaga',
    "Murang'a",
    'Kiambu',
    'Turkana',
    'West Pokot',
    'Samburu',
    'Trans Nzoia',
    'Uasin Gishu',
    'Elgeyo-Marakwet',
    'Nandi',
    'Baringo',
    'Laikipia',
    'Nakuru',
    'Narok',
    'Kajiado',
    'Kericho',
    'Bomet',
    'Kakamega',
    'Vihiga',
    'Bungoma',
    'Busia',
    'Siaya',
    'Kisumu',
    'Homa Bay',
    'Migori',
    'Kisii',
    'Nyamira',
    'Nairobi',
  ];

  const grades = [
    'A',
    'A-',
    'B+',
    'B',
    'B-',
    'C+',
    'C',
    'C-',
    'D+',
    'D',
    'D-',
    'E',
    'X',
  ];
  const years = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  const steps = [
    'Personal Information',
    'Compulsory Subjects',
    'Science Subjects',
    'Humanities Subjects',
    'Technical Subjects',
  ];

  const handleInputChange = (category, field, value) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [field]: value,
      },
    });
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      // Calculate mean grade and redirect
      const meanGrade = calculateMeanGrade();
      navigate(`/results?meanGrade=${meanGrade}`);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const calculateMeanGrade = () => {
    // This is a simplified calculation - in a real system, this would be more complex
    const gradePoints = {
      A: 12,
      'A-': 11,
      'B+': 10,
      B: 9,
      'B-': 8,
      'C+': 7,
      C: 6,
      'C-': 5,
      'D+': 4,
      D: 3,
      'D-': 2,
      E: 1,
      X: 0,
    };

    let totalPoints = 0;
    let subjectCount = 0;

    // Compulsory subjects
    for (const subject in formData.compulsorySubjects) {
      if (
        formData.compulsorySubjects[subject] &&
        formData.compulsorySubjects[subject] !== 'not_taken'
      ) {
        totalPoints += gradePoints[formData.compulsorySubjects[subject]];
        subjectCount++;
      }
    }

    // Science subjects
    for (const subject in formData.scienceSubjects) {
      if (
        formData.scienceSubjects[subject] &&
        formData.scienceSubjects[subject] !== 'not_taken'
      ) {
        totalPoints += gradePoints[formData.scienceSubjects[subject]];
        subjectCount++;
      }
    }

    // Humanities subjects
    for (const subject in formData.humanitiesSubjects) {
      if (
        formData.humanitiesSubjects[subject] &&
        formData.humanitiesSubjects[subject] !== 'not_taken'
      ) {
        totalPoints += gradePoints[formData.humanitiesSubjects[subject]];
        subjectCount++;
      }
    }

    // Technical subjects
    for (const subject in formData.technicalSubjects) {
      if (
        formData.technicalSubjects[subject] &&
        formData.technicalSubjects[subject] !== 'not_taken'
      ) {
        totalPoints += gradePoints[formData.technicalSubjects[subject]];
        subjectCount++;
      }
    }

    // Calculate mean grade
    const meanPoints = subjectCount > 0 ? totalPoints / subjectCount : 0;

    // Convert mean points back to grade
    const gradeRanges = [
      { min: 11.5, grade: 'A' },
      { min: 10.5, grade: 'A-' },
      { min: 9.5, grade: 'B+' },
      { min: 8.5, grade: 'B' },
      { min: 7.5, grade: 'B-' },
      { min: 6.5, grade: 'C+' },
      { min: 5.5, grade: 'C' },
      { min: 4.5, grade: 'C-' },
      { min: 3.5, grade: 'D+' },
      { min: 2.5, grade: 'D' },
      { min: 1.5, grade: 'D-' },
      { min: 0.5, grade: 'E' },
      { min: 0, grade: 'X' },
    ];

    const meanGrade =
      gradeRanges.find((range) => meanPoints >= range.min)?.grade || 'X';
    return meanGrade;
  };

  const isStepComplete = () => {
    switch (step) {
      case 0: // Personal Info
        return (
          formData.personalInfo.name &&
          formData.personalInfo.school &&
          formData.personalInfo.yearOfCompletion &&
          formData.personalInfo.gender &&
          formData.personalInfo.county
        );
      case 1: // Compulsory Subjects
        return (
          formData.compulsorySubjects.english &&
          formData.compulsorySubjects.kiswahili &&
          formData.compulsorySubjects.mathematics
        );
      case 2: // Science Subjects
        // At least one science subject is required
        return Object.values(formData.scienceSubjects).some(
          (value) => value && value !== 'not_taken'
        );
      case 3: // Humanities Subjects
        // At least one humanities subject is required
        return Object.values(formData.humanitiesSubjects).some(
          (value) => value && value !== 'not_taken'
        );
      case 4: // Technical Subjects
        // At least one technical subject is required
        return Object.values(formData.technicalSubjects).some(
          (value) => value && value !== 'not_taken'
        );
      default:
        return false;
    }
  };

  const [humanitiesTab, setHumanitiesTab] = useState(0);

  const handleHumanitiesTabChange = (event, newValue) => {
    setHumanitiesTab(newValue);
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleColorMode={toggleColorMode} />
      <Container component="main" maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Enter Your KCSE Results
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Provide your KCSE results for personalized career recommendations
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={step} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label || ''}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2">
            Step {step + 1} of {steps.length}
          </Typography>
          <Typography variant="body2">
            {Math.round(progress)}% complete
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 4, height: 8, borderRadius: 4 }}
        />

        <Card>
          <CardHeader
            title={steps[step] || ''}
            subheader={
              step === 0
                ? 'Enter your personal details'
                : step === 1
                ? 'Enter your grades for compulsory subjects'
                : step === 2
                ? 'Enter your grades for science subjects (at least one)'
                : step === 3
                ? 'Enter your grades for humanities subjects (at least one)'
                : 'Enter your grades for technical subjects (at least one)'
            }
          />
          <CardContent>
            {step === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.personalInfo.name || ''}
                    onChange={(e) =>
                      handleInputChange('personalInfo', 'name', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="school"
                    label="School"
                    placeholder="Alliance High School"
                    value={formData.personalInfo.school || ''}
                    onChange={(e) =>
                      handleInputChange(
                        'personalInfo',
                        'school',
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    select
                    id="yearOfCompletion"
                    label="Year of Completion"
                    value={formData.personalInfo.yearOfCompletion || ''}
                    onChange={(e) =>
                      handleInputChange(
                        'personalInfo',
                        'yearOfCompletion',
                        e.target.value
                      )
                    }
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year || ''}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl required fullWidth>
                    <FormLabel id="gender-label">Gender</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="gender-label"
                      name="gender"
                      value={formData.personalInfo.gender || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'personalInfo',
                          'gender',
                          e.target.value
                        )
                      }
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="Other"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    select
                    id="county"
                    label="County"
                    value={formData.personalInfo.county || ''}
                    onChange={(e) =>
                      handleInputChange(
                        'personalInfo',
                        'county',
                        e.target.value
                      )
                    }
                  >
                    {counties.map((county) => (
                      <MenuItem key={county} value={county.toLowerCase()}>
                        {county || ''}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            )}

            {step === 1 && (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <AlertTitle>Important</AlertTitle>
                  All compulsory subjects must be filled in to proceed.
                </Alert>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">English</Typography>
                      <Tooltip title="Enter your KCSE grade for English">
                        <IconButton size="small">
                          <HelpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      required
                      fullWidth
                      select
                      id="english"
                      value={formData.compulsorySubjects.english || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'compulsorySubjects',
                          'english',
                          e.target.value
                        )
                      }
                    >
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade || ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Kiswahili</Typography>
                      <Tooltip title="Enter your KCSE grade for Kiswahili">
                        <IconButton size="small">
                          <HelpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      required
                      fullWidth
                      select
                      id="kiswahili"
                      value={formData.compulsorySubjects.kiswahili || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'compulsorySubjects',
                          'kiswahili',
                          e.target.value
                        )
                      }
                    >
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade || ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Mathematics</Typography>
                      <Tooltip title="Enter your KCSE grade for Mathematics">
                        <IconButton size="small">
                          <HelpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      required
                      fullWidth
                      select
                      id="mathematics"
                      value={formData.compulsorySubjects.mathematics || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'compulsorySubjects',
                          'mathematics',
                          e.target.value
                        )
                      }
                    >
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade || ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            )}

            {step === 2 && (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <AlertTitle>Important</AlertTitle>
                  Select at least one science subject to proceed.
                </Alert>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Biology</Typography>
                      <Tooltip title="Enter your KCSE grade for Biology">
                        <IconButton size="small">
                          <HelpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      select
                      id="biology"
                      value={formData.scienceSubjects.biology || 'not_taken'}
                      onChange={(e) =>
                        handleInputChange(
                          'scienceSubjects',
                          'biology',
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="not_taken">Not taken</MenuItem>
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade || ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Chemistry</Typography>
                      <Tooltip title="Enter your KCSE grade for Chemistry">
                        <IconButton size="small">
                          <HelpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      select
                      id="chemistry"
                      value={formData.scienceSubjects.chemistry || 'not_taken'}
                      onChange={(e) =>
                        handleInputChange(
                          'scienceSubjects',
                          'chemistry',
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="not_taken">Not taken</MenuItem>
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade || ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Physics</Typography>
                      <Tooltip title="Enter your KCSE grade for Physics">
                        <IconButton size="small">
                          <HelpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <TextField
                      fullWidth
                      select
                      id="physics"
                      value={formData.scienceSubjects.physics || 'not_taken'}
                      onChange={(e) =>
                        handleInputChange(
                          'scienceSubjects',
                          'physics',
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="not_taken">Not taken</MenuItem>
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade || ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            )}

            {step === 3 && (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <AlertTitle>Important</AlertTitle>
                  Select at least one humanities subject to proceed.
                </Alert>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs
                    value={humanitiesTab}
                    onChange={handleHumanitiesTabChange}
                    aria-label="humanities tabs"
                  >
                    <Tab label="History & Geography" />
                    <Tab label="Religious Studies" />
                  </Tabs>
                </Box>

                {humanitiesTab === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        History
                      </Typography>
                      <TextField
                        fullWidth
                        select
                        id="history"
                        value={
                          formData.humanitiesSubjects.history || 'not_taken'
                        }
                        onChange={(e) =>
                          handleInputChange(
                            'humanitiesSubjects',
                            'history',
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="not_taken">Not taken</MenuItem>
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            {grade || ''}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Geography
                      </Typography>
                      <TextField
                        fullWidth
                        select
                        id="geography"
                        value={
                          formData.humanitiesSubjects.geography || 'not_taken'
                        }
                        onChange={(e) =>
                          handleInputChange(
                            'humanitiesSubjects',
                            'geography',
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="not_taken">Not taken</MenuItem>
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            {grade || ''}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                )}

                {humanitiesTab === 1 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Christian Religious Education
                      </Typography>
                      <TextField
                        fullWidth
                        select
                        id="cre"
                        value={formData.humanitiesSubjects.cre || 'not_taken'}
                        onChange={(e) =>
                          handleInputChange(
                            'humanitiesSubjects',
                            'cre',
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="not_taken">Not taken</MenuItem>
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            {grade || ''}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Islamic Religious Education
                      </Typography>
                      <TextField
                        fullWidth
                        select
                        id="ire"
                        value={formData.humanitiesSubjects.ire || 'not_taken'}
                        onChange={(e) =>
                          handleInputChange(
                            'humanitiesSubjects',
                            'ire',
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="not_taken">Not taken</MenuItem>
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            {grade || ''}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Hindu Religious Education
                      </Typography>
                      <TextField
                        fullWidth
                        select
                        id="hre"
                        value={formData.humanitiesSubjects.hre || 'not_taken'}
                        onChange={(e) =>
                          handleInputChange(
                            'humanitiesSubjects',
                            'hre',
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="not_taken">Not taken</MenuItem>
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            {grade || ''}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}

            {step === 4 && (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <AlertTitle>Important</AlertTitle>
                  Select at least one technical subject to proceed.
                </Alert>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      Agriculture
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      id="agriculture"
                      value={
                        formData.technicalSubjects.agriculture || 'not_taken'
                      }
                      onChange={(e) =>
                        handleInputChange(
                          'technicalSubjects',
                          'agriculture',
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="not_taken">Not taken</MenuItem>
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade || ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      Business Studies
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      id="businessStudies"
                      value={
                        formData.technicalSubjects.businessStudies ||
                        'not_taken'
                      }
                      onChange={(e) =>
                        handleInputChange(
                          'technicalSubjects',
                          'businessStudies',
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="not_taken">Not taken</MenuItem>
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade || ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      Computer Studies
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      id="computerStudies"
                      value={
                        formData.technicalSubjects.computerStudies ||
                        'not_taken'
                      }
                      onChange={(e) =>
                        handleInputChange(
                          'technicalSubjects',
                          'computerStudies',
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="not_taken">Not taken</MenuItem>
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade || ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      Home Science
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      id="homescience"
                      value={
                        formData.technicalSubjects.homescience || 'not_taken'
                      }
                      onChange={(e) =>
                        handleInputChange(
                          'technicalSubjects',
                          'homescience',
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="not_taken">Not taken</MenuItem>
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade || ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      Art & Design
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      id="artDesign"
                      value={
                        formData.technicalSubjects.artDesign || 'not_taken'
                      }
                      onChange={(e) =>
                        handleInputChange(
                          'technicalSubjects',
                          'artDesign',
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="not_taken">Not taken</MenuItem>
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade || ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', p: 3 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={step === 0}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!isStepComplete()}
            >
              {step < steps.length - 1 ? 'Next' : 'Get Recommendations'}
            </Button>
          </CardActions>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
}

export default KcseInput;
