'use client';

import { useRef } from 'react';
import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const LineChart = ({
  data,
  xField,
  yField,
  seriesField,
  title,
  height = 400,
}) => {
  const chartRef = useRef(null);

  // Transform data if seriesField is provided
  const transformedData = !seriesField
    ? data
    : data.reduce((acc, item) => {
        const existingItem = acc.find((i) => i[xField] === item[xField]);
        if (existingItem) {
          existingItem[item[seriesField]] = item[yField];
        } else {
          const newItem = {
            [xField]: item[xField],
            [item[seriesField]]: item[yField],
          };
          acc.push(newItem);
        }
        return acc;
      }, []);

  // Get all unique series keys if seriesField is provided
  const seriesKeys = seriesField
    ? [...new Set(data.map((item) => item[seriesField]))]
    : [yField];

  // Generate colors for the lines
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
  ];

  return (
    <div ref={chartRef} style={{ width: '100%', height }}>
      {title && (
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={seriesField ? transformedData : data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xField} />
          <YAxis />
          <Tooltip />
          <Legend />
          {seriesKeys.map((key, index) => (
            <RechartsLine
              key={key}
              type="monotone"
              dataKey={seriesField ? key : yField}
              stroke={COLORS[index % COLORS.length]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
              dot={{ r: 4 }}
              animationDuration={1000}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
