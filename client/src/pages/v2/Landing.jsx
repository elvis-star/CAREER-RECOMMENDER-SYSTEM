'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Button,
  Row,
  Col,
  Space,
  Progress,
  Avatar,
  Badge,
} from 'antd';
import {
  GraduationCap,
  TrendingUp,
  School,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Users,
  Award,
  BookOpen,
  Star,
  Sparkles,
  Target,
  Brain,
  Zap,
  Globe,
  Shield,
  Clock,
  Heart,
  Play,
  ChevronLeft,
  Quote,
  MapPin,
  Calendar,
  Trophy,
  Rocket,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Text, Paragraph } = Typography;

const Landing = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    howItWorks: false,
    stats: false,
    testimonials: false,
    cta: false,
  });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const [statsAnimated, setStatsAnimated] = useState(false);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced Intersection Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50px',
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));

          // Trigger stats animation
          if (entry.target.id === 'stats' && !statsAnimated) {
            setStatsAnimated(true);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    const sections = [
      'hero',
      'features',
      'howItWorks',
      'stats',
      'testimonials',
      'cta',
    ];

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) observer.unobserve(element);
      });
    };
  }, [statsAnimated]);

  // Auto-rotate testimonials with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'James Kimani',
      role: 'Computer Science Student',
      university: 'University of Nairobi',
      location: 'Nairobi, Kenya',
      image: '/david.png?height=80&width=80&text=JK',
      quote:
        "This platform completely transformed my career planning journey. The AI recommendations were incredibly accurate and helped me discover opportunities I never knew existed. Now I'm confidently pursuing computer science with a clear roadmap!",
      rating: 5,
      achievement: 'Secured internship at top tech company',
      date: '2024',
      subjects: ['Mathematics A', 'Physics A-', 'Chemistry B+'],
      careerMatch: '95%',
    },
    {
      id: 2,
      name: 'Grace Otieno',
      role: 'Career Counselor',
      organization: 'Kenya Education Board',
      location: 'Kisumu, Kenya',
      image: '/amina.png?height=80&width=80&text=GO',
      quote:
        "As a career counselor with 15 years of experience, I can confidently say this is the most comprehensive career guidance tool I've encountered. The data-driven recommendations perfectly align with current market demands.",
      rating: 5,
      achievement: 'Helped 500+ students find their paths',
      date: '2024',
      experience: '15 years',
      studentsHelped: '500+',
    },
    {
      id: 3,
      name: 'Peter Njoroge',
      role: 'Engineering Student',
      university: 'Jomo Kenyatta University',
      location: 'Kiambu, Kenya',
      image: '/michael.png?height=80&width=80&text=PN',
      quote:
        'The career matching algorithm was spot-on! It analyzed my KCSE results and interests to recommend electrical engineering. The detailed career path information and salary insights helped me make the right choice.',
      rating: 5,
      achievement: 'Top 5% in engineering program',
      date: '2023',
      subjects: ['Mathematics A', 'Physics A', 'Chemistry B'],
      careerMatch: '92%',
    },
    {
      id: 4,
      name: 'Sarah Wanjiku',
      role: 'Medical Student',
      university: 'University of Nairobi',
      location: 'Nairobi, Kenya',
      image: '/Sarah.png?height=80&width=80&text=SW',
      quote:
        "The platform's comprehensive analysis of my strengths in biology and chemistry guided me toward medicine. The career insights and university recommendations were invaluable in my decision-making process.",
      rating: 5,
      achievement: "Dean's List for 3 consecutive semesters",
      date: '2023',
      subjects: ['Biology A', 'Chemistry A-', 'Mathematics B+'],
      careerMatch: '98%',
    },
  ];

  // Enhanced statistics with animations
  const statistics = [
    {
      icon: <Users size={40} />,
      value: 15000,
      suffix: '+',
      label: 'Students Guided',
      description: 'Across Kenya since 2022',
      color: 'blue',
      growth: '+25% this year',
    },
    {
      icon: <BookOpen size={40} />,
      value: 350,
      suffix: '+',
      label: 'Career Paths',
      description: 'In our comprehensive database',
      color: 'green',
      growth: '+50 new careers added',
    },
    {
      icon: <School size={40} />,
      value: 75,
      suffix: '+',
      label: 'Partner Universities',
      description: 'Across East Africa',
      color: 'purple',
      growth: '+15 new partnerships',
    },
    {
      icon: <Award size={40} />,
      value: 97,
      suffix: '%',
      label: 'Success Rate',
      description: 'Students satisfied with recommendations',
      color: 'orange',
      growth: '+2% improvement',
    },
  ];

  // Enhanced features data
  const features = [
    {
      icon: <Brain size={48} />,
      title: 'AI-Powered Analysis',
      description:
        'Advanced machine learning algorithms analyze your KCSE results, identifying patterns and strengths to provide highly accurate career recommendations.',
      color: 'blue',
      benefits: [
        'Pattern Recognition',
        'Predictive Analytics',
        'Continuous Learning',
      ],
      accuracy: '95%',
    },
    {
      icon: <Target size={48} />,
      title: 'Personalized Matching',
      description:
        'Get career suggestions tailored specifically to your academic profile, interests, and the current job market demands in Kenya and beyond.',
      color: 'green',
      benefits: ['Custom Profiles', 'Interest Assessment', 'Market Alignment'],
      accuracy: '92%',
    },
    {
      icon: <BarChart3 size={48} />,
      title: 'Market Intelligence',
      description:
        'Access real-time data on job market trends, salary ranges, and career growth prospects to make informed decisions about your future.',
      color: 'purple',
      benefits: ['Real-time Data', 'Salary Insights', 'Growth Projections'],
      accuracy: '98%',
    },
    {
      icon: <Rocket size={48} />,
      title: 'Career Roadmaps',
      description:
        'Receive detailed step-by-step guidance on how to achieve your career goals, including education requirements and skill development paths.',
      color: 'orange',
      benefits: ['Step-by-step Plans', 'Skill Mapping', 'Timeline Planning'],
      accuracy: '90%',
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Enhanced Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        className={`
          relative min-h-screen flex items-center justify-center overflow-hidden
          ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
              : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
          }
          transition-all duration-1000 transform
          ${
            isVisible.hero
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }
        `}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <div
            className="absolute w-96 h-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse"
            style={{
              top: '10%',
              right: `${20 + mousePosition.x * 0.02}%`,
              animationDelay: '0s',
              animationDuration: '4s',
            }}
          />
          <div
            className="absolute w-80 h-80 rounded-full bg-purple-500/20 blur-3xl animate-pulse"
            style={{
              top: `${60 + mousePosition.y * 0.01}%`,
              left: `${10 + mousePosition.x * 0.015}%`,
              animationDelay: '2s',
              animationDuration: '5s',
            }}
          />
          <div
            className="absolute w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl animate-pulse"
            style={{
              bottom: '20%',
              right: `${30 + mousePosition.x * 0.01}%`,
              animationDelay: '1s',
              animationDuration: '6s',
            }}
          />

          {/* Geometric Patterns */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-20 left-20 w-32 h-32 border border-blue-300 rotate-45 animate-spin"
              style={{ animationDuration: '20s' }}
            />
            <div
              className="absolute bottom-20 right-20 w-24 h-24 border border-purple-300 rotate-12 animate-bounce"
              style={{ animationDuration: '3s' }}
            />
            <div
              className="absolute top-1/2 left-10 w-16 h-16 border border-indigo-300 rounded-full animate-ping"
              style={{ animationDuration: '4s' }}
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 animate-fade-in-up">
            <Sparkles size={20} className="mr-2 text-yellow-400" />
            <span className="font-medium">
              Trusted by 15,000+ Kenyan Students
            </span>
            <Badge count="New" className="ml-2" />
          </div>

          {/* Main Headline */}
          <div
            className="mb-8 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <Title
              level={1}
              className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight"
            >
              Discover Your Perfect
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Career Path
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-4 bg-gradient-to-r from-yellow-400/30 to-red-500/30 blur-sm transform -rotate-1" />
              </span>
            </Title>
          </div>

          {/* Enhanced Subtitle */}
          <div
            className="mb-12 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Paragraph className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Our revolutionary AI-powered Career Recommender System analyzes
              your KCSE results with
              <span className="font-semibold text-yellow-400">
                {' '}
                95% accuracy
              </span>{' '}
              to suggest personalized career paths that match your academic
              strengths and Kenya's evolving job market.
            </Paragraph>
          </div>

          {/* Enhanced CTA Buttons */}
          <div
            className="mb-12 animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            <Space size="large" className="flex-wrap justify-center">
              <Button
                type="primary"
                size="large"
                className="h-14 px-8 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/register" className="flex items-center">
                  <Rocket size={20} className="mr-2" />
                  Start Your Journey
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              </Button>

              <Button
                size="large"
                className="h-14 px-8 text-lg font-semibold rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 hover:border-white/40 shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => setIsHeroVideoPlaying(true)}
              >
                <Play size={20} className="mr-2" />
                Watch Demo
              </Button>
            </Space>
          </div>

          {/* Trust Indicators */}
          <div
            className="flex flex-wrap justify-center gap-8 mb-12 animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            <div className="flex items-center text-white/80">
              <CheckCircle size={24} className="text-green-400 mr-3" />
              <span className="font-medium">AI-Powered Recommendations</span>
            </div>
            <div className="flex items-center text-white/80">
              <Shield size={24} className="text-blue-400 mr-3" />
              <span className="font-medium">Data Privacy Protected</span>
            </div>
            <div className="flex items-center text-white/80">
              <Zap size={24} className="text-yellow-400 mr-3" />
              <span className="font-medium">Instant Results</span>
            </div>
          </div>

          {/* Hero Visual */}
          <div
            className="relative max-w-5xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '1s' }}
          >
            <div className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-2xl" />
            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <img
                src="/DashboardPreview.png?height=400&width=800&text=Career+Dashboard+Preview"
                alt="Career Recommender Dashboard Preview"
                className="w-full h-auto object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                Live Demo
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section
        id="features"
        className={`
          py-24 relative overflow-hidden
          ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
          transition-all duration-1000 transform
          ${
            isVisible.features
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mb-6 font-medium">
              <Sparkles size={20} className="mr-2" />
              Revolutionary Features
            </div>
            <Title
              level={2}
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Why Students Choose Our Platform
            </Title>
            <Paragraph
              className={`text-xl max-w-3xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Experience the future of career guidance with our cutting-edge
              technology and comprehensive approach to career planning.
            </Paragraph>
          </div>

          {/* Enhanced Feature Cards */}
          <Row gutter={[32, 32]} className="mb-16">
            {features.map((feature, index) => (
              <Col xs={24} md={12} lg={6} key={index}>
                <FeatureCard
                  {...feature}
                  delay={index * 0.1}
                  isVisible={isVisible.features}
                  isDarkMode={isDarkMode}
                />
              </Col>
            ))}
          </Row>

          {/* Feature Showcase */}
          <div
            className={`rounded-3xl p-8 md:p-12 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            } relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-sm font-medium">
                    <Target size={16} className="mr-2" />
                    Advanced Analytics
                  </div>
                  <Title
                    level={3}
                    className={`text-3xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Precision Career Matching
                  </Title>
                  <Paragraph
                    className={`text-lg ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Our sophisticated algorithm doesn't just look at grades—it
                    analyzes patterns, identifies strengths, and considers
                    market trends to provide recommendations with
                    industry-leading accuracy.
                  </Paragraph>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Recommendation Accuracy
                      </span>
                      <span className="text-green-500 font-bold">95%</span>
                    </div>
                    <Progress
                      percent={95}
                      strokeColor="#10B981"
                      showInfo={false}
                    />

                    <div className="flex items-center justify-between">
                      <span
                        className={`font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Student Satisfaction
                      </span>
                      <span className="text-blue-500 font-bold">97%</span>
                    </div>
                    <Progress
                      percent={97}
                      strokeColor="#3B82F6"
                      showInfo={false}
                    />
                  </div>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="relative">
                  <img
                    src="/AnalyticsDashboard.png?height=400&width=500&text=Analytics+Dashboard"
                    alt="Analytics Dashboard"
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                  <div className="absolute -top-4 -right-4 bg-blue-500 text-white p-4 rounded-2xl shadow-xl animate-pulse">
                    <BarChart3 size={32} />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section
        id="howItWorks"
        className={`
          py-24 relative overflow-hidden
          ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}
          transition-all duration-1000 transform
          ${
            isVisible.howItWorks
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 mb-6 font-medium">
              <Zap size={20} className="mr-2" />
              Simple Process
            </div>
            <Title
              level={2}
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Your Journey to Success
            </Title>
            <Paragraph
              className={`text-xl max-w-3xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Get personalized career recommendations in just three simple steps
            </Paragraph>
          </div>

          {/* Enhanced Process Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transform -translate-y-1/2 rounded-full" />

            <Row gutter={[32, 32]}>
              {[
                {
                  number: '01',
                  title: 'Input Your KCSE Results',
                  description:
                    'Securely enter your KCSE grades for all subjects. Our system uses advanced encryption to protect your data while analyzing your academic strengths.',
                  icon: <GraduationCap size={48} />,
                  color: 'blue',
                  features: [
                    'Secure Data Entry',
                    'Grade Validation',
                    'Subject Analysis',
                  ],
                },
                {
                  number: '02',
                  title: 'AI Analysis & Matching',
                  description:
                    'Our sophisticated AI algorithms analyze your results, identify patterns, and match them with career paths that align with your strengths and market demands.',
                  icon: <Brain size={48} />,
                  color: 'purple',
                  features: [
                    'Pattern Recognition',
                    'Market Analysis',
                    'Strength Mapping',
                  ],
                },
                {
                  number: '03',
                  title: 'Explore Your Future',
                  description:
                    'Receive detailed career recommendations with salary insights, education requirements, and step-by-step roadmaps to achieve your goals.',
                  icon: <Target size={48} />,
                  color: 'green',
                  features: [
                    'Career Roadmaps',
                    'Salary Insights',
                    'University Guidance',
                  ],
                },
              ].map((step, index) => (
                <Col xs={24} lg={8} key={index}>
                  <StepCard
                    {...step}
                    delay={index * 0.2}
                    isVisible={isVisible.howItWorks}
                    isDarkMode={isDarkMode}
                  />
                </Col>
              ))}
            </Row>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div
              className={`inline-block p-8 rounded-3xl ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-2xl border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4">
                  <Rocket size={32} />
                </div>
                <Title
                  level={3}
                  className={`mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Ready to Discover Your Path?
                </Title>
                <Paragraph
                  className={`text-lg mb-6 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Join thousands of students who have found their perfect career
                  match
                </Paragraph>
              </div>
              <Button
                type="primary"
                size="large"
                className="h-12 px-8 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/register" className="flex items-center">
                  Get Started Free
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section
        id="stats"
        ref={statsRef}
        className={`
          py-24 relative overflow-hidden
          ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
          transition-all duration-1000 transform
          ${
            isVisible.stats
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 mb-6 font-medium">
              <TrendingUp size={20} className="mr-2" />
              Our Impact
            </div>
            <Title
              level={2}
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Transforming Lives Across Kenya
            </Title>
            <Paragraph
              className={`text-xl max-w-3xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Real numbers that showcase our commitment to helping students
              succeed
            </Paragraph>
          </div>

          {/* Enhanced Statistics Grid */}
          <Row gutter={[32, 32]} className="mb-16">
            {statistics.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <StatCard
                  {...stat}
                  delay={index * 0.1}
                  isVisible={isVisible.stats}
                  isAnimated={statsAnimated}
                  isDarkMode={isDarkMode}
                />
              </Col>
            ))}
          </Row>

          {/* Success Stories Preview */}
          <div
            className={`rounded-3xl p-8 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            } relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="text-center mb-12">
                <Title
                  level={3}
                  className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Success Stories from Every County
                </Title>
                <Paragraph
                  className={`text-lg ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Students from all 47 counties have found their perfect career
                  paths
                </Paragraph>
              </div>

              <Row gutter={[24, 24]}>
                {[
                  {
                    county: 'Nairobi',
                    students: '2,500+',
                    topCareer: 'Technology',
                  },
                  {
                    county: 'Kiambu',
                    students: '1,800+',
                    topCareer: 'Engineering',
                  },
                  {
                    county: 'Nakuru',
                    students: '1,200+',
                    topCareer: 'Agriculture',
                  },
                  {
                    county: 'Mombasa',
                    students: '1,000+',
                    topCareer: 'Maritime',
                  },
                ].map((location, index) => (
                  <Col xs={24} sm={12} lg={6} key={index}>
                    <div
                      className={`p-6 rounded-2xl ${
                        isDarkMode ? 'bg-gray-700' : 'bg-white'
                      } shadow-lg text-center`}
                    >
                      <MapPin
                        size={32}
                        className="text-blue-500 mx-auto mb-3"
                      />
                      <Title
                        level={4}
                        className={`mb-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {location.county}
                      </Title>
                      <Text className="text-blue-500 font-bold text-lg block mb-1">
                        {location.students}
                      </Text>
                      <Text
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Top: {location.topCareer}
                      </Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section
        id="testimonials"
        className={`
          py-24 relative overflow-hidden
          ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}
          transition-all duration-1000 transform
          ${
            isVisible.testimonials
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 mb-6 font-medium">
              <Heart size={20} className="mr-2" />
              Student Success Stories
            </div>
            <Title
              level={2}
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Hear From Our Success Stories
            </Title>
            <Paragraph
              className={`text-xl max-w-3xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Real students sharing how our platform transformed their career
              journey
            </Paragraph>
          </div>

          {/* Enhanced Testimonial Carousel */}
          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <TestimonialCard
                      testimonial={testimonial}
                      isActive={index === currentTestimonial}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <Button
                shape="circle"
                size="large"
                onClick={() =>
                  setCurrentTestimonial(
                    (prev) =>
                      (prev - 1 + testimonials.length) % testimonials.length
                  )
                }
                className={`${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
              >
                <ChevronLeft size={20} />
              </Button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-blue-500 w-8'
                        : isDarkMode
                        ? 'bg-gray-600'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                shape="circle"
                size="large"
                onClick={() =>
                  setCurrentTestimonial(
                    (prev) => (prev + 1) % testimonials.length
                  )
                }
                className={`${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA Section */}
      <section
        id="cta"
        className={`
          py-24 relative overflow-hidden
          ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
          transition-all duration-1000 transform
          ${
            isVisible.cta
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-12 md:p-16 text-center">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white mb-8 font-medium">
                <Rocket size={20} className="mr-2" />
                Start Your Journey Today
              </div>

              <Title
                level={1}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                Your Dream Career
                <br />
                <span className="text-yellow-400">Awaits You</span>
              </Title>

              <Paragraph className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
                Join over 15,000 Kenyan students who have discovered their
                perfect career path. Get personalized recommendations in
                minutes, not months.
              </Paragraph>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Button
                  type="primary"
                  size="large"
                  className="h-16 px-12 text-xl font-bold rounded-full bg-white text-blue-600 border-0 hover:bg-gray-100 shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link to="/register" className="flex items-center">
                    <Sparkles size={24} className="mr-3" />
                    Get Started Free
                    <ArrowRight size={24} className="ml-3" />
                  </Link>
                </Button>

                <div className="flex items-center text-white/80">
                  <Clock size={20} className="mr-2" />
                  <span className="font-medium">
                    Results in under 5 minutes
                  </span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-8 text-white/70">
                <div className="flex items-center">
                  <Shield size={20} className="mr-2" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center">
                  <Users size={20} className="mr-2" />
                  <span>15,000+ Students</span>
                </div>
                <div className="flex items-center">
                  <Award size={20} className="mr-2" />
                  <span>97% Success Rate</span>
                </div>
                <div className="flex items-center">
                  <Globe size={20} className="mr-2" />
                  <span>All 47 Counties</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Enhanced Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
  color,
  benefits,
  accuracy,
  delay,
  isVisible,
  isDarkMode,
}) => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div
      className={`
        group h-full transition-all duration-700 transform hover:-translate-y-2
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
      `}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div
        className={`
        h-full p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden
        ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }
        shadow-lg hover:shadow-2xl group-hover:shadow-blue-500/10
      `}
      >
        {/* Background Gradient */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorMap[color]} opacity-10 rounded-full blur-2xl`}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colorMap[color]} text-white mb-6 shadow-lg`}
          >
            {icon}
          </div>

          {/* Content */}
          <Title
            level={4}
            className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </Title>

          <Paragraph
            className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {description}
          </Paragraph>

          {/* Benefits */}
          <div className="space-y-2 mb-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle
                  size={16}
                  className="text-green-500 mr-2 flex-shrink-0"
                />
                <Text
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {benefit}
                </Text>
              </div>
            ))}
          </div>

          {/* Accuracy Badge */}
          <div className="flex items-center justify-between">
            <div
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${colorMap[color]} text-white text-sm font-medium`}
            >
              {accuracy} Accurate
            </div>
            <ArrowRight
              size={16}
              className={`${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              } group-hover:translate-x-1 transition-transform duration-300`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Step Card Component
const StepCard = ({
  number,
  title,
  description,
  icon,
  color,
  features,
  delay,
  isVisible,
  isDarkMode,
}) => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
  };

  return (
    <div
      className={`
        group relative transition-all duration-700 transform hover:-translate-y-2
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
      `}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div
        className={`
        h-full p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden
        ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }
        shadow-lg hover:shadow-2xl group-hover:shadow-purple-500/10
      `}
      >
        {/* Step Number */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
          <span
            className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {number}
          </span>
        </div>

        {/* Background Gradient */}
        <div
          className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${colorMap[color]} opacity-10 rounded-full blur-2xl`}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colorMap[color]} text-white mb-6 shadow-lg`}
          >
            {icon}
          </div>

          {/* Content */}
          <Title
            level={4}
            className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </Title>

          <Paragraph
            className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {description}
          </Paragraph>

          {/* Features */}
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorMap[color]} mr-3`}
                />
                <Text
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {feature}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Stat Card Component
const StatCard = ({
  icon,
  value,
  suffix,
  label,
  description,
  color,
  growth,
  delay,
  isVisible,
  isAnimated,
  isDarkMode,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (isAnimated) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isAnimated, value]);

  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div
      className={`
        group transition-all duration-700 transform hover:-translate-y-1
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
      `}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div
        className={`
        h-full p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden text-center
        ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }
        shadow-lg hover:shadow-2xl group-hover:shadow-blue-500/10
      `}
      >
        {/* Background Elements */}
        <div
          className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorMap[color]} opacity-10 rounded-full blur-xl`}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colorMap[color]} text-white mb-6 shadow-lg`}
          >
            {icon}
          </div>

          {/* Value */}
          <div className="mb-4">
            <div
              className={`text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-2`}
            >
              {isAnimated
                ? animatedValue.toLocaleString()
                : value.toLocaleString()}
              {suffix}
            </div>
            <Title
              level={4}
              className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {label}
            </Title>
          </div>

          {/* Description */}
          <Paragraph
            className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {description}
          </Paragraph>

          {/* Growth Indicator */}
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${colorMap[color]} text-white text-sm font-medium`}
          >
            <TrendingUp size={14} className="mr-1" />
            {growth}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Testimonial Card Component
const TestimonialCard = ({ testimonial, isActive, isDarkMode }) => {
  return (
    <div
      className={`
      p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      ${isActive ? 'shadow-2xl scale-105' : 'shadow-lg'}
    `}
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
      <Quote
        size={48}
        className={`absolute top-6 right-6 ${
          isDarkMode ? 'text-gray-700' : 'text-gray-200'
        }`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start space-x-6 mb-6">
          <div className="relative flex-shrink-0">
            <Avatar
              size={80}
              src={testimonial.image}
              className="border-4 border-blue-100 dark:border-blue-900 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
              <CheckCircle size={16} className="text-white" />
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <Title
                level={4}
                className={`mb-0 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {testimonial.name}
              </Title>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : isDarkMode
                        ? 'text-gray-600'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
            </div>

            <Text
              className={`block mb-1 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              } font-medium`}
            >
              {testimonial.role}
            </Text>

            <div className="flex items-center text-sm text-gray-500 space-x-4">
              {testimonial.university && (
                <div className="flex items-center">
                  <School size={14} className="mr-1" />
                  {testimonial.university}
                </div>
              )}
              {testimonial.location && (
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {testimonial.location}
                </div>
              )}
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {testimonial.date}
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <Paragraph
          className={`text-lg italic mb-6 leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          "{testimonial.quote}"
        </Paragraph>

        {/* Achievement & Stats */}
        <div className="space-y-4">
          <div
            className={`p-4 rounded-2xl ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            } border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy size={20} className="text-yellow-500 mr-2" />
                <Text
                  className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Achievement
                </Text>
              </div>
              <Text
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {testimonial.achievement}
              </Text>
            </div>
          </div>

          {testimonial.careerMatch && (
            <div className="flex items-center justify-between">
              <Text
                className={`font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Career Match Accuracy
              </Text>
              <div className="flex items-center">
                <Progress
                  percent={Number.parseInt(testimonial.careerMatch)}
                  size="small"
                  strokeColor="#10B981"
                  className="w-20 mr-2"
                  showInfo={false}
                />
                <Text className="text-green-500 font-bold">
                  {testimonial.careerMatch}
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
