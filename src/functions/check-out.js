// ===========================
// File: netlify/functions/stripe-checkout.js
// ===========================
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { amount, currency, description, plan } = JSON.parse(event.body);

    // Validate input
    if (!amount || !currency || !plan) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: plan,
              description: description || `Subscription to ${plan}`
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/cancel`,
      metadata: {
        plan: plan,
        timestamp: Date.now().toString()
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      })
    };

  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Payment processing failed',
        message: error.message 
      })
    };
  }
};

// ===========================
// File: netlify/functions/mpesa-stk-push.js
// ===========================
const axios = require('axios');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { customerPhone, amount, description, reference } = JSON.parse(event.body);

    // Validate Kenyan phone number
    const phoneRegex = /^254[0-9]{9}$/;
    const formattedPhone = customerPhone.replace(/^0/, '254');
    
    if (!phoneRegex.test(formattedPhone)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid phone number format' })
      };
    }

    // Get M-Pesa OAuth token first
    const authResponse = await axios.get(
      `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        auth: {
          username: process.env.MPESA_CONSUMER_KEY,
          password: process.env.MPESA_CONSUMER_SECRET
        }
      }
    );

    const accessToken = authResponse.data.access_token;

    // Generate password and timestamp for STK Push
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_BUSINESS_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    // Initiate STK Push
    const stkResponse = await axios.post(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.URL}/.netlify/functions/mpesa-callback`,
        AccountReference: reference,
        TransactionDesc: description
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'STK Push initiated',
        checkoutRequestId: stkResponse.data.CheckoutRequestID,
        merchantRequestId: stkResponse.data.MerchantRequestID
      })
    };

  } catch (error) {
    console.error('M-Pesa Error:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'M-Pesa payment failed',
        message: error.response?.data?.errorMessage || error.message
      })
    };
  }
};

// ===========================
// File: netlify/functions/mpesa-callback.js
// ===========================
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const callbackData = JSON.parse(event.body);
    console.log('M-Pesa Callback:', JSON.stringify(callbackData, null, 2));

    // Process the callback data
    const resultCode = callbackData.Body.stkCallback.ResultCode;
    
    if (resultCode === 0) {
      // Payment successful - store in database
      // Update user access, send confirmation email, etc.
      console.log('Payment successful');
    } else {
      console.log('Payment failed:', callbackData.Body.stkCallback.ResultDesc);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Callback processed' })
    };

  } catch (error) {
    console.error('Callback processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Callback processing failed' })
    };
  }
};

// ===========================
// File: netlify/functions/paypal-create-order.js
// ===========================
const paypal = require('@paypal/checkout-server-sdk');

// PayPal environment setup
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  return process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { amount, currency, description } = JSON.parse(event.body);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toFixed(2)
        },
        description: description
      }],
      application_context: {
        return_url: `${process.env.URL}/success`,
        cancel_url: `${process.env.URL}/cancel`
      }
    });

    const order = await client().execute(request);
    
    // Find approval URL
    const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;

    return {
      statusCode: 200,
      body: JSON.stringify({
        orderId: order.result.id,
        url: approvalUrl
      })
    };

  } catch (error) {
    console.error('PayPal Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'PayPal order creation failed',
        message: error.message
      })
    };
  }
};

// ===========================
// File: netlify/functions/verify-payment.js
// ===========================
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { sessionId, provider } = JSON.parse(event.body);

    let paymentDetails = null;

    switch (provider) {
      case 'stripe':
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === 'paid') {
          paymentDetails = {
            verified: true,
            plan: session.metadata.plan,
            amount: session.amount_total / 100,
            currency: session.currency
          };
        }
        break;

      // Add verification for other providers...
    }

    return {
      statusCode: 200,
      body: JSON.stringify(paymentDetails)
    };

  } catch (error) {
    console.error('Verification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Verification failed' })
    };
  }
};
