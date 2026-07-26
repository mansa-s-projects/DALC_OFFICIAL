import { test, expect } from '@playwright/test';

test('loads the DALC home page', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle(/Dubai|DALC/i);
  await expect(page.locator('body')).toBeVisible();
});

test('loads the application login screen', async ({ page }) => {
  const response = await page.goto('/auth/login?from=%2Fadmin');

  expect(response?.ok()).toBe(true);
  await expect(page.getByText('Sign In', { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
});
