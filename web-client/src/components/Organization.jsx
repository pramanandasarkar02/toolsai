import React, { useEffect, useState } from 'react';
import { FaBuilding, FaLink, FaKey, FaPlus, FaInfoCircle, FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const Organization = () => {
    const [organizations, setOrganizations] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrganizations = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/organizations');
            const data = await response.json();
            setOrganizations(data);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleOrganizationCreated = () => {
        fetchOrganizations();
        setIsFormOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this organization?')) {
            try {
                await fetch(`http://localhost:8080/api/v1/organizations/${id}`, {
                    method: 'DELETE'
                });
                fetchOrganizations();
            } catch (error) {
                console.error('Error deleting organization:', error);
            }
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" />;
        return sortConfig.direction === 'ascending' 
            ? <FaSortUp className="ml-1" /> 
            : <FaSortDown className="ml-1" />;
    };

    const sortedOrganizations = React.useMemo(() => {
        let sortableItems = [...organizations];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [organizations, sortConfig]);

    const filteredOrganizations = sortedOrganizations.filter(org => 
        org.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.orgUrl?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrganizations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Organizations</h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                    <FaPlus /> Create Organization
                </button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search organizations..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('id')}
                                >
                                    <div className="flex items-center">
                                        ID {getSortIcon('id')}
                                    </div>
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('orgName')}
                                >
                                    <div className="flex items-center">
                                        Name {getSortIcon('orgName')}
                                    </div>
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Description
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('orgUrl')}
                                >
                                    <div className="flex items-center">
                                        URL {getSortIcon('orgUrl')}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.length > 0 ? (
                                currentItems.map(org => (
                                    <tr key={org.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {org.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FaBuilding className="mr-2 text-blue-500" />
                                                {org.orgName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {org.description || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {org.orgUrl ? (
                                                <a 
                                                    href={org.orgUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center"
                                                >
                                                    <FaLink className="mr-1" /> Visit
                                                </a>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-4">
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(org.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No organizations found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {filteredOrganizations.length > itemsPerPage && (
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                        <span className="font-medium">
                            {Math.min(indexOfLastItem, filteredOrganizations.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredOrganizations.length}</span> results
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 border rounded-md ${currentPage === number 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                            >
                                {number}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {isFormOpen && (
                <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <CreateOrganizationForm 
                            onSuccess={handleOrganizationCreated} 
                            onCancel={() => setIsFormOpen(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};


const CreateOrganizationForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        orgName: '',
        description: '',
        orgUrl: '',
        orgSecret: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/v1/organizations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to create organization');
            }

            onSuccess();
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaBuilding /> Create New Organization
                </h2>
                
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                            <FaBuilding className="text-gray-500" /> Organization Name
                        </label>
                        <input
                            type="text"
                            name="orgName"
                            value={formData.orgName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                            <FaInfoCircle className="text-gray-500" /> Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                            <FaLink className="text-gray-500" /> Website URL
                        </label>
                        <input
                            type="url"
                            name="orgUrl"
                            value={formData.orgUrl}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center gap-2">
                            <FaKey className="text-gray-500" /> Secret Key
                        </label>
                        <input
                            type="password"
                            name="orgSecret"
                            value={formData.orgSecret}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : (
                                <>
                                    <FaPlus /> Create
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Organization;