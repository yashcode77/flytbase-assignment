import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { MapPin, Clock, Calendar, Target, BarChart3, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MissionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mission, setMission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchMission();
    }, [id]);

    const fetchMission = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/missions/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMission(data);
            } else {
                toast.error('Failed to fetch mission details');
                navigate('/missions');
            }
        } catch (error) {
            toast.error('Error fetching mission details');
            navigate('/missions');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/missions/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                toast.success(`Mission status updated to ${newStatus}`);
                fetchMission();
            } else {
                toast.error('Failed to update mission status');
            }
        } catch (error) {
            toast.error('Error updating mission status');
        } finally {
            setUpdating(false);
        }
    };

    const deleteMission = async () => {
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
                navigate('/missions');
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-700 dark:text-gray-200">Loading mission details...</div>
            </div>
        );
    }

    if (!mission) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Mission not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{mission.name}</h1>
                    <p className="text-gray-600 dark:text-gray-300">{mission.description}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/missions/${id}/edit`)}
                        className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                        <Edit size={16} className="mr-2" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        onClick={deleteMission}
                        className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                    >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Status and Priority */}
            <div className="flex gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mission.status)}`}>
                    {mission.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(mission.priority)}`}>
                    {mission.priority} Priority
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mission Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                            <BarChart3 size={20} className="mr-2" />
                            Mission Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Mission Type</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium capitalize">{mission.missionType}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">{mission.createdBy?.name || 'Unknown'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created Date</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">
                                    {new Date(mission.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">
                                    {mission.duration ? `${mission.duration} minutes` : 'Not started'}
                                </p>
                            </div>
                            {mission.scheduledAt && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled For</label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {new Date(mission.scheduledAt).toLocaleString()}
                                    </p>
                                </div>
                            )}
                            {mission.droneId && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Drone</label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">{mission.droneId}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                            <MapPin size={20} className="mr-2" />
                            Location Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Latitude</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">{mission.coordinates.latitude}°</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Longitude</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">{mission.coordinates.longitude}°</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Altitude</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">{mission.coordinates.altitude} meters</p>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                            <div className="text-center">
                                <Target size={48} className="text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400">Map visualization would be displayed here</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Coordinates: {mission.coordinates.latitude}, {mission.coordinates.longitude}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Management */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Status Management</h2>

                        <div className="space-y-3">
                            {mission.status === 'pending' && (
                                <Button
                                    onClick={() => updateStatus('active')}
                                    disabled={updating}
                                    className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                                >
                                    {updating ? 'Starting...' : 'Start Mission'}
                                </Button>
                            )}

                            {mission.status === 'active' && (
                                <>
                                    <Button
                                        onClick={() => updateStatus('completed')}
                                        disabled={updating}
                                        className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                                    >
                                        {updating ? 'Completing...' : 'Complete Mission'}
                                    </Button>
                                    <Button
                                        onClick={() => updateStatus('failed')}
                                        disabled={updating}
                                        variant="outline"
                                        className="w-full text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                                    >
                                        {updating ? 'Marking...' : 'Mark as Failed'}
                                    </Button>
                                </>
                            )}

                            {(mission.status === 'pending' || mission.status === 'active') && (
                                <Button
                                    onClick={() => updateStatus('cancelled')}
                                    disabled={updating}
                                    variant="outline"
                                    className="w-full text-gray-600 border-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700"
                                >
                                    {updating ? 'Cancelling...' : 'Cancel Mission'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Flight Path */}
                    {mission.flightPath && mission.flightPath.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Flight Path</h2>
                            <div className="space-y-2">
                                {mission.flightPath.map((point, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            Point {index + 1}
                                        </span>
                                        <span className="text-gray-900 dark:text-gray-100">
                                            {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 