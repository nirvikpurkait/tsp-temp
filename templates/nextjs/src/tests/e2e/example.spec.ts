import { test, expect } from "@playwright/test";

test("Template has title", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page).toHaveTitle(/Next.js Project Template/);
});

test.describe("Go to nextjs template home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("Go to docs page", async ({ page }) => {
    const newTab_docsPage = page.waitForEvent("popup");
    await page.getByRole("link", { name: "Read our docs" }).click();
    const docsPage = await newTab_docsPage;
    await docsPage.goto(
      "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    );
  });

  test("Go to learn page", async ({ page }) => {
    const newTab_learnPage = page.waitForEvent("popup");
    await page.getByRole("link", { name: "Learn" }).click();
    const learnpage = await newTab_learnPage;
    await learnpage.goto(
      "https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    );
  });

  test("Go to show sample template page", async ({ page }) => {
    const newTab_showTemplate = page.waitForEvent("popup");
    await page.getByRole("link", { name: "Examples" }).click();
    const showTemplatePage = await newTab_showTemplate;
    await showTemplatePage.goto(
      "https://vercel.com/templates?framework=next.js"
    );
  });

  test("Nextjs home page", async ({ page }) => {
    const newTab_nextJsHomePage = page.waitForEvent("popup");
    await page.getByRole("link", { name: "Go to nextjs.org →" }).click();
    const nextJsHomePage = await newTab_nextJsHomePage;
    await nextJsHomePage.goto(
      "https://nextjs.org/?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    );
  });
});
