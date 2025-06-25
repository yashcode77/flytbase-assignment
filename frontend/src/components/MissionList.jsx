import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Search, Filter, Plus, Eye, Edit, Trash2, Calendar, MapPin, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from './ui/input';

export default function MissionList() {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        try {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-700 dark:text-gray-200">Loading missions...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
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

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search missions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 mb-1"
                        />
                    </div>

                    <div className="relative">
                        <button type="button" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex justify-between items-center" onClick={() => setShowStatusDropdown(v => !v)}>
                            {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {showStatusDropdown && (
                            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                                {['all', 'pending', 'active', 'completed', 'failed', 'cancelled'].map(status => (
                                    <li key={status} className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer" onClick={() => { setStatusFilter(status); setShowStatusDropdown(false); }}>
                                        {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="relative">
                        <button type="button" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex justify-between items-center" onClick={() => setShowTypeDropdown(v => !v)}>
                            {typeFilter === 'all' ? 'All Types' : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {showTypeDropdown && (
                            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                                {['all', 'surveillance', 'mapping', 'inspection', 'delivery'].map(type => (
                                    <li key={type} className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer" onClick={() => { setTypeFilter(type); setShowTypeDropdown(false); }}>
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

            {filteredMissions.length === 0 ? (
                <div className="text-center py-12">
                    <Target size={48} className="text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No missions found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                            ? 'Try adjusting your filters or search terms'
                            : 'Get started by creating your first mission'
                        }
                    </p>
                    {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                        <Link to="/missions/create">
                            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                                <Plus size={16} className="mr-2" />
                                Create Mission
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMissions.map(mission => (
                        <div key={mission._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                            {mission.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                            {mission.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                                        {mission.status}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(mission.priority)}`}>
                                        {mission.priority}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <Target size={14} className="mr-2" />
                                        <span className="capitalize">{mission.missionType}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <MapPin size={14} className="mr-2" />
                                        <span>
                                            {mission.coordinates.latitude.toFixed(4)}, {mission.coordinates.longitude.toFixed(4)}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <Calendar size={14} className="mr-2" />
                                        <span>{new Date(mission.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 