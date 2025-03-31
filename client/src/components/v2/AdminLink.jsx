'use client';
import { Link } from 'react-router-dom';
import { Button, Tooltip, Badge } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { ShieldOutlined } from '@mui/icons-material';

const AdminLink = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Tooltip title="Admin Dashboard">
      <Link to="/admin">
        <Badge dot>
          <Button
            type="text"
            shape="circle"
            icon={<ShieldOutlined className="text-white" />}
            className="flex items-center justify-center hover:bg-[#003366]"
            aria-label="Admin Dashboard"
          />
        </Badge>
      </Link>
    </Tooltip>
  );
};

export default AdminLink;
