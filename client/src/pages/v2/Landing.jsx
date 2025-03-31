'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Row,
  Col,
  Space,
  Card,
  Statistic,
  Carousel,
} from 'antd';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  School,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Users,
  Award,
  BookOpen,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Text, Paragraph } = Typography;

const Landing = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isVisible, setIsVisible] = useState({
    features: false,
    howItWorks: false,
    stats: false,
    testimonials: false,
  });

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const sections = ['features', 'howItWorks', 'stats', 'testimonials'];
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
  }, []);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'James Kimani',
      role: 'Computer Science Student',
      image: '/user.avif?height=80&width=80',
      quote:
        "This platform helped me discover career paths I never knew existed. Now I'm pursuing computer science with confidence!",
      rating: 5,
    },
    {
      id: 2,
      name: 'Grace Otieno',
      role: 'Career Advisor',
      image: '/user.avif?height=80&width=80',
      quote:
        'As a career counselor, I recommend this tool to all my students. It provides data-driven recommendations that align with the job market.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Peter Njoroge',
      role: 'Engineering Student',
      image: '/user.avif?height=80&width=80',
      quote:
        'The career recommendations were spot on! I found my passion in electrical engineering thanks to this platform.',
      rating: 4,
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div
        className={`
          py-20 md:py-32 px-4 relative overflow-hidden
          ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
              : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
          }
        `}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-indigo-500 opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-20 right-1/3 w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <Row justify="center" align="middle">
            <Col xs={24} md={20} lg={18} xl={16} className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mb-6 text-sm font-medium">
                <Star size={16} className="mr-2" />
                <span>Trusted by 10,000+ Kenyan students</span>
              </div>

              <Title
                level={1}
                className="text-4xl md:text-6xl font-bold mb-6 text-theme-text"
              >
                Find Your Perfect <br />
                <span className="text-theme-primary relative">
                  Career Path
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200 dark:bg-blue-800/50 -z-10 transform -rotate-1"></span>
                </span>
              </Title>

              <Paragraph className="text-lg md:text-xl text-theme-text-secondary mb-8 max-w-3xl mx-auto">
                Our AI-powered Career Recommender System analyzes your KCSE
                results to suggest personalized career paths that match your
                academic strengths and the current job market demands in Kenya.
              </Paragraph>

              <Space size="middle" className="mb-8">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  className="px-8 h-12 text-base flex items-center"
                >
                  <Link to="/register" className="flex items-center">
                    Get Started <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                <Button
                  size="large"
                  shape="round"
                  className="h-12 text-base border-theme-border text-theme-text"
                >
                  <Link to="/about">Learn more</Link>
                </Button>
              </Space>

              <div className="flex flex-wrap justify-center gap-8 mt-12">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-500 mr-2" />
                  <span className="text-theme-text">
                    Personalized Recommendations
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-500 mr-2" />
                  <span className="text-theme-text">Based on KCSE Results</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-500 mr-2" />
                  <span className="text-theme-text">
                    Market-Aligned Careers
                  </span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Hero Image */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="absolute inset-0 -m-6 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"></div>
            <img
              src="/guidance.jpg?height=600&width=1000"
              alt="Career Recommender Dashboard"
              className="w-full h-auto object-cover rounded-xl shadow-theme-lg relative z-10"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        id="features"
        className={`
          py-20 bg-theme-background transition-all duration-1000 transform
          ${
            isVisible.features
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 mb-4 text-sm font-medium">
              <Star size={16} className="mr-2" />
              <span>Key Features</span>
            </div>
            <Title
              level={2}
              className="text-3xl md:text-4xl font-bold mb-4 text-theme-text"
            >
              How We Help You Find Your Path
            </Title>
            <Paragraph className="text-lg text-theme-text-secondary max-w-3xl mx-auto">
              Our platform combines academic analysis, market insights, and
              personalized guidance to help you make informed career decisions.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} className="mb-12">
            <Col xs={24} sm={12} lg={6}>
              <FeatureCard
                icon={<GraduationCap size={40} />}
                title="KCSE Analysis"
                description="Our system analyzes your KCSE results to identify your academic strengths and potential career paths."
                color="blue"
                delay={0.1}
                isVisible={isVisible.features}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <FeatureCard
                icon={<Briefcase size={40} />}
                title="Career Matching"
                description="Get personalized career recommendations that match your academic profile and interests."
                color="green"
                delay={0.2}
                isVisible={isVisible.features}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <FeatureCard
                icon={<TrendingUp size={40} />}
                title="Market Insights"
                description="Access up-to-date information about job market trends and career prospects in Kenya."
                color="purple"
                delay={0.3}
                isVisible={isVisible.features}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <FeatureCard
                icon={<School size={40} />}
                title="Institution Guidance"
                description="Discover the best universities and colleges in Kenya for your recommended career paths."
                color="orange"
                delay={0.4}
                isVisible={isVisible.features}
              />
            </Col>
          </Row>

          <div className="text-center">
            <Button type="primary" size="large">
              <Link to="/about" className="flex items-center">
                Explore All Features <ChevronRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div
        id="howItWorks"
        className={`
          py-20 bg-theme-background-secondary transition-all duration-1000 transform
          ${
            isVisible.howItWorks
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 mb-4 text-sm font-medium">
              <CheckCircle size={16} className="mr-2" />
              <span>Simple Process</span>
            </div>
            <Title
              level={2}
              className="text-3xl md:text-4xl font-bold mb-4 text-theme-text"
            >
              How It Works
            </Title>
            <Paragraph className="text-lg text-theme-text-secondary max-w-3xl mx-auto">
              Our simple 3-step process to help you find your ideal career path
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} className="mb-12">
            <Col xs={24} md={8}>
              <StepCard
                number="1"
                title="Input Your KCSE Results"
                description="Enter your KCSE grades for all subjects to help our system understand your academic strengths."
                delay={0.1}
                isVisible={isVisible.howItWorks}
              />
            </Col>
            <Col xs={24} md={8}>
              <StepCard
                number="2"
                title="Get Personalized Recommendations"
                description="Our AI analyzes your results and provides tailored career suggestions based on your performance."
                delay={0.2}
                isVisible={isVisible.howItWorks}
              />
            </Col>
            <Col xs={24} md={8}>
              <StepCard
                number="3"
                title="Explore Career Paths"
                description="Dive deeper into each recommended career with detailed information, requirements, and job prospects."
                delay={0.3}
                isVisible={isVisible.howItWorks}
              />
            </Col>
          </Row>

          <div className="bg-theme-primary text-white p-8 rounded-2xl shadow-theme-lg max-w-4xl mx-auto">
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={16}>
                <Title level={3} className="text-white mb-4">
                  Ready to discover your ideal career?
                </Title>
                <Paragraph className="text-white opacity-90 mb-6">
                  Input your KCSE results and get personalized career
                  recommendations in minutes.
                </Paragraph>
                <Button
                  size="large"
                  className="bg-white text-theme-primary border-white hover:bg-gray-100 hover:text-theme-primary hover:border-gray-100"
                >
                  <Link to="/register" className="flex items-center">
                    Get Started Now <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </Col>
              <Col xs={24} md={8} className="hidden md:block">
                <div className="bg-blue-600 p-6 rounded-xl">
                  <GraduationCap size={80} className="text-white mx-auto" />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div
        id="stats"
        className={`
          py-20 bg-theme-background transition-all duration-1000 transform
          ${
            isVisible.stats
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 mb-4 text-sm font-medium">
              <TrendingUp size={16} className="mr-2" />
              <span>Our Impact</span>
            </div>
            <Title
              level={2}
              className="text-3xl md:text-4xl font-bold mb-4 text-theme-text"
            >
              Making a Difference
            </Title>
            <Paragraph className="text-lg text-theme-text-secondary max-w-3xl mx-auto">
              Helping Kenyan students make informed career decisions since 2022
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} className="mb-12">
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={<Users size={32} />}
                value="10,000+"
                label="Students Helped"
                description="Since 2022"
                color="blue"
                delay={0.1}
                isVisible={isVisible.stats}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={<BookOpen size={32} />}
                value="200+"
                label="Career Paths"
                description="Available in our database"
                color="green"
                delay={0.2}
                isVisible={isVisible.stats}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={<School size={32} />}
                value="50+"
                label="Universities"
                description="Partner institutions"
                color="purple"
                delay={0.3}
                isVisible={isVisible.stats}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={<Award size={32} />}
                value="95%"
                label="Satisfaction Rate"
                description="From our users"
                color="orange"
                delay={0.4}
                isVisible={isVisible.stats}
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* Testimonials Section */}
      <div
        id="testimonials"
        className={`
          py-20 bg-theme-background-secondary transition-all duration-1000 transform
          ${
            isVisible.testimonials
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 mb-4 text-sm font-medium">
              <Star size={16} className="mr-2" />
              <span>Testimonials</span>
            </div>
            <Title
              level={2}
              className="text-3xl md:text-4xl font-bold mb-4 text-theme-text"
            >
              What Our Users Say
            </Title>
            <Paragraph className="text-lg text-theme-text-secondary max-w-3xl mx-auto">
              Hear from students who have found their ideal career paths using
              our platform
            </Paragraph>
          </div>

          <div className="max-w-5xl mx-auto">
            <Carousel
              autoplay
              dots={true}
              autoplaySpeed={5000}
              className="testimonial-carousel"
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="px-4 pb-12">
                  <Card
                    className="bg-theme-card border-theme-border shadow-theme-md rounded-xl overflow-hidden"
                    bordered={false}
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <div className="flex-shrink-0">
                        <img
                          src={testimonial.image || '/placeholder.svg'}
                          alt={testimonial.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
                        />
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <div className="flex justify-center md:justify-start mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < testimonial.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        <Paragraph className="text-lg italic mb-4 text-theme-text">
                          "{testimonial.quote}"
                        </Paragraph>
                        <div>
                          <Text strong className="text-theme-text block">
                            {testimonial.name}
                          </Text>
                          <Text className="text-theme-text-secondary">
                            {testimonial.role}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-theme-background">
        <div className="max-w-5xl mx-auto px-4">
          <Card
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden rounded-2xl border-0 shadow-theme-lg"
            bordered={false}
          >
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={14}>
                <Title level={2} className="text-white mb-4">
                  Ready to discover your ideal career?
                </Title>
                <Paragraph className="text-white opacity-90 text-lg mb-6">
                  Join thousands of Kenyan students who have found their perfect
                  career path using our recommender system.
                </Paragraph>
                <Space>
                  <Button
                    size="large"
                    shape="round"
                    className="bg-white text-blue-600 border-white hover:bg-gray-100 hover:text-blue-700 hover:border-gray-100"
                  >
                    <Link to="/register" className="flex items-center">
                      Get Started Now <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                  <Button size="large" shape="round" ghost>
                    <Link to="/about">Learn More</Link>
                  </Button>
                </Space>
              </Col>
              <Col xs={24} md={10} className="hidden md:block">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Students celebrating graduation"
                  className="rounded-lg w-full h-auto object-cover shadow-lg transform rotate-2"
                />
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, color, delay, isVisible }) => {
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300',
    green:
      'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300',
    purple:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300',
    orange:
      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300',
  };

  return (
    <div
      className={`
        text-center h-full transition-all duration-700 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
      `}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${colorMap[color]}`}
      >
        {icon}
      </div>
      <Title level={4} className="text-theme-text">
        {title}
      </Title>
      <Text className="text-theme-text-secondary">{description}</Text>
    </div>
  );
};

// Step Card Component
const StepCard = ({ number, title, description, delay, isVisible }) => {
  return (
    <Card
      hoverable
      className={`
        h-full transition-all duration-700 transform hover:-translate-y-1
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        bg-theme-card border-theme-border
      `}
      style={{ transitionDelay: `${delay}s` }}
      bodyStyle={{ padding: 24 }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-theme-primary text-white text-xl font-bold mb-4">
          {number}
        </div>
        <Title level={4} className="mb-2 text-theme-text">
          {title}
        </Title>
        <Text className="text-theme-text-secondary">{description}</Text>
      </div>
    </Card>
  );
};

// Stat Card Component
const StatCard = ({
  icon,
  value,
  label,
  description,
  color,
  delay,
  isVisible,
}) => {
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300',
    green:
      'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300',
    purple:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300',
    orange:
      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300',
  };

  return (
    <Card
      className={`
        text-center h-full transition-all duration-700 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        bg-theme-card border-theme-border
      `}
      style={{ transitionDelay: `${delay}s` }}
      bordered={false}
      bodyStyle={{ padding: 24 }}
    >
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${colorMap[color]}`}
      >
        {icon}
      </div>
      <Statistic
        value={value}
        title={
          <div className="text-lg font-medium text-theme-text">{label}</div>
        }
        valueStyle={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'var(--color-primary)',
        }}
      />
      <Text type="secondary" className="text-theme-text-secondary">
        {description}
      </Text>
    </Card>
  );
};

export default Landing;
