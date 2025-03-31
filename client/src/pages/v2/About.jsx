import { Typography, Row, Col, Card, Space, Button, Avatar } from 'antd';
import {
  GraduationCap,
  TrendingUp,
  LightbulbIcon as LightBulb,
  Users,
  Quote,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & CEO',
      image: '/placeholder.svg?height=150&width=150',
      bio: 'Ph.D. in Educational Psychology with over 15 years of experience in career counseling and development.',
    },
    {
      name: 'Michael Omondi',
      role: 'Lead Career Counselor',
      image: '/placeholder.svg?height=150&width=150',
      bio: 'Former university career advisor with expertise in helping students transition from education to employment.',
    },
    {
      name: 'Amina Wanjiku',
      role: 'Data Scientist',
      image: '/placeholder.svg?height=150&width=150',
      bio: 'Specializes in analyzing educational and labor market data to identify emerging career trends in Kenya.',
    },
    {
      name: 'David Mwangi',
      role: 'Software Engineer',
      image: '/placeholder.svg?height=150&width=150',
      bio: 'Full-stack developer passionate about creating tools that make education and career guidance accessible to all.',
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote:
        "This platform helped me discover career paths I never knew existed. Now I'm pursuing computer science with confidence!",
      author: 'James Kimani',
      role: 'Student, University of Nairobi',
    },
    {
      quote:
        'As a career counselor, I recommend this tool to all my students. It provides data-driven recommendations that align with the job market.',
      author: 'Grace Otieno',
      role: 'Career Advisor, Strathmore University',
    },
    {
      quote:
        'The career recommendations were spot on! I found my passion in electrical engineering thanks to this platform.',
      author: 'Peter Njoroge',
      role: 'Engineering Student',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Hero Section */}
      <Row gutter={[32, 32]} align="middle" className="mb-16">
        <Col xs={24} md={12}>
          <Title level={1}>About Career Recommender</Title>
          <Paragraph className="text-lg text-gray-600 mb-6">
            We're on a mission to help Kenyan students make informed career
            decisions based on their academic strengths, interests, and the
            current job market demands.
          </Paragraph>
          <Button type="primary" size="large">
            <Link to="/register">Join Us Today</Link>
          </Button>
        </Col>
        <Col xs={24} md={12}>
          <img
            src="/placeholder.svg?height=400&width=500"
            alt="Students discussing career options"
            className="w-full rounded-lg shadow-lg"
          />
        </Col>
      </Row>

      {/* Our Mission Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <Title level={2}>Our Mission</Title>
          <Paragraph className="text-lg max-w-3xl mx-auto">
            To empower Kenyan students to make informed career choices that
            align with their academic strengths, personal interests, and the
            evolving job market.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500">
                  <GraduationCap size={32} />
                </div>
              </div>
              <Title level={4}>Education-Focused</Title>
              <Text>
                We analyze academic performance to identify strengths and
                potential career paths.
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-500">
                  <TrendingUp size={32} />
                </div>
              </div>
              <Title level={4}>Data-Driven</Title>
              <Text>
                Our recommendations are based on current job market trends and
                future projections.
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 text-purple-500">
                  <LightBulb size={32} />
                </div>
              </div>
              <Title level={4}>Personalized Guidance</Title>
              <Text>
                We provide tailored career recommendations that match individual
                profiles.
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-500">
                  <Users size={32} />
                </div>
              </div>
              <Title level={4}>Inclusive Approach</Title>
              <Text>
                We aim to make career guidance accessible to all Kenyan students
                regardless of background.
              </Text>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Our Story Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <Title level={2}>Our Story</Title>
        </div>

        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={12}>
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="Our journey"
              className="w-full rounded-lg shadow-lg"
            />
          </Col>
          <Col xs={24} md={12}>
            <Title level={3}>From Idea to Impact</Title>
            <Paragraph>
              Career Recommender was founded in 2022 by a team of educators,
              career counselors, and technologists who recognized a critical gap
              in Kenya's educational system: the lack of personalized career
              guidance for students.
            </Paragraph>
            <Paragraph>
              After witnessing countless students struggle to choose career
              paths that aligned with their strengths and interests, we set out
              to create a data-driven solution that would bridge this gap.
            </Paragraph>
            <Paragraph>
              Today, we've helped over 10,000 Kenyan students discover career
              paths that match their academic profiles, and we continue to
              expand our services to reach more students across the country.
            </Paragraph>
          </Col>
        </Row>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <Title level={2}>Meet Our Team</Title>
          <Paragraph className="text-lg max-w-3xl mx-auto">
            We're a diverse team of educators, technologists, and career experts
            passionate about helping students find their path.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {teamMembers.map((member, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className="h-full text-center">
                <Avatar src={member.image} size={100} className="mb-4" />
                <Title level={4} className="mb-0">
                  {member.name}
                </Title>
                <Text type="secondary" className="block mb-4">
                  {member.role}
                </Text>
                <Paragraph>{member.bio}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Testimonials Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <Title level={2}>What Our Users Say</Title>
        </div>

        <Row gutter={[24, 24]}>
          {testimonials.map((testimonial, index) => (
            <Col xs={24} md={8} key={index}>
              <Card className="h-full">
                <Quote size={32} className="text-gray-300 mb-4" />
                <Paragraph className="italic mb-4">
                  {testimonial.quote}
                </Paragraph>
                <div>
                  <Text strong>{testimonial.author}</Text>
                  <br />
                  <Text type="secondary">{testimonial.role}</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA Section */}
      <Card className="bg-[#0080ff] text-white text-center">
        <Title level={2} className="text-white">
          Ready to Find Your Ideal Career?
        </Title>
        <Paragraph className="text-white text-lg mb-6 max-w-3xl mx-auto">
          Join thousands of Kenyan students who have discovered their perfect
          career path using our recommender system.
        </Paragraph>
        <Space size="middle">
          <Button
            size="large"
            className="bg-white text-[#0080ff] border-white hover:bg-gray-100"
          >
            <Link to="/register">Get Started</Link>
          </Button>
          <Button size="large" ghost>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default About;
