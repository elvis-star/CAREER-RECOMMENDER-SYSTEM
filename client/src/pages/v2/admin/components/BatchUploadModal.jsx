'use client';

import { useState } from 'react';
import { Modal, Button, Alert, Upload, notification } from 'antd';
import { CloudUploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import api from '../../../../services/api';
import { generateBatchTemplate } from '../../../../utils/institutionUtils';

const { Dragger } = Upload;

const BatchUploadModal = ({ visible, onClose }) => {
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const queryClient = useQueryClient();

  // Import institutions mutation
  const importInstitutionsMutation = useMutation({
    mutationFn: (institutionsData) =>
      api.post('/institutions/import', { institutions: institutionsData }),
    onSuccess: (response) => {
      const { success, failed } = response.data.data;
      notification.success({
        message: 'Batch Upload Successful',
        description: `Successfully uploaded ${success} institutions. ${
          failed > 0 ? `Failed to upload ${failed} institutions.` : ''
        }`,
      });
      onClose();
      setImportFile(null);
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Batch Upload Failed',
        description:
          error.response?.data?.message || 'Failed to upload institutions',
      });
    },
    onSettled: () => {
      setImportLoading(false);
    },
  });

  // Handle import institutions
  const handleImportInstitutions = () => {
    if (!importFile) {
      notification.warning({
        message: 'No File Selected',
        description: 'Please select a file to upload.',
      });
      return;
    }

    setImportLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process the data to match the expected format
        const processedData = jsonData.map((row) => ({
          name: row.Name,
          type: row.Type,
          description: row.Description,
          location: {
            city: row.City,
            county: row.County,
            country: row.Country || 'Kenya',
            address: row.Address,
          },
          contact: {
            email: row.Email,
            phone: row.Phone,
          },
          website: row.Website,
          establishedYear: row.EstablishedYear,
          featured: row.Featured === 'Yes' || row.Featured === true,
          facilities: row.Facilities
            ? row.Facilities.split(',').map((s) => s.trim())
            : [],
        }));

        importInstitutionsMutation.mutate(processedData);
      } catch (error) {
        notification.error({
          message: 'Upload Error',
          description:
            'Failed to parse upload file. Please check the file format.',
        });
        setImportLoading(false);
      }
    };

    reader.readAsArrayBuffer(importFile);
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <CloudUploadOutlined className="mr-2 text-blue-500" />
          <span>Batch Upload Institutions</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div className="space-y-6">
        <Alert
          message="Batch Upload Instructions"
          description={
            <ol className="list-decimal pl-5 mt-2">
              <li>Download the template Excel file</li>
              <li>Fill in multiple institution entries in the spreadsheet</li>
              <li>Upload the completed file to add all institutions at once</li>
              <li>The system will validate each entry and report any errors</li>
            </ol>
          }
          type="info"
          showIcon
        />

        <Dragger
          name="file"
          multiple={false}
          accept=".xlsx,.xls,.csv"
          showUploadList={true}
          beforeUpload={(file) => {
            setImportFile(file);
            return false;
          }}
          fileList={importFile ? [importFile] : []}
          onRemove={() => setImportFile(null)}
        >
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for Excel (.xlsx, .xls) or CSV files only
          </p>
        </Dragger>

        <div className="flex justify-between">
          <Button icon={<DownloadOutlined />} onClick={generateBatchTemplate}>
            Download Template
          </Button>

          <div>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handleImportInstitutions}
              loading={importLoading}
              disabled={!importFile}
            >
              Upload and Process
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BatchUploadModal;
