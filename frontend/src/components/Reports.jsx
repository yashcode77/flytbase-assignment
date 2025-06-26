"use client"

import { useState, useEffect } from "react"
import {
    FileText,
    Download,
    Calendar,
    Plus,
    Search,
    Eye,
    Edit,
    Trash2,
    TrendingUp,
    Clock,
    MapPin,
    Battery,
    Camera,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Loader,
    MoreHorizontal,
    FileDown,
    Share2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

export default function ReportsDashboard() {
    const [reports, setReports] = useState([])
    const [stats, setStats] = useState({
        totalReports: 0,
        thisMonth: 0,
        reportTypes: {},
        completionRate: 85,
        avgFlightTime: 24,
    })
    const [loading, setLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState(null)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [dateRange, setDateRange] = useState("30")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const [newReport, setNewReport] = useState({
        title: "",
        reportType: "summary",
        missionId: "",
        content: "",
        autoGenerate: true,
    })

    // Mock missions data - in real app, fetch from API
    const [missions] = useState([
        { _id: "1", name: "Site Alpha Inspection", status: "completed" },
        { _id: "2", name: "Security Patrol Route B", status: "completed" },
        { _id: "3", name: "Infrastructure Survey", status: "completed" },
    ])

    useEffect(() => {
        fetchReports()
        fetchStats()
    }, [currentPage, searchTerm, filterType, dateRange])

    const fetchReports = async () => {
        setLoading(true)
        try {
            // Mock API call - replace with actual API
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const mockReports = [
                {
                    _id: "1",
                    title: "Site Alpha Inspection Report",
                    reportType: "detailed",
                    content: "Comprehensive inspection of Site Alpha facility completed successfully.",
                    missionId: {
                        _id: "1",
                        name: "Site Alpha Inspection",
                        status: "completed",
                        missionType: "inspection",
                    },
                    data: {
                        distanceCovered: "2.5",
                        flightTime: "28",
                        batteryConsumption: "65",
                        imagesCaptured: "156",
                        videosCaptured: "3",
                    },
                    analysis: {
                        efficiency: "92",
                        riskAssessment: "Low",
                        recommendations: ["Schedule follow-up inspection in 3 months", "Monitor roof condition"],
                    },
                    createdAt: "2024-01-15T10:30:00Z",
                    generatedBy: { name: "John Doe", email: "john@company.com" },
                },
                {
                    _id: "2",
                    title: "Security Patrol Summary",
                    reportType: "summary",
                    content: "Routine security patrol completed without incidents.",
                    missionId: {
                        _id: "2",
                        name: "Security Patrol Route B",
                        status: "completed",
                        missionType: "security",
                    },
                    data: {
                        distanceCovered: "1.8",
                        flightTime: "22",
                        batteryConsumption: "45",
                        imagesCaptured: "89",
                        videosCaptured: "1",
                    },
                    analysis: {
                        efficiency: "88",
                        riskAssessment: "Low",
                        recommendations: ["Continue regular patrols", "Check perimeter fence"],
                    },
                    createdAt: "2024-01-14T14:15:00Z",
                    generatedBy: { name: "Jane Smith", email: "jane@company.com" },
                },
            ]

            setReports(mockReports)
        } catch (error) {
            console.error("Failed to fetch reports:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            // Mock API call
            const mockStats = {
                totalReports: 24,
                thisMonth: 8,
                reportTypes: {
                    summary: 12,
                    detailed: 8,
                    analytics: 3,
                    incident: 1,
                },
                completionRate: 92,
                avgFlightTime: 26,
            }
            setStats(mockStats)
        } catch (error) {
            console.error("Failed to fetch stats:", error)
        }
    }

    const handleCreateReport = async (e) => {
        e.preventDefault()
        try {
            // Mock API call
            console.log("Creating report:", newReport)

            // Reset form and close dialog
            setNewReport({
                title: "",
                reportType: "summary",
                missionId: "",
                content: "",
                autoGenerate: true,
            })
            setShowCreateDialog(false)

            // Refresh reports
            fetchReports()
        } catch (error) {
            console.error("Failed to create report:", error)
        }
    }

    const handleDeleteReport = async (reportId) => {
        if (!confirm("Are you sure you want to delete this report?")) return

        try {
            // Mock API call
            console.log("Deleting report:", reportId)
            fetchReports()
        } catch (error) {
            console.error("Failed to delete report:", error)
        }
    }

    const getReportTypeColor = (type) => {
        switch (type) {
            case "summary":
                return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
            case "detailed":
                return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200"
            case "analytics":
                return "bg-violet-100 text-violet-800 dark:bg-violet-800 dark:text-violet-200"
            case "incident":
                return "bg-rose-100 text-rose-800 dark:bg-rose-800 dark:text-rose-200"
            default:
                return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-4 w-4 text-emerald-500" />
            case "failed":
                return <XCircle className="h-4 w-4 text-rose-500" />
            case "in-progress":
                return <Loader className="h-4 w-4 text-blue-500 animate-spin" />
            default:
                return <Clock className="h-4 w-4 text-slate-500" />
        }
    }

    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.content.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === "all" || report.reportType === filterType
        return matchesSearch && matchesType
    })

    // Pagination calculations
    const totalItems = filteredReports.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentReports = filteredReports.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType, dateRange]);

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Survey Reports</h1>
                    <p className="text-slate-600 dark:text-slate-300">Comprehensive mission reports and analytics</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <Download className="h-4 w-4 mr-2" />
                        Export All
                    </Button>
                    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                        <DialogTrigger asChild>
                            <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                                <Plus className="h-4 w-4 mr-2" />
                                New Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Create New Report</DialogTitle>
                                <DialogDescription>Generate a comprehensive report from mission data</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateReport} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Report Title</Label>
                                        <Input
                                            id="title"
                                            value={newReport.title}
                                            onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                                            placeholder="Enter report title"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reportType">Report Type</Label>
                                        <Select
                                            value={newReport.reportType}
                                            onValueChange={(value) => setNewReport({ ...newReport, reportType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="summary">Summary Report</SelectItem>
                                                <SelectItem value="detailed">Detailed Analysis</SelectItem>
                                                <SelectItem value="analytics">Analytics Report</SelectItem>
                                                <SelectItem value="incident">Incident Report</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mission">Select Mission</Label>
                                    <Select
                                        value={newReport.missionId}
                                        onValueChange={(value) => setNewReport({ ...newReport, missionId: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a completed mission" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {missions.map((mission) => (
                                                <SelectItem key={mission._id} value={mission._id}>
                                                    {mission.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Additional Notes (Optional)</Label>
                                    <Textarea
                                        id="content"
                                        value={newReport.content}
                                        onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                                        placeholder="Add any specific observations or notes..."
                                        rows={3}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="autoGenerate"
                                        checked={newReport.autoGenerate}
                                        onChange={(e) => setNewReport({ ...newReport, autoGenerate: e.target.checked })}
                                        className="rounded border-slate-300"
                                    />
                                    <Label htmlFor="autoGenerate" className="text-sm">
                                        Auto-generate analysis and recommendations
                                    </Label>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Generate Report</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Reports</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalReports}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">+{stats.thisMonth} this month</p>
                        </div>
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <FileText className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Mission Success Rate</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.completionRate}%</p>
                            <Progress value={stats.completionRate} className="mt-2" />
                        </div>
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Flight Time</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.avgFlightTime}m</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Per mission</p>
                        </div>
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <Clock className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">This Month</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.thisMonth}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">New reports generated</p>
                        </div>
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <Calendar className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search reports by title or content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="summary">Summary</SelectItem>
                                <SelectItem value="detailed">Detailed</SelectItem>
                                <SelectItem value="analytics">Analytics</SelectItem>
                                <SelectItem value="incident">Incident</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last 7 days</SelectItem>
                                <SelectItem value="30">Last 30 days</SelectItem>
                                <SelectItem value="90">Last 3 months</SelectItem>
                                <SelectItem value="365">Last year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Reports</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {filteredReports.length} of {reports.length} reports
                    </p>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader className="h-8 w-8 animate-spin text-slate-600" />
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                            <p>No reports found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {currentReports.map((report) => (
                                <div
                                    key={report._id}
                                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{report.title}</h3>
                                            <Badge className={getReportTypeColor(report.reportType)}>{report.reportType}</Badge>
                                            {report.missionId && getStatusIcon(report.missionId.status)}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                            {report.missionId && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {report.missionId.name}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </div>
                                            {report.data?.flightTime && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {report.data.flightTime}m flight
                                                </div>
                                            )}
                                            {report.data?.batteryConsumption && (
                                                <div className="flex items-center gap-1">
                                                    <Battery className="h-3 w-3" />
                                                    {report.data.batteryConsumption}% battery
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Report
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <FileDown className="h-4 w-4 mr-2" />
                                                    Export PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Share2 className="h-4 w-4 mr-2" />
                                                    Share Report
                                                </DropdownMenuItem>
                                                <Separator />
                                                <DropdownMenuItem className="text-rose-600" onClick={() => handleDeleteReport(report._id)}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Report
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} reports
                        </div>

                        <div className="flex items-center gap-2">
                            {/* First Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="dark:bg-gray-800 dark:text-slate-200 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <ChevronsLeft size={16} />
                            </Button>

                            {/* Previous Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="dark:bg-gray-800 dark:text-slate-200 dark:border-gray-700 dark:hover:bg-gray-700"
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
                                                ? "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white"
                                                : "dark:bg-gray-800 dark:text-slate-200 dark:border-gray-700 dark:hover:bg-gray-700"
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
                                className="dark:bg-gray-800 dark:text-slate-200 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <ChevronRight size={16} />
                            </Button>

                            {/* Last Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="dark:bg-gray-800 dark:text-slate-200 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <ChevronsRight size={16} />
                            </Button>
                        </div>

                        {/* Items per page selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-700 dark:text-slate-300">Show:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={25}>25</option>
                            </select>
                            <span className="text-sm text-slate-700 dark:text-slate-300">per page</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Detail Dialog */}
            {selectedReport && (
                <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="pb-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex-1">
                                    <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                                        {selectedReport.title}
                                    </DialogTitle>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                                        <Badge className={getReportTypeColor(selectedReport.reportType)}>
                                            {selectedReport.reportType}
                                        </Badge>
                                        <span>•</span>
                                        <span>{new Date(selectedReport.createdAt).toLocaleString()}</span>
                                        <span>•</span>
                                        <span>By {selectedReport.generatedBy.name}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2 sm:mt-0">
                                    <Button variant="outline" size="sm" className="h-8">
                                        <FileDown className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8">
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </Button>
                                </div>
                            </div>
                        </DialogHeader>

                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="data">Mission Data</TabsTrigger>
                                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Report Type</div>
                                            <Badge className={getReportTypeColor(selectedReport.reportType)}>
                                                {selectedReport.reportType}
                                            </Badge>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Created</div>
                                            <div className="text-slate-900 dark:text-slate-100 text-sm">{new Date(selectedReport.createdAt).toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Generated by</div>
                                            <div className="text-slate-900 dark:text-slate-100 text-sm">{selectedReport.generatedBy.name}</div>
                                        </div>
                                    </div>
                                    {selectedReport.missionId && (
                                        <div className="mt-6">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold uppercase tracking-wide">Mission Information</div>
                                            <div className="space-y-2">
                                                <div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Mission Name</div>
                                                    <div className="text-slate-900 dark:text-slate-100 text-sm">{selectedReport.missionId.name}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status</div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        {getStatusIcon(selectedReport.missionId.status)}
                                                        <span className="capitalize text-slate-900 dark:text-slate-100 font-medium">
                                                            {selectedReport.missionId.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {selectedReport.content && (
                                        <div className="mt-6">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Report Content</div>
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                                                    {selectedReport.content}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="data" className="space-y-6">
                                {selectedReport.data ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {Object.entries(selectedReport.data).map(([key, value]) => (
                                            <div key={key} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                                        {value}
                                                        {key === "batteryConsumption" && "%"}
                                                        {key === "flightTime" && " min"}
                                                        {key === "distanceCovered" && " km"}
                                                    </div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-400 capitalize font-medium">
                                                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 border border-gray-200 dark:border-gray-700">
                                        <div className="text-center">
                                            <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                                            <p className="text-slate-500 text-lg font-medium">No mission data available</p>
                                            <p className="text-slate-400 text-sm mt-1">This report doesn't contain any mission data</p>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="analysis" className="space-y-6">
                                {selectedReport.analysis ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {selectedReport.analysis.efficiency && (
                                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                                                        Mission Efficiency
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div className="text-4xl font-bold text-emerald-600 mb-2">
                                                            {selectedReport.analysis.efficiency}%
                                                        </div>
                                                        <Progress value={Number.parseInt(selectedReport.analysis.efficiency)} className="h-3" />
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            {Number.parseInt(selectedReport.analysis.efficiency) >= 90
                                                                ? "Excellent performance - Mission completed with outstanding efficiency"
                                                                : Number.parseInt(selectedReport.analysis.efficiency) >= 75
                                                                    ? "Good performance - Mission completed successfully"
                                                                    : "Needs improvement - Review mission parameters for optimization"}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedReport.analysis.riskAssessment && (
                                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                                                        Risk Assessment
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div
                                                            className={`text-3xl font-bold mb-2 ${selectedReport.analysis.riskAssessment === "Low"
                                                                ? "text-emerald-600"
                                                                : selectedReport.analysis.riskAssessment === "Medium"
                                                                    ? "text-amber-600"
                                                                    : "text-rose-600"
                                                                }`}
                                                        >
                                                            {selectedReport.analysis.riskAssessment}
                                                        </div>
                                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                Risk level based on mission parameters, environmental factors, and operational conditions
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {selectedReport.analysis.recommendations && selectedReport.analysis.recommendations.length > 0 && (
                                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                                    Recommendations
                                                </h3>
                                                <div className="space-y-3">
                                                    {selectedReport.analysis.recommendations.map((rec, index) => (
                                                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{rec}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 border border-gray-200 dark:border-gray-700">
                                        <div className="text-center">
                                            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                                            <p className="text-slate-500 text-lg font-medium">No analysis data available</p>
                                            <p className="text-slate-400 text-sm mt-1">This report doesn't contain any analysis information</p>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
