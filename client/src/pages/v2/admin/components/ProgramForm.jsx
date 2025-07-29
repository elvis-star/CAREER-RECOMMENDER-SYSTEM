'use client';

import { Modal, Form, Input, Select, Button, Divider } from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const ProgramForm = ({
  visible,
  onCancel,
  onSubmit,
  currentInstitution,
  currentProgram,
  loading,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={
        <div className="flex items-center">
          {currentProgram ? (
            <>
              <EditOutlined className="mr-2 text-blue-500" />
              <span>Edit Program: {currentProgram?.name}</span>
            </>
          ) : (
            <>
              <PlusOutlined className="mr-2 text-green-500" />
              <span>Add New Program to {currentInstitution?.name}</span>
            </>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          level: 'Bachelors',
          specificSubjects: [],
          additionalRequirements: [],
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Program Name"
            rules={[{ required: true, message: 'Please enter program name' }]}
          >
            <Input placeholder="e.g. Bachelor of Science in Computer Science" />
          </Form.Item>

          <Form.Item
            name="level"
            label="Program Level"
            rules={[{ required: true, message: 'Please select program level' }]}
          >
            <Select placeholder="Select level">
              <Option value="Certificate">Certificate</Option>
              <Option value="Diploma">Diploma</Option>
              <Option value="Bachelors">Bachelors</Option>
              <Option value="Masters">Masters</Option>
              <Option value="Doctorate">Doctorate</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="duration"
            label="Duration"
            rules={[
              { required: true, message: 'Please enter program duration' },
            ]}
          >
            <Input placeholder="e.g. 4 years" />
          </Form.Item>

          <Form.Item name="tuitionFees" label="Tuition Fees">
            <Input placeholder="e.g. KES 120,000 per semester" />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <TextArea rows={3} placeholder="Describe the program..." />
        </Form.Item>

        <Divider orientation="left">Entry Requirements</Divider>

        <Form.Item name="minimumGrade" label="Minimum Grade">
          <Select placeholder="Select minimum grade">
            <Option value="A">A</Option>
            <Option value="A-">A-</Option>
            <Option value="B+">B+</Option>
            <Option value="B">B</Option>
            <Option value="B-">B-</Option>
            <Option value="C+">C+</Option>
            <Option value="C">C</Option>
            <Option value="C-">C-</Option>
            <Option value="D+">D+</Option>
            <Option value="D">D</Option>
          </Select>
        </Form.Item>

        <Form.List name="specificSubjects">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'subject']}
                    rules={[
                      { required: true, message: 'Please enter subject' },
                    ]}
                  >
                    <Input placeholder="Subject (e.g. Mathematics)" />
                  </Form.Item>
                  <div className="flex items-center gap-2">
                    <Form.Item
                      {...restField}
                      name={[name, 'grade']}
                      className="flex-1"
                      rules={[
                        { required: true, message: 'Please enter grade' },
                      ]}
                    >
                      <Select placeholder="Grade">
                        <Option value="A">A</Option>
                        <Option value="A-">A-</Option>
                        <Option value="B+">B+</Option>
                        <Option value="B">B</Option>
                      </Select>
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                    />
                  </div>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Subject Requirement
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          name="additionalRequirements"
          label="Additional Requirements"
          extra="Press Enter after each requirement"
        >
          <Select
            mode="tags"
            placeholder="Add additional requirements"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <div className="flex justify-end mt-4">
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {currentProgram ? 'Update Program' : 'Add Program'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProgramForm;
