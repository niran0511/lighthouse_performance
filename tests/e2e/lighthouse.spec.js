import { expect, test } from '@playwright/test';

const apiBaseUrl = process.env.API_BASE_URL;

test.describe('Lighthouse Monitor API workflow', () => {
  test.skip(!apiBaseUrl, 'Set API_BASE_URL when an API and MongoDB are running for live end-to-end coverage.');

  test('rejects unsafe URL protocols and starts a valid public analysis', async ({ request }) => {
    const email = `e2e-${Date.now()}@example.test`;
    const registration = await request.post(`${apiBaseUrl}/api/auth/register`, { data: { name: 'E2E Monitor', email, password: 'a-secure-e2e-password' } });
    expect(registration.ok()).toBeTruthy();
    const { token } = await registration.json();
    const headers = { Authorization: `Bearer ${token}` };

    const unsafe = await request.post(`${apiBaseUrl}/api/scans`, { headers, data: { url: 'file:///etc/passwd' } });
    expect(unsafe.status()).toBe(400);

    const created = await request.post(`${apiBaseUrl}/api/scans`, { headers, data: { url: 'https://example.com' } });
    expect(created.status()).toBe(202);
    const { scan } = await created.json();
    expect(scan.status).toBe('PENDING');
  });
});

