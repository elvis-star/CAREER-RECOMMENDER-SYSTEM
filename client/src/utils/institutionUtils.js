import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Apply filters and search
export const getFilteredInstitutions = (
  institutions,
  searchText,
  filters,
  advancedSearch,
  advancedFilters
) => {
  if (!institutions) return [];

  return institutions.filter((institution) => {
    // Text search
    const matchesSearch =
      institution.name.toLowerCase().includes(searchText.toLowerCase()) ||
      institution.description
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      institution.type.toLowerCase().includes(searchText.toLowerCase()) ||
      (institution.location?.city || '')
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (institution.facilities || []).some((facility) =>
        facility.toLowerCase().includes(searchText.toLowerCase())
      );

    // Type filter
    const matchesType =
      filters.type.length === 0 || filters.type.includes(institution.type);

    // City filter
    const matchesCity =
      filters.city.length === 0 ||
      filters.city.includes(institution.location?.city);

    // Featured filter
    const matchesFeatured =
      filters.featured === null || institution.featured === filters.featured;

    // Advanced filters
    let matchesAdvancedFilters = true;

    if (advancedSearch) {
      // Established year range filter
      const establishedYear = institution.establishedYear || 0;
      const matchesYearRange =
        establishedYear >= advancedFilters.establishedYearRange[0] &&
        establishedYear <= advancedFilters.establishedYearRange[1];

      // Program count filter
      const programCount = institution.programs?.length || 0;
      const matchesProgramCount =
        programCount >= advancedFilters.programCount[0] &&
        programCount <= advancedFilters.programCount[1];

      matchesAdvancedFilters = matchesYearRange && matchesProgramCount;
    }

    return (
      matchesSearch &&
      matchesType &&
      matchesCity &&
      matchesFeatured &&
      matchesAdvancedFilters
    );
  });
};

// Sort institutions
export const getSortedInstitutions = (
  filteredInstitutions,
  sortField,
  sortOrder
) => {
  return [...filteredInstitutions].sort((a, b) => {
    let valueA, valueB;

    // Handle nested fields
    if (sortField === 'programs') {
      valueA = a.programs?.length || 0;
      valueB = b.programs?.length || 0;
    } else if (sortField === 'location.city') {
      valueA = a.location?.city || '';
      valueB = b.location?.city || '';
    } else if (sortField === 'views') {
      valueA = a.views || 0;
      valueB = b.views || 0;
    } else {
      valueA = a[sortField] || '';
      valueB = b[sortField] || '';
    }

    // Handle string vs number comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'ascend'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortOrder === 'ascend' ? valueA - valueB : valueB - valueA;
    }
  });
};

// Calculate institution statistics for analytics
export const calculateInstitutionStats = (institutionsData) => {
  // Total institutions
  const totalInstitutions = institutionsData.length;

  // Featured institutions
  const featuredInstitutions = institutionsData.filter(
    (i) => i.featured
  ).length;

  // Type distribution
  const typeCounts = institutionsData.reduce((acc, institution) => {
    acc[institution.type] = (acc[institution.type] || 0) + 1;
    return acc;
  }, {});

  // Location distribution
  const locationDistribution = institutionsData.reduce((acc, institution) => {
    const city = institution.location?.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  // Average programs per institution
  const totalPrograms = institutionsData.reduce((sum, institution) => {
    return sum + (institution.programs?.length || 0);
  }, 0);
  const averagePrograms =
    totalInstitutions > 0 ? Math.round(totalPrograms / totalInstitutions) : 0;

  // Top institutions by program count
  const topInstitutions = [...institutionsData]
    .sort((a, b) => (b.programs?.length || 0) - (a.programs?.length || 0))
    .slice(0, 5);

  // Recently added institutions
  const recentlyAdded = [...institutionsData]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return {
    totalInstitutions,
    featuredInstitutions,
    typeCounts,
    locationDistribution,
    averagePrograms,
    topInstitutions,
    recentlyAdded,
  };
};

// Export functions
export const handleExportInstitutions = async (
  institutions,
  format,
  csvLinkRef,
  setExportLoading
) => {
  try {
    setExportLoading(true);

    // Prepare data for export
    const exportData = institutions.map((institution) => ({
      Name: institution.name,
      Type: institution.type,
      Description: institution.description,
      City: institution.location?.city || '',
      County: institution.location?.county || '',
      Country: institution.location?.country || 'Kenya',
      Address: institution.location?.address || '',
      Email: institution.contact?.email || '',
      Phone: institution.contact?.phone || '',
      Website: institution.website || '',
      EstablishedYear: institution.establishedYear || '',
      Programs: (institution.programs || []).length,
      Facilities: (institution.facilities || []).join(', '),
      Featured: institution.featured ? 'Yes' : 'No',
      Views: institution.views || 0,
    }));

    if (format === 'csv') {
      // CSV export is handled by CSVLink component
      setTimeout(() => {
        csvLinkRef.current.link.click();
        setExportLoading(false);
      }, 500);
    } else if (format === 'excel') {
      // Excel export
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Institutions');
      XLSX.writeFile(workbook, 'institutions_export.xlsx');
      setExportLoading(false);
    } else if (format === 'pdf') {
      // PDF export
      const doc = new jsPDF('landscape');
      doc.autoTable({
        head: [['Name', 'Type', 'City', 'Programs', 'Established', 'Featured']],
        body: exportData.map((institution) => [
          institution.Name,
          institution.Type,
          institution.City,
          institution.Programs,
          institution.EstablishedYear,
          institution.Featured,
        ]),
      });
      doc.save('institutions_export.pdf');
      setExportLoading(false);
    }
  } catch (error) {
    setExportLoading(false);
    throw error;
  }
};

// Generate batch template
export const generateBatchTemplate = () => {
  const template = [
    {
      Name: 'University of Nairobi',
      Type: 'University',
      Description: 'Leading public university in Kenya',
      City: 'Nairobi',
      County: 'Nairobi County',
      Country: 'Kenya',
      Address: 'University Way, Nairobi',
      Email: 'info@uonbi.ac.ke',
      Phone: '+254 20 4910000',
      Website: 'https://www.uonbi.ac.ke',
      EstablishedYear: '1970',
      Facilities: 'Library, Computer Labs, Sports Complex',
      Featured: 'Yes',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
  XLSX.writeFile(workbook, 'institution_import_template.xlsx');
};
