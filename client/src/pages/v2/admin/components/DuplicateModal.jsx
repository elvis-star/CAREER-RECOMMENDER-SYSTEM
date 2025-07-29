'use client';

import { Modal, Form, Input, Button, Alert, Tag } from 'antd';
import { CopyOutlined, BuildOutlined } from '@ant-design/icons';

const DuplicateModal = ({
  visible,
  onClose,
  institutionToDuplicate,
  onConfirm,
  loading,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={
        <div className="flex items-center">
          <CopyOutlined className="mr-2 text-blue-500" />
          <span>Duplicate Institution</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onConfirm}
        initialValues={{
          newName: institutionToDuplicate
            ? `Copy of ${institutionToDuplicate.name}`
            : '',
        }}
      >
        <div className="mb-4">
          <Alert
            message="You are duplicating:"
            description={
              <div className="flex items-center mt-2">
                {institutionToDuplicate?.logo ? (
                  <img
                    src={institutionToDuplicate.logo || '/placeholder.svg'}
                    alt={institutionToDuplicate.name}
                    className="w-12 h-12 object-cover rounded-md mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                    <BuildOutlined
                      style={{ color: '#bfbfbf', fontSize: '20px' }}
                    />
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {institutionToDuplicate?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    <Tag color="default">{institutionToDuplicate?.type}</Tag>
                  </div>
                </div>
              </div>
            }
            type="info"
            showIcon
          />
        </div>

        <Form.Item
          name="newName"
          label="New Institution Name"
          rules={[
            {
              required: true,
              message: 'Please enter a name for the duplicate institution',
            },
          ]}
        >
          <Input placeholder="Enter new name" />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Duplicate Institution
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default DuplicateModal;
