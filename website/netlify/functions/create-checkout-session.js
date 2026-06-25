// Netlify Function for Stripe Checkout Session Creation

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { description, paymentAmount } = JSON.parse(event.body);

    // Validate input
    if (!description || !paymentAmount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const amount = Math.floor(parseFloat(paymentAmount) * 100);
    if (amount <= 0 || isNaN(amount)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid payment amount' }),
      };
    }

    // Get the origin from headers
    const origin = event.headers.origin || event.headers.referer || 'https://phillyargtango.com';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: description,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/checkout.html?success=true`,
      cancel_url: `${origin}/checkout.html?canceled=true`,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Stripe error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
