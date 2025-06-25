import React from 'react';
import { BarChart3, FileText, Download, Calendar } from 'lucide-react';

export default function Reports() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
                <p className="text-gray-600 dark:text-gray-300">Generate and manage mission reports and analytics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">24</p>
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
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">8</p>
                        </div>
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Analytics</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Types */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Report Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Mission Summary</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Quick overview reports</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Analytics</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Performance metrics</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Scheduled</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Automated reports</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <Download className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Export</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Download reports</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Reports</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">Surveillance Mission Report</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Generated 2 hours ago</p>
                        </div>
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            View
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">Monthly Analytics Summary</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Generated 1 day ago</p>
                        </div>
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            View
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">Fleet Performance Report</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Generated 3 days ago</p>
                        </div>
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 