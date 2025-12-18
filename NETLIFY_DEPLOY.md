# Deploying to Netlify

This site includes backend functionality (form submissions, Airtable integration, Discord notifications) that requires Netlify Functions. Follow these steps to deploy:

## Prerequisites

1. A Netlify account (free tier works)
2. Airtable account with a base set up
3. Discord webhook URL (optional, for notifications)

## Step 1: Connect Repository to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Choose GitHub and select your repository: `aag76/IS373_Final_eaikw`
4. Netlify will auto-detect the `netlify.toml` configuration

## Step 2: Configure Environment Variables

In Netlify dashboard, go to **Site settings > Environment variables** and add:

### Required:
- `AIRTABLE_API_TOKEN` - Your Airtable API token
- `AIRTABLE_BASE_ID` - Your Airtable base ID

### Optional (for Discord notifications):
- `DISCORD_WEBHOOK_SUBMISSIONS` - Discord webhook URL for submission notifications

## Step 3: Deploy

Click "Deploy site" - Netlify will:
1. Run `npm run build`
2. Deploy the `_site` folder
3. Set up serverless functions from `netlify/functions/`

## Step 4: Update Custom Domain (Optional)

If you want to keep using `www.eaikw.com`:
1. In Netlify: Site settings > Domain management
2. Add custom domain: `www.eaikw.com`
3. Update your DNS records as instructed by Netlify
4. Or, update the CNAME file to point to your new Netlify URL

## Features Enabled with Netlify

✅ Form submissions stored in Airtable
✅ Email confirmations
✅ Discord notifications
✅ Review dashboard with live data
✅ Submission tracking
✅ All Netlify Functions working

## Alternative: Keep GitHub Pages + Add Backend

If you prefer to keep GitHub Pages, you would need to:
1. Deploy ONLY the functions to Netlify (as a separate app)
2. Update form submission URLs to point to Netlify function URLs
3. Configure CORS properly

**Recommended:** Full Netlify deployment is simpler and free.
