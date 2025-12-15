# Getting Started with Design Gallery Platform

This guide helps you get the Design Gallery platform up and running quickly.

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your Sanity credentials (see below for setup instructions).

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:8080` to see your site!

### 4. Access Key Pages

- **Gallery:** http://localhost:8080/showcase/
- **Submit Form:** http://localhost:8080/submit-style-guide/
- **Instructor Panel:** http://localhost:8080/instructor-panel/
- **Track Submission:** http://localhost:8080/track-submission/

---

## Full Setup Guide (30 minutes)

### Step 1: Initial Setup

```bash
# Clone/prepare the repository
cd your-project-directory

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Step 2: Set Up Sanity CMS

Follow the [Sanity Setup Guide](./sanity-setup.md):

1. Create a Sanity project
2. Get your Project ID and API Token
3. Add to `.env`:
   ```env
   SANITY_PROJECT_ID=your-id
   SANITY_DATASET=production
   SANITY_API_TOKEN=your-token
   ```

### Step 3: Set Up Review API Token

Generate a secure token for the instructor panel:

```bash
# Generate a random token
node -e "console.log('Bearer ' + require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:

```env
REVIEW_API_TOKEN=your-generated-token
```

### Step 4: (Optional) Set Up Airtable CRM

Follow the [Airtable Setup Guide](./airtable-setup.md):

1. Create an Airtable base
2. Get your Base ID and API Token
3. Add to `.env`:
   ```env
   AIRTABLE_BASE_ID=appXXXXXX
   AIRTABLE_API_TOKEN=patXXXXXX
   ```

### Step 5: (Optional) Set Up Discord

Follow the [Discord Setup Guide](./discord-setup.md):

1. Create Discord server and channels
2. Create bot and webhook
3. Add to `.env`:
   ```env
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
   ```

### Step 6: Start Development

```bash
# Start dev server with live reload
npm run dev

# In another terminal, start Sanity Studio
npm run sanity:dev
```

---

## Common Tasks

### Submit a Design System

1. Visit: http://localhost:8080/submit-style-guide/
2. Fill out the form with:
   - Your name and email
   - Design system URL
   - Description (min 100 characters)
3. Click Submit
4. You'll get a confirmation with a tracking ID

### Review Submissions (Instructor)

1. Visit: http://localhost:8080/instructor-panel/
2. Enter your API token (from Step 3)
3. View all pending submissions
4. Click "Review" on any submission
5. Click "Approve" or "Reject"
6. Add review notes (optional)

### View Gallery

1. Visit: http://localhost:8080/showcase/
2. See all approved submissions
3. Click on any to view details
4. Visit the external URL to see the design system

### Track Your Submission

1. Visit: http://localhost:8080/track-submission/
2. Enter your email address
3. View status and approved submissions

---

## File Structure

```
project/
├── src/
│   ├── blog/              # Blog posts (Markdown)
│   ├── css/               # Styling
│   ├── js/                # Client-side JavaScript
│   ├── images/            # Images and assets
│   ├── _data/
│   │   ├── site.json      # Site metadata
│   │   └── submissions.json # Local submission data
│   ├── _layouts/          # Template layouts
│   ├── _includes/         # Reusable components
│   └── *.njk              # Page templates
├── netlify/
│   └── functions/         # Serverless functions
│       ├── sanity-submissions.js    # Sanity integration
│       ├── airtable-crm.js          # Airtable sync
│       └── discord-notifications.js # Discord webhooks
├── tests/                 # Playwright tests
├── docs/                  # Documentation
└── .env                   # Environment variables
```

---

## Deployment

### To Netlify

1. Connect your GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `_site`
4. Add environment variables in Netlify settings
5. Deploy!

### To Traditional Hosting

1. Run: `npm run build`
2. Upload `_site/` folder to your server
3. Set up environment variables
4. Configure serverless function support

---

## Troubleshooting

### Dev Server Won't Start

```bash
# Clear cache and try again
npm run clean
npm install
npm run dev
```

### Submissions Not Appearing

1. Check Sanity connection:

   ```bash
   echo $SANITY_PROJECT_ID
   echo $SANITY_API_TOKEN
   ```

2. Verify in Sanity Studio:
   - Visit http://localhost:3333
   - Check "Gallery Submission" table
   - Should see submitted entries

### API Token Issues

1. Generate new review token:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Update `.env` with new token
3. Try accessing instructor panel again

### Tests Failing

1. Start dev server first:

   ```bash
   npm run dev
   ```

2. In another terminal, run tests:

   ```bash
   npm test
   ```

3. View detailed report:
   ```bash
   npm run test:report
   ```

---

## Next Steps

1. **Customize Styling**
   - Edit `src/css/tailwind.css`
   - Modify colors in CSS variables
   - See `tailwind.config.js` for Tailwind customization

2. **Add Blog Posts**
   - Create `.md` files in `src/blog/`
   - Use front matter for metadata

3. **Configure Analytics**
   - Add Plausible (privacy-friendly)
   - Add Sentry for error tracking
   - Add Web Vitals monitoring

4. **Set Up Email Notifications**
   - Configure SendGrid
   - Send confirmation emails on submission
   - Send review notifications

5. **Monitor Performance**
   - Run Lighthouse tests: `npm run lighthouse`
   - Check Playwright tests: `npm test`
   - Review bundle size: Check CI logs

---

## Documentation

Full documentation available in `docs/`:

- [Sanity CMS Setup](./sanity-setup.md)
- [Airtable Integration](./airtable-setup.md)
- [Discord Integration](./discord-setup.md)
- [API Documentation](./api-documentation.md)
- [QA Report](./qa-report.md)

---

## Support

- **Issues?** Check the [Troubleshooting](#troubleshooting) section above
- **Questions?** Review the documentation files
- **Bug reports?** Create an issue on GitHub

---

## Environment Variables Reference

```env
# Core Configuration
NODE_ENV=production

# Sanity CMS
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-token

# Review Panel
REVIEW_API_TOKEN=your-review-token

# Airtable CRM (Optional)
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_API_TOKEN=patXXXXXXXXXXXXXX

# Discord (Optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
DISCORD_BOT_TOKEN=your-bot-token

# Email (Optional)
SENDGRID_API_KEY=SG.your-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Monitoring (Optional)
SENTRY_DSN=your-sentry-dsn
```

---

**Happy building! 🎨**

_Last updated: December 15, 2025_
