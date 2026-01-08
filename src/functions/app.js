// Auth Service - Enterprise-Grade Authentication Microservice
// Mode D: Production-Ready with Vault, OpenTelemetry, Rate Limiting

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redis = require('redis');
const { Vault } = require('node-vault');
const { trace, context, SpanStatusCode } = require('@opentelemetry/api');
const prometheus = require('prom-client');

const app = express();
app.use(express.json());

// ==================== CONFIGURATION ====================
const PORT = process.env.PORT || 3001;
const JWT_SECRET_PATH = process.env.VAULT_JWT_SECRET_PATH || 'secret/data/jwt';
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const VAULT_ADDR = process.env.VAULT_ADDR || 'http://vault:8200';
const VAULT_TOKEN = process.env.VAULT_TOKEN;

// ==================== VAULT CLIENT ====================
const vault = Vault({
  apiVersion: 'v1',
  endpoint: VAULT_ADDR,
  token: VAULT_TOKEN
});

let JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-dev-only';

// Load JWT secret from Vault on startup
async function loadSecretsFromVault() {
  try {
    const result = await vault.read(JWT_SECRET_PATH);
    JWT_SECRET = result.data.data.secret;
    console.log('✅ JWT Secret loaded from Vault');
  } catch (error) {
    console.error('⚠️  Vault connection failed, using fallback secret:', error.message);
  }
}

// ==================== REDIS CLIENT ====================
const redisClient = redis.createClient({ url: REDIS_URL });
redisClient.on('error', (err) => console.error('Redis Error:', err));
redisClient.connect();

// ==================== PROMETHEUS METRICS ====================
const register = new prometheus.Registry();
prometheus.collectDefaultMetrics({ register });

const loginCounter = new prometheus.Counter({
  name: 'auth_login_attempts_total',
  help: 'Total number of login attempts',
  labelNames: ['status'],
  registers: [register]
});

const tokenCounter = new prometheus.Counter({
  name: 'auth_token_validations_total',
  help: 'Total number of token validations',
  labelNames: ['status'],
  registers: [register]
});

// ==================== OPENTELEMETRY TRACING ====================
const tracer = trace.getTracer('auth-service', '1.0.0');

// ==================== IN-MEMORY USER STORE (Replace with DB) ====================
const users = new Map();

// ==================== RATE LIMITING ====================
async function rateLimitCheck(identifier, maxAttempts = 5, windowSeconds = 300) {
  const key = `ratelimit:${identifier}`;
  const attempts = await redisClient.get(key);
  
  if (attempts && parseInt(attempts) >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  await redisClient.incr(key);
  await redisClient.expire(key, windowSeconds);
  return true;
}

// ==================== MIDDLEWARE: REQUEST TRACING ====================
app.use((req, res, next) => {
  const span = tracer.startSpan(`${req.method} ${req.path}`);
  context.with(trace.setSpan(context.active(), span), () => {
    res.on('finish', () => {
      span.setStatus({ code: res.statusCode < 400 ? SpanStatusCode.OK : SpanStatusCode.ERROR });
      span.end();
    });
    next();
  });
});

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'auth-service',
    timestamp: new Date().toISOString()
  });
});

// ==================== METRICS ENDPOINT ====================
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// ==================== REGISTER USER ====================
app.post('/register', async (req, res) => {
  const span = tracer.startSpan('register-user');
  
  try {
    const { username, password, phone, role = 'user' } = req.body;
    
    if (!username || !password || !phone) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'Missing fields' });
      return res.status(400).json({ error: 'Username, password, and phone required' });
    }
    
    if (users.has(username)) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'User exists' });
      return res.status(409).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    users.set(username, {
      username,
      password: hashedPassword,
      phone,
      role,
      createdAt: new Date().toISOString()
    });
    
    span.setStatus({ code: SpanStatusCode.OK });
    res.status(201).json({ 
      message: 'User registered successfully',
      username,
      phone
    });
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    span.end();
  }
});

// ==================== LOGIN ====================
app.post('/login', async (req, res) => {
  const span = tracer.startSpan('login');
  
  try {
    const { username, password } = req.body;
    
    // Rate limiting
    const allowed = await rateLimitCheck(`login:${username}`);
    if (!allowed) {
      loginCounter.inc({ status: 'rate_limited' });
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'Rate limited' });
      return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
    }
    
    const user = users.get(username);
    if (!user) {
      loginCounter.inc({ status: 'failed' });
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'User not found' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      loginCounter.inc({ status: 'failed' });
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'Invalid password' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { username: user.username, role: user.role, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Store token in Redis for revocation capability
    await redisClient.setEx(`token:${username}`, 86400, token);
    
    loginCounter.inc({ status: 'success' });
    span.setStatus({ code: SpanStatusCode.OK });
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { username: user.username, role: user.role, phone: user.phone }
    });
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    res.status(500).json({ error: 'Login failed' });
  } finally {
    span.end();
  }
});

// ==================== VALIDATE TOKEN ====================
app.post('/validate', async (req, res) => {
  const span = tracer.startSpan('validate-token');
  
  try {
    const { token } = req.body;
    
    if (!token) {
      tokenCounter.inc({ status: 'missing' });
      return res.status(400).json({ error: 'Token required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token is revoked
    const storedToken = await redisClient.get(`token:${decoded.username}`);
    if (storedToken !== token) {
      tokenCounter.inc({ status: 'revoked' });
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'Token revoked' });
      return res.status(401).json({ error: 'Token revoked or expired' });
    }
    
    tokenCounter.inc({ status: 'valid' });
    span.setStatus({ code: SpanStatusCode.OK });
    
    res.json({ 
      valid: true,
      user: decoded
    });
  } catch (error) {
    tokenCounter.inc({ status: 'invalid' });
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    res.status(401).json({ error: 'Invalid token' });
  } finally {
    span.end();
  }
});

// ==================== LOGOUT (Token Revocation) ====================
app.post('/logout', async (req, res) => {
  const span = tracer.startSpan('logout');
  
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    
    await redisClient.del(`token:${decoded.username}`);
    
    span.setStatus({ code: SpanStatusCode.OK });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    span.recordException(error);
    res.status(500).json({ error: 'Logout failed' });
  } finally {
    span.end();
  }
});

// ==================== REFRESH TOKEN ====================
app.post('/refresh', async (req, res) => {
  const span = tracer.startSpan('refresh-token');
  
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    
    const newToken = jwt.sign(
      { username: decoded.username, role: decoded.role, phone: decoded.phone },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    await redisClient.setEx(`token:${decoded.username}`, 86400, newToken);
    
    span.setStatus({ code: SpanStatusCode.OK });
    res.json({ token: newToken });
  } catch (error) {
    span.recordException(error);
    res.status(401).json({ error: 'Token refresh failed' });
  } finally {
    span.end();
  }
});

// ==================== SERVER STARTUP ====================
async function startServer() {
  await loadSecretsFromVault();
  
  app.listen(PORT, () => {
    console.log(`🔐 Auth Service running on port ${PORT}`);
    console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
    console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  });
}

startServer().catch(console.error);

module.exports = app;
