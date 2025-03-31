'use client';

import { useRef } from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const BarChart = ({
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

  return (
    <div ref={chartRef} style={{ width: '100%', height }}>
      {title && (
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={seriesField ? transformedData : data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey={xField} />
          <YAxis />
          <Tooltip />
          <Legend />
          {seriesKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={seriesField ? key : yField}
              fill={`hsl(${index * 40}, 70%, 50%)`}
              animationDuration={1000}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
