'use client';

import { useState } from 'react';
import { Modal, Button, Alert, Tag, notification } from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  CloudUploadOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import { generateBatchTemplate } from '../../../../utils/institutionUtils';
import api from '../../../../services/api';

const ImportModal = ({ visible, onClose }) => {
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
        message: 'Import Successful',
        description: `Successfully imported ${success} institutions. ${
          failed > 0 ? `Failed to import ${failed} institutions.` : ''
        }`,
      });
      onClose();
      setImportFile(null);
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Import Failed',
        description:
          error.response?.data?.message || 'Failed to import institutions',
      });
    },
    onSettled: () => {
      setImportLoading(false);
    },
  });

  // Handle import file change
  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);
    }
  };

  // Handle import institutions
  const handleImportInstitutions = () => {
    if (!importFile) {
      notification.warning({
        message: 'No File Selected',
        description: 'Please select a file to import.',
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
          message: 'Import Error',
          description:
            'Failed to parse import file. Please check the file format.',
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
          <UploadOutlined className="mr-2 text-blue-500" />
          <span>Import Institutions</span>
        </div>
      }
      open={visible}
      onCancel={() => {
        onClose();
        setImportFile(null);
      }}
      footer={[
        <Button
          key="template"
          icon={<DownloadOutlined />}
          onClick={generateBatchTemplate}
        >
          Download Template
        </Button>,
        <Button
          key="cancel"
          onClick={() => {
            onClose();
            setImportFile(null);
          }}
        >
          Cancel
        </Button>,
        <Button
          key="import"
          type="primary"
          icon={<CloudUploadOutlined />}
          onClick={handleImportInstitutions}
          loading={importLoading}
          disabled={!importFile}
        >
          Import
        </Button>,
      ]}
      width={600}
    >
      <div className="space-y-4">
        <Alert
          message="Import Instructions"
          description={
            <ol className="list-decimal pl-5 mt-2">
              <li>Download the template Excel file</li>
              <li>
                Fill in the institution data following the template format
              </li>
              <li>Upload the completed file</li>
              <li>Click Import to add the institutions to the system</li>
            </ol>
          }
          type="info"
          showIcon
        />

        <div className="border-dashed border-2 border-gray-300 p-6 text-center rounded-md">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImportFileChange}
            style={{ display: 'none' }}
            id="import-file"
          />
          <label htmlFor="import-file">
            <div className="cursor-pointer">
              <UploadOutlined style={{ fontSize: 40, color: '#1890ff' }} />
              <p className="text-blue-500 mt-2">Click to upload</p>
              <p className="text-gray-500 text-sm">Support for Excel or CSV</p>
            </div>
          </label>

          {importFile && (
            <div className="mt-4">
              <Tag color="blue" icon={<FileExcelOutlined />}>
                {importFile.name}
              </Tag>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;
