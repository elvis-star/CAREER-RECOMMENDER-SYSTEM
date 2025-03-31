'use client';

import { useState } from 'react';
import { Card, Tabs, Spin, Alert, Row, Col, Select, DatePicker } from 'antd';
import { useQuery } from '@tanstack/react-query';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
import api from '../../../services/api';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AnalyticsCharts = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [dateRange, setDateRange] = useState([null, null]);
  const [careerCategory, setCareerCategory] = useState('all');

  // Fetch analytics data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', timeRange, dateRange, careerCategory],
    queryFn: async () => {
      const params = {
        timeRange,
        category: careerCategory !== 'all' ? careerCategory : undefined,
      };

      if (dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].toISOString();
        params.endDate = dateRange[1].toISOString();
      }

      const response = await api.get('/admin/analytics', { params });
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message="Error loading analytics data"
        description="There was a problem fetching the analytics data. Please try again later."
        className="mb-4"
      />
    );
  }

  // Prepare data for charts
  const userGrowthData = data?.data?.userGrowth || [];
  const recommendationData = data?.data?.recommendations || [];
  const careerPopularityData = data?.data?.careerPopularity || [];
  const userTypeData = data?.data?.userTypes || [];

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120, marginRight: 16 }}
          >
            <Option value="week">Last Week</Option>
            <Option value="month">Last Month</Option>
            <Option value="quarter">Last Quarter</Option>
            <Option value="year">Last Year</Option>
            <Option value="custom">Custom Range</Option>
          </Select>

          {timeRange === 'custom' && (
            <RangePicker onChange={setDateRange} style={{ marginRight: 16 }} />
          )}

          <Select
            value={careerCategory}
            onChange={setCareerCategory}
            style={{ width: 150 }}
            placeholder="Filter by category"
          >
            <Option value="all">All Categories</Option>
            <Option value="Technology">Technology</Option>
            <Option value="Healthcare">Healthcare</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Education">Education</Option>
            <Option value="Engineering">Engineering</Option>
            {/* Add more categories as needed */}
          </Select>
        </div>
      </div>

      <Tabs defaultActiveKey="users">
        <TabPane tab="User Growth" key="users">
          <Card>
            <LineChart
              data={userGrowthData}
              xField="date"
              yField="count"
              seriesField="type"
              title="User Growth Over Time"
              height={400}
            />
          </Card>
        </TabPane>

        <TabPane tab="Recommendations" key="recommendations">
          <Card>
            <LineChart
              data={recommendationData}
              xField="date"
              yField="count"
              title="Recommendations Over Time"
              height={400}
            />
          </Card>
        </TabPane>

        <TabPane tab="Career Popularity" key="careers">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Most Popular Careers">
                <BarChart
                  data={careerPopularityData}
                  xField="count"
                  yField="title"
                  seriesField="category"
                  title="Career Popularity"
                  height={400}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="User Types">
                <PieChart
                  data={userTypeData}
                  angleField="count"
                  colorField="type"
                  title="User Type Distribution"
                  height={400}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AnalyticsCharts;
