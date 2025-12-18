# Testing Form Submission After Deployment

## 📋 Your Netlify Functions Status

All 8 functions are deployed successfully:
- ✅ `airtable-crm`
- ✅ `discord-notifications`
- ✅ `new-member`
- ✅ `register-event`
- ✅ `sanity-submissions`
- ✅ `sanity-to-airtable`
- ✅ `submissions` ← **This is the one we enhanced with logging**
- ✅ `track`

## 🎯 Testing Steps

### 1. Wait for Netlify Deployment
After pushing the latest changes, wait for Netlify to rebuild and redeploy (usually 2-3 minutes).

Check deployment status:
- Go to your Netlify dashboard
- Look for "Building" or "Published" status
- Wait until it shows "Published"

### 2. Test Form Submission

1. Open your deployed site: `https://www.eaikw.com/submit-style-guide/`
2. Open browser console (F12 or right-click → Inspect → Console tab)
3. Fill out the form with test data:
   - **Your Name**: Test User
   - **Email**: your-email@example.com
   - **Role**: Designer
   - **Style Guide Name**: Test Design System
   - **Style Guide URL**: https://example.com
   - **Category**: UI Components
   - **Description**: (At least 100 characters) "This is a comprehensive test of the design system submission form to verify that all backend functionality is working correctly including Airtable integration and Discord notifications."
   - **Technologies**: React, TypeScript, Tailwind
   - **Live Example URL**: https://example.com/demo
   - **License**: MIT
   - **Additional Notes**: Testing form submission
   - **Check**: Agreement checkbox

4. Click **Submit**

### 3. Check Browser Console Logs

You should see detailed logs like:
```
Submitting data: {submitterName: "Test User", submitterEmail: "...", ...}
Response status: 200
Response headers: {...}
Response body: {success: true, confirmationNumber: "DSG-XXXX", ...}
```

**If you see an error**, the console will show:
- ❌ Submission failed: [error message]
- Details: [specific error]
- 💡 [Helpful hint about what's wrong]
- Status: [HTTP status code]

### 4. Check Netlify Function Logs

1. Go to Netlify Dashboard → Your Site
2. Click **Functions** tab
3. Click **submissions**
4. Click **Function log** tab

You should see detailed server logs:
```
📝 Submission received
Raw body: {"submitterName":"Test User", ...}
Environment check: {
  hasAirtableToken: true,
  hasAirtableBase: true,
  hasDiscordWebhook: true,
  tokenLength: 17,
  baseIdLength: 17
}
Parsed data fields: [...keys...]
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

## 🔍 Troubleshooting Guide

### Error: "Missing Airtable credentials"
**Problem**: Environment variables not set or not in Production scope

**Solution**:
1. Go to Netlify Dashboard → Site settings → Environment variables
2. Verify these exist:
   - `AIRTABLE_API_TOKEN`
   - `AIRTABLE_BASE_ID`
   - `DISCORD_WEBHOOK_SUBMISSIONS` (optional)
3. Make sure they're in **Production** scope (not just "Builds")
4. After adding/changing, trigger new deploy:
   - Go to Deploys tab → Trigger deploy → Deploy site

### Error: "Airtable error: Could not find table"
**Problem**: Table name doesn't match

**Solution**:
1. Open your Airtable base
2. Verify table is named exactly `Submissions` (case-sensitive)
3. Or update the function to use your table name:
   - Edit `netlify/functions/submissions.js`
   - Line 16: `const tableName = "YourTableName";`

### Error: "Airtable error: Unknown field"
**Problem**: Field names in Airtable don't match function

**Solution**:
1. Check your Airtable table has these exact fields:
   - `ConfirmationNumber` (Single line text)
   - `Status` (Single line text)
   - `Name` (Single line text)
   - `Email` (Email field)
   - `DesignStyle` (Single line text)
   - `DemoURL` (URL field)
   - `Description` (Long text)
   - `Technologies` (Long text)
   - `LiveExampleURL` (URL field)
   - `License` (Single line text)
   - `AdditionalNotes` (Long text)
   - `SubmittedDate` (Date field)

2. Field names are case-sensitive!

### Error: "Network Error" or CORS issue
**Problem**: Function not accessible or CORS headers missing

**Solution**:
1. Check function URL: `https://www.eaikw.com/.netlify/functions/submissions`
2. Verify `netlify.toml` has correct redirects
3. Clear browser cache and try again

### Success but no Discord notification
**Not an error** - Discord notification is optional and won't prevent submission

**If you want notifications**:
1. Create Discord webhook URL
2. Add as `DISCORD_WEBHOOK_SUBMISSIONS` in Netlify
3. Redeploy

## ✅ Expected Success Response

**Browser shows**:
```
✅ Thank you for your submission!

Confirmation Number: DSG-XXXXXXXX

We've received your style guide and will review it within 1-3 business days.
You'll receive an email confirmation shortly.
```

**Console shows**:
```
Response body: {
  success: true,
  confirmationNumber: "DSG-XXXXXXXX",
  message: "Your style guide submission has been received!"
}
```

**Netlify logs show**:
```
✅ Airtable record created: rec123456789
✅ Submission completed successfully
```

**Airtable shows**:
- New row in Submissions table with all form data

**Discord shows** (if configured):
- New message with submission details

## 🚀 Next Steps After Successful Test

1. ✅ Test form submission
2. ✅ Verify record appears in Airtable
3. ✅ Check Discord notification (if configured)
4. 🎉 Your form backend is fully working!

## 📞 Need Help?

If you're still seeing errors after following this guide:
1. Copy the complete error message from browser console
2. Copy the relevant section from Netlify function logs
3. Share both for detailed troubleshooting

The comprehensive logging we added will show exactly where the process fails!
