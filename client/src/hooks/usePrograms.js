import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  addProgramToInstitution,
  updateInstitutionProgram,
  deleteInstitutionProgram,
} from '../services/api';

export const usePrograms = () => {
  const queryClient = useQueryClient();

  // Add program mutation
  const addProgramMutation = useMutation({
    mutationFn: ({ id, programData }) => {
      return addProgramToInstitution(id, programData);
    },
    onSuccess: (response) => {
      notification.success({
        message: 'Program Added',
        description: 'The program has been successfully added.',
        icon: React.createElement(CheckCircleOutlined, {
          style: { color: '#52c41a' },
        }),
      });
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Addition Failed',
        description: error.response?.data?.error || 'Failed to add program',
        icon: React.createElement(CloseCircleOutlined, {
          style: { color: '#ff4d4f' },
        }),
      });
    },
  });

  // Update program mutation
  const updateProgramMutation = useMutation({
    mutationFn: ({ institutionId, programId, programData }) => {
      return updateInstitutionProgram(institutionId, programId, programData);
    },
    onSuccess: (response) => {
      notification.success({
        message: 'Program Updated',
        description: 'The program has been successfully updated.',
        icon: React.createElement(CheckCircleOutlined, {
          style: { color: '#52c41a' },
        }),
      });
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Update Failed',
        description: error.response?.data?.error || 'Failed to update program',
        icon: React.createElement(CloseCircleOutlined, {
          style: { color: '#ff4d4f' },
        }),
      });
    },
  });

  // Delete program mutation
  const deleteProgramMutation = useMutation({
    mutationFn: ({ institutionId, programId }) => {
      return deleteInstitutionProgram(institutionId, programId);
    },
    onSuccess: (response) => {
      notification.success({
        message: 'Program Deleted',
        description: 'The program has been successfully deleted.',
        icon: React.createElement(CheckCircleOutlined, {
          style: { color: '#52c41a' },
        }),
      });
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Deletion Failed',
        description: error.response?.data?.error || 'Failed to delete program',
        icon: React.createElement(CloseCircleOutlined, {
          style: { color: '#ff4d4f' },
        }),
      });
    },
  });

  return {
    addProgramMutation,
    updateProgramMutation,
    deleteProgramMutation,
  };
};
