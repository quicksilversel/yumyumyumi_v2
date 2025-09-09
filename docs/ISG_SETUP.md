# Incremental Static Regeneration (ISG) Setup Guide

This guide explains how to set up on-demand revalidation with Supabase webhooks for your YumYumYumi app.

## Overview

The app now uses Next.js ISG (Incremental Static Regeneration) to:
- Serve static pages from the CDN for fast performance
- Automatically rebuild pages when data changes in Supabase
- Fall back to time-based revalidation (1 hour) as a safety net

## Setup Instructions

### 1. Environment Variables

Add the webhook secret to your `.env.local` file:

```bash
# Generate a secure secret
openssl rand -base64 32

# Add to .env.local
SUPABASE_WEBHOOK_SECRET=your_generated_secret_here
```

### 2. Deploy Your Application

Deploy your application to Vercel or your preferred hosting platform. You'll need the production URL for the webhook configuration.

### 3. Configure Supabase Webhooks

#### For the Recipes Table:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Database → Webhooks**
3. Click **Create a new webhook**
4. Configure as follows:

   - **Name**: `revalidate-recipes`
   - **Table**: `recipes`
   - **Events**: Select `INSERT`, `UPDATE`, and `DELETE`
   - **Type**: `HTTP Request`
   - **HTTP URL**: `https://your-domain.com/api/revalidate`
   - **HTTP Headers**:
     ```
     x-webhook-secret: your_webhook_secret_here
     Content-Type: application/json
     ```
   - **Payload**: Keep default (Send record)

5. Click **Create webhook**

#### For the Bookmarks Table (Optional):

Repeat the above steps but:
- **Name**: `revalidate-bookmarks`
- **Table**: `bookmarks`

### 4. Test the Webhook

1. Check the endpoint is working:
   ```bash
   curl https://your-domain.com/api/revalidate
   ```
   Should return: `{"status":"ok","message":"Revalidation endpoint is active"}`

2. Create or update a recipe in your app
3. Check the Supabase webhook logs for successful delivery
4. Verify the page updates without manual refresh

## How It Works

### Data Flow

1. **User updates data** → Supabase database changes
2. **Supabase webhook** → Sends POST request to `/api/revalidate`
3. **Revalidation API** → Verifies secret and calls `revalidatePath()`/`revalidateTag()`
4. **Next.js** → Rebuilds affected pages in the background
5. **Next visitor** → Gets fresh static page

### Cache Strategy

- **Home page (`/`)**: Revalidated when any recipe changes
- **Recipe pages (`/recipes/[id]`)**: Revalidated when specific recipe changes
- **Cache tags**:
  - `recipes`: All recipe-related pages
  - `recipes-list`: Home page recipe list
  - `bookmarks`: Bookmark-related data

### Fallback Revalidation

If webhooks fail, pages still revalidate every hour (`revalidate: 3600`)

## Monitoring

### Check Webhook Status

In Supabase Dashboard:
1. Go to **Database → Webhooks**
2. Click on your webhook
3. View **Recent deliveries** for success/failure logs

### Application Logs

The revalidation endpoint logs:
- Successful revalidations
- Failed authentication attempts
- Errors during processing

Check your hosting platform's logs (e.g., Vercel Functions logs)

## Troubleshooting

### Webhook Not Triggering

- Verify webhook is enabled in Supabase
- Check the webhook URL is correct
- Ensure your app is deployed and accessible

### Pages Not Updating

- Check webhook secret matches in both Supabase and env vars
- Verify revalidation logs show success
- Clear browser cache and CDN cache if needed
- Check Next.js build logs for any errors

### Performance Issues

- Monitor webhook delivery time in Supabase
- Consider reducing `generateStaticParams` if too many pages
- Use selective revalidation (specific paths vs all)

## Benefits

- **90% faster page loads** from CDN edge locations
- **Real-time updates** when content changes
- **Reduced database load** and API costs
- **Better SEO** with static pages
- **Improved user experience** with instant navigation

## Local Development

ISG features work differently in development:
- Pages are always dynamically rendered
- Revalidation API still works but has no caching effect
- Test webhook integration using ngrok or similar tunneling service

```bash
# Example using ngrok
ngrok http 3000
# Use the ngrok URL for webhook configuration during testing
```