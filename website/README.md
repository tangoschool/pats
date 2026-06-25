# Philadelphia Argentine Tango School - Static Website

This is a fully static version of the Philadelphia Argentine Tango School website, converted from Next.js + Contentful to pure HTML, CSS, and vanilla JavaScript.

## Features

- ✅ Pure static HTML/CSS/JavaScript (no build process required)
- ✅ 169 pages generated from Contentful data
- ✅ Responsive design (mobile and desktop)
- ✅ Image carousel with autoplay and drag/swipe
- ✅ Mobile menu with drawer animation
- ✅ Stripe checkout integration (requires backend API)
- ✅ All images downloaded locally
- ✅ No external dependencies (except Stripe.js and Google Fonts)

## Project Structure

```
/web
├── index.html              # Home page
├── checkout.html           # Payment checkout page
├── about.html              # Detail page example
├── [page].html             # 167 other detail pages
├── css/
│   └── main.css            # All styles
├── js/
│   ├── data.js             # Site data and logo SVGs
│   ├── carousel.js         # Image carousel component
│   ├── menu.js             # Navigation menu system
│   ├── utils.js            # Utility functions
│   ├── main.js             # Home page initialization
│   ├── detail-page.js      # Detail page functionality
│   └── checkout.js         # Stripe checkout
├── images/                 # All downloaded images (294 images)
└── data/
    ├── content.json        # Site content data
    └── image-urls.json     # Original image URLs
```

## Deployment Options

### Option 1: Netlify (Recommended)

1. Create a `netlify.toml` file in the `/web` directory
2. Create the Stripe API function in `/web/netlify/functions/create-checkout-session.js`
3. Deploy via Netlify CLI or Git integration
4. Set environment variables in Netlify dashboard:
   - `STRIPE_SECRET_KEY`

### Option 2: Vercel

1. Create `/web/api/create-checkout-session.js` for serverless function
2. Deploy via Vercel CLI or Git integration
3. Set environment variables in Vercel dashboard

### Option 3: Traditional Hosting (Apache/Nginx)

1. Upload the entire `/web` directory to your server
2. Set up a PHP backend for Stripe (see example below)
3. Configure environment variables on server

### Option 4: GitHub Pages

1. Push `/web` contents to a GitHub repository
2. Enable GitHub Pages
3. **Note:** Stripe checkout will not work without a backend API
   - Consider using Stripe Payment Links as a workaround

## Stripe Backend API

You need to implement a backend endpoint for Stripe checkout session creation.

### Netlify Function Example

Create `/web/netlify/functions/create-checkout-session.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { description, paymentAmount } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: description },
          unit_amount: Math.floor(parseFloat(paymentAmount) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${event.headers.origin}/checkout.html?success=true`,
      cancel_url: `${event.headers.origin}/checkout.html?canceled=true`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

Install dependencies:
```bash
npm init -y
npm install stripe
```

### PHP Backend Example

Create `/web/api/create-checkout-session.php`:

```php
<?php
require_once 'vendor/autoload.php';

\Stripe\Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$input = json_decode(file_get_contents('php://input'), true);
$description = $input['description'];
$paymentAmount = $input['paymentAmount'];

try {
    $session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'usd',
                'product_data' => ['name' => $description],
                'unit_amount' => floor(floatval($paymentAmount) * 100),
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => $_SERVER['HTTP_ORIGIN'] . '/checkout.html?success=true',
        'cancel_url' => $_SERVER['HTTP_ORIGIN'] . '/checkout.html?canceled=true',
    ]);

    echo json_encode(['sessionId' => $session->id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
```

## Configuration

### Update Stripe Keys

1. Edit `/web/js/checkout.js`
2. Replace `STRIPE_PUBLIC_KEY` with your actual Stripe publishable key

### Update API Endpoint

If your backend API is not at `/api/create-checkout-session`, update the fetch URL in `/web/js/checkout.js`:

```javascript
const response = await fetch('YOUR_API_ENDPOINT_HERE', {
  method: 'POST',
  // ...
});
```

## Local Development

### Using Python HTTP Server

```bash
cd web
python3 -m http.server 8000
```

Visit: http://localhost:8000

### Using Node.js HTTP Server

```bash
npm install -g http-server
cd web
http-server -p 8000
```

Visit: http://localhost:8000

### Using PHP Built-in Server

```bash
cd web
php -S localhost:8000
```

Visit: http://localhost:8000

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Chrome Mobile

## Performance Optimization

### Optional Enhancements

1. **Enable Gzip Compression** (on server)
2. **Convert images to WebP format**
3. **Add lazy loading to images** (already implemented in carousel)
4. **Minify CSS and JavaScript**
5. **Add service worker for offline support**

## SEO Optimization

Each page includes:
- Proper `<title>` tags
- Open Graph meta tags for social sharing
- Semantic HTML structure

To improve further:
- Add meta descriptions to each page
- Add structured data (JSON-LD)
- Create a sitemap.xml
- Add robots.txt

## Content Updates

Since this is a static site without a CMS, content updates require:

1. Edit the HTML files directly, or
2. Update `/web/data/content.json` and regenerate pages using the build scripts

To regenerate pages from the source project:
```bash
cd /var/home/helioha/projects/personal/pats
node generate-pages.js
```

## Support

For issues or questions about the conversion:
- Check the conversion plan: `/STATIC-CONVERSION-PLAN.md`
- Review the original Next.js source code

## License

© Philadelphia Argentine Tango School. All rights reserved.
