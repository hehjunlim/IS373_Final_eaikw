# Discord Webhook Setup Guide

This guide will help you connect your submission form to Discord notifications.

## 📋 Overview

When someone submits a style guide, a notification will be sent to your Discord server with all the submission details.

## 🔧 Setup Steps

### 1. Create a Discord Webhook

1. Open your Discord server
2. Go to **Server Settings** (click the server name dropdown)
3. Navigate to **Integrations** → **Webhooks**
4. Click **New Webhook** or **Create Webhook**
5. Give it a name (e.g., "Style Guide Submissions")
6. Select the channel where you want notifications to appear
7. (Optional) Upload a custom avatar for the webhook
8. Click **Copy Webhook URL** - this is what you'll need!

### 2. Add Webhook URL to Netlify

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site
3. Navigate to **Site settings** → **Environment variables**
4. Click **Add a variable** or **New variable**
5. Set the following:
   - **Key:** `DISCORD_WEBHOOK_SUBMISSIONS`
   - **Value:** Paste the webhook URL you copied from Discord
6. Click **Save**

### 3. Redeploy Your Site

After adding the environment variable, you need to trigger a redeploy:

**Option A: Through Netlify Dashboard**
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

**Option B: Through Git**
```bash
git commit --allow-empty -m "chore: Trigger redeploy for Discord webhook"
git push
```

### 4. Test the Integration

1. Visit your submission form: `/submit-style-guide/`
2. Fill out and submit a test style guide
3. Check your Discord channel - you should see a notification!

## 📬 What Gets Sent

Each Discord notification includes:
- 📝 Style Guide Name
- 🏷️ Category
- 👤 Submitter Name
- 📧 Email Address
- 🔗 Style Guide URL
- 📄 License Type
- 🎫 Confirmation Number
- 📅 Submission Date/Time

## 🔍 Troubleshooting

### No notifications appearing?

1. **Check Netlify Logs:**
   - Go to Netlify Dashboard → Deploys → Click latest deploy
   - Click **Functions** tab
   - Look for the `submissions` function logs

2. **Verify Environment Variable:**
   - Go to Site settings → Environment variables
   - Make sure `DISCORD_WEBHOOK_SUBMISSIONS` is set
   - URL should start with `https://discord.com/api/webhooks/`

3. **Check Webhook Status:**
   - Go back to Discord → Server Settings → Webhooks
   - Make sure the webhook is enabled (not deleted)

4. **Redeploy:**
   - Environment variable changes require a redeploy to take effect

### Common Issues

**"Discord webhook not configured" in logs:**
- Environment variable is not set or misspelled
- Solution: Add `DISCORD_WEBHOOK_SUBMISSIONS` in Netlify settings

**"Discord notification failed: 404":**
- Webhook URL is invalid or webhook was deleted in Discord
- Solution: Create a new webhook and update the environment variable

**"Discord notification failed: 401":**
- Webhook URL is incomplete or corrupted
- Solution: Copy the webhook URL again from Discord (include the full URL)

**Notifications work locally but not in production:**
- Environment variables are not synced
- Solution: Make sure to add the variable in Netlify, not just `.env` file

## 🎨 Customization

The notification format is defined in `netlify/functions/submissions.js` in the `sendDiscordNotification()` function. You can customize:

- Embed color (currently blue: `3447003`)
- Fields shown in the notification
- Footer text and icon
- Mention behavior (currently mentions @here)

## 📚 Additional Resources

- [Discord Webhooks Guide](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Discord Embed Visualizer](https://leovoel.github.io/embed-visualizer/) - Test embed designs

## ✅ Verification Checklist

- [ ] Discord webhook created in server
- [ ] Webhook URL copied
- [ ] Environment variable added to Netlify
- [ ] Site redeployed
- [ ] Test submission sent
- [ ] Notification received in Discord

---

**Need help?** Check the Netlify function logs for detailed error messages.
