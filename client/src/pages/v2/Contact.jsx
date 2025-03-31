'use client';

import { useState } from 'react';
import { Typography, Row, Col, Card, Form, Input, Button, Space } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form values:', values);
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  // Contact information
  const contactInfo = [
    {
      icon: <MapPin size={24} />,
      title: 'Our Location',
      content: 'Kimathi Street, Nairobi, Kenya',
      color: '#f5222d',
    },
    {
      icon: <Phone size={24} />,
      title: 'Phone Number',
      content: '+254 712 345 678',
      color: '#52c41a',
    },
    {
      icon: <Mail size={24} />,
      title: 'Email Address',
      content: 'info@careerrecommender.co.ke',
      color: '#1890ff',
    },
    {
      icon: <Clock size={24} />,
      title: 'Working Hours',
      content: 'Mon - Fri: 8:00 AM - 5:00 PM',
      color: '#fa8c16',
    },
  ];

  // FAQ items
  const faqItems = [
    {
      question: 'How does the career recommendation system work?',
      answer:
        'Our system analyzes your KCSE results to identify your academic strengths and matches them with suitable career paths based on subject requirements and performance patterns.',
    },
    {
      question: 'Is the service free to use?',
      answer:
        'Yes, our basic career recommendation service is completely free for all Kenyan students. We also offer premium features for more detailed guidance and personalized counseling.',
    },
    {
      question: 'How accurate are the career recommendations?',
      answer:
        'Our recommendations are based on academic performance, current job market trends, and established career path requirements. While we strive for high accuracy, we always recommend consulting with a career counselor for personalized advice.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Title level={1}>Contact Us</Title>
        <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Get in touch
          with our team.
        </Paragraph>
      </div>

      {/* Contact Information Cards */}
      <Row gutter={[24, 24]} className="mb-12">
        {contactInfo.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="h-full text-center">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4"
                style={{
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                }}
              >
                {item.icon}
              </div>
              <Title level={5}>{item.title}</Title>
              <Text>{item.content}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Contact Form and Map Section */}
      <Row gutter={[32, 32]} className="mb-16">
        <Col xs={24} md={12}>
          <Card title={<Title level={3}>Send Us a Message</Title>}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                name="name"
                label="Your Name"
                rules={[
                  { required: true, message: 'Please enter your name' },
                  { min: 2, message: 'Name must be at least 2 characters' },
                ]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  {
                    type: 'email',
                    message: 'Please enter a valid email address',
                  },
                ]}
              >
                <Input placeholder="Enter your email address" />
              </Form.Item>

              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input placeholder="Enter message subject" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[
                  { required: true, message: 'Please enter your message' },
                  {
                    min: 10,
                    message: 'Message must be at least 10 characters',
                  },
                ]}
              >
                <TextArea placeholder="Enter your message" rows={5} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Title level={3} className="mb-6">
            Our Location
          </Title>
          <div className="w-full h-[400px] bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center mb-4">
            <Text type="secondary">Map Placeholder</Text>
          </div>
          <Text type="secondary">
            Visit our office in Nairobi's central business district,
            conveniently located near major transportation hubs.
          </Text>
        </Col>
      </Row>

      {/* FAQ Section */}
      <div className="mb-16">
        <Title level={2} className="text-center mb-8">
          Frequently Asked Questions
        </Title>
        <Row gutter={[24, 24]}>
          {faqItems.map((item, index) => (
            <Col xs={24} md={12} key={index}>
              <Card className="h-full">
                <Title level={4}>{item.question}</Title>
                <Paragraph>{item.answer}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Social Media Section */}
      <div className="text-center mb-12">
        <Title level={3} className="mb-6">
          Connect With Us
        </Title>
        <Paragraph className="mb-6">
          Follow us on social media for the latest updates, career tips, and
          more.
        </Paragraph>
        <Space size="large" wrap className="justify-center">
          <Button icon={<FacebookOutlined />} size="large">
            Facebook
          </Button>
          <Button icon={<TwitterOutlined />} size="large">
            Twitter
          </Button>
          <Button icon={<InstagramOutlined />} size="large">
            Instagram
          </Button>
          <Button icon={<LinkedinOutlined />} size="large">
            LinkedIn
          </Button>
        </Space>
      </div>

      {/* CTA Section */}
      <Card className="bg-[#0080ff] text-white text-center">
        <Title level={2} className="text-white">
          Need Personalized Assistance?
        </Title>
        <Paragraph className="text-white text-lg mb-6 max-w-3xl mx-auto">
          Our career counselors are available for one-on-one sessions to provide
          personalized guidance for your career journey.
        </Paragraph>
        <Button
          size="large"
          className="bg-white text-[#0080ff] border-white hover:bg-gray-100"
        >
          Book a Consultation
        </Button>
      </Card>
    </div>
  );
};

export default Contact;
