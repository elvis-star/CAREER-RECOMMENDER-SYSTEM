'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Tabs,
  Button,
  Input,
  Select,
  Switch,
  Divider,
  DatePicker,
  Alert,
} from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UploadWidget from '../../../../components/v2/common/UploadWidget';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const InstitutionForm = ({
  visible,
  onCancel,
  onSubmit,
  editMode,
  currentInstitution,
  loading,
}) => {
  const [form] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [logoUrl, setLogoUrl] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (editMode && currentInstitution) {
      setLogoUrl(currentInstitution.logo || '');
      setImageUrls(currentInstitution.images || []);

      form.setFieldsValue({
        name: currentInstitution.name,
        type: currentInstitution.type,
        address: currentInstitution.location?.address,
        city: currentInstitution.location?.city,
        county: currentInstitution.location?.county,
        country: currentInstitution.location?.country || 'Kenya',
        latitude: currentInstitution.location?.coordinates?.latitude,
        longitude: currentInstitution.location?.coordinates?.longitude,
        description: currentInstitution.description,
        website: currentInstitution.website,
        email: currentInstitution.email,
        phone: currentInstitution.phone,
        facebook: currentInstitution.facebook,
        twitter: currentInstitution.twitter,
        instagram: currentInstitution.instagram,
        linkedin: currentInstitution.linkedin,
        nationalRanking: currentInstitution.nationalRanking,
        internationalRanking: currentInstitution.internationalRanking,
        rankingYear: currentInstitution.rankings?.year
          ? dayjs().year(currentInstitution.rankings.year)
          : null,
        facilities: currentInstitution.facilities || [],
        accreditation: currentInstitution.accreditation?.[0] || '',
        establishedYear: currentInstitution.establishedYear
          ? dayjs().year(currentInstitution.establishedYear)
          : null,
        logo: currentInstitution.logo,
        images: currentInstitution.images || [],
        featured: currentInstitution.featured || false,
      });
    } else {
      form.resetFields();
      setLogoUrl('');
      setImageUrls([]);
    }
  }, [editMode, currentInstitution, form]);

  const handleLogoUpload = (url) => {
    setLogoUrl(url);
    form.setFieldsValue({ logo: url });
  };

  const handleImagesUpload = (url) => {
    const newUrls = [...imageUrls, url];
    setImageUrls(newUrls);
    form.setFieldsValue({ images: newUrls });
  };

  const handleFormSubmit = (values) => {
    // Convert dayjs objects back to year numbers
    const processedValues = {
      ...values,
      establishedYear: values.establishedYear
        ? values.establishedYear.year()
        : null,
      rankingYear: values.rankingYear ? values.rankingYear.year() : null,
    };

    onSubmit(processedValues);
  };

  const validateForm = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (error) {
      const firstErrorField = error.errorFields[0]?.name[0];
      const fieldToTabMap = {
        name: '1',
        type: '1',
        description: '1',
        city: '1',
        country: '1',
        website: '2',
        email: '2',
        phone: '2',
        facilities: '3',
        accreditation: '3',
        nationalRanking: '3',
        logo: '4',
      };

      if (firstErrorField && fieldToTabMap[firstErrorField]) {
        setActiveTabKey(fieldToTabMap[firstErrorField]);
      }
      return false;
    }
  };

  const handleNextTab = async () => {
    const isValid = await validateForm();
    if (isValid) {
      const nextTab = String(Number(activeTabKey) + 1);
      if (Number(nextTab) <= 4) {
        setActiveTabKey(nextTab);
      }
    }
  };

  const handlePrevTab = () => {
    const prevTab = String(Number(activeTabKey) - 1);
    if (Number(prevTab) >= 1) {
      setActiveTabKey(prevTab);
    }
  };

  const formTabs = [
    {
      key: '1',
      tab: 'Basic Information',
      content: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Institution Name"
              rules={[
                { required: true, message: 'Please enter institution name' },
              ]}
            >
              <Input placeholder="e.g. University of Nairobi" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Institution Type"
              rules={[
                { required: true, message: 'Please select institution type' },
              ]}
            >
              <Select placeholder="Select type">
                <Option value="University">University</Option>
                <Option value="College">College</Option>
                <Option value="Technical Institute">Technical Institute</Option>
                <Option value="Vocational Center">Vocational Center</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={4} placeholder="Describe the institution..." />
          </Form.Item>

          <Form.Item name="establishedYear" label="Established Year">
            <DatePicker picker="year" placeholder="Select year" />
          </Form.Item>

          <Form.Item
            name="featured"
            valuePropName="checked"
            label="Featured Institution"
            extra="Featured institutions will be highlighted in search results and recommendations"
          >
            <Switch />
          </Form.Item>

          <Divider orientation="left">Location</Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please enter city' }]}
            >
              <Input placeholder="e.g. Nairobi" />
            </Form.Item>

            <Form.Item name="county" label="County">
              <Input placeholder="e.g. Nairobi County" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="country"
              label="Country"
              initialValue="Kenya"
              rules={[{ required: true, message: 'Please enter country' }]}
            >
              <Input placeholder="e.g. Kenya" />
            </Form.Item>

            <Form.Item name="address" label="Address">
              <Input placeholder="e.g. University Way, Nairobi" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="latitude" label="Latitude">
              <Input placeholder="e.g. -1.2833" />
            </Form.Item>

            <Form.Item name="longitude" label="Longitude">
              <Input placeholder="e.g. 36.8167" />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      key: '2',
      tab: 'Contact Information',
      content: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="website"
              label="Website"
              rules={[
                { required: true, message: 'Please enter website URL' },
                { type: 'url', message: 'Please enter a valid URL' },
              ]}
            >
              <Input placeholder="e.g. https://www.uonbi.ac.ke" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="e.g. info@uonbi.ac.ke" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input placeholder="e.g. +254 20 4910000" />
            </Form.Item>
          </div>

          <Divider orientation="left">Social Media</Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="facebook" label="Facebook">
              <Input placeholder="e.g. https://facebook.com/uonbi" />
            </Form.Item>

            <Form.Item name="twitter" label="Twitter">
              <Input placeholder="e.g. https://twitter.com/uonbi" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="instagram" label="Instagram">
              <Input placeholder="e.g. https://instagram.com/uonbi" />
            </Form.Item>

            <Form.Item name="linkedin" label="LinkedIn">
              <Input placeholder="e.g. https://linkedin.com/school/uonbi" />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      key: '3',
      tab: 'Facilities & Accreditation',
      content: (
        <>
          <Form.Item
            name="facilities"
            label="Facilities"
            extra="Press Enter after each facility"
          >
            <Select
              mode="tags"
              placeholder="Add facilities (e.g. Library, Computer Labs, Sports Complex)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="accreditation" label="Accreditation">
            <Input placeholder="e.g. Commission for University Education (CUE)" />
          </Form.Item>

          <Divider orientation="left">Rankings</Divider>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="nationalRanking" label="National Ranking">
              <Input type="number" placeholder="e.g. 1" min={1} />
            </Form.Item>

            <Form.Item
              name="internationalRanking"
              label="International Ranking"
            >
              <Input type="number" placeholder="e.g. 500" min={1} />
            </Form.Item>

            <Form.Item name="rankingYear" label="Ranking Year">
              <DatePicker picker="year" placeholder="Select year" />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      key: '4',
      tab: 'Media',
      content: (
        <>
          <Form.Item name="logo" label="Institution Logo" className="mb-6">
            <Input hidden />
            {logoUrl && (
              <div className="mb-3">
                <img
                  src={logoUrl || '/placeholder.svg'}
                  alt="Institution Logo"
                  className="w-40 h-40 object-cover rounded border"
                />
              </div>
            )}
            <UploadWidget
              uwConfig={{
                cloudName: 'victorkib',
                uploadPreset: 'career-recommender',
                multiple: false,
                maxImageFileSize: 2000000,
                folder: 'cms/institutions/logo',
              }}
              onUploadSuccess={handleLogoUpload}
              setLoading={setUploadLoading}
              buttonText="Upload Logo"
            />
            {uploadLoading && <div className="mt-2">Uploading logo...</div>}
          </Form.Item>

          <Divider />

          <Form.Item name="images" label="Institution Images" className="mb-2">
            <Input hidden />
            {imageUrls.length > 0 && (
              <div className="mb-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url || '/placeholder.svg'}
                      alt={`Institution Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="primary"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      className="absolute top-1 right-1"
                      onClick={() => {
                        const newUrls = [...imageUrls];
                        newUrls.splice(index, 1);
                        setImageUrls(newUrls);
                        form.setFieldsValue({ images: newUrls });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <UploadWidget
              uwConfig={{
                cloudName: 'victorkib',
                uploadPreset: 'career-recommender',
                multiple: false,
                maxImageFileSize: 5000000,
                folder: 'cms/institutions',
              }}
              onUploadSuccess={handleImagesUpload}
              setLoading={setUploadLoading}
              buttonText="Upload Image"
            />
            {uploadLoading && <div className="mt-2">Uploading image...</div>}
          </Form.Item>

          <Alert
            message="Image Guidelines"
            description={
              <ul className="list-disc pl-5 mt-2">
                <li>Use high-quality images that represent the institution</li>
                <li>Logo: Recommended size 400x400 pixels</li>
                <li>Images: Recommended size 1200x800 pixels</li>
                <li>Maximum file size: 5MB</li>
                <li>Supported formats: JPG, PNG, GIF</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center">
          {editMode ? (
            <>
              <EditOutlined className="mr-2 text-blue-500" />
              <span>Edit Institution: {currentInstitution?.name}</span>
            </>
          ) : (
            <>
              <PlusOutlined className="mr-2 text-green-500" />
              <span>Add New Institution</span>
            </>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          type: 'University',
          country: 'Kenya',
          featured: false,
          facilities: [],
        }}
      >
        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
          {formTabs.map((tab) => (
            <TabPane tab={tab.tab} key={tab.key}>
              {tab.content}
            </TabPane>
          ))}
        </Tabs>

        <div className="flex justify-between mt-6">
          <div>
            {activeTabKey !== '1' && (
              <Button onClick={handlePrevTab}>Previous</Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={onCancel}>Cancel</Button>

            {activeTabKey !== '4' ? (
              <Button type="primary" onClick={handleNextTab}>
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={uploadLoading}
              >
                {editMode ? 'Update Institution' : 'Create Institution'}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default InstitutionForm;
