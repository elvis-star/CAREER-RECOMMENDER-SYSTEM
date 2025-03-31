'use client';

import { Typography } from 'antd';
import AdminLayout from '../../../components/v2/admin/AdminLayout';
import AnalyticsCharts from '../../../components/v2/admin/AnalyticsCharts';

const { Title, Paragraph } = Typography;

const AdminAnalytics = () => {
  return (
    <AdminLayout>
      <div className="mb-6">
        <Title level={2}>Analytics Dashboard</Title>
        <Paragraph className="text-gray-500">
          View detailed analytics about users, recommendations, and career
          popularity.
        </Paragraph>
      </div>

      <AnalyticsCharts />
    </AdminLayout>
  );
};

export default AdminAnalytics;
