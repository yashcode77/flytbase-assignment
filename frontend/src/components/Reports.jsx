import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, Download, Calendar, Plus, Eye, Edit, Trash2, Filter, Search, TrendingUp, Clock, MapPin, Drone, Target, Activity, Globe, Users, Building, Settings, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    // Form state for creating reports
    const [formData, setFormData] = useState({
        missionId: '',
        reportType: 'survey_summary',
        title: '',
        content: '',
        isPublic: false
    });

    const [missions, setMissions] = useState([]);
    const [missionsLoading, setMissionsLoading] = useState(false);

    useEffect(() => {
        fetchReports();
        fetchStats();
        fetchMissions();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/reports', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setReports(data.reports || []);
        } catch (error) {
            toast.error('Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/reports/stats/overview', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchMissions = async () => {
        setMissionsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/missions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const missionsData = Array.isArray(data) ? data : (data.missions || data.data || []);
            setMissions(missionsData);
        } catch (error) {
            console.error('Failed to fetch missions:', error);
            toast.error('Failed to load missions');
            setMissions([]);
        } finally {
            setMissionsLoading(false);
        }
    };

    const generateAnalytics = async () => {
        setAnalyticsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/reports/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date().toISOString()
                })
            });
            const data = await response.json();
            setAnalytics(data);
            toast.success('Analytics generated successfully');
        } catch (error) {
            toast.error('Failed to generate analytics');
        } finally {
            setAnalyticsLoading(false);
        }
    };

    const createReport = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newReport = await response.json();
                setReports([newReport, ...reports]);
                setShowCreateModal(false);
                setFormData({
                    missionId: '',
                    reportType: 'survey_summary',
                    title: '',
                    content: '',
                    isPublic: false
                });
                toast.success('Report created successfully');
                fetchStats();
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to create report');
            }
        } catch (error) {
            toast.error('Failed to create report');
        }
    };

    const deleteReport = async (reportId) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/reports/${reportId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setReports(reports.filter(r => r._id !== reportId));
                toast.success('Report deleted successfully');
                fetchStats();
            } else {
                toast.error('Failed to delete report');
            }
        } catch (error) {
            toast.error('Failed to delete report');
        }
    };

    const generateMissionSummary = async (missionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/reports/mission/${missionId}/summary`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const newReport = await response.json();
                setReports([newReport, ...reports]);
                toast.success('Survey summary generated successfully');
                fetchStats();
            } else {
                toast.error('Failed to generate survey summary');
            }
        } catch (error) {
            toast.error('Failed to generate survey summary');
        }
    };

    const filteredReports = reports.filter(report => {
        const matchesType = filterType === 'all' || report.reportType === filterType;
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.content?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (minutes) => {
        if (!minutes) return '0 min';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const formatDistance = (meters) => {
        if (!meters) return '0 km';
        return `${(meters / 1000).toFixed(1)} km`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Survey Reports</h1>
                    <p className="text-gray-600 dark:text-gray-300">Comprehensive drone survey management and analytics</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (missions.length === 0 && !missionsLoading) {
                                toast.error('No missions available. Please create a mission first.');
                                return;
                            }
                            setShowCreateModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={missionsLoading}
                    >
                        <Plus className="h-4 w-4" />
                        {missionsLoading ? 'Loading...' : 'Create Report'}
                    </button>
                </div>
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalReports || 0}</p>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.thisMonthReports || 0}</p>
                        </div>
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Missions</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{missions.length}</p>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Drone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {missions.filter(m => m.status === 'completed').length}
                            </p>
                        </div>
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Performance Analytics
                    </h2>
                    <button
                        onClick={generateAnalytics}
                        disabled={analyticsLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {analyticsLoading ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <BarChart3 className="h-4 w-4" />
                                Generate Analytics
                            </>
                        )}
                    </button>
                </div>

                {analytics ? (
                    <div className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{analytics.totalMissions}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Missions</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{analytics.efficiencyMetrics.successRate}%</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <p className="text-2xl font-bold text-purple-600">{formatDuration(analytics.averageDuration)}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
                            </div>
                            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                <p className="text-2xl font-bold text-orange-600">{formatDistance(analytics.efficiencyMetrics.totalDistance)}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Distance</p>
                            </div>
                        </div>

                        {/* Mission Type Distribution */}
                        {analytics.missionTypes && Object.keys(analytics.missionTypes).length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Mission Types</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {Object.entries(analytics.missionTypes).map(([type, count]) => (
                                        <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Status Distribution */}
                        {analytics.statusDistribution && Object.keys(analytics.statusDistribution).length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Mission Status</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {Object.entries(analytics.statusDistribution).map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{status}</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">No analytics data available</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            Click "Generate Analytics" to analyze your mission performance
                        </p>
                    </div>
                )}
            </div>

            {/* Recent Missions Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Missions
                </h3>
                <div className="space-y-3">
                    {missions.slice(0, 5).map(mission => (
                        <div key={mission._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100">{mission.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{mission.missionType}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {formatDuration(mission.duration)}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                                        {mission.status}
                                    </p>
                                </div>
                                <button
                                    onClick={() => generateMissionSummary(mission._id)}
                                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    ))}
                    {missions.length === 0 && (
                        <div className="text-center py-8">
                            <Drone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">No missions available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* No Missions Warning */}
            {missions.length === 0 && !missionsLoading && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                No survey missions available
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                <p>
                                    You need to create at least one survey mission before you can generate reports.
                                    <button
                                        onClick={() => window.location.href = '/missions/create'}
                                        className="ml-1 underline hover:no-underline"
                                    >
                                        Create your first survey mission
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                            <option value="all">All Types</option>
                            <option value="survey_summary">Survey Summary</option>
                            <option value="detailed">Detailed</option>
                            <option value="analytics">Analytics</option>
                            <option value="incident">Incident</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Reports</h2>
                {filteredReports.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No reports found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReports.map((report) => (
                            <div key={report._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${report.reportType === 'survey_summary' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                            report.reportType === 'analytics' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                                report.reportType === 'detailed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                            }`}>
                                            {report.reportType === 'survey_summary' ? 'Survey Summary' : report.reportType}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{report.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Mission: {report.missionId?.name || 'Unknown'} • {formatDate(report.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedReport(report);
                                            setShowViewModal(true);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteReport(report._id)}
                                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Report Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Create Report</h2>
                        <form onSubmit={createReport} className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mission</label>
                                    <button
                                        type="button"
                                        onClick={fetchMissions}
                                        disabled={missionsLoading}
                                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                                    >
                                        {missionsLoading ? 'Loading...' : 'Refresh'}
                                    </button>
                                </div>
                                <select
                                    value={formData.missionId}
                                    onChange={(e) => setFormData({ ...formData, missionId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                    disabled={missionsLoading}
                                >
                                    <option value="">
                                        {missionsLoading ? 'Loading missions...' : 'Select a mission'}
                                    </option>
                                    {missions.length === 0 && !missionsLoading ? (
                                        <option value="" disabled>No missions available</option>
                                    ) : (
                                        missions.map(mission => (
                                            <option key={mission._id} value={mission._id}>
                                                {mission.name} ({mission.status})
                                            </option>
                                        ))
                                    )}
                                </select>
                                {missionsLoading && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading missions...</p>
                                )}
                                {missions.length === 0 && !missionsLoading && (
                                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">No missions found. Please create a mission first.</p>
                                )}
                                {missions.length > 0 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {missions.length} mission{missions.length !== 1 ? 's' : ''} available
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
                                <select
                                    value={formData.reportType}
                                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="survey_summary">Survey Summary</option>
                                    <option value="detailed">Detailed Report</option>
                                    <option value="analytics">Analytics Report</option>
                                    <option value="incident">Incident Report</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">Make public</label>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Report
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Report Modal */}
            {showViewModal && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{selectedReport.title}</h2>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>Type: {selectedReport.reportType === 'survey_summary' ? 'Survey Summary' : selectedReport.reportType}</span>
                                <span>Created: {formatDate(selectedReport.createdAt)}</span>
                                <span>Mission: {selectedReport.missionId?.name}</span>
                            </div>

                            {selectedReport.content && (
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Content</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{selectedReport.content}</p>
                                </div>
                            )}

                            {selectedReport.data && (
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Survey Data</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {selectedReport.data.distanceCovered && (
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="text-lg font-semibold text-blue-600">{formatDistance(selectedReport.data.distanceCovered)}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
                                            </div>
                                        )}
                                        {selectedReport.data.flightTime && (
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="text-lg font-semibold text-green-600">{formatDuration(selectedReport.data.flightTime)}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Flight Time</p>
                                            </div>
                                        )}
                                        {selectedReport.data.batteryConsumption && (
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="text-lg font-semibold text-orange-600">{selectedReport.data.batteryConsumption}%</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Battery</p>
                                            </div>
                                        )}
                                        {selectedReport.data.imagesCaptured && (
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="text-lg font-semibold text-purple-600">{selectedReport.data.imagesCaptured}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Images</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectedReport.analysis && (
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Analysis</h3>
                                    <div className="space-y-2">
                                        {selectedReport.analysis.efficiency && (
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Efficiency: {selectedReport.analysis.efficiency}%
                                            </p>
                                        )}
                                        {selectedReport.analysis.riskAssessment && (
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Risk Assessment: {selectedReport.analysis.riskAssessment}
                                            </p>
                                        )}
                                        {selectedReport.analysis.recommendations && selectedReport.analysis.recommendations.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommendations:</p>
                                                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                                                    {selectedReport.analysis.recommendations.map((rec, index) => (
                                                        <li key={index}>{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 