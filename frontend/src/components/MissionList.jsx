import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Search, Filter, Plus, Eye, Edit, Trash2, Calendar, MapPin, Target, Map, Route, Settings2, Table, LayoutGrid, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from './ui/input';
import { ClipLoader } from 'react-spinners';

export default function MissionList() {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem('missionsViewMode') || 'card');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9); // 9 for 3x3 grid in card view

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/missions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMissions(data);
            } else {
                toast.error('Failed to fetch missions');
            }
        } catch (error) {
            toast.error('Error fetching missions');
        } finally {
            setLoading(false);
        }
    };

    const deleteMission = async (id) => {
        if (!confirm('Are you sure you want to delete this mission?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/missions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Mission deleted successfully');
                fetchMissions();
            } else {
                toast.error('Failed to delete mission');
            }
        } catch (error) {
            toast.error('Error deleting mission');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    };

    const filteredMissions = missions.filter(mission => {
        const matchesSearch = mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mission.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || mission.status === statusFilter;
        const matchesType = typeFilter === 'all' || mission.missionType === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    // Pagination calculations
    const totalItems = filteredMissions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMissions = filteredMissions.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, typeFilter]);

    // Update items per page based on view mode
    useEffect(() => {
        setItemsPerPage(viewMode === 'card' ? 9 : 10);
        setCurrentPage(1);
    }, [viewMode]);

    // Determine if filters are active
    const filtersActive = searchTerm || statusFilter !== 'all' || typeFilter !== 'all';

    return (
        <div className="space-y-6">
            {/* Header - Always visible */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Missions</h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage and monitor your drone missions</p>
                </div>
                <Link to="/missions/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                        <Plus size={16} className="mr-2" />
                        Create Mission
                    </Button>
                </Link>
            </div>

            {/* Filters - Always visible */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2">
                        <button
                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium border transition-colors ${viewMode === 'card' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'}`}
                            onClick={() => { setViewMode('card'); localStorage.setItem('missionsViewMode', 'card'); }}
                            aria-pressed={viewMode === 'card'}
                        >
                            <LayoutGrid size={16} /> Card View
                        </button>
                        <button
                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium border transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'}`}
                            onClick={() => { setViewMode('table'); localStorage.setItem('missionsViewMode', 'table'); }}
                            aria-pressed={viewMode === 'table'}
                        >
                            <Table size={16} /> Table View
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search missions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2"
                        />
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex justify-between items-center"
                            onClick={() => setShowStatusDropdown(v => !v)}
                        >
                            {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {showStatusDropdown && (
                            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                                {['all', 'pending', 'active', 'completed', 'failed', 'cancelled'].map(status => (
                                    <li
                                        key={status}
                                        className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer"
                                        onClick={() => { setStatusFilter(status); setShowStatusDropdown(false); }}
                                    >
                                        {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex justify-between items-center"
                            onClick={() => setShowTypeDropdown(v => !v)}
                        >
                            {typeFilter === 'all' ? 'All Types' : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {showTypeDropdown && (
                            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                                {['all', 'surveillance', 'mapping', 'inspection', 'delivery'].map(type => (
                                    <li
                                        key={type}
                                        className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer"
                                        onClick={() => { setTypeFilter(type); setShowTypeDropdown(false); }}
                                    >
                                        {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                            setTypeFilter('all');
                        }}
                        className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                        <Filter size={16} className="mr-2" />
                        Clear Filters
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="">
                    <div className="flex flex-col justify-center items-center">
                        <ClipLoader size={32} color="#2563eb" />
                        <span className="mt-4 text-blue-700 dark:text-blue-300 text-lg">Loading missions...</span>
                    </div>
                </div>
            )}

            {/* Content - Only show when not loading */}
            {!loading && (
                viewMode === 'card' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentMissions.map(mission => (
                            <div key={mission._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-shadow duration-200 group flex flex-col h-full">
                                {/* Card Header */}
                                <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                            {mission.name}
                                        </h3>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(mission.status)} border border-transparent`}>{mission.status}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(mission.priority)} border border-transparent`}>{mission.priority}</span>
                                    </div>
                                </div>
                                {/* Card Body */}
                                <div className="flex-1 flex flex-col justify-between px-6 py-4">
                                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Target size={16} className="text-blue-500 dark:text-blue-400" title="Mission Type" />
                                            <span className="capitalize font-medium">{mission.missionType}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-green-500 dark:text-green-400" title="Location" />
                                            <span>{mission.coordinates.latitude.toFixed(4)}, {mission.coordinates.longitude.toFixed(4)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-500 dark:text-gray-400" title="Created Date" />
                                            <span>{new Date(mission.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Map size={16} className="text-purple-500 dark:text-purple-400" title="Survey Area" />
                                            <span>Survey Area: <span className="font-semibold">{mission.surveyArea?.length || 0}</span> points</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Route size={16} className="text-orange-500 dark:text-orange-400" title="Waypoints" />
                                            <span>Waypoints: <span className="font-semibold">{mission.flightPath?.length || 0}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Settings2 size={16} className="text-pink-500 dark:text-pink-400" title="Data Collection" />
                                            <span>Data: {mission.dataCollection?.frequency ? `${mission.dataCollection.frequency}s` : 'N/A'} | Sensors: {mission.dataCollection?.sensors?.length ? mission.dataCollection.sensors.join(', ') : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Card Actions */}
                                <div className="flex gap-2 px-6 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                    <Link to={`/missions/${mission._id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700">
                                            <Eye size={14} className="mr-1" />
                                            View
                                        </Button>
                                    </Link>
                                    <Link to={`/missions/${mission._id}/edit`}>
                                        <Button variant="outline" size="sm" className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700">
                                            <Edit size={14} />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteMission(mission._id)}
                                        className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Priority</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Type</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Location</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Survey Area</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Waypoints</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Data</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {currentMissions.map(mission => (
                                    <tr key={mission._id} className="hover:bg-blue-50 dark:hover:bg-gray-900 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{mission.name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(mission.status)} border border-transparent`}>{mission.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(mission.priority)} border border-transparent`}>{mission.priority}</span>
                                        </td>
                                        <td className="px-4 py-3 capitalize">{mission.missionType}</td>
                                        <td className="px-4 py-3">{mission.coordinates.latitude.toFixed(4)}, {mission.coordinates.longitude.toFixed(4)}</td>
                                        <td className="px-4 py-3">{mission.surveyArea?.length || 0} points</td>
                                        <td className="px-4 py-3">{mission.flightPath?.length || 0}</td>
                                        <td className="px-4 py-3">
                                            {mission.dataCollection?.frequency ? `${mission.dataCollection.frequency}s` : 'N/A'}<br />
                                            {mission.dataCollection?.sensors?.length ? mission.dataCollection.sensors.join(', ') : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link to={`/missions/${mission._id}`}>
                                                    <Button variant="outline" size="sm" className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700">
                                                        <Eye size={14} className="mr-1" />
                                                    </Button>
                                                </Link>
                                                <Link to={`/missions/${mission._id}/edit`}>
                                                    <Button variant="outline" size="sm" className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700">
                                                        <Edit size={14} />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => deleteMission(mission._id)}
                                                    className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} missions
                        </div>

                        <div className="flex items-center gap-2">
                            {/* First Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <ChevronsLeft size={16} />
                            </Button>

                            {/* Previous Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <ChevronLeft size={16} />
                            </Button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={currentPage === pageNum
                                                ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                                                : "dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                                            }
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            {/* Next Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <ChevronRight size={16} />
                            </Button>

                            {/* Last Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <ChevronsRight size={16} />
                            </Button>
                        </div>

                        {/* Items per page selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700 dark:text-gray-300">Show:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            >
                                <option value={6}>6</option>
                                <option value={9}>9</option>
                                <option value={12}>12</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                            <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}