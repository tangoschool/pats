# Deployment Guide - Philadelphia Argentine Tango School

## Quick Start

The static website is ready to deploy! All files are in the `/web` directory.

## File Summary

- **HTML Pages:** 169 (including home, checkout, and all detail pages)
- **CSS Files:** 1 (main.css - all styles consolidated)
- **JavaScript Files:** 8 (modular components)
- **Images:** 291 (all downloaded locally)
- **Total Size:** ~150-200MB

## Deployment Steps

### Option A: Netlify (Recommended) - 5 Minutes

1. **Install Netlify CLI** (if not installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy from the web directory**:
   ```bash
   cd /var/home/helioha/projects/personal/pats/web
   netlify deploy --prod
   ```

4. **Set Environment Variables** in Netlify Dashboard:
   - Go to Site Settings > Build & Deploy > Environment
   - Add: `STRIPE_SECRET_KEY` = your Stripe secret key

5. **Done!** Your site is live.

### Option B: Netlify with Git Integration

1. **Create a new repository** on GitHub

2. **Push the web folder**:
   ```bash
   cd /var/home/helioha/projects/personal/pats/web
   git init
   git add .
   git commit -m "Initial commit - static site"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

3. **Connect to Netlify**:
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select your repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `.`
   - Click "Deploy site"

4. **Set Environment Variables**: Same as Option A, step 4

### Option C: Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd /var/home/helioha/projects/personal/pats/web
   vercel --prod
   ```

3. **Configure Stripe Function**: 
   - Move `/netlify/functions/` to `/api/`
   - Rename to `/api/create-checkout-session.js`
   - Update `checkout.js` to call `/api/create-checkout-session`

4. **Set Environment Variables** in Vercel dashboard

### Option D: GitHub Pages (Free, No Stripe)

**Note:** GitHub Pages doesn't support serverless functions, so Stripe checkout won't work.

1. **Create repository**: `username.github.io` or any repo name

2. **Push web folder**:
   ```bash
   cd /var/home/helioha/projects/personal/pats/web
   git init
   git add .
   git commit -m "Deploy to GitHub Pages"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Source: main branch / root
   - Save

4. **Workaround for Checkout**:
   - Replace checkout page with Stripe Payment Links
   - Or use a different hosting service for the API

### Option E: Traditional Hosting (cPanel, etc.)

1. **Upload files via FTP/SFTP**:
   - Upload entire `/web` directory contents to `public_html/` or equivalent

2. **Set up PHP Backend for Stripe** (if PHP is available):
   ```bash
   # Install Stripe PHP SDK
   composer require stripe/stripe-php
   ```

3. **Update checkout.js**:
   - Change API endpoint to `/api/create-checkout-session.php`

4. **Configure environment variables** in server config

## Stripe Configuration

### Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_`)
3. Copy your **Secret key** (starts with `sk_`)

### Update Publishable Key

Edit `/web/js/checkout.js`:

```javascript
// Line ~7
const STRIPE_PUBLIC_KEY = 'pk_live_YOUR_ACTUAL_KEY_HERE';
```

**Important:** Use `pk_test_` for testing, `pk_live_` for production

### Set Secret Key

Set as environment variable:
- **Netlify/Vercel:** In dashboard settings
- **PHP:** In `.env` file or server config
- **Never commit** the secret key to Git!

## Testing Locally

### Python HTTP Server
```bash
cd /var/home/helioha/projects/personal/pats/web
python3 -m http.server 8000
```
Visit: http://localhost:8000

### Node.js HTTP Server
```bash
npm install -g http-server
cd /var/home/helioha/projects/personal/pats/web
http-server -p 8000
```

### PHP Built-in Server
```bash
cd /var/home/helioha/projects/personal/pats/web
php -S localhost:8000
```

## Verification Checklist

After deployment, test:

- [ ] Home page loads with carousel
- [ ] Carousel autoplays and is draggable
- [ ] Mobile menu opens and closes
- [ ] Navigation links work
- [ ] Images load correctly
- [ ] Detail pages render with content
- [ ] Teasers display on detail pages
- [ ] Footer renders correctly
- [ ] Responsive design works on mobile
- [ ] Checkout page loads
- [ ] Stripe test payment works (use card 4242 4242 4242 4242)

## Custom Domain Setup

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Update DNS records as shown
4. SSL automatically provisioned

### Vercel
1. Go to Settings > Domains
2. Add domain
3. Update DNS records
4. SSL automatically provisioned

### GitHub Pages
1. Add `CNAME` file with your domain
2. Update DNS records at your registrar:
   - Type: `CNAME`
   - Name: `www`
   - Value: `username.github.io`

## Performance Optimization

After deployment, consider:

1. **Enable Gzip/Brotli compression** (automatic on Netlify/Vercel)
2. **Set cache headers** for static assets
3. **Add CDN** if not using Netlify/Vercel
4. **Minify CSS/JS** (optional - files already small)
5. **Convert images to WebP** (optional optimization)

## Monitoring

### Netlify Analytics
- Included free with Netlify
- View in dashboard

### Google Analytics
Add to each page's `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Troubleshooting

### Images not loading
- Check browser console for 404 errors
- Verify image paths start with `/images/`
- Check file names match (case-sensitive on Linux servers)

### Carousel not working
- Check browser console for JavaScript errors
- Verify `/data/content.json` loads correctly
- Ensure all JS files are loaded in correct order

### Stripe checkout fails
- Verify publishable key is correct
- Check serverless function is deployed
- View function logs in Netlify/Vercel dashboard
- Test with Stripe test card: 4242 4242 4242 4242

### Mobile menu doesn't open
- Check JavaScript console for errors
- Verify `menu.js` is loaded
- Clear browser cache

## Support

For deployment issues:
- Netlify: https://docs.netlify.com
- Vercel: https://vercel.com/docs
- Stripe: https://stripe.com/docs

For site-specific issues:
- Check `/web/README.md`
- Review conversion plan: `/STATIC-CONVERSION-PLAN.md`

## Next Steps

After successful deployment:

1. **Test all pages** - Click through navigation
2. **Test mobile** - Resize browser or use device
3. **Test checkout** - Use Stripe test mode
4. **Update DNS** - Point domain to new site
5. **Monitor traffic** - Set up analytics
6. **Update content** - See README for content update process

## Success! 🎉

Your static website is now live and fully functional!

Original Next.js site → Pure HTML/CSS/JS with no dependencies
169 pages, 291 images, fully responsive, with Stripe payments
