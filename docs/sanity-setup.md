# Sanity CMS Setup Guide

This guide walks you through setting up Sanity CMS for the Design Gallery
platform.

## Prerequisites

- Node.js 18+
- npm or yarn
- A Sanity account (free at https://www.sanity.io)

## Step 1: Create a Sanity Project

1. Go to [https://www.sanity.io](https://www.sanity.io)
2. Click "Get Started"
3. Create a new project:
   - **Project Name:** "Design Gallery" (or your preference)
   - **Data Region:** Choose closest to your location
   - **Create new dataset:** Select "Production"

## Step 2: Get Your Credentials

1. In Sanity console, go to **Project Settings**
2. Copy your **Project ID**
3. Go to **API** → **Tokens**
4. Create a new token with these permissions:
   - `Editor` (for read/write access)
   - Name it: `eleventy-portfolio-token`
   - Copy the token value

## Step 3: Install Sanity CLI

```bash
npm install -g @sanity/cli
```

## Step 4: Initialize Sanity in Your Project

From the project root:

```bash
sanity init
```

Answer the prompts:

- Use your Project ID from Step 2
- Select the dataset: `production`
- Choose: "No, don't create project from template"

## Step 5: Update Environment Variables

Create a `.env` file in the project root:

```env
SANITY_PROJECT_ID=your-project-id-here
SANITY_DATASET=production
SANITY_API_TOKEN=your-token-here
```

Replace with your actual values from Step 2.

## Step 6: Start Sanity Studio

```bash
npm run sanity:dev
```

This opens Sanity Studio at `http://localhost:3333`

## Step 7: Verify Schemas

In Sanity Studio, you should see:

- Design Style
- Gallery Submission
- Article
- Author

If you don't see these, the schemas didn't load correctly.

## Step 8: Create Sample Data (Optional)

In Sanity Studio:

1. **Create an Author:**
   - Go to "Author"
   - Click "Create" → "Author"
   - Fill in details
   - Publish

2. **Create a Design Style:**
   - Go to "Design Style"
   - Click "Create" → "Design Style"
   - Fill in: title, slug, description
   - Add color palette colors
   - Add sample images
   - Publish

3. **Test a Submission:**
   - Go to "Gallery Submission"
   - Click "Create" → "Gallery Submission"
   - Fill in submitter info, URL, description
   - Set status to "approved"
   - Publish

## Step 9: Enable Webhooks (Optional)

For Discord/Airtable integrations:

1. In Sanity, go to **Settings** → **API** → **Webhooks**
2. Add a webhook:
   - **URL:** `https://yourdomain.com/.netlify/functions/sanity-submissions`
   - **Events:** "Create document", "Update document"
   - **Include draft events:** No
   - Add **HTTP Basic Auth** with your API token

## Troubleshooting

### Schemas not showing in Studio

```bash
sanity build
sanity deploy
```

### Can't connect to Sanity

Check your `.env` file:

```bash
echo $SANITY_PROJECT_ID
echo $SANITY_API_TOKEN
```

### Token permissions issue

Re-create token with broader permissions in Sanity console.

---

**Next:** Set up Airtable integration (see `airtable-setup.md`)
