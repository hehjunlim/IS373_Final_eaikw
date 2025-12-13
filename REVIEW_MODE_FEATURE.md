# Review Mode Feature ✨

## Overview

A review mode toggle has been added to the site header that enables access to a
submission review dashboard for managing design system submissions.

**Live Demo**: Toggle the switch in the header, then navigate to `/review/` to
see the dashboard in action!

## How It Works

### Toggle Location

- **Desktop**: Top-right of header navigation (next to About link)
- **Mobile**: Inside mobile menu, below navigation links with visual switch

### Functionality

#### When Review Mode is OFF (Default)

- Normal site behavior
- `/review/` page shows "Review Mode Required" message
- Toggle appears in header but is unchecked

#### When Review Mode is ON

- Red "Review Mode Active" badge appears in top-right corner
- `/review/` page displays full submission dashboard
- Mobile menu shows "Review Submissions" button
- State persists across page navigation (stored in localStorage)

## Review Dashboard (`/review/`)

### Statistics Overview

Shows counts for:

- Total Submissions
- Pending Review
- Approved
- Declined

### Filter Tabs

- **All**: Shows all submissions
- **Pending**: Only pending submissions
- **Approved**: Only approved submissions
- **Declined**: Only declined submissions

### Submission Cards Display

Each submission shows:

- Style name and status badge
- Submitter name, email, and date
- Color palette preview (4 colors: primary, secondary, accent, background)
- Description and tags
- Demo URL link

### Actions (for Pending submissions)

- **View Demo**: Opens demo URL in new tab
- **Approve**: Marks submission as approved
- **Decline**: Marks submission as declined
- **Request Changes**: Opens prompt for reviewer feedback

## Sample Data

5 sample submissions are included in `/src/_data/submissions.json`:

1. **Neon Cyber** (Pending) - Cyberpunk design system
2. **Organic Earth** (Pending) - Nature-inspired system
3. **Retro Wave** (Pending) - 80s synthwave aesthetic
4. **Minimal Glass** (Pending) - Glassmorphism design
5. **Industrial Tech** (Approved) - Industrial/utilitarian style

## Technical Implementation

### Files Created/Modified

**New Files:**

- `/src/_data/submissions.json` - Sample submission data
- `/src/review.njk` - Review dashboard page

**Modified Files:**

- `/src/_includes/layouts/base.njk` - Added toggle UI and JavaScript

### Key Features

- Review mode state persists via localStorage
- Custom event dispatching for cross-page communication
- Responsive toggle design for mobile and desktop
- Visual badge indicator when review mode is active
- Filter functionality with tab navigation
- Mock action handlers (would connect to backend in production)

## Usage Instructions

1. **Enable Review Mode**: Click the toggle in the header
2. **Access Dashboard**: Navigate to `/review/` or click "Review Submissions" in
   mobile menu
3. **Filter Submissions**: Use tabs to filter by status
4. **Review Items**: Click action buttons to approve/decline/request changes
5. **View Demos**: Click "View Demo" to see live design systems
6. **Disable Review Mode**: Click toggle again to return to normal view

## Future Enhancements

In a production environment, this would connect to:

- Backend API for real submission data
- Email notification system for status updates
- File upload handling for screenshots
- Authentication system for reviewer access
- Database storage for submissions
- Admin user roles and permissions
