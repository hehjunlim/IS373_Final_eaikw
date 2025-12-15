# Airtable CRM Setup Guide

This guide walks you through setting up Airtable for CRM integration with the
Design Gallery.

## Prerequisites

- An Airtable account (free at https://airtable.com)
- Your API token from Airtable
- Base ID from your workspace

## Step 1: Create an Airtable Base

1. Go to [https://airtable.com](https://airtable.com)
2. Click "Create a Base"
3. Name it: "Design Gallery CMS"
4. Select "Start from scratch"

## Step 2: Create Tables

Your base needs these tables:

### Table 1: Submissions

**Columns:**

- `Name` (text) - Submission identifier
- `Submitter Name` (text)
- `Email` (email)
- `URL` (url)
- `Description` (long text)
- `Status` (select) - Options: "submitted", "approved", "rejected",
  "under-review"
- `Submitted At` (date)
- `Sanity ID` (text) - Reference to Sanity document ID
- `Review Notes` (long text)
- `Reviewed At` (date)

**Views to create:**

- Grid: All submissions
- Filter: Status = "pending"
- Filter: Status = "approved"
- Timeline: Submitted At

### Table 2: Contributors

**Columns:**

- `Name` (text)
- `Email` (email) - Primary field
- `Contact Info` (text)
- `Company` (text)
- `Submission Count` (number)
- `Total Submissions` (rollup) - Count from Submissions table
- `Last Submission` (lookup) - From Submissions

**Views to create:**

- Grid: All contributors
- Filter: Submission Count > 0

### Table 3: Design Styles (Reference)

**Columns:**

- `Title` (text)
- `Category` (select)
- `Description` (long text)
- `Color Palette` (rich text)
- `Sample Images` (attachment)
- `Related Submissions` (link to Submissions table)

## Step 3: Link Tables

1. In **Submissions** table, add a field:
   - Type: `Link to another table`
   - Link to: **Contributors**
   - Bidirectional: Yes

2. In **Submissions** table, add a field:
   - Type: `Link to another table`
   - Link to: **Design Styles**

## Step 4: Get Your API Credentials

1. Go to **Account** (top right)
2. Click **API**
3. Create a new token:
   - Name: "eleventy-portfolio"
   - Scopes needed:
     - `data.records:read`
     - `data.records:write`
     - `data.recordComments:read`
   - Access to all bases required
4. Copy the token
5. Also note your **Base ID** from your base URL:
   - URL format: `https://airtable.com/base/<BASE_ID>`

## Step 5: Update Environment Variables

Add to your `.env` file:

```env
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_API_TOKEN=patXXXXXXXXXXXXXX
```

## Step 6: Automate Syncing

Set up automation to sync submissions:

### Option A: Using Make/Zapier

1. In Airtable, go to the base
2. Click **Automations**
3. Create new automation:
   - **Trigger:** "When record created"
   - **Table:** Submissions
   - **Action:** "Run script"

**Script to run:**

```javascript
// Triggers on new submission
let table = base.getTable("Submissions");
let record = input.config().recordId;
let data = await table.selectRecordsAsync();

// This would send to your Netlify function
// Typically handled by Zapier/Make for automation
```

### Option B: Manual Setup with Zapier

1. Go to [zapier.com](https://zapier.com)
2. Create a new Zap:
   - **Trigger:** Sanity (new document)
   - **Action:** Airtable (create record)
   - **Map fields** between Sanity and Airtable

Configuration:

```
Sanity → Zapier → Airtable

Mapping:
- Sanity submitterName → Airtable "Submitter Name"
- Sanity submitterEmail → Airtable "Email"
- Sanity url → Airtable "URL"
- Sanity description → Airtable "Description"
- Sanity status → Airtable "Status"
- Sanity _id → Airtable "Sanity ID"
```

## Step 7: Test the Integration

1. Create a test submission in your app
2. Check if it appears in Airtable
3. Update status in Airtable
4. Verify the change syncs back (if bidirectional enabled)

## Step 8: Set Up Views for Team

### Submissions Manager View

**For reviewers:**

```
View: "For Review"
Filter: Status is empty OR Status = "submitted"
Sort: "Submitted At" descending
```

### Approved Submissions View

**For publishing:**

```
View: "Live in Gallery"
Filter: Status = "approved"
Sort: "Submitted At" descending
```

### Contributors View

**For engagement:**

```
View: "Top Contributors"
Filter: Submission Count > 1
Sort: Submission Count descending
```

## Step 9: Configure Notifications (Optional)

In Airtable, add notifications:

1. Go to **Settings**
2. **Notifications**
3. Add:
   - When record added to "Submissions" table
   - When status changes to "approved"
   - Notify: Your email

## Advanced: Custom Automation

### Sync Back to Sanity

To sync approvals back to Sanity:

1. In Airtable, create automation:
   - **Trigger:** Record updated
   - **Condition:** Status = "approved"
   - **Action:** Run script
2. Script:

```javascript
// Update Sanity when status changes
fetch("https://yourdomain.com/.netlify/functions/sanity-submissions", {
  method: "PUT",
  headers: {
    Authorization: "Bearer YOUR_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    submissionId: record.getCellValue("Sanity ID"),
    status: "approved",
  }),
});
```

## Troubleshooting

### API Token Not Working

1. Re-generate token in Airtable
2. Check token has correct scopes
3. Verify token is not expired
4. Test with curl:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.airtable.com/v0/meta/bases
```

### Can't Connect to Base

1. Verify Base ID is correct
2. Check API token has access to base
3. Test connection:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.airtable.com/v0/YOUR_BASE_ID/Submissions
```

### Data Not Syncing

1. Check Zapier logs if using Zapier
2. Verify webhook is configured in Sanity
3. Check Netlify function logs
4. Test manual API call:

```bash
curl -X POST https://yourdomain.com/.netlify/functions/airtable-crm \
  -H "Content-Type: application/json" \
  -d '{"action": "sync"}'
```

---

**Next:** Set up Discord integration (see `discord-setup.md`)
