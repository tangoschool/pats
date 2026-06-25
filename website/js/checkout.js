// Checkout Page JavaScript
// Handles Stripe checkout integration

(function() {
  'use strict';

  // Initialize Stripe
  // NOTE: Replace with your actual Stripe publishable key
  const STRIPE_PUBLIC_KEY = 'pk_test_51I5yqrGJfkCy8TjWPQKNJxKm0LwLGbXjhDdZH4XqBqYbF8JxJ9f8PZKGjYq5bGZQKGjYq5bGZQKGjYq5bGZ';
  let stripe;

  try {
    if (typeof Stripe !== 'undefined') {
      stripe = Stripe(STRIPE_PUBLIC_KEY);
    }
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }

  // Check for success/cancel status in URL
  function checkPaymentStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const messageElement = document.getElementById('checkout-message');

    if (!messageElement) return;

    if (urlParams.get('success') === 'true') {
      messageElement.textContent = 'Payment successful! Thank you for your payment.';
      messageElement.classList.add('success');
    } else if (urlParams.get('canceled') === 'true') {
      messageElement.textContent = 'Payment was canceled. No charge was made.';
      messageElement.classList.add('error');
    }
  }

  // Handle checkout form submission
  async function handleCheckout(e) {
    e.preventDefault();

    if (!stripe) {
      alert('Stripe is not loaded. Please refresh the page and try again.');
      return;
    }

    const form = e.target;
    const description = form.description.value;
    const paymentAmount = parseFloat(form.paymentAmount.value);

    if (!description || !paymentAmount || paymentAmount <= 0) {
      alert('Please enter a valid description and amount.');
      return;
    }

    // Disable submit button
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    try {
      // Call backend API to create Stripe checkout session
      // For Netlify, this will call the serverless function
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: description,
          paymentAmount: paymentAmount
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe redirect error:', error);
        alert('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');

      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }

  // Initialize checkout page
  function initCheckout() {
    checkPaymentStatus();

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', handleCheckout);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCheckout);
  } else {
    initCheckout();
  }
})();
