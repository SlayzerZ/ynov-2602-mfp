import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';

test('has sign up page', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByText("Create Account")).toBeVisible();
});

test('Do an sign up procedure', async ({ page }) => {
    const form = { email: faker.internet.email(), password: faker.internet.password() }
    console.log("User Data: ", form);
    await page.goto('http://localhost:5173/');

    await page.getByRole('button', { name: 'Sign up' }).click();

    await page.getByLabel('Email Address').fill(form.email);
    await page.getByLabel('Password').fill(form.password);

    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(page.getByText('Address Management')).toBeVisible();
});

test('Do an sign in procedure', async ({ page }) => {
    const form = { email: "mac@mac.com", password: "azertyuiop" }
    console.log("User Data: ", form);
    await page.goto('http://localhost:5173/');

    await page.getByLabel('Email Address').fill(form.email);
    await page.getByLabel('Password').fill(form.password);

    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Address Management')).toBeVisible();
});