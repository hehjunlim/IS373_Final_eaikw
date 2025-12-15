# Discord Integration Setup Guide

This guide walks you through setting up Discord notifications for the Design
Gallery.

## Prerequisites

- A Discord server where you have admin rights
- Discord account
- Discord Developer Portal access

## Step 1: Create Discord Server (if needed)

1. Open Discord
2. Click the **+** button to create a server
3. Name: "Design Gallery" (or your preference)
4. Continue with default settings

## Step 2: Create Channels

Create these text channels in your Discord server:

1. **#gallery-submissions**
   - For: New submission notifications
   - Topic: "New design system submissions for review"

2. **#announcements**
   - For: Approval notifications
   - Topic: "Approved submissions published to gallery"

3. **#moderation** (optional)
   - For: Rejection notifications
   - Topic: "Submission decisions and feedback"

## Step 3: Create a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application**
3. Name it: "Design Gallery Bot"
4. Go to **Bot** tab (left sidebar)
5. Click **Add Bot**
6. Under **TOKEN**, click **Copy**
   - This is your `DISCORD_BOT_TOKEN` (keep it secret!)

## Step 4: Configure Bot Permissions

1. Go to **OAuth2** → **URL Generator**
2. Select scopes:
   - `bot`
   - `applications.commands`

3. Select permissions:
   - `Send Messages`
   - `Embed Links`
   - `Attach Files`
   - `Read Message History`
   - `Mention @everyone`

4. Copy the generated URL

## Step 5: Add Bot to Your Server

1. Paste the URL from Step 4 into your browser
2. Select your "Design Gallery" server
3. Authorize the bot
4. Confirm the action

## Step 6: Set Up Webhooks

Webhooks are how we send messages from your app to Discord.

### Method 1: Using Webhooks (Recommended)

1. In Discord, go to **#gallery-submissions**
2. Right-click channel name → **Edit Channel**
3. Go to **Integrations** → **Webhooks**
4. Click **New Webhook**
5. Name: "Design Gallery Bot"
6. Click **Copy Webhook URL**
   - This is your `DISCORD_WEBHOOK_URL`

Repeat for **#announcements** channel:

- You can use the same webhook URL (we control the message content)
- Or create separate webhooks for different channels

### Method 2: Using Bot Token (Alternative)

If using bot token instead of webhooks:

1. Get bot token from Step 3
2. Get channel IDs:
   - Enable Developer Mode in Discord
   - Right-click channel → Copy Channel ID

## Step 7: Update Environment Variables

Add to your `.env` file:

```env
# Option 1: Using Webhooks (Recommended)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Option 2: Using Bot Token
DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN
DISCORD_CHANNEL_SUBMISSIONS=YOUR_CHANNEL_ID
DISCORD_CHANNEL_ANNOUNCEMENTS=YOUR_CHANNEL_ID
```

## Step 8: Test the Integration

### Test Webhook

```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Test message",
    "embeds": [{
      "title": "Test Notification",
      "description": "If you see this, webhooks are working!",
      "color": 3447003
    }]
  }'
```

### Test via App

1. Submit a design system on the submission form
2. Check **#gallery-submissions** in Discord
3. You should see a notification with:
   - Submitter name
   - Email
   - Project URL
   - Description

## Step 9: Customize Messages

Edit message templates in `netlify/functions/discord-notifications.js`:

```javascript
const embed = {
  title: "📝 New Gallery Submission", // Customize emoji/title
  color: 3447003, // RGB color code
  fields: [{ name: "Custom Field", value: "Your value" }],
};
```

Color codes (decimal):

- Blue: `3447003`
- Green: `3066993`
- Red: `15158332`
- Orange: `16711680`

## Step 10: Set Up Role Permissions

### For Notifications Only

1. Go to **Server Settings** → **Roles**
2. Assign bot a role (e.g., "Bot" role)
3. Go to each channel
4. Click **Edit Channel** → **Permissions**
5. Find your bot role
6. Enable: Send Messages, Embed Links
7. Disable: Manage Channel, Manage Messages

### For Interactive Features (Future)

If you want reactions, message edits, etc.:

1. Additional permissions:
   - Add Reactions
   - Manage Messages
   - Read Message History

## Step 11: Enable Developer Features

For advanced debugging:

1. In Discord, go to **User Settings** → **Advanced**
2. Enable **Developer Mode**
3. Now you can right-click and copy message IDs, channel IDs, etc.

## Message Examples

### New Submission

```
📝 New Gallery Submission
━━━━━━━━━━━━━━━━━━━━━━━━━

Submitter: John Doe
Email: john@example.com
Project: [View Project](https://example.com)

Description: A modern design system...

Status: Awaiting Review
```

### Approved Submission

```
✅ Submission Approved
━━━━━━━━━━━━━━━━━━━━━━━━━

Submitter: John Doe
Project: [View Project](https://example.com)

Now Live in Gallery
Status: Published
```

### Rejected Submission

```
❌ Submission Rejected
━━━━━━━━━━━━━━━━━━━━━━━━━

Submitter: John Doe
Reason: Does not meet guidelines
Review Notes: ...
```

## Troubleshooting

### Bot Not Posting

1. Check bot has permissions in channel:
   - Right-click channel → **View Permissions**
   - Verify bot role can send messages

2. Check webhook URL is correct:
   - Verify URL starts with `https://discord.com/api/webhooks/`
   - Re-copy webhook URL if unsure

3. Test webhook with curl (see Step 8)

### Messages Showing Error

1. Check `.env` file is properly loaded
2. Verify `DISCORD_WEBHOOK_URL` doesn't have extra spaces
3. Check rate limiting (max 10 messages/minute per webhook)

### Bot Not Visible in Server

1. Check bot was added with correct permissions
2. Go to **Server Settings** → **Members**
3. Look for the bot (should have checkmark)
4. If not there, re-run OAuth2 URL

### Webhook Expired

Webhooks don't expire, but tokens can be regenerated:

1. Go to channel → **Integrations** → **Webhooks**
2. Click on the webhook
3. **Copy new URL** if needed

## Advanced: Message Formatting

### Using Markdown

````javascript
const embed = {
  description: "**Bold** and *italic* text\n> Quote\n```code block```",
};
````

### Color Gradients

For status-based colors:

```javascript
const statusColors = {
  submitted: 16776960, // Yellow
  approved: 65280, // Green
  rejected: 16711680, // Red
  "under-review": 255, // Blue
};
```

### Inline Fields

```javascript
fields: [
  { name: "Inline 1", value: "Value 1", inline: true },
  { name: "Inline 2", value: "Value 2", inline: true },
  { name: "Full Width", value: "This spans full width", inline: false },
];
```

## Security Notes

- ✅ Never commit `DISCORD_WEBHOOK_URL` to version control
- ✅ Use `.env` file for secrets
- ✅ Regenerate webhook URL if accidentally exposed
- ✅ Rotate bot token regularly
- ✅ Use separate webhook URLs for different environments (dev/prod)

---

## What's Next

- Set up automated submissions (see `airtable-setup.md`)
- Configure review workflow
- Add approval automation
- Monitor Discord logs for issues

---

**Questions?** Check Discord's official documentation:
https://discord.com/developers/docs
