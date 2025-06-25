import React from 'react';
import { BarChart3, TrendingUp, Clock, Target, Activity, Users, MapPin, Calendar } from 'lucide-react';

export default function Analytics() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
                <p className="text-gray-600 dark:text-gray-300">Monitor performance metrics and insights</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Missions</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">156</p>
                            <p className="text-sm text-green-600 dark:text-green-400">+12% from last month</p>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">94.2%</p>
                            <p className="text-sm text-green-600 dark:text-green-400">+2.1% from last month</p>
                        </div>
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Mission Time</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">45m</p>
                            <p className="text-sm text-red-600 dark:text-red-400">-3m from last month</p>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Drones</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">8</p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">2 in maintenance</p>
                        </div>
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mission Performance */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Mission Performance</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Surveillance</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">85%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Mapping</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">92%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Inspection</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">78%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Delivery</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">88%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fleet Utilization */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Fleet Utilization</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">DJI Phantom 4 Pro</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">75%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Autel EVO II</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">90%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Skydio 2</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">60%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">Surveillance Mission Completed</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Mission #1234 completed successfully</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">Drone Maintenance Scheduled</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Skydio 2 scheduled for maintenance</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">4 hours ago</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">Performance Alert</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Success rate improved by 5% this week</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">1 day ago</span>
                    </div>
                </div>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Top Performing Drone</h3>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Autel EVO II</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">90% success rate</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">156 missions completed</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Most Active Region</h3>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Downtown</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">45 missions this month</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">High surveillance demand</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Peak Hours</h3>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">2-4 PM</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Highest mission activity</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Optimal weather conditions</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 