# Reports Feature Documentation

## Overview
The Reports feature provides comprehensive mission reporting and analytics capabilities for the drone management system. It allows users to generate, view, and manage various types of reports related to their missions.

## Features

### 1. Report Types
- **Summary Reports**: Quick overview of mission completion with key metrics
- **Detailed Reports**: Comprehensive analysis with full mission data
- **Analytics Reports**: Performance metrics and trends across multiple missions
- **Incident Reports**: Documentation of issues or anomalies during missions

### 2. Report Management
- Create new reports manually or automatically
- View detailed report information
- Delete reports
- Filter reports by type
- Search reports by title or content
- Generate mission summary reports from mission details

### 3. Analytics Dashboard
- Mission success rates
- Average flight duration
- Total distance covered
- Mission type distribution
- Status distribution
- Monthly trends

### 4. Statistics Overview
- Total reports count
- Reports generated this month
- Breakdown by report type
- Real-time statistics

## Backend API Endpoints

### Reports Controller (`/backend/controllers/reports.js`)

#### GET `/api/reports`
- Get all reports for the authenticated user
- Supports pagination, filtering by type, and date range
- Returns: `{ reports, totalPages, currentPage, total }`

#### GET `/api/reports/:id`
- Get a specific report by ID
- Returns detailed report with populated mission and user data

#### POST `/api/reports`
- Create a new report
- Required fields: `missionId`, `title`
- Optional fields: `reportType`, `content`, `data`, `analysis`, `isPublic`

#### PUT `/api/reports/:id`
- Update an existing report
- Only the report owner can update

#### DELETE `/api/reports/:id`
- Delete a report
- Only the report owner can delete

#### POST `/api/reports/analytics`
- Generate analytics report
- Optional filters: `startDate`, `endDate`, `missionType`
- Returns comprehensive analytics data

#### POST `/api/reports/mission/:missionId/summary`
- Generate automatic summary report for a specific mission
- Creates report with calculated metrics and analysis

#### GET `/api/reports/stats/overview`
- Get report statistics for the user
- Returns: `{ totalReports, thisMonthReports, reportTypes }`

## Frontend Components

### Reports Component (`/frontend/src/components/Reports.jsx`)
- Main reports dashboard
- Statistics cards
- Report creation modal
- Report viewing modal
- Search and filtering
- Analytics display

### Mission Detail Integration
- "Generate Report" button added to mission detail page
- Direct navigation to reports after generation

## Data Models

### Report Schema (`/backend/models/Report.js`)
```javascript
{
  missionId: ObjectId (required),
  reportType: String (enum: ['summary', 'detailed', 'analytics', 'incident']),
  title: String (required),
  content: String,
  data: {
    distanceCovered: Number,
    flightTime: Number,
    batteryConsumption: Number,
    imagesCaptured: Number,
    videosCaptured: Number,
    anomalies: [String],
    weatherConditions: {
      temperature: Number,
      windSpeed: Number,
      visibility: Number
    }
  },
  analysis: {
    efficiency: Number,
    riskAssessment: String,
    recommendations: [String],
    compliance: Boolean
  },
  attachments: [{
    type: String,
    url: String,
    filename: String,
    size: Number
  }],
  generatedBy: ObjectId (required),
  isPublic: Boolean
}
```

## Usage Examples

### Creating a Report
1. Navigate to Reports page
2. Click "Create Report" button
3. Select mission from dropdown
4. Choose report type
5. Add title and content
6. Submit form

### Generating Mission Summary
1. Go to Mission Detail page
2. Click "Generate Report" button
3. Report is automatically created with mission data
4. Redirected to Reports page

### Viewing Analytics
1. On Reports page, click "Generate Analytics" button
2. Analytics data is displayed with metrics
3. Includes success rates, durations, and trends

### Filtering Reports
1. Use search bar to find reports by title/content
2. Use type filter dropdown to filter by report type
3. Results update in real-time

## Technical Implementation

### Backend Architecture
- Controller-based architecture with separation of concerns
- Route handlers delegate to controller functions
- Comprehensive error handling and validation
- Authentication middleware for all endpoints

### Frontend Features
- React hooks for state management
- Real-time data fetching and updates
- Modal-based UI for report creation and viewing
- Responsive design with Tailwind CSS
- Toast notifications for user feedback

### Security
- JWT authentication required for all endpoints
- User can only access their own reports
- Mission ownership validation for report creation
- Input validation and sanitization

## Future Enhancements
- Report templates
- Scheduled report generation
- Export to PDF/Excel
- Advanced analytics with charts
- Report sharing and collaboration
- Email notifications for report generation 