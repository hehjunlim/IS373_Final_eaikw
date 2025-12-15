# Design Gallery CMS Integration

Complete backend system for managing design system submissions with Sanity CMS,
Airtable CRM, and Discord notifications.

## 🎯 System Architecture

```
User Submission → Sanity CMS → Netlify Functions → Airtable CRM
                                    ↓
                              Discord Notifications
```

## 📋 Features

### Submission Management

- ✅ Collect design system submissions via web form
- ✅ Store all submissions in Sanity CMS
- ✅ Track submission status (submitted, under-review, approved, rejected)
- ✅ Add review notes and feedback
- ✅ Automatic timestamp tracking

### Review Workflow

- ✅ Instructor/admin review panel at `/instructor-panel/`
- ✅ Token-based authentication
- ✅ Dashboard with submission statistics
- ✅ One-click approval/rejection
- ✅ Batch filtering and sorting

### Gallery Display

- ✅ Public gallery showing approved submissions only
- ✅ Filter by design style
- ✅ Full submission details and external links
- ✅ Responsive design for all devices

### CRM Integration

- ✅ Automatic sync to Airtable
- ✅ Track contributors and submissions
- ✅ Generate reports and analytics
- ✅ Zapier/Make automation support

### Discord Notifications

- ✅ New submission alerts
- ✅ Approval announcements
- ✅ Rejection notifications
- ✅ Rich embed formatting

## 🚀 Quick Start

### 1. Install & Configure

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# (See setup guides in docs/)
```

### 2. Set Up Sanity CMS

Follow [Sanity Setup Guide](./sanity-setup.md):

```bash
# Initialize Sanity
sanity init

# Start Sanity Studio
npm run sanity:dev
```

### 3. Configure Review Panel

```bash
# Generate secure API token
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
REVIEW_API_TOKEN=your-generated-token
```

### 4. Start Development

```bash
npm run dev
```

Visit:

- Gallery: http://localhost:8080/showcase/
- Submit: http://localhost:8080/submit-style-guide/
- Review Panel: http://localhost:8080/instructor-panel/

## 📁 Project Structure

```
netlify/functions/
├── sanity-submissions.js         # Main submission & review API
├── airtable-crm.js               # Airtable CRM sync
└── discord-notifications.js      # Discord webhook notifications

src/
├── _data/
│   ├── sanity-queries.js         # Centralized Sanity queries
│   └── submissions.json          # Local fallback data
├── instructor-panel.njk          # Review dashboard
├── showcase.njk                  # Gallery display
└── submit-style-guide.njk        # Submission form

docs/
├── GETTING_STARTED.md            # Quick start guide
├── api-documentation.md          # Complete API reference
├── sanity-setup.md               # Sanity CMS setup
├── airtable-setup.md             # Airtable CRM setup
├── discord-setup.md              # Discord integration setup
└── qa-report.md                  # QA and testing report
```

## 🔌 API Endpoints

### Submissions

```bash
# Create submission
POST /.netlify/functions/sanity-submissions
Content-Type: application/json
{
  "submitterName": "John Doe",
  "submitterEmail": "john@example.com",
  "url": "https://example.com/design-system",
  "description": "A comprehensive design system..."
}

# Get approved submissions
GET /.netlify/functions/sanity-submissions?status=approved

# Get all submissions (requires auth)
GET /.netlify/functions/sanity-submissions
Authorization: Bearer YOUR_REVIEW_TOKEN

# Update submission status (requires auth)
PUT /.netlify/functions/sanity-submissions
Authorization: Bearer YOUR_REVIEW_TOKEN
{
  "submissionId": "doc-id",
  "status": "approved",
  "reviewNotes": "Great work!"
}
```

See [API Documentation](./api-documentation.md) for complete reference.

## 🗄️ Data Models

### Sanity Collections

**gallerySubmission**

```json
{
  "_id": "unique-id",
  "_type": "gallerySubmission",
  "submitterName": "string",
  "submitterEmail": "string",
  "url": "string",
  "description": "string",
  "status": "submitted|under-review|approved|changes-requested|rejected",
  "screenshot": "image",
  "submittedAt": "datetime",
  "reviewNotes": "string",
  "reviewedAt": "datetime",
  "reviewedBy": "reference"
}
```

**designStyle**

```json
{
  "title": "string",
  "slug": "string",
  "description": "string",
  "historicalBackground": "rich text",
  "colorPalette": "object",
  "typographyGuidance": "rich text",
  "sampleImages": "array",
  "gallerySubmissions": "references"
}
```

**article** & **author** For educational content management.

### Airtable Tables

- **Submissions** - Synced from Sanity
- **Contributors** - Submitter information
- **Design Styles** - Reference data

## 🔐 Security

### Authentication

- ✅ Bearer token authentication for admin endpoints
- ✅ API token stored in `.env` (not in version control)
- ✅ CORS headers configured properly
- ✅ Input validation on all endpoints

### Environment Variables

All sensitive credentials in `.env`:

```env
SANITY_PROJECT_ID=...
SANITY_API_TOKEN=...
REVIEW_API_TOKEN=...
AIRTABLE_API_TOKEN=...
DISCORD_WEBHOOK_URL=...
```

## 📊 Dashboard & Monitoring

### Review Panel (`/instructor-panel/`)

- Real-time submission statistics
- Filter by status (All, Submitted, Approved, Rejected)
- Click to review and approve submissions
- Add review notes
- Search and sort functionality

### Public Gallery (`/showcase/`)

- Display approved submissions only
- Filter by design style
- Responsive card layout
- External URL links

### Analytics (via Airtable)

- Track total submissions
- Monitor approval rate
- Identify top contributors
- Generate reports

## 🧪 Testing

```bash
# Run Playwright tests
npm test

# View test report
npm run test:report

# Run Lighthouse audit
npm run lighthouse

# Run with coverage
npm run test -- --coverage
```

See [QA Report](./qa-report.md) for detailed testing results.

## 🔄 Workflow

### Submission Flow

1. User fills form at `/submit-style-guide/`
2. Submission created in Sanity (status: "submitted")
3. Synced to Airtable automatically
4. Discord notification sent
5. Instructor reviews at `/instructor-panel/`
6. Status changed to "approved"
7. Appears in public gallery `/showcase/`

### Discord Notifications

- **#gallery-submissions** - New submission alerts
- **#announcements** - Approval announcements
- **#moderation** - Rejection notifications

## 🛠️ Maintenance

### Backup Sanity Data

```bash
npm run sanity:backup
# (or manually via Sanity console)
```

### Monitor Functions

Check Netlify function logs:

- Successful submissions
- Failed approvals
- API errors
- Discord webhook status

### Update Schemas

Edit `sanity.config.ts` and deploy:

```bash
npm run sanity:deploy
```

## 📚 Documentation

- [Getting Started](./GETTING_STARTED.md) - Quick start guide
- [API Documentation](./api-documentation.md) - Complete API reference
- [Sanity Setup](./sanity-setup.md) - CMS configuration
- [Airtable Setup](./airtable-setup.md) - CRM integration
- [Discord Setup](./discord-setup.md) - Discord webhooks
- [QA Report](./qa-report.md) - Testing & performance

## 🤝 Integration Examples

### Zapier Automation

Connect Sanity submissions to Zapier for:

- Send approval emails
- Create calendar events
- Update Google Sheets
- Trigger Slack messages

### Make (formerly Integromat)

Set up automation workflows:

- Multi-step approval processes
- Conditional notifications
- Cross-platform syncing

### Custom Webhooks

Extend with your own integrations:

- Email notifications
- Slack messages
- Google Workspace updates
- Custom CRM systems

## 📈 Performance

- ✅ Lighthouse Score: 95+
- ✅ Core Web Vitals: All Green
- ✅ Bundle Size: 28KB JS (gzipped)
- ✅ API Response: < 200ms
- ✅ Database Queries: Optimized with Sanity CDN

## 🐛 Troubleshooting

### Submissions not appearing

1. Check Sanity connection in `.env`
2. Verify API token permissions
3. Check Netlify function logs

### Review panel won't load

1. Verify `REVIEW_API_TOKEN` in `.env`
2. Clear browser cache
3. Check browser console for errors

### Discord messages not sending

1. Verify `DISCORD_WEBHOOK_URL` is correct
2. Check bot permissions in Discord
3. View Netlify function logs

See detailed troubleshooting in setup guides.

## 📝 License

MIT - See LICENSE file for details

## 🚀 Next Steps

1. Set up Sanity CMS (see [Sanity Setup](./sanity-setup.md))
2. Configure review panel with API token
3. Set up Airtable for CRM (optional)
4. Configure Discord webhooks (optional)
5. Deploy to production
6. Monitor and maintain

---

**Questions?** Check the [Getting Started Guide](./GETTING_STARTED.md) or
specific setup guides in `docs/`

**Issues?** Create an issue on GitHub or check existing troubleshooting
sections.

**Last Updated:** December 15, 2025
