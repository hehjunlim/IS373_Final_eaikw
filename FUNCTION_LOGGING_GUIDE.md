# Netlify Functions Logging Guide

This document describes the comprehensive logging implemented across all 8 Netlify functions for debugging and monitoring.

## 📊 Logging Overview

All functions now include detailed logging at every stage:
- 📝 **Request logging** - Method, headers, body, query parameters
- ✅ **Success logging** - Confirmation numbers, record IDs, operation results
- ❌ **Error logging** - Full error details with stack traces
- 📤 **Database logging** - Airtable operations and table names
- 📨 **External API logging** - Discord webhooks, Sanity API calls
- ℹ️ **Status logging** - Validation results, skipped operations

## 🎯 Functions with Enhanced Logging

### 1. **submissions.js** (Style Guide Submissions)
**Purpose**: Handle design style guide submissions to Airtable

**Logs Include**:
```
📝 Submission received
Raw body: {...}
Environment check: {hasAirtableToken, hasAirtableBase, tokenLength, baseIdLength}
Parsed data fields: [...]
Full data: {...}
Generated confirmation: DSG-XXXXXXXX
Mapped fields: {...}
📤 Attempting to create Airtable record...
Table name: Submissions
Base ID: app12345...
✅ Airtable record created: rec123456789
📨 Sending Discord notification...
✅ Submission completed successfully
```

**Error Logs**:
```
❌ Airtable submission error
Error details: {message, stack, statusCode}
💡 Missing Airtable credentials (if applicable)
```

**How to View**:
- Browser console (F12): Client-side request/response
- Netlify Dashboard → Functions → submissions → Logs

---

### 2. **new-member.js** (Community Member Registration)
**Purpose**: Register new community members in Airtable

**Logs Include**:
```
👤 New member registration request: {method, headers, queryParams}
Raw body: {...}
Parsed data: {...}
Generated member ID: MBR-XXXXXXXX
📤 Creating Airtable record in table: Members
✅ Airtable record created: rec123456789
📨 Discord notification sent (or failed with reason)
✅ Member registration completed successfully
```

**Error Logs**:
```
❌ Member registration error
Error details: {message, stack, statusCode}
```

**How to View**:
- Netlify Dashboard → Functions → new-member → Logs

---

### 3. **register-event.js** (Event Registration)
**Purpose**: Handle event registrations and store in Airtable

**Logs Include**:
```
📅 Event registration request: {method, headers, queryParams}
Raw body: {...}
Parsed data: {...}
Generated registration number: EVT-XXXXXXXX
📤 Creating Airtable record in table: EventRegistrations
✅ Airtable record created: rec123456789
📨 Discord notification sent (or failed with reason)
✅ Event registration completed successfully
```

**Error Logs**:
```
❌ Event registration error
Error details: {message, stack, statusCode}
```

**How to View**:
- Netlify Dashboard → Functions → register-event → Logs

---

### 4. **track.js** (Submission Tracking)
**Purpose**: Track submission status by confirmation number

**Logs Include**:
```
🔍 Tracking request: {method, headers, queryParams}
Raw body: {...}
Searching for confirmation number: DSG-XXXXXXXX
📤 Querying Airtable table: Submissions
Query results: Found match / No match found
✅ Submission found: {confirmationNumber, status}
```

**Error Logs**:
```
❌ Missing confirmation number
❌ Submission not found
❌ Track submission error
Error details: {message, stack, statusCode}
```

**How to View**:
- Netlify Dashboard → Functions → track → Logs

---

### 5. **sanity-submissions.js** (Sanity CMS Submissions)
**Purpose**: Create gallery submissions in Sanity CMS

**Logs Include**:
```
📝 Sanity submission request: {method, headers, queryParams}
Raw body: {...}
Parsed data: {...}
❌ Validation failed. Missing fields: [...] (if applicable)
✅ Validation passed
📤 Creating Sanity document...
✅ Sanity document created: doc-id-123
📨 Sending Discord notification...
ℹ️ Discord webhook not configured (if applicable)
✅ Submission completed successfully
```

**Error Logs**:
```
❌ Submission error
Error details: {message, stack, statusCode}
```

**How to View**:
- Netlify Dashboard → Functions → sanity-submissions → Logs

---

### 6. **sanity-to-airtable.js** (Sanity to Airtable Sync)
**Purpose**: Sync published Sanity documents to Airtable (webhook)

**Logs Include**:
```
🔄 Sanity to Airtable sync triggered: {method, headers, queryParams}
Raw body: {...}
Parsed webhook data: {...}
Document type: gallerySubmission ID: doc-123
ℹ️ Skipping non-gallery submission type (if applicable)
ℹ️ Skipping draft document (if applicable)
✅ Document validation passed, proceeding with sync
📤 Sending to Airtable table: Submissions
Payload: {...}
Airtable response status: 200
Airtable response data: {...}
✅ Successfully synced to Airtable: rec123456789
```

**Error Logs**:
```
❌ Method not allowed
❌ Airtable error: {...}
❌ Sync error
Error details: {message, stack}
```

**How to View**:
- Netlify Dashboard → Functions → sanity-to-airtable → Logs

---

### 7. **discord-notifications.js** (Discord Integration Module)
**Purpose**: Send Discord notifications (helper functions, not a handler)

**Note**: This is a module with helper functions (`notifySubmission`, `notifyApproval`, `notifyRejection`) used by other functions. Logging is handled by the calling functions.

**Logs Include** (from calling functions):
```
Discord notification sent successfully
Discord notification error: {...}
Discord webhook not configured, skipping notification
```

---

### 8. **airtable-crm.js** (Airtable CRM Integration)
**Purpose**: Sync data to Airtable CRM (helper functions, not a handler)

**Note**: This is a module with helper functions (`syncSubmissionToAirtable`, `syncContributorToAirtable`, etc.) used by other functions.

**Logs Include**:
```
Updated Airtable record: rec123456789
Created Airtable record for email@example.com
Airtable sync error: {...}
Contributors fetch error: {...}
```

---

## 🔍 How to Access Function Logs

### Method 1: Netlify Dashboard (Recommended)
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: **www.eaikw.com**
3. Click **Functions** tab in sidebar
4. Click on the function you want to inspect (e.g., `submissions`)
5. Click **Function log** tab
6. Set time range (Last hour, Last 24 hours, etc.)
7. View real-time logs with filters

### Method 2: Netlify CLI
```bash
# View logs for all functions
netlify functions:logs

# View logs for specific function
netlify functions:logs submissions

# Follow logs in real-time (like tail -f)
netlify functions:logs --follow
```

### Method 3: Browser Console (Client-side)
For functions called from the browser (like form submissions):
1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Submit form or trigger action
4. View request/response logs with emojis:
   - 📝 Submission data
   - ✅ Success responses
   - ❌ Error messages with hints

---

## 🎯 Debugging Common Issues

### Issue: "Missing environment variables"

**Logs to check**:
```
Environment check: {
  hasAirtableToken: false,  ← Problem here
  hasAirtableBase: false,   ← Problem here
  tokenLength: undefined
}
```

**Solution**:
1. Go to Netlify Dashboard → Site settings → Environment variables
2. Add `AIRTABLE_API_TOKEN` and `AIRTABLE_BASE_ID`
3. Make sure they're in **Production** scope
4. Trigger new deploy

---

### Issue: "Airtable error: Could not find table"

**Logs to check**:
```
📤 Creating Airtable record in table: Submissions
❌ Airtable error: TABLE_NOT_FOUND
```

**Solution**:
1. Open your Airtable base
2. Verify table name matches exactly (case-sensitive)
3. For `submissions.js` → Table must be named `Submissions`
4. For `new-member.js` → Table must be named `Members`
5. For `register-event.js` → Table must be named `EventRegistrations`

---

### Issue: "Discord notification failed"

**Logs to check**:
```
📨 Sending Discord notification...
Discord notification failed: 404 Not Found
```

**Solution**:
1. Check Discord webhook URL is valid
2. Verify webhook hasn't been deleted in Discord
3. Test webhook with curl:
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message"}'
```
4. Note: Discord failures don't prevent form submissions from succeeding

---

### Issue: "Submission not found when tracking"

**Logs to check**:
```
🔍 Tracking request
Searching for confirmation number: DSG-ABCD1234
📤 Querying Airtable table: Submissions
Query results: No match found
❌ Submission not found
```

**Solution**:
1. Verify confirmation number is typed correctly
2. Check if submission actually succeeded (check function logs)
3. Check Airtable to see if record exists
4. Verify field name in Airtable is `ConfirmationNumber` (exact case)

---

### Issue: "Sanity document creation failed"

**Logs to check**:
```
📝 Sanity submission request
Parsed data: {...}
❌ Validation failed. Missing fields: ["submitterEmail"]
```

**Solution**:
1. Ensure all required fields are filled:
   - submitterName
   - submitterEmail
   - url
   - description
2. Check form is sending correct field names
3. Verify Sanity API token has write permissions

---

## 📊 Log Emoji Legend

| Emoji | Meaning | Used For |
|-------|---------|----------|
| 📝 | Request received | Incoming requests |
| ✅ | Success | Successful operations |
| ❌ | Error | Errors and failures |
| 📤 | Outgoing operation | Database writes, API calls |
| 📨 | Notification | Discord webhooks |
| 🔍 | Search/Query | Database lookups |
| 👤 | Member/User | Member registrations |
| 📅 | Event | Event registrations |
| 🔄 | Sync | Data synchronization |
| ℹ️ | Info | Informational messages |
| 💡 | Hint | Helpful suggestions |

---

## 🚀 Best Practices

### For Development:
1. **Always check logs** after deploying changes
2. **Test with invalid data** to verify error logging works
3. **Monitor first few real submissions** to catch issues early
4. **Use browser console** for client-side debugging
5. **Use Netlify logs** for server-side debugging

### For Production:
1. **Set up alerts** in Netlify for function failures
2. **Review logs regularly** to identify patterns
3. **Keep error logs** for at least 7 days
4. **Document any new error patterns** you discover
5. **Update this guide** when adding new functions

### For Troubleshooting:
1. **Start with the most recent logs** (last 1 hour)
2. **Look for emoji markers** (❌ for errors, ✅ for success)
3. **Check environment variables first** (most common issue)
4. **Verify table/field names** in Airtable
5. **Test external APIs** (Discord, Sanity) separately

---

## 📞 Getting Help

If logs show an error you can't resolve:

1. **Copy the complete error** from Netlify function logs
2. **Copy the request data** (remove sensitive info like emails)
3. **Note the timestamp** of the failed request
4. **Check this guide** for known solutions
5. **Review environment variables** are all set correctly

---

## 🔄 Updating This Guide

When adding new functions or logging:

1. Update the function list above
2. Add example log output
3. Add common errors and solutions
4. Update the emoji legend if using new emojis
5. Add to best practices if needed

---

**Last Updated**: December 18, 2025  
**Version**: 1.0  
**Maintained by**: Development Team
