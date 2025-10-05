# Cloudflare Pages Deployment Guide

This guide walks you through deploying the Premier Properties website to Cloudflare Pages.

## Prerequisites

- A Cloudflare account (free tier works perfectly)
- GitHub account with this repository
- Google Maps API key (already configured in the project)

## Local Development Setup

Before deploying, you need to build the project locally:

### Prerequisites

- Node.js installed (v14 or higher)
- Google Maps API key in `.env` file

### Build Process

1. **Install dependencies** (optional - no npm packages needed for basic build):
   ```bash
   # No dependencies to install - uses built-in Node.js modules
   ```

2. **Run build script**:
   ```bash
   npm run build
   ```
   This injects your API key from `.env` into `properties.js`

3. **Open in browser**:
   - Open `index.html` in your browser
   - The map should work with your API key

**Important:**
- `properties.js` is git-ignored (contains your API key)
- `properties.js.template` is committed (no API key)
- Always run `npm run build` before testing locally

## Deployment Methods

### Method 1: GitHub Integration (Recommended)

This method automatically deploys whenever you push to GitHub.

#### Step 1: Connect to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **"Workers & Pages"** in the left sidebar
3. Click **"Create application"** → **"Pages"**
4. Click **"Connect to Git"**
5. Authorize Cloudflare to access your GitHub account
6. Select the **`premier-properties`** repository

#### Step 2: Configure Build Settings

In the Cloudflare Pages setup wizard:

- **Project name:** `premier-properties` (or your preferred name)
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `/` (root directory)
- **Root directory:** Leave empty

#### Step 3: Add Environment Variables (REQUIRED)

⚠️ **IMPORTANT:** You MUST add the Google Maps API key as an environment variable.

Click **"Environment Variables"** and add:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `PUBLIC_GOOGLE_MAPS_API_KEY` | Your Google Maps API Key | Production & Preview |

**How to add:**
1. Click **"Add variable"**
2. Name: `PUBLIC_GOOGLE_MAPS_API_KEY`
3. Value: Paste your Google Maps API key from the `.env` file
4. Select **"Production"** and **"Preview"** checkboxes
5. Click **"Save"**

**Security Note:** The API key is now injected at build time from environment variables and never committed to the repository.

#### Step 4: Deploy

1. Click **"Save and Deploy"**
2. Cloudflare will build and deploy your site
3. Wait 1-3 minutes for deployment to complete
4. You'll get a URL like: `https://premier-properties.pages.dev`

### Method 2: Direct Upload via Wrangler CLI

If you prefer manual deployments:

#### Install Wrangler

```bash
npm install -g wrangler
```

#### Login to Cloudflare

```bash
wrangler login
```

#### Deploy

```bash
wrangler pages deploy . --project-name=premier-properties
```

## Post-Deployment Configuration

### Custom Domain Setup

1. Go to your Cloudflare Pages project
2. Click **"Custom domains"** tab
3. Click **"Set up a custom domain"**
4. Enter your domain (e.g., `premierproperties.com`)
5. Follow DNS configuration instructions
6. Wait for SSL certificate provisioning (automatic)

### Environment Variables (Optional)

For production environment variables:

1. Go to **Settings** → **Environment variables**
2. Add any sensitive variables (API keys, etc.)
3. Redeploy to apply changes

## Configuration Files Explained

### `wrangler.toml`

- Defines project name and compatibility date
- Configures production and preview environments
- Specifies routes for custom domains

### `_headers`

- **Security headers**: Protects against XSS, clickjacking, MIME sniffing
- **Content Security Policy**: Allows Google Maps API scripts and resources
- **Cache headers**: Optimizes static asset caching
  - CSS/JS/Images: 1 year cache
  - HTML: 1 hour cache with revalidation

### `_redirects`

- Redirects `/home` and `/index.html` to root `/`
- Handles trailing slash variations
- 301 redirects for SEO

## Google Maps API Configuration

### Update API Key Restrictions

To ensure your Google Maps API key works on Cloudflare Pages:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your API key
4. Under **Application restrictions**, select **HTTP referrers**
5. Add your Cloudflare Pages URLs:
   ```
   https://premier-properties.pages.dev/*
   https://premierproperties.com/*
   https://www.premierproperties.com/*
   ```

### For Local Development

Also add:
```
http://localhost/*
http://127.0.0.1/*
file:///*
```

## Automatic Deployments

Once GitHub integration is set up:

- **Every push to `main`** → Deploys to production
- **Every pull request** → Creates a preview deployment
- **Branch deployments** → Automatic preview URLs

## Monitoring & Analytics

### Cloudflare Web Analytics (Free)

1. Go to your Pages project
2. Click **"Analytics"** tab
3. Enable **Web Analytics**
4. View traffic, performance, and visitor data

### Performance Optimization

Cloudflare Pages automatically provides:

✅ **Global CDN** - Content served from 200+ locations worldwide
✅ **Automatic SSL** - Free HTTPS certificates
✅ **DDoS Protection** - Enterprise-level security
✅ **HTTP/3 & QUIC** - Latest protocol support
✅ **Brotli Compression** - Smaller file sizes
✅ **Image Optimization** - Automatic WebP conversion

## Troubleshooting

### Map Not Loading

**Issue:** Blue square instead of map

**Solution:**
1. Check browser console for errors
2. Verify API key is correct in `properties.js:377`
3. Ensure Maps JavaScript API is enabled in Google Cloud Console
4. Check API key restrictions allow your Cloudflare domain

### 404 Errors

**Issue:** Direct navigation to `/properties` returns 404

**Solution:**
- Cloudflare Pages serves exact files
- Use `/properties.html` or configure `_redirects`
- Update navigation links if needed

### Build Failures

**Issue:** Deployment fails

**Solution:**
1. Verify all files are committed to Git
2. Check for syntax errors in HTML/CSS/JS
3. Review build logs in Cloudflare dashboard
4. Ensure no build command is specified (static site)

### Cache Issues

**Issue:** Changes not appearing after deployment

**Solution:**
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Use incognito/private browsing
3. Purge Cloudflare cache in dashboard
4. Wait a few minutes for CDN propagation

## Rollback

To rollback to a previous version:

1. Go to **Deployments** tab
2. Find the deployment you want to rollback to
3. Click **"..."** menu → **"Rollback to this deployment"**
4. Confirm rollback

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Custom Domains Setup](https://developers.cloudflare.com/pages/platform/custom-domains/)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)

## Support

For issues:
- **Cloudflare:** [Community Forum](https://community.cloudflare.com/)
- **Google Maps:** [Stack Overflow](https://stackoverflow.com/questions/tagged/google-maps)
- **Project Issues:** [GitHub Issues](https://github.com/azm0de/premier-properties/issues)

---

**Deployed URLs:**

- Production: `https://premier-properties.pages.dev`
- Preview: `https://<branch>-premier-properties.pages.dev`
- Custom Domain: Configure in Cloudflare dashboard

**Last Updated:** 2025-10-05
