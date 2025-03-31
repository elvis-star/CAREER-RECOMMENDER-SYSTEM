import React, { useState } from 'react';
import {
  Typography,
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Alert,
  Modal,
  Tooltip,
  message,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getRecommendations } from '../../services/recommendationService';
import { useMutation } from '@tanstack/react-query';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// KCSE Grading System
const KCSE_GRADES = [
  { value: 'A', points: 12 },
  { value: 'A-', points: 11 },
  { value: 'B+', points: 10 },
  { value: 'B', points: 9 },
  { value: 'B-', points: 8 },
  { value: 'C+', points: 7 },
  { value: 'C', points: 6 },
  { value: 'C-', points: 5 },
  { value: 'D+', points: 4 },
  { value: 'D', points: 3 },
  { value: 'D-', points: 2 },
  { value: 'E', points: 1 },
];

// Available KCSE Subjects
const KCSE_SUBJECTS = [
  { id: 'english', name: 'English', category: 'Compulsory' },
  { id: 'kiswahili', name: 'Kiswahili', category: 'Compulsory' },
  { id: 'mathematics', name: 'Mathematics', category: 'Compulsory' },
  { id: 'biology', name: 'Biology', category: 'Sciences' },
  { id: 'chemistry', name: 'Chemistry', category: 'Sciences' },
  { id: 'physics', name: 'Physics', category: 'Sciences' },
  { id: 'history', name: 'History & Government', category: 'Humanities' },
  { id: 'geography', name: 'Geography', category: 'Humanities' },
  { id: 'cre', name: 'Christian Religious Education', category: 'Humanities' },
  { id: 'ire', name: 'Islamic Religious Education', category: 'Humanities' },
  { id: 'hre', name: 'Hindu Religious Education', category: 'Humanities' },
  { id: 'agriculture', name: 'Agriculture', category: 'Technical' },
  { id: 'business', name: 'Business Studies', category: 'Technical' },
  { id: 'computer', name: 'Computer Studies', category: 'Technical' },
  { id: 'homescience', name: 'Home Science', category: 'Technical' },
  { id: 'art', name: 'Art & Design', category: 'Creative Arts' },
  { id: 'music', name: 'Music', category: 'Creative Arts' },
  { id: 'french', name: 'French', category: 'Languages' },
  { id: 'german', name: 'German', category: 'Languages' },
  { id: 'arabic', name: 'Arabic', category: 'Languages' },
];

const ResultsInput = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isAddSubjectModalVisible, setIsAddSubjectModalVisible] =
    useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([
    { key: 'english', subject: 'english', grade: '' },
    { key: 'kiswahili', subject: 'kiswahili', grade: '' },
    { key: 'mathematics', subject: 'mathematics', grade: '' },
  ]);
  const [meanGrade, setMeanGrade] = useState({ grade: 'N/A', points: 0 });

  // Calculate mean grade
  const calculateMeanGrade = (subjects) => {
    if (!subjects || subjects.length === 0) return { grade: 'N/A', points: 0 };

    const subjectsWithGrades = subjects.filter((subj) => subj.grade);
    if (subjectsWithGrades.length === 0) return { grade: 'N/A', points: 0 };

    const totalPoints = subjectsWithGrades.reduce((sum, subj) => {
      const grade = subj.grade;
      const points = KCSE_GRADES.find((g) => g.value === grade)?.points || 0;
      return sum + points;
    }, 0);

    const meanPoints = totalPoints / subjectsWithGrades.length;

    // Find the closest grade
    let meanGrade = 'E';
    for (const grade of KCSE_GRADES) {
      if (meanPoints >= grade.points) {
        meanGrade = grade.value;
        break;
      }
    }

    return { grade: meanGrade, points: meanPoints.toFixed(2) };
  };

  // Update mean grade when subjects change
  const updateMeanGrade = () => {
    const newMeanGrade = calculateMeanGrade(subjects);
    setMeanGrade(newMeanGrade);
  };

  // Handle grade change
  const handleGradeChange = (key, value) => {
    const updatedSubjects = subjects.map((subject) =>
      subject.key === key ? { ...subject, grade: value } : subject
    );
    setSubjects(updatedSubjects);

    // Update mean grade
    const newMeanGrade = calculateMeanGrade(updatedSubjects);
    setMeanGrade(newMeanGrade);
  };

  // Handle adding a new subject
  const handleAddSubject = () => {
    if (!selectedSubject) {
      messageApi.warning('Please select a subject');
      return;
    }

    // Check if subject already exists
    const exists = subjects.some((s) => s.subject === selectedSubject);
    if (exists) {
      messageApi.warning('You have already added this subject');
      return;
    }

    const newSubject = {
      key: selectedSubject,
      subject: selectedSubject,
      grade: '',
    };

    setSubjects([...subjects, newSubject]);
    setSelectedSubject('');
    setIsAddSubjectModalVisible(false);
  };

  // Handle removing a subject
  const handleRemoveSubject = (key) => {
    // Check if it's a compulsory subject
    const subjectInfo = KCSE_SUBJECTS.find((s) => s.id === key);
    if (subjectInfo?.category === 'Compulsory') {
      messageApi.error('You cannot remove compulsory subjects');
      return;
    }

    const updatedSubjects = subjects.filter((subject) => subject.key !== key);
    setSubjects(updatedSubjects);

    // Update mean grade
    const newMeanGrade = calculateMeanGrade(updatedSubjects);
    setMeanGrade(newMeanGrade);
  };

  // Get available subjects (not already selected)
  const getAvailableSubjects = () => {
    const selectedSubjects = subjects.map((s) => s.subject);
    return KCSE_SUBJECTS.filter((s) => !selectedSubjects.includes(s.id));
  };

  // Fixed React Query v5 mutation
  const mutation = useMutation({
    mutationFn: (data) => getRecommendations(data),
    onSuccess: (data) => {
      messageApi.success({
        content:
          'Results submitted successfully. Redirecting to your career recommendations.',
        duration: 3,
      });

      // Navigate to recommendations page
      navigate('/recommendations', { state: { recommendations: data } });
    },
    onError: (error) => {
      messageApi.error({
        content:
          error.message || 'Error submitting results. Please try again later.',
        duration: 5,
      });
    },
  });

  const onFinish = (values) => {
    // Validate that at least 7 subjects are provided
    const subjectsWithGrades = subjects.filter((s) => s.grade);
    if (subjectsWithGrades.length < 7) {
      messageApi.warning('Please provide grades for at least 7 subjects');
      return;
    }

    // Format data for API
    const formattedData = {
      year: values.year,
      subjects: subjects
        .filter((s) => s.grade)
        .map((s) => ({
          subject:
            KCSE_SUBJECTS.find((subj) => subj.id === s.subject)?.name ||
            s.subject,
          grade: s.grade,
          points: KCSE_GRADES.find((g) => g.value === s.grade)?.points || 0,
        })),
      meanGrade: meanGrade.grade,
      meanPoints: Number.parseFloat(meanGrade.points),
    };

    // Submit data
    mutation.mutate(formattedData);
  };

  // Table columns
  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text) => {
        const subjectInfo = KCSE_SUBJECTS.find((s) => s.id === text);
        const isCompulsory = subjectInfo?.category === 'Compulsory';

        return (
          <Space>
            {subjectInfo?.name || text}
            {isCompulsory && <Tag color="red">Required</Tag>}
          </Space>
        );
      },
    },
    {
      title: 'Category',
      dataIndex: 'subject',
      key: 'category',
      render: (text) => {
        const subjectInfo = KCSE_SUBJECTS.find((s) => s.id === text);
        const category = subjectInfo?.category || 'Other';

        let color = 'default';
        switch (category) {
          case 'Compulsory':
            color = 'red';
            break;
          case 'Sciences':
            color = 'green';
            break;
          case 'Humanities':
            color = 'blue';
            break;
          case 'Technical':
            color = 'orange';
            break;
          case 'Creative Arts':
            color = 'purple';
            break;
          case 'Languages':
            color = 'cyan';
            break;
          default:
            color = 'default';
        }

        return <Tag color={color}>{category}</Tag>;
      },
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (text, record) => (
        <Select
          style={{ width: 120 }}
          value={text || undefined}
          onChange={(value) => handleGradeChange(record.key, value)}
          placeholder="Select grade"
        >
          {KCSE_GRADES.map((grade) => (
            <Option key={grade.value} value={grade.value}>
              {grade.value} ({grade.points} points)
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const subjectInfo = KCSE_SUBJECTS.find((s) => s.id === record.subject);
        const isCompulsory = subjectInfo?.category === 'Compulsory';

        return (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            disabled={isCompulsory}
            onClick={() => handleRemoveSubject(record.key)}
          />
        );
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {contextHolder}

      <div className="mb-8">
        <Title level={2}>Input Your KCSE Results</Title>
        <Paragraph className="text-gray-500">
          Enter your KCSE grades to get personalized career recommendations
          based on your academic strengths.
        </Paragraph>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ year: new Date().getFullYear() }}
      >
        <Row gutter={[24, 24]}>
          {/* Examination Details */}
          <Col xs={24}>
            <Card title="Examination Details">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="year"
                    label="Year of Examination"
                    rules={[
                      { required: true, message: 'Year is required' },
                      {
                        type: 'number',
                        min: 1990,
                        max: new Date().getFullYear(),
                        message: `Year must be between 1990 and ${new Date().getFullYear()}`,
                        transform: (value) => Number(value),
                      },
                    ]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Mean Grade">
                    <Row gutter={8}>
                      <Col span={12}>
                        <Input value={meanGrade.grade} readOnly />
                      </Col>
                      <Col span={8}>
                        <Input value={meanGrade.points} readOnly />
                      </Col>
                      <Col span={4} className="flex items-center">
                        <Tooltip title="Mean grade is calculated automatically based on your subject grades">
                          <InfoCircleOutlined className="text-gray-500" />
                        </Tooltip>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Subject Grades */}
          <Col xs={24}>
            <Card
              title="Subject Grades"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddSubjectModalVisible(true)}
                >
                  Add Subject
                </Button>
              }
            >
              <Alert
                message="Important!"
                description="Please enter grades for at least 7 subjects, including the compulsory ones (English, Kiswahili, Mathematics)."
                type="info"
                showIcon
                className="mb-4"
              />

              {subjects.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={subjects}
                  pagination={false}
                  rowKey="key"
                />
              ) : (
                <div className="text-center py-8">
                  <QuestionCircleOutlined
                    style={{ fontSize: 40, color: '#ccc' }}
                    className="mb-4"
                  />
                  <Paragraph className="text-gray-500">
                    No subjects added yet. Click "Add Subject" to begin.
                  </Paragraph>
                </div>
              )}

              <Divider />

              <div className="flex items-center">
                <InfoCircleOutlined className="text-gray-500 mr-2" />
                <Text type="secondary">
                  You need to enter at least 7 subjects to get accurate career
                  recommendations.
                </Text>
              </div>
            </Card>
          </Col>

          {/* Submit Button */}
          <Col xs={24} className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={mutation.isPending}
            >
              <ClipboardList size={16} style={{ marginRight: 8 }} />
              Get Career Recommendations
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Add Subject Modal */}
      <Modal
        title="Add Subject"
        open={isAddSubjectModalVisible}
        onOk={handleAddSubject}
        onCancel={() => setIsAddSubjectModalVisible(false)}
        okButtonProps={{ disabled: !selectedSubject }}
      >
        <Form layout="vertical">
          <Form.Item label="Select Subject">
            <Select
              placeholder="Choose a subject"
              value={selectedSubject}
              onChange={(value) => setSelectedSubject(value)}
              style={{ width: '100%' }}
            >
              {getAvailableSubjects().map((subject) => (
                <Option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.category})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResultsInput;
