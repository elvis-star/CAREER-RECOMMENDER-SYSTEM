'use client';

import { useRef } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const PieChart = ({ data, angleField, colorField, title, height = 400 }) => {
  const chartRef = useRef(null);

  // Generate colors for the pie slices
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
    '#FF6B6B',
    '#6B66FF',
  ];

  // Format the data for recharts if needed
  const formattedData = data.map((item) => ({
    name: item[colorField],
    value: item[angleField],
  }));

  // Custom label to show percentage
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div ref={chartRef} style={{ width: '100%', height }}>
      {title && (
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <RechartsPie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </RechartsPie>
          <Tooltip formatter={(value) => [value, 'Value']} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
