import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Scan } from '../src/models/Scan.js';

let mongo;
let app;
const fakeLighthouseReport = {
  performanceScore: 86, accessibilityScore: 98, bestPracticesScore: 92, seoScore: 100, pwaScore: null,
  metrics: { fcp: 1.2, lcp: 2.1, cls: 0.01, tbt: 42, speedIndex: 1.7 }, audits: [], rawAudits: {}, lighthouseVersion: 'test',
};

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const scanService = new (await import('../src/services/scan-service.js')).ScanService({
    validateTarget: async (url) => url,
    lighthouseRunner: async () => fakeLighthouseReport,
  });
  app = createApp({ scanService });
});

afterEach(async () => { await Promise.all([User.deleteMany({}), Scan.deleteMany({})]); });
afterAll(async () => { await mongoose.disconnect(); await mongo.stop(); });

async function registerAndGetToken() {
  const response = await request(app).post('/api/auth/register').send({ name: 'Taylor QA', email: 'taylor@example.com', password: 'a-secure-password' });
  return response.body.token;
}

describe('authentication API', () => {
  it('registers, logs in, and restores the authenticated user', async () => {
    const registration = await request(app).post('/api/auth/register').send({ name: 'Taylor QA', email: 'taylor@example.com', password: 'a-secure-password' }).expect(201);
    expect(registration.body.user).toMatchObject({ name: 'Taylor QA', email: 'taylor@example.com' });
    const login = await request(app).post('/api/auth/login').send({ email: 'taylor@example.com', password: 'a-secure-password' }).expect(200);
    await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`).expect(200);
  });

  it('rejects duplicate registration and invalid passwords', async () => {
    await registerAndGetToken();
    await request(app).post('/api/auth/register').send({ name: 'Another Person', email: 'taylor@example.com', password: 'a-secure-password' }).expect(409);
    await request(app).post('/api/auth/login').send({ email: 'taylor@example.com', password: 'wrong-password' }).expect(401);
  });
});

describe('scan API', () => {
  it('requires authentication and validates unsafe URLs', async () => {
    await request(app).post('/api/scans').send({ url: 'https://example.com' }).expect(401);
    const token = await registerAndGetToken();
    const invalid = await request(app).post('/api/scans').set('Authorization', `Bearer ${token}`).send({ url: 'file:///etc/passwd' }).expect(400);
    expect(invalid.body.errorCode).toBe('UNSUPPORTED_URL_PROTOCOL');
  });

  it('queues a valid scan and persists its completed report', async () => {
    const token = await registerAndGetToken();
    const created = await request(app).post('/api/scans').set('Authorization', `Bearer ${token}`).send({ url: 'https://example.com' }).expect(202);
    expect(created.body.scan.status).toBe('PENDING');
    await new Promise((resolve) => setTimeout(resolve, 30));
    const report = await request(app).get(`/api/scans/${created.body.scan._id}`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(report.body.scan).toMatchObject({ status: 'COMPLETED', performanceScore: 86 });
  });
});

