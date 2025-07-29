import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  fetchInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  updateInstitutionFeaturedStatus,
  duplicateInstitution,
  bulkDeleteInstitutions,
  bulkUpdateInstitutionsFeatured,
} from '../services/api';

export const useInstitutions = () => {
  const queryClient = useQueryClient();

  // Fetch institutions
  const {
    data: institutionsResponse,
    isLoading,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['admin-institutions'],
    queryFn: async () => {
      const response = await fetchInstitutions();
      return response;
    },
  });

  // Extract institutions data from response
  const institutions = institutionsResponse?.data || [];

  // Create institution mutation
  const createInstitutionMutation = useMutation({
    mutationFn: (institutionData) => {
      const transformedData = transformInstitutionData(institutionData);
      return createInstitution(transformedData);
    },
    onSuccess: (response) => {
      notification.success({
        message: 'Institution Created',
        description: 'The institution has been successfully created.',
        icon: React.createElement(CheckCircleOutlined, {
          style: { color: '#52c41a' },
        }),
      });
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Creation Failed',
        description:
          error.response?.data?.error || 'Failed to create institution',
        icon: React.createElement(CloseCircleOutlined, {
          style: { color: '#ff4d4f' },
        }),
      });
    },
  });

  // Update institution mutation
  const updateInstitutionMutation = useMutation({
    mutationFn: ({ id, institutionData }) => {
      const transformedData = transformInstitutionData(institutionData);
      return updateInstitution(id, transformedData);
    },
    onSuccess: (response) => {
      notification.success({
        message: 'Institution Updated',
        description: 'The institution has been successfully updated.',
        icon: React.createElement(CheckCircleOutlined, {
          style: { color: '#52c41a' },
        }),
      });
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Update Failed',
        description:
          error.response?.data?.error || 'Failed to update institution',
        icon: React.createElement(CloseCircleOutlined, {
          style: { color: '#ff4d4f' },
        }),
      });
    },
  });

  // Update featured status mutation
  const updateFeaturedStatusMutation = useMutation({
    mutationFn: ({ id, featured }) => {
      return updateInstitutionFeaturedStatus(id, featured);
    },
    onSuccess: (response, variables) => {
      notification.success({
        message: 'Featured Status Updated',
        description: `Institution has been ${
          variables.featured ? 'featured' : 'unfeatured'
        } successfully.`,
        icon: React.createElement(CheckCircleOutlined, {
          style: { color: '#52c41a' },
        }),
      });
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Featured Status Update Failed',
        description:
          error.response?.data?.error || 'Failed to update featured status',
        icon: React.createElement(CloseCircleOutlined, {
          style: { color: '#ff4d4f' },
        }),
      });
    },
  });

  // Delete institution mutation
  const deleteInstitutionMutation = useMutation({
    mutationFn: (institutionId) => deleteInstitution(institutionId),
    onSuccess: (response) => {
      notification.success({
        message: 'Institution Deleted',
        description: 'The institution has been successfully deleted.',
        icon: React.createElement(CheckCircleOutlined, {
          style: { color: '#52c41a' },
        }),
      });
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Deletion Failed',
        description:
          error.response?.data?.error || 'Failed to delete institution',
        icon: React.createElement(CloseCircleOutlined, {
          style: { color: '#ff4d4f' },
        }),
      });
    },
  });

  // Bulk delete institutions mutation
  const bulkDeleteInstitutionsMutation = useMutation({
    mutationFn: (institutionIds) => bulkDeleteInstitutions(institutionIds),
    onSuccess: (response, institutionIds) => {
      notification.success({
        message: 'Institutions Deleted',
        description: `${institutionIds.length} institutions have been successfully deleted.`,
        icon: React.createElement(CheckCircleOutlined, {
          style: { color: '#52c41a' },
        }),
      });
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Bulk Deletion Failed',
        description:
          error.response?.data?.error || 'Failed to delete institutions',
        icon: React.createElement(CloseCircleOutlined, {
          style: { color: '#ff4d4f' },
        }),
      });
    },
  });

  // Bulk update featured mutation
  const bulkUpdateFeaturedMutation = useMutation({
    mutationFn: ({ institutionIds, featured }) =>
      bulkUpdateInstitutionsFeatured(institutionIds, featured),
    onSuccess: (response, variables) => {
      notification.success({
        message: 'Institutions Updated',
        description: `${
          variables.institutionIds.length
        } institutions have been ${
          variables.featured ? 'featured' : 'unfeatured'
        }.`,
        icon: React.createElement(CheckCircleOutlined, {
          style: { color: '#52c41a' },
        }),
      });
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Bulk Update Failed',
        description:
          error.response?.data?.error || 'Failed to update institutions',
        icon: React.createElement(CloseCircleOutlined, {
          style: { color: '#ff4d4f' },
        }),
      });
    },
  });

  // Duplicate institution mutation
  const duplicateInstitutionMutation = useMutation({
    mutationFn: ({ institutionId, newName }) =>
      duplicateInstitution(institutionId, newName),
    onSuccess: (response) => {
      notification.success({
        message: 'Institution Duplicated',
        description: 'The institution has been successfully duplicated.',
        icon: React.createElement(CheckCircleOutlined, {
          style: { color: '#52c41a' },
        }),
      });
      queryClient.invalidateQueries(['admin-institutions']);
    },
    onError: (error) => {
      notification.error({
        message: 'Duplication Failed',
        description:
          error.response?.data?.error || 'Failed to duplicate institution',
        icon: React.createElement(CloseCircleOutlined, {
          style: { color: '#ff4d4f' },
        }),
      });
    },
  });

  return {
    institutions,
    isLoading,
    fetchError,
    refetch,
    createInstitutionMutation,
    updateInstitutionMutation,
    updateFeaturedStatusMutation, // FIXED: Added the specific featured status mutation
    deleteInstitutionMutation,
    bulkDeleteInstitutionsMutation,
    bulkUpdateFeaturedMutation,
    duplicateInstitutionMutation,
  };
};

// Helper function to transform institution data
const transformInstitutionData = (institutionData) => ({
  name: institutionData.name,
  type: institutionData.type,
  location: {
    address: institutionData.address,
    city: institutionData.city,
    county: institutionData.county,
    country: institutionData.country,
    coordinates: {
      latitude: institutionData.latitude
        ? Number(institutionData.latitude)
        : null,
      longitude: institutionData.longitude
        ? Number(institutionData.longitude)
        : null,
    },
  },
  description: institutionData.description,
  website: institutionData.website,
  contact: {
    email: institutionData.email,
    phone: institutionData.phone,
    socialMedia: {
      facebook: institutionData.facebook,
      twitter: institutionData.twitter,
      instagram: institutionData.instagram,
      linkedin: institutionData.linkedin,
    },
  },
  programs: institutionData.programs || [],
  rankings: {
    national: institutionData.nationalRanking
      ? Number(institutionData.nationalRanking)
      : null,
    international: institutionData.internationalRanking
      ? Number(institutionData.internationalRanking)
      : null,
    year: institutionData.rankingYear
      ? Number(institutionData.rankingYear)
      : null,
  },
  facilities: institutionData.facilities || [],
  accreditation: institutionData.accreditation
    ? [institutionData.accreditation]
    : [],
  establishedYear: institutionData.establishedYear
    ? Number(institutionData.establishedYear)
    : null,
  logo: institutionData.logo,
  images: institutionData.images || [],
  featured: institutionData.featured || false,
});
