import { expect, test } from '@playwright/test';

const credentialsAvailable = Boolean(process.env.HORIZON_USERNAME && process.env.HORIZON_PASSWORD);

async function openLoginPage(page) {
  await page.goto(process.env.HORIZON_LOGIN_PATH || '/languages');
  const emailCandidate = page.getByLabel(/email|username/i).or(page.getByPlaceholder(/email|username/i));
  if (await emailCandidate.count()) return;

  const signInNavigation = page.getByRole('link', { name: /sign in|log in|login/i })
    .or(page.getByRole('button', { name: /sign in|log in|login/i }));
  await expect(signInNavigation.first()).toBeVisible();
  await signInNavigation.first().click();
}

async function loginControls(page) {
  const email = page.getByLabel(/email|username/i).or(page.getByPlaceholder(/email|username/i)).first();
  const password = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i)).first();
  const submit = page.getByRole('button', { name: /sign in|log in|login/i }).first();
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await expect(submit).toBeVisible();
  return { email, password, submit };
}

test.describe('Horizon Broadband login', () => {
  test.beforeEach(async ({ page }) => {
    await openLoginPage(page);
  });

  test('displays a usable login form', async ({ page }) => {
    const { email, password, submit } = await loginControls(page);
    await expect(email).toBeEditable();
    await expect(password).toBeEditable();
    await expect(submit).toBeVisible();
  });

  test('validates missing credentials', async ({ page }) => {
    const { submit } = await loginControls(page);
    if (await submit.isEnabled()) await submit.click();
    await expect(page.getByRole('alert').or(page.getByText(/required|enter.*(email|password)|invalid/i)).first()).toBeVisible();
  });

  test('rejects invalid credentials', async ({ page }) => {
    const { email, password, submit } = await loginControls(page);
    await email.fill('invalid-user@example.com');
    await password.fill('not-a-valid-password');
    await submit.click();
    await expect(page.getByRole('alert').or(page.getByText(/invalid|incorrect|failed|unable/i)).first()).toBeVisible();
  });

  test('authenticates with configured Horizon credentials', async ({ page }) => {
    test.skip(!credentialsAvailable, 'HORIZON_USERNAME and HORIZON_PASSWORD are required for the positive login case.');
    const { email, password, submit } = await loginControls(page);
    await email.fill(process.env.HORIZON_USERNAME);
    await password.fill(process.env.HORIZON_PASSWORD);
    await submit.click();
    await expect(page.getByRole('button', { name: /logout|sign out|profile|account/i }).or(page.getByText(/welcome|my account|dashboard/i)).first()).toBeVisible({ timeout: 15_000 });
  });
});

