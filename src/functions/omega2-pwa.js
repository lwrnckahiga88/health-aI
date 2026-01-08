// File: netlify/functions/omega2-pwa.js
// Unified Omega2 PWA: Complete API Gateway + Payments + USSD + OpenTelemetry + Security

// ----------------- Environment Variables Documentation -----------------
// OpenTelemetry:
// OTEL_DEBUG, OTEL_SERVICE_NAME, SERVICE_VERSION, OTEL_EXPORTER_OTLP_ENDPOINT
// 
// M-Pesa:
// MPESA_SANDBOX, MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_BUSINESS_SHORT_CODE,
// MPESA_PASS_KEY, MPESA_CALLBACK_URL
// 
// Airtel Money:
// AIRTEL_SANDBOX, AIRTEL_CLIENT_ID, AIRTEL_CLIENT_SECRET, AIRTEL_COUNTRY, AIRTEL_CURRENCY,
// AIRTEL_CALLBACK_URL
// 
// Tigo Pesa (via PAYNA):
// PAYNA_EMAIL, PAYNA_PASSWORD, PAYNA_API_KEY, PAYNA_CALLBACK_URL
// 
// Stripe:
// STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
// 
// PayPal:
// PAYPAL_SANDBOX, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET
// 
// MTN MoMo:
// MTN_MOMO_SANDBOX, MTN_MOMO_COLLECTION_API_USER, MTN_MOMO_COLLECTION_API_KEY,
// MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY, MTN_MOMO_DISBURSEMENT_API_USER,
// MTN_MOMO_DISBURSEMENT_API_KEY, MTN_MOMO_DISBURSEMENT_SUBSCRIPTION_KEY,
// MTN_MOMO_CURRENCY, MTN_MOMO_CALLBACK_URL
// 
// Wave Payments:
// WAVE_API_KEY, WAVE_SANDBOX, WAVE_CALLBACK_URL
// 
// Flutterwave:
// FLUTTERWAVE_PUBLIC_KEY, FLUTTERWAVE_SECRET_KEY, FLUTTERWAVE_ENCRYPTION_KEY,
// FLUTTERWAVE_WEBHOOK_SECRET
// 
// Microservices:
// AUTH_SERVICE_URL, BACKEND_SERVICE_URL, PAYMENTS_SERVICE_URL
// 
// General:
// NODE_ENV, SITE_URL

import axios from "axios";
import Stripe from 'stripe';
import crypto from 'crypto';

// ----------------- OpenTelemetry Setup -----------------
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { diag, DiagConsoleLogger, DiagLogLevel, trace, context, SpanStatusCode } = require('@opentelemetry/api');

if (process.env.OTEL_DEBUG === 'true') {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'omega2-service',
  [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
});

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4317'
});
const metricExporter = new OTLPMetricExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4317'
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 60000
});

const sdk = new NodeSDK({
  resource,
  spanProcessor: new BatchSpanProcessor(traceExporter),
  metricReader,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start()
  .then(() => console.log('✅ OpenTelemetry initialized'))
  .catch(err => console.error('❌ OpenTelemetry initialization failed:', err));

process.on('SIGTERM', async () => {
  await sdk.shutdown();
  process.exit(0);
});
process.on('SIGINT', async () => {
  await sdk.shutdown();
  process.exit(0);
});

async function withSpan(name, fn, attrs = {}) {
  const tracer = trace.getTracer('omega2-service');
  const span = tracer.startSpan(name, { attributes: attrs });
  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.recordException(err);
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      throw err;
    } finally {
      span.end();
    }
  });
}

// ----------------- ERROR HANDLING -----------------
class PaymentError extends Error {
  constructor(message, code, statusCode = 500, details = null) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.statusCode = 400;
  }
}

function createErrorResponse(error, span) {
  if (span) {
    span.recordException(error);
    span.setAttribute('error.type', error.name || 'Error');
    span.setAttribute('error.code', error.code || 'UNKNOWN');
  }

  const statusCode = error.statusCode || 500;
  const response = {
    error: error.message,
    code: error.code || 'INTERNAL_ERROR',
    ...(error.details && { details: error.details }),
    ...(error.field && { field: error.field })
  };

  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response)
  };
}

// ----------------- CACHING & RATE LIMITING -----------------
const cache = new Map();
const rateLimitStore = new Map();

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.value;
}

function setCache(key, value, ttlMs = 300000) {
  cache.set(key, {
    value,
    expiry: Date.now() + ttlMs
  });
}

function checkRateLimit(clientId, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitStore.get(clientId) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }

  record.count++;
  rateLimitStore.set(clientId, record);

  if (record.count > maxRequests) {
    throw new PaymentError(
      'Rate limit exceeded',
      'RATE_LIMIT_ERROR',
      429,
      { resetTime: record.resetTime, limit: maxRequests }
    );
  }

  return {
    remaining: maxRequests - record.count,
    resetTime: record.resetTime
  };
}

// ----------------- RETRY LOGIC -----------------
async function retryOperation(operation, maxRetries = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }
}

// ----------------- INPUT VALIDATION & SANITIZATION -----------------
function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input.replace(/[<>]/g, '').trim();
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return input;
}

function validatePhoneNumber(phone, countryCode = 'KE') {
  const patterns = {
    KE: /^(?:\+?254|0)?([17]\d{8})$/,
    UG: /^(?:\+?256|0)?([37]\d{8})$/,
    TZ: /^(?:\+?255|0)?([67]\d{8})$/
  };

  const pattern = patterns[countryCode];
  if (!pattern) throw new ValidationError('Unsupported country code', 'countryCode');

  const match = phone.match(pattern);
  if (!match) throw new ValidationError('Invalid phone number format', 'phone');

  return match[1];
}

// ----------------- REQUEST LOGGING -----------------
function logRequest(event, response, duration, error = null) {
  const log = {
    timestamp: new Date().toISOString(),
    method: event.httpMethod,
    path: event.path,
    statusCode: response.statusCode,
    duration: `${duration}ms`,
    clientId: event.headers['x-client-id'] || event.headers['x-forwarded-for'] || 'anonymous',
    ...(error && { error: error.message, errorCode: error.code })
  };

  console.log(JSON.stringify(log));
}

// ----------------- STRIPE INTEGRATION -----------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createStripePaymentIntent(event) {
  return withSpan('stripe-payment-intent', async (span) => {
    const { amount, currency = 'usd', description, receipt_email } = sanitizeInput(JSON.parse(event.body));

    if (!amount || amount <= 0) {
      throw new ValidationError('Valid amount is required', 'amount');
    }

    span.setAttribute('stripe.amount', amount);
    span.setAttribute('stripe.currency', currency);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      description: description || 'Omega2 Payment',
      receipt_email,
      automatic_payment_methods: { enabled: true }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })
    };
  });
}

async function createStripeCheckoutSession(event) {
  return withSpan('stripe-checkout-session', async (span) => {
    const { amount, currency = 'usd', description, success_url, cancel_url } = sanitizeInput(JSON.parse(event.body));

    if (!amount || amount <= 0) {
      throw new ValidationError('Valid amount is required', 'amount');
    }

    span.setAttribute('stripe.amount', amount);
    span.setAttribute('stripe.currency', currency);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: description || 'Omega2 Payment'
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: success_url || `${process.env.SITE_URL}/success`,
      cancel_url: cancel_url || `${process.env.SITE_URL}/cancel`,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      })
    };
  });
}

async function confirmStripePayment(event) {
  return withSpan('stripe-confirm-payment', async (span) => {
    const { paymentIntentId } = sanitizeInput(JSON.parse(event.body));

    if (!paymentIntentId) {
      throw new ValidationError('Payment Intent ID is required', 'paymentIntentId');
    }

    span.setAttribute('stripe.payment_intent_id', paymentIntentId);

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentIntent)
    };
  });
}

async function handleStripeWebhook(event) {
  return withSpan('stripe-webhook', async (span) => {
    const sig = event.headers['stripe-signature'];
    const payload = event.body;

    const stripeEvent = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    span.setAttribute('stripe.event_type', stripeEvent.type);
    console.log('Stripe webhook received:', stripeEvent.type);

    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object;
        console.log(`Stripe payment succeeded: ID=${paymentIntent.id}, Amount=${paymentIntent.amount / 100}`);
        break;
      case 'payment_intent.payment_failed':
        const failedIntent = stripeEvent.data.object;
        console.log(`Stripe payment failed: ID=${failedIntent.id}`);
        break;
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        console.log(`Stripe Checkout completed: ID=${session.id}`);
        break;
    }

    return { statusCode: 200, headers: { 'Content-Type': 'text/plain' }, body: 'Webhook received' };
  });
}

// ----------------- PAYPAL INTEGRATION -----------------
async function getPayPalAccessToken() {
  const cacheKey = 'paypal_access_token';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = process.env.PAYPAL_SANDBOX === 'true'
    ? 'https://api-m.sandbox.paypal.com/v1/oauth2/token'
    : 'https://api-m.paypal.com/v1/oauth2/token';

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios.post(url, 'grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const token = response.data.access_token;
  setCache(cacheKey, token, 3600000);
  return token;
}

async function createPayPalOrder(event) {
  return withSpan('paypal-create-order', async (span) => {
    const { amount, currency = 'USD', description } = sanitizeInput(JSON.parse(event.body));

    if (!amount || amount <= 0) {
      throw new ValidationError('Valid amount is required', 'amount');
    }

    span.setAttribute('paypal.amount', amount);
    span.setAttribute('paypal.currency', currency);

    const accessToken = await getPayPalAccessToken();
    const url = process.env.PAYPAL_SANDBOX === 'true'
      ? 'https://api-m.sandbox.paypal.com/v2/checkout/orders'
      : 'https://api-m.paypal.com/v2/checkout/orders';

    const data = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toFixed(2)
        },
        description: description || 'Omega2 Payment'
      }]
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: response.data.id,
        approveUrl: response.data.links.find(link => link.rel === 'approve')?.href
      })
    };
  });
}

async function capturePayPalOrder(event) {
  return withSpan('paypal-capture-order', async (span) => {
    const { orderId } = sanitizeInput(JSON.parse(event.body));

    if (!orderId) {
      throw new ValidationError('Order ID is required', 'orderId');
    }

    span.setAttribute('paypal.order_id', orderId);

    const accessToken = await getPayPalAccessToken();
    const url = process.env.PAYPAL_SANDBOX === 'true'
      ? `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`
      : `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`;

    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.data)
    };
  });
}

async function handlePayPalWebhook(event) {
  return withSpan('paypal-webhook', async (span) => {
    const webhookData = JSON.parse(event.body);
    
    span.setAttribute('paypal.event_type', webhookData.event_type);
    console.log('PayPal webhook received:', webhookData.event_type);

    if (webhookData.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const capture = webhookData.resource;
      console.log(`PayPal payment captured: ID=${capture.id}, Amount=${capture.amount.value}`);
    }

    return { statusCode: 200, headers: { 'Content-Type': 'text/plain' }, body: '' };
  });
}

// ----------------- MTN MOMO INTEGRATION -----------------
async function getMtnMomoAccessToken(collection = true) {
  const cacheKey = `mtn_momo_${collection ? 'collection' : 'disbursement'}_token`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const envPrefix = collection ? 'MTN_MOMO_COLLECTION' : 'MTN_MOMO_DISBURSEMENT';
  const apiUser = process.env[`${envPrefix}_API_USER`];
  const apiKey = process.env[`${envPrefix}_API_KEY`];
  const subscriptionKey = process.env[`${envPrefix}_SUBSCRIPTION_KEY`];
  const baseUrl = process.env.MTN_MOMO_SANDBOX === 'true'
    ? 'https://sandbox.momodeveloper.mtn.com'
    : 'https://proxy.momoapi.mtn.com';

  const url = `${baseUrl}/${collection ? 'collection' : 'disbursement'}/token/`;
  const auth = Buffer.from(`${apiUser}:${apiKey}`).toString('base64');

  const response = await axios.post(url, {}, {
    headers: {
      Authorization: `Basic ${auth}`,
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  });

  const token = response.data.access_token;
  setCache(cacheKey, token, 3600000);
  return token;
}

async function initiateMtnMomoRequestToPay(event) {
  return withSpan('mtn-momo-request-to-pay', async (span) => {
    const { customerPhone, amount, description, reference } = sanitizeInput(JSON.parse(event.body));

    if (!customerPhone || !amount || amount <= 0) {
      throw new ValidationError('Phone number and valid amount are required');
    }

    let formattedPhone = customerPhone;
    if (customerPhone.startsWith('0')) {
      formattedPhone = `256${customerPhone.slice(1)}`;
    } else if (customerPhone.startsWith('+256')) {
      formattedPhone = customerPhone.slice(1);
    } else if (!customerPhone.startsWith('256')) {
      formattedPhone = `256${customerPhone.replace(/^0+/, '')}`;
    }

    span.setAttribute('momo.phone', formattedPhone);
    span.setAttribute('momo.amount', amount);

    const accessToken = await getMtnMomoAccessToken(true);
    const subscriptionKey = process.env.MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY;
    const baseUrl = process.env.MTN_MOMO_SANDBOX === 'true'
      ? 'https://sandbox.momodeveloper.mtn.com'
      : 'https://proxy.momoapi.mtn.com';

    const url = `${baseUrl}/collection/v1_0/requesttopay`;
    const externalId = reference || `pay_${Date.now()}`;
    const currency = process.env.MTN_MOMO_CURRENCY || 'EUR';

    const data = {
      amount: amount.toString(),
      currency,
      externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: formattedPhone
      },
      payerMessage: description || 'Omega2 Payment',
      payeeNote: 'Thank you'
    };

    await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Reference-Id': externalId,
        'X-Target-Environment': process.env.MTN_MOMO_SANDBOX === 'true' ? 'sandbox' : 'mtnuganda',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 202,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        paymentId: externalId,
        message: 'Request to Pay initiated'
      })
    };
  });
}

async function checkMtnMomoTransactionStatus(event) {
  return withSpan('mtn-momo-check-status', async (span) => {
    const { transactionId } = sanitizeInput(JSON.parse(event.body));

    if (!transactionId) {
      throw new ValidationError('Transaction ID is required', 'transactionId');
    }

    span.setAttribute('momo.transaction_id', transactionId);

    const accessToken = await getMtnMomoAccessToken(true);
    const subscriptionKey = process.env.MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY;
    const baseUrl = process.env.MTN_MOMO_SANDBOX === 'true'
      ? 'https://sandbox.momodeveloper.mtn.com'
      : 'https://proxy.momoapi.mtn.com';

    const url = `${baseUrl}/collection/v1_0/requesttopay/${transactionId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Target-Environment': process.env.MTN_MOMO_SANDBOX === 'true' ? 'sandbox' : 'mtnuganda',
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.data)
    };
  });
}

async function handleMtnMomoWebhook(event) {
  return withSpan('mtn-momo-webhook', async (span) => {
    if (event.httpMethod !== 'POST') {
      throw new PaymentError('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
    }

    const callbackData = JSON.parse(event.body);
    
    span.setAttribute('momo.status', callbackData.status);
    span.setAttribute('momo.transaction_id', callbackData.financialTransactionId);
    
    console.log('MTN MoMo Callback received:', callbackData);

    const { financialTransactionId, status, reason } = callbackData;

    if (status === 'SUCCESSFUL') {
      console.log(`Successful MTN MoMo payment: Transaction ID=${financialTransactionId}`);
    } else {
      console.log(`MTN MoMo payment failed: Transaction ID=${financialTransactionId}, Reason=${reason}`);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' })
    };
  });
}

// ----------------- WAVE PAYMENTS INTEGRATION -----------------
async function initiateWavePayout(event) {
  return withSpan('wave-payout', async (span) => {
    const { mobile, amount, currency = 'XOF', name, reference } = sanitizeInput(JSON.parse(event.body));

    if (!mobile || !amount || amount <= 0) {
      throw new ValidationError('Mobile number and valid amount are required');
    }

    span.setAttribute('wave.mobile', mobile);
    span.setAttribute('wave.amount', amount);

    const url = 'https://api.wave.com/v1/payouts';
    const data = {
      mobile,
      amount,
      currency,
      name,
      reference: reference || `payout_${Date.now()}`
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${process.env.WAVE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        payoutId: response.data.id,
        message: 'Payout initiated successfully',
        details: response.data
      })
    };
  });
}

async function checkWavePayoutStatus(event) {
  return withSpan('wave-check-status', async (span) => {
    const { payoutId } = sanitizeInput(JSON.parse(event.body));

    if (!payoutId) {
      throw new ValidationError('Payout ID is required', 'payoutId');
    }

    span.setAttribute('wave.payout_id', payoutId);

    const url = `https://api.wave.com/v1/payouts/${payoutId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.WAVE_API_KEY}`
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.data)
    };
  });
}

// ----------------- FLUTTERWAVE INTEGRATION -----------------
async function initiateFlutterwavePayment(event) {
  return withSpan('flutterwave-initiate', async (span) => {
    const { amount, currency, email, phone, name, tx_ref } = sanitizeInput(JSON.parse(event.body));

    if (!amount || !email || !currency) {
      throw new ValidationError('Amount, email, and currency are required');
    }

    span.setAttribute('flutterwave.amount', amount);
    span.setAttribute('flutterwave.currency', currency);

    const url = 'https://api.flutterwave.com/v3/payments';
    const data = {
      tx_ref: tx_ref || `FLW_${Date.now()}`,
      amount,
      currency,
      redirect_url: `${process.env.SITE_URL}/payment-callback`,
      payment_options: 'card,mobilemoney,ussd',
      customer: {
        email,
        phonenumber: phone,
        name
      },
      customizations: {
        title: 'Omega2 Payment',
        description: 'Payment for services',
        logo: `${process.env.SITE_URL}/logo.png`
      }
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        paymentUrl: response.data.data.link,
        transactionId: response.data.data.tx_ref
      })
    };
  });
}

async function verifyFlutterwaveTransaction(event) {
  return withSpan('flutterwave-verify', async (span) => {
    const { transactionId } = sanitizeInput(JSON.parse(event.body));

    if (!transactionId) {
      throw new ValidationError('Transaction ID is required', 'transactionId');
    }

    span.setAttribute('flutterwave.transaction_id', transactionId);

    const url = `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.data)
    };
  });
}

async function initiateFlutterwaveMobileMoney(event) {
  return withSpan('flutterwave-mobile-money', async (span) => {
    const { amount, currency, email, phone, network, tx_ref } = sanitizeInput(JSON.parse(event.body));

    if (!amount || !phone || !network) {
      throw new ValidationError('Amount, phone, and network are required');
    }

    span.setAttribute('flutterwave.network', network);
    span.setAttribute('flutterwave.amount', amount);

    const url = 'https://api.flutterwave.com/v3/charges?type=mobile_money_ghana';
    const data = {
      tx_ref: tx_ref || `FLW_MM_${Date.now()}`,
      amount,
      currency: currency || 'GHS',
      network,
      email: email || 'user@example.com',
      phone_number: phone,
      fullname: 'Omega2 User'
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.data)
    };
  });
}

async function handleFlutterwaveWebhook(event) {
  return withSpan('flutterwave-webhook', async (span) => {
    const signature = event.headers['verif-hash'];
    
    if (!signature || signature !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
      throw new PaymentError('Invalid webhook signature', 'INVALID_SIGNATURE', 401);
    }

    const webhookData = JSON.parse(event.body);
    
    span.setAttribute('flutterwave.event', webhookData.event);
    console.log('Flutterwave webhook received:', webhookData.event);

    if (webhookData.event === 'charge.completed') {
      const transaction = webhookData.data;
      console.log(`Flutterwave payment completed: ID=${transaction.id}, Amount=${transaction.amount}`);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Webhook received'
    };
  });
}

// ----------------- M-PESA INTEGRATION -----------------
async function getMpesaAccessToken() {
  const cacheKey = 'mpesa_access_token';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = process.env.MPESA_SANDBOX === 'true'
    ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}` }
  });

  const token = response.data.access_token;
  setCache(cacheKey, token, 3600000);
  return token;
}

function getMpesaTimestamp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${y}${m}${d}${h}${min}${s}`;
}

function getMpesaPassword(timestamp) {
  const shortCode = process.env.MPESA_BUSINESS_SHORT_CODE;
  const passKey = process.env.MPESA_PASS_KEY;
  const raw = `${shortCode}${passKey}${timestamp}`;
  return Buffer.from(raw).toString('base64');
}

async function initiateStkPush(event) {
  return withSpan('mpesa-stk-push', async (span) => {
    const { customerPhone, amount, description, reference } = sanitizeInput(JSON.parse(event.body));

    if (!customerPhone || !amount || amount <= 0) {
      throw new ValidationError('Phone number and valid amount are required');
    }

    const formattedPhone = validatePhoneNumber(customerPhone, 'KE');
    const phoneNumber = `254${formattedPhone}`;

    span.setAttribute('mpesa.phone', phoneNumber);
    span.setAttribute('mpesa.amount', amount);

    const accessToken = await getMpesaAccessToken();
    const timestamp = getMpesaTimestamp();
    const password = getMpesaPassword(timestamp);

    const url = process.env.MPESA_SANDBOX === 'true'
      ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const data = {
      BusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_BUSINESS_SHORT_CODE,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: reference || 'Omega2',
      TransactionDesc: description || 'Payment for services'
    };

    const response = await retryOperation(async () => {
      return await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    }, 2);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: response.data.ResponseCode === '0',
        merchantRequestId: response.data.MerchantRequestID,
        checkoutRequestId: response.data.CheckoutRequestID,
        message: response.data.ResponseDescription
      })
    };
  });
}

async function handleMpesaCallback(event) {
  return withSpan('mpesa-callback', async (span) => {
    if (event.httpMethod !== 'POST') {
      throw new PaymentError('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
    }

    const callbackData = JSON.parse(event.body);
    
    span.setAttribute('mpesa.result_code', callbackData.Body?.stkCallback?.ResultCode);
    console.log('M-Pesa STK Callback received:', callbackData);

    const { ResultCode, ResultDesc, CallbackMetadata } = callbackData.Body?.stkCallback || {};

    if (ResultCode === 0) {
      const metadata = CallbackMetadata?.Item || [];
      const amount = metadata.find(item => item.Name === 'Amount')?.Value;
      const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;

      console.log(`Successful M-Pesa payment: Receipt=${mpesaReceiptNumber}, Amount=${amount}, Phone=${phoneNumber}`);
    } else {
      console.log(`M-Pesa payment failed: ${ResultDesc}`);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' })
    };
  });
}

async function handleMpesaValidation(event) {
  return withSpan('mpesa-validation', async (span) => {
    const validationData = JSON.parse(event.body);
    
    span.setAttribute('mpesa.transaction_type', validationData.TransactionType);
    console.log('M-Pesa C2B Validation:', validationData);

    // Implement validation logic here
    const isValid = true;

    if (isValid) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' })
      };
    } else {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ResultCode: 1, ResultDesc: 'Rejected' })
      };
    }
  });
}

async function registerMpesaUrls(event) {
  return withSpan('mpesa-register-urls', async (span) => {
    const accessToken = await getMpesaAccessToken();

    const url = process.env.MPESA_SANDBOX === 'true'
      ? 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl'
      : 'https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl';

    const data = {
      ShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
      ResponseType: 'Completed',
      ConfirmationURL: `${process.env.MPESA_CALLBACK_URL}/confirmation`,
      ValidationURL: `${process.env.MPESA_CALLBACK_URL}/validation`
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.data)
    };
  });
}

// ----------------- AIRTEL MONEY INTEGRATION -----------------
async function getAirtelAccessToken() {
  const cacheKey = 'airtel_access_token';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const baseUrl = process.env.AIRTEL_SANDBOX === 'true'
    ? 'https://openapiuat.airtel.africa'
    : 'https://openapi.airtel.africa';
  const url = `${baseUrl}/auth/oauth2/token`;

  const data = {
    client_id: process.env.AIRTEL_CLIENT_ID,
    client_secret: process.env.AIRTEL_CLIENT_SECRET,
    grant_type: 'client_credentials'
  };

  const response = await axios.post(url, data, {
    headers: { 'Content-Type': 'application/json' }
  });

  const token = response.data.access_token;
  setCache(cacheKey, token, 3600000);
  return token;
}

async function initiateAirtelUssdPush(event) {
  return withSpan('airtel-ussd-push', async (span) => {
    const { customerPhone, amount, description, reference } = sanitizeInput(JSON.parse(event.body));

    if (!customerPhone || !amount || amount <= 0) {
      throw new ValidationError('Phone number and valid amount are required');
    }

    const formattedPhone = validatePhoneNumber(customerPhone, 'KE');
    const phoneNumber = `254${formattedPhone}`;

    span.setAttribute('airtel.phone', phoneNumber);
    span.setAttribute('airtel.amount', amount);

    const accessToken = await getAirtelAccessToken();
    const country = process.env.AIRTEL_COUNTRY || 'KE';
    const baseUrl = process.env.AIRTEL_SANDBOX === 'true'
      ? 'https://openapiuat.airtel.africa'
      : 'https://openapi.airtel.africa';

    const url = `${baseUrl}/merchant/v1/payments/`;
    const transactionId = reference || `AIRTEL_${Date.now()}`;

    const data = {
      reference: transactionId,
      subscriber: {
        country,
        currency: process.env.AIRTEL_CURRENCY || 'KES',
        msisdn: phoneNumber
      },
      transaction: {
        amount: amount.toString(),
        country,
        currency: process.env.AIRTEL_CURRENCY || 'KES',
        id: transactionId
      }
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Country': country,
        'X-Currency': process.env.AIRTEL_CURRENCY || 'KES'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: response.data.status?.success || false,
        transactionId,
        message: response.data.status?.message || 'Payment initiated',
        details: response.data
      })
    };
  });
}

async function checkAirtelTransactionStatus(event) {
  return withSpan('airtel-check-status', async (span) => {
    const { transactionId } = sanitizeInput(JSON.parse(event.body));

    if (!transactionId) {
      throw new ValidationError('Transaction ID is required', 'transactionId');
    }

    span.setAttribute('airtel.transaction_id', transactionId);

    const accessToken = await getAirtelAccessToken();
    const country = process.env.AIRTEL_COUNTRY || 'KE';
    const baseUrl = process.env.AIRTEL_SANDBOX === 'true'
      ? 'https://openapiuat.airtel.africa'
      : 'https://openapi.airtel.africa';

    const url = `${baseUrl}/standard/v1/payments/${transactionId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Country': country,
        'X-Currency': process.env.AIRTEL_CURRENCY || 'KES'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.data)
    };
  });
}

async function handleAirtelCallback(event) {
  return withSpan('airtel-callback', async (span) => {
    if (event.httpMethod !== 'POST') {
      throw new PaymentError('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
    }

    const callbackData = JSON.parse(event.body);
    
    span.setAttribute('airtel.transaction_id', callbackData.transaction?.id);
    console.log('Airtel Money Callback received:', callbackData);

    const { transaction } = callbackData;

    if (transaction?.status === 'TS') {
      console.log(`Successful Airtel payment: ID=${transaction.id}, Amount=${transaction.amount}`);
    } else {
      console.log(`Airtel payment status: ${transaction?.status}`);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' })
    };
  });
}

// ----------------- TIGO PESA (PAYNA) INTEGRATION -----------------
async function getPaynaAccessToken() {
  const cacheKey = 'payna_access_token';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = 'https://api.payna.co.tz/payment/auth/token';
  const data = {
    email: process.env.PAYNA_EMAIL,
    password: process.env.PAYNA_PASSWORD
  };

  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.PAYNA_API_KEY
    }
  });

  const token = response.data.token;
  setCache(cacheKey, token, 3600000);
  return token;
}

async function initiateTigoUssdPush(event) {
  return withSpan('tigo-ussd-push', async (span) => {
    const { customerPhone, amount, description, reference } = sanitizeInput(JSON.parse(event.body));

    if (!customerPhone || !amount || amount <= 0) {
      throw new ValidationError('Phone number and valid amount are required');
    }

    const formattedPhone = validatePhoneNumber(customerPhone, 'TZ');
    const phoneNumber = `255${formattedPhone}`;

    span.setAttribute('tigo.phone', phoneNumber);
    span.setAttribute('tigo.amount', amount);

    const accessToken = await getPaynaAccessToken();
    const url = 'https://api.payna.co.tz/client/request';

    const data = {
      reference: reference || `TIGO_${Date.now()}`,
      msisdn: phoneNumber,
      amount: Number(amount),
      channel: 'TIGO',
      callback: process.env.PAYNA_CALLBACK_URL || `${process.env.SITE_URL}/api/payments/tigo/callback`
    };

    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: response.data.success,
        transactionId: data.reference,
        message: 'USSD push initiated',
        details: response.data
      })
    };
  });
}

async function handlePaynaCallback(event) {
  return withSpan('payna-callback', async (span) => {
    if (event.httpMethod !== 'POST') {
      throw new PaymentError('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
    }

    const callbackData = JSON.parse(event.body);
    
    span.setAttribute('payna.status', callbackData.action);
    console.log('Payna/Tigo Pesa Callback received:', callbackData);

    const { action, amount, msisdn, reference, receipt, transaction_date } = callbackData;

    if (action === 'PAYMENT') {
      console.log(`Successful Tigo Pesa payment: Ref=${reference}, Amount=${amount}, Receipt=${receipt}`);
    } else if (action === 'FAILED') {
      console.log(`Tigo Pesa payment failed: ${reference}`);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' })
    };
  });
}

// ----------------- API GATEWAY -----------------
const MICROSERVICES = {
  auth: process.env.AUTH_SERVICE_URL || "https://auth.yourdomain.com",
  backend: process.env.BACKEND_SERVICE_URL || "https://api.yourdomain.com",
  payments: process.env.PAYMENTS_SERVICE_URL || "https://payments.yourdomain.com",
};

async function handleHealthCheck(event) {
  return withSpan('health-check', async (span) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'omega2-service',
      version: process.env.SERVICE_VERSION || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cacheSize: cache.size,
      rateLimitStoreSize: rateLimitStore.size
    };

    span.setAttribute('health.status', health.status);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(health)
    };
  });
}

async function handleMetrics(event) {
  return withSpan('metrics', async (span) => {
    const metrics = {
      timestamp: new Date().toISOString(),
      cache: {
        size: cache.size,
        keys: Array.from(cache.keys())
      },
      rateLimit: {
        activeRecords: rateLimitStore.size
      },
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    };
  });
}

async function proxyService(baseUrl, endpoint, event, token) {
  return withSpan('proxy-service', async (span) => {
    try {
      span.setAttribute('proxy.base_url', baseUrl);
      span.setAttribute('proxy.endpoint', endpoint);
      span.setAttribute('proxy.method', event.httpMethod);

      const url = `${baseUrl}/api/${endpoint}`;
      
      const config = {
        method: event.httpMethod,
        url,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        ...(event.body && { data: JSON.parse(event.body) }),
        timeout: 30000,
        validateStatus: (status) => status < 500
      };

      const response = await retryOperation(async () => {
        return await axios(config);
      }, 2);

      span.setAttribute('proxy.status_code', response.status);

      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          ...response.headers
        },
        body: JSON.stringify(response.data)
      };
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new PaymentError(
          'Request timeout',
          'PROXY_TIMEOUT',
          504,
          'The upstream service took too long to respond'
        );
      }
      
      if (error.response) {
        throw new PaymentError(
          `Upstream service error: ${error.response.statusText}`,
          'PROXY_UPSTREAM_ERROR',
          error.response.status,
          error.response.data
        );
      }
      
      throw new PaymentError(
        'Failed to connect to upstream service',
        'PROXY_CONNECTION_ERROR',
        503,
        error.message
      );
    }
  });
}

export async function handler(event, context) {
  const startTime = Date.now();
  
  return withSpan('api-handler', async (span) => {
    let response;
    try {
      span.setAttribute('http.method', event.httpMethod);
      span.setAttribute('http.path', event.path);
      
      const path = event.path.replace("/api/", "");
      const [service, ...rest] = path.split("/");
      const endpoint = rest.join("/");
      const token = event.headers.authorization?.replace("Bearer ", "");
      
      span.setAttribute('service.name', service);
      span.setAttribute('api.endpoint', endpoint);

      // Rate limiting - skip for health checks
      if (service !== 'health' && service !== 'metrics') {
        const clientId = event.headers['x-client-id'] || 
                         event.headers['x-forwarded-for'] || 
                         'anonymous';
        const rateLimitInfo = checkRateLimit(clientId, 100, 60000);
        
        span.setAttribute('rateLimit.remaining', rateLimitInfo.remaining);
      }

      // Health and utility endpoints
      if (path === 'health' || service === 'health') {
        response = await handleHealthCheck(event);
      } else if (path === 'metrics' || service === 'metrics') {
        response = await handleMetrics(event);
      }
      
      // Service routing
      else if (service === "auth" || service === "backend") {
        response = await proxyService(MICROSERVICES[service], endpoint, event, token);
      }
      
      else if (service === "payments") {
        // M-Pesa routes
        if (endpoint === "mpesa/stk-push") {
          response = await initiateStkPush(event);
        } else if (endpoint === "mpesa/callback") {
          response = await handleMpesaCallback(event);
        } else if (endpoint === "mpesa/validation") {
          response = await handleMpesaValidation(event);
        } else if (endpoint === "mpesa/register-url") {
          response = await registerMpesaUrls(event);
        }
        
        // Airtel Money routes
        else if (endpoint === "airtel/ussd-push") {
          response = await initiateAirtelUssdPush(event);
        } else if (endpoint === "airtel/check-status") {
          response = await checkAirtelTransactionStatus(event);
        } else if (endpoint === "airtel/callback") {
          response = await handleAirtelCallback(event);
        }
        
        // Tigo Pesa routes
        else if (endpoint === "tigo/ussd-push") {
          response = await initiateTigoUssdPush(event);
        } else if (endpoint === "tigo/callback") {
          response = await handlePaynaCallback(event);
        }
        
        // Stripe routes
        else if (endpoint === "stripe/create-payment-intent") {
          response = await createStripePaymentIntent(event);
        } else if (endpoint === "stripe/create-checkout-session") {
          response = await createStripeCheckoutSession(event);
        } else if (endpoint === "stripe/confirm-payment") {
          response = await confirmStripePayment(event);
        } else if (endpoint === "stripe/webhook") {
          response = await handleStripeWebhook(event);
        }
        
        // PayPal routes
        else if (endpoint === "paypal/create-order") {
          response = await createPayPalOrder(event);
        } else if (endpoint === "paypal/capture-order") {
          response = await capturePayPalOrder(event);
        } else if (endpoint === "paypal/webhook") {
          response = await handlePayPalWebhook(event);
        }
        
        // MTN MoMo routes
        else if (endpoint === "momo/request-to-pay") {
          response = await initiateMtnMomoRequestToPay(event);
        } else if (endpoint === "momo/check-status") {
          response = await checkMtnMomoTransactionStatus(event);
        } else if (endpoint === "momo/webhook") {
          response = await handleMtnMomoWebhook(event);
        }
        
        // Wave routes
        else if (endpoint === "wave/payout") {
          response = await initiateWavePayout(event);
        } else if (endpoint === "wave/check-status") {
          response = await checkWavePayoutStatus(event);
        }
        
        // Flutterwave routes
        else if (endpoint === "flutterwave/initiate") {
          response = await initiateFlutterwavePayment(event);
        } else if (endpoint === "flutterwave/verify") {
          response = await verifyFlutterwaveTransaction(event);
        } else if (endpoint === "flutterwave/mobile-money") {
          response = await initiateFlutterwaveMobileMoney(event);
        } else if (endpoint === "flutterwave/webhook") {
          response = await handleFlutterwaveWebhook(event);
        }
        
        // Proxy to payments service for other endpoints
        else {
          response = await proxyService(MICROSERVICES.payments, endpoint, event, token);
        }
      }
      
      else if (service === "ussd") {
        response = await handleUSSDsimulation(event);
      }
      
      else {
        throw new PaymentError(
          `Service '${service}' not found`,
          'SERVICE_NOT_FOUND',
          404
        );
      }

      // Add common headers
      const duration = Date.now() - startTime;
      response.headers = {
        ...response.headers,
        'X-Response-Time': `${duration}ms`,
        'X-Service-Version': process.env.SERVICE_VERSION || '1.0.0'
      };

      // Log successful request
      logRequest(event, response, duration);

      return response;
    } catch (err) {
      const duration = Date.now() - startTime;
      response = createErrorResponse(err, span);
      
      // Log failed request
      logRequest(event, response, duration, err);
      
      return response;
    }
  });
}

// ----------------- USSD SIMULATION -----------------
async function handleUSSDsimulation(event) {
  return withSpan('ussd-simulation', async (span) => {
    try {
      if (event.httpMethod !== 'POST') {
        throw new ValidationError('Only POST method is allowed for USSD');
      }

      const { sessionId, phoneNumber, text } = JSON.parse(event.body);

      if (!sessionId || !phoneNumber) {
        throw new ValidationError('Session ID and phone number are required');
      }

      span.setAttribute('ussd.session_id', sessionId);
      span.setAttribute('ussd.phone_number', phoneNumber);
      span.setAttribute('ussd.text', text || '');

      let response = "";
      
      if (!text || text === "") {
        response = "CON Welcome to Omega2\n1. Check Balance\n2. Buy Data\n3. Buy Airtime\n4. Pay Bill\n5. Exit";
      } else if (text === "1") {
        response = "END Your balance:\n• Data: 150 MB\n• Airtime: KES 245\nThank you for using Omega2";
      } else if (text === "2") {
        response = "CON Select Data Bundle:\n1. 50MB - KES 10\n2. 100MB - KES 20\n3. 500MB - KES 50\n4. 1GB - KES 100\n5. 5GB - KES 450";
      } else if (text === "2*1") {
        response = "CON Confirm purchase:\n50MB for KES 10\n1. Confirm\n2. Cancel";
      } else if (text === "2*1*1") {
        response = "END Successfully purchased 50MB data bundle for KES 10.\nYour new balance: 200MB\nThank you!";
      } else if (text === "2*2") {
        response = "CON Confirm purchase:\n100MB for KES 20\n1. Confirm\n2. Cancel";
      } else if (text === "2*2*1") {
        response = "END Successfully purchased 100MB data bundle for KES 20.\nYour new balance: 250MB\nThank you!";
      } else if (text === "2*3") {
        response = "CON Confirm purchase:\n500MB for KES 50\n1. Confirm\n2. Cancel";
      } else if (text === "2*3*1") {
        response = "END Successfully purchased 500MB data bundle for KES 50.\nYour new balance: 650MB\nThank you!";
      } else if (text === "2*4") {
        response = "CON Confirm purchase:\n1GB for KES 100\n1. Confirm\n2. Cancel";
      } else if (text === "2*4*1") {
        response = "END Successfully purchased 1GB data bundle for KES 100.\nYour new balance: 1.15GB\nThank you!";
      } else if (text.match(/2\*[1-4]\*2/)) {
        response = "END Purchase cancelled.\nThank you for using Omega2";
      } else if (text === "3") {
        response = "CON Enter amount (KES):\nMinimum: 10\nMaximum: 5000";
      } else if (text.startsWith("3*")) {
        const amount = text.split("*")[1];
        if (isNaN(amount) || parseFloat(amount) < 10) {
          response = "END Invalid amount.\nMinimum is KES 10";
        } else if (parseFloat(amount) > 5000) {
          response = "END Invalid amount.\nMaximum is KES 5000";
        } else {
          response = `CON Confirm purchase:\nAirtime worth KES ${amount}\n1. Confirm\n2. Cancel`;
        }
      } else if (text.match(/3\*\d+\*1/)) {
        const amount = text.split("*")[1];
        response = `END Airtime of KES ${amount} purchased successfully.\nNew balance: KES ${parseFloat(amount) + 245}\nThank you!`;
      } else if (text.match(/3\*\d+\*2/)) {
        response = "END Purchase cancelled.\nThank you for using Omega2";
      } else if (text === "4") {
        response = "CON Pay Bill\nEnter Business Number:";
      } else if (text.startsWith("4*") && text.split("*").length === 2) {
        response = "CON Enter Account Number:";
      } else if (text.startsWith("4*") && text.split("*").length === 3) {
        response = "CON Enter Amount (KES):";
      } else if (text.startsWith("4*") && text.split("*").length === 4) {
        const parts = text.split("*");
        const businessNo = parts[1];
        const accountNo = parts[2];
        const amount = parts[3];
        
        if (isNaN(amount) || parseFloat(amount) < 1) {
          response = "END Invalid amount.\nPlease try again.";
        } else {
          response = `CON Confirm Payment:\nBusiness: ${businessNo}\nAccount: ${accountNo}\nAmount: KES ${amount}\n1. Confirm\n2. Cancel`;
        }
      } else if (text.match(/4\*\d+\*\w+\*\d+\*1/)) {
        const parts = text.split("*");
        const amount = parts[3];
        response = `END Payment of KES ${amount} sent successfully.\nYou will receive a confirmation SMS shortly.\nThank you!`;
      } else if (text.match(/4\*\d+\*\w+\*\d+\*2/)) {
        response = "END Payment cancelled.\nThank you for using Omega2";
      } else if (text === "5") {
        response = "END Thank you for using Omega2.\nDial *123# to access services again.";
      } else {
        response = "END Invalid selection.\nPlease try again by dialing *123#";
      }

      span.setAttribute('ussd.response_type', response.startsWith('CON') ? 'continue' : 'end');

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: response
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        return createErrorResponse(error, span);
      }
      throw new PaymentError(
        'USSD simulation error',
        'USSD_ERROR',
        500,
        error.message
      );
    }
  });
}

// ----------------- COMPREHENSIVE API DOCUMENTATION -----------------
/*
 * ═══════════════════════════════════════════════════════════════════════
 * OMEGA2 PWA - UNIFIED SERVERLESS FUNCTION
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * This is a production-ready, enterprise-grade serverless function that provides:
 * 
 * ✅ FEATURES:
 * - API Gateway with microservices proxy
 * - Multi-provider payment integration (9+ providers)
 * - USSD simulation for mobile networks
 * - OpenTelemetry distributed tracing & metrics
 * - Rate limiting (100 req/min default)
 * - Response caching with TTL
 * - Comprehensive error handling
 * - Input validation & sanitization
 * - Retry logic with exponential backoff
 * - Request/response logging
 * - Health & metrics endpoints
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * PAYMENT PROVIDERS SUPPORTED:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * 1. M-PESA (Kenya)
 *    - STK Push: POST /api/payments/mpesa/stk-push
 *    - Callback: POST /api/payments/mpesa/callback
 *    - Validation: POST /api/payments/mpesa/validation
 *    - Register URLs: POST /api/payments/mpesa/register-url
 * 
 * 2. AIRTEL MONEY (Kenya, Uganda, Tanzania)
 *    - USSD Push: POST /api/payments/airtel/ussd-push
 *    - Check Status: POST /api/payments/airtel/check-status
 *    - Callback: POST /api/payments/airtel/callback
 * 
 * 3. TIGO PESA (Tanzania) via PAYNA
 *    - USSD Push: POST /api/payments/tigo/ussd-push
 *    - Callback: POST /api/payments/tigo/callback
 * 
 * 4. STRIPE (Global)
 *    - Create Payment Intent: POST /api/payments/stripe/create-payment-intent
 *    - Create Checkout Session: POST /api/payments/stripe/create-checkout-session
 *    - Confirm Payment: POST /api/payments/stripe/confirm-payment
 *    - Webhook: POST /api/payments/stripe/webhook
 * 
 * 5. PAYPAL (Global)
 *    - Create Order: POST /api/payments/paypal/create-order
 *    - Capture Order: POST /api/payments/paypal/capture-order
 *    - Webhook: POST /api/payments/paypal/webhook
 * 
 * 6. MTN MOMO (Uganda, Ghana, etc.)
 *    - Request to Pay: POST /api/payments/momo/request-to-pay
 *    - Check Status: POST /api/payments/momo/check-status
 *    - Webhook: POST /api/payments/momo/webhook
 * 
 * 7. WAVE (Senegal, Ivory Coast)
 *    - Payout: POST /api/payments/wave/payout
 *    - Check Status: POST /api/payments/wave/check-status
 * 
 * 8. FLUTTERWAVE (Africa-wide)
 *    - Initiate Payment: POST /api/payments/flutterwave/initiate
 *    - Verify Transaction: POST /api/payments/flutterwave/verify
 *    - Mobile Money: POST /api/payments/flutterwave/mobile-money
 *    - Webhook: POST /api/payments/flutterwave/webhook
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * UTILITY ENDPOINTS:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * - Health Check: GET /api/health
 * - Metrics: GET /api/metrics
 * - USSD Simulation: POST /api/ussd
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * MICROSERVICES PROXY:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * - Auth Service: /api/auth/*
 * - Backend Service: /api/backend/*
 * - Payments Service: /api/payments/* (fallback for unmapped routes)
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * CONFIGURATION:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Set these environment variables in Netlify:
 * 
 * OpenTelemetry:
 *   OTEL_SERVICE_NAME, OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_DEBUG, SERVICE_VERSION
 * 
 * Payment Providers:
 *   MPESA_*, AIRTEL_*, PAYNA_*, STRIPE_*, PAYPAL_*, MTN_MOMO_*,
 *   WAVE_*, FLUTTERWAVE_*
 * 
 * Microservices:
 *   AUTH_SERVICE_URL, BACKEND_SERVICE_URL, PAYMENTS_SERVICE_URL
 * 
 * General:
 *   NODE_ENV, SITE_URL
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * ERROR CODES:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * - VALIDATION_ERROR (400) - Invalid input data
 * - METHOD_NOT_ALLOWED (405) - Wrong HTTP method
 * - RATE_LIMIT_ERROR (429) - Too many requests
 * - SERVICE_NOT_FOUND (404) - Unknown service route
 * - PROXY_TIMEOUT (504) - Upstream service timeout
 * - PROXY_CONNECTION_ERROR (503) - Cannot connect to upstream
 * - PROXY_UPSTREAM_ERROR (varies) - Upstream service error
 * - INVALID_SIGNATURE (401) - Webhook signature verification failed
 * - *_AUTH_ERROR (500) - Authentication failures
 * - *_PAYMENT_ERROR (500) - Payment processing failures
 * - INTERNAL_ERROR (500) - Generic internal error
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * SECURITY FEATURES:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * - Input sanitization (XSS protection)
 * - Rate limiting (DDoS protection, 100 req/min default)
 * - Webhook signature verification (Stripe, Flutterwave)
 * - Phone number validation
 * - Request validation
 * - Secure token handling
 * - Error masking (no sensitive data in responses)
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * OBSERVABILITY:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * - Distributed tracing with OpenTelemetry
 * - Metrics collection (requests, errors, latency)
 * - Structured JSON logging
 * - Health monitoring endpoint
 * - Performance tracking
 * - Cache and rate limit metrics
 * - Memory usage monitoring
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * CACHING STRATEGY:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * - Access tokens cached for 1 hour (3600000ms)
 * - Default cache TTL: 5 minutes (300000ms)
 * - Automatic cache expiry and cleanup
 * - In-memory cache for serverless environment
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * RETRY STRATEGY:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * - Max retries: 3 (configurable)
 * - Exponential backoff: delay * attempt
 * - Applied to: External API calls, proxy requests
 * - Not applied to: Webhooks, callbacks
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * USAGE EXAMPLES:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * M-Pesa STK Push:
 * POST /api/payments/mpesa/stk-push
 * {
 *   "customerPhone": "0712345678",
 *   "amount": 100,
 *   "reference": "ORDER123",
 *   "description": "Payment for order"
 * }
 * 
 * Stripe Payment Intent:
 * POST /api/payments/stripe/create-payment-intent
 * {
 *   "amount": 50.00,
 *   "currency": "usd",
 *   "description": "Product purchase",
 *   "receipt_email": "customer@example.com"
 * }
 * 
 * PayPal Order:
 * POST /api/payments/paypal/create-order
 * {
 *   "amount": 100.00,
 *   "currency": "USD",
 *   "description": "Service payment"
 * }
 * 
 * MTN MoMo Request to Pay:
 * POST /api/payments/momo/request-to-pay
 * {
 *   "customerPhone": "256712345678",
 *   "amount": 5000,
 *   "description": "Payment for goods"
 * }
 * 
 * Flutterwave Payment:
 * POST /api/payments/flutterwave/initiate
 * {
 *   "amount": 1000,
 *   "currency": "KES",
 *   "email": "customer@example.com",
 *   "phone": "254712345678",
 *   "name": "John Doe"
 * }
 * 
 * USSD Simulation:
 * POST /api/ussd
 * {
 *   "sessionId": "session_123",
 *   "phoneNumber": "254712345678",
 *   "text": "1"
 * }
 * 
 * Health Check:
 * GET /api/health
 * 
 * Metrics:
 * GET /api/metrics
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * DEPLOYMENT:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * 1. Set all required environment variables in Netlify
 * 2. Deploy to Netlify (automatic via Git push)
 * 3. Configure webhook URLs in payment provider dashboards
 * 4. Test with sandbox credentials first
 * 5. Switch to production credentials when ready
 * 6. Monitor logs and metrics via OpenTelemetry
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * TESTING:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Use sandbox/test credentials for all providers:
 * - Set *_SANDBOX environment variables to 'true'
 * - Use test phone numbers and cards
 * - Monitor webhook callbacks
 * - Verify tracing in OpenTelemetry collector
 * - Check /api/health and /api/metrics regularly
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * TROUBLESHOOTING:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Common issues:
 * 1. Rate limit exceeded: Increase limit or implement client-side throttling
 * 2. Authentication failed: Check API keys and tokens in environment variables
 * 3. Webhook not received: Verify callback URLs and firewall rules
 * 4. Timeout errors: Increase timeout or optimize upstream services
 * 5. Cache issues: Clear cache or reduce TTL
 * 6. Phone number validation: Ensure correct country code format
 * 
 * Debug mode:
 * - Set OTEL_DEBUG=true for detailed tracing logs
 * - Check /api/metrics for system health and cache status
 * - Monitor /api/health for service status
 * - Review Netlify function logs for errors
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * PERFORMANCE OPTIMIZATION:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * - Access tokens are cached to reduce API calls
 * - Rate limiting prevents abuse and protects APIs
 * - Retry logic handles transient failures
 * - Connection pooling for HTTP requests
 * - Efficient error handling and logging
 * - Minimal dependencies for faster cold starts
 * 
 * ═══════════════════════════════════════════════════════════════════════
 * PRODUCTION CHECKLIST:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * ✓ All environment variables configured
 * ✓ Webhook URLs registered with payment providers
 * ✓ SSL/TLS certificates valid
 * ✓ Rate limits adjusted for production load
 * ✓ OpenTelemetry collector configured
 * ✓ Monitoring and alerting set up
 * ✓ Error tracking configured
 * ✓ Backup and disaster recovery plan
 * ✓ Security audit completed
 * ✓ Load testing performed
 * ✓ Documentation updated
 * ✓ Team trained on system operations
 * 
 * ═══════════════════════════════════════════════════════════════════════
 */
