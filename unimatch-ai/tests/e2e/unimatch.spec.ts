import { expect, test } from "@playwright/test";

test.describe("UniMatch AI core flows", () => {
  test("homepage smoke test", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/UniMatch AI/);
    await expect(page.getByRole("button", { name: "UniMatch AI" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Find my match" }).first(),
    ).toBeVisible();
  });

  test("catalog loads programs and filters", async ({ page }) => {
    await page.goto("/");

    const catalog = page.locator("#universities");
    await expect(
      catalog.getByRole("heading", { name: "Explore universities and programs" }),
    ).toBeVisible();
    await expect(catalog.getByLabel("Filter by country")).toBeVisible();
    await expect(catalog.getByLabel("Filter by field")).toBeVisible();
    await expect(catalog.getByRole("article").first()).toBeVisible();
  });

  test("catalog filter keeps results in a valid state", async ({ page }) => {
    await page.goto("/");

    const catalog = page.locator("#universities");
    await catalog.getByLabel("Filter by field").selectOption("Computer Science");

    await expect(catalog.getByText(/matching programs/i).first()).toBeVisible();
    await expect(
      catalog
        .getByRole("article")
        .filter({ hasText: /computer science|computing|software/i })
        .first(),
    ).toBeVisible();
  });

  test("student profile produces ranked admission recommendations", async ({
    page,
  }) => {
    await page.goto("/");

    const profile = page.locator("#match-score");
    await profile.getByLabel("Intended field").fill("Computer Science");
    await profile.getByRole("group", { name: "Degree level" }).getByRole(
      "button",
      { name: "Bachelor" },
    ).click();
    await profile.getByLabel("GPA").fill("3.6");
    await profile.getByLabel("IELTS").fill("6.5");
    await profile.getByLabel("Max annual tuition budget").fill("35000");
    await profile.getByRole("button", { name: "Calculate fit" }).click();

    const results = page.locator("#results");
    await expect(results.getByText(/ranked matches/i)).toBeVisible();
    await expect(results.getByText(/match score/i).first()).toBeVisible();
    await expect(results.getByText(/Rank #1/i)).toBeVisible();
  });

  test("compare shortlist updates after adding two programs", async ({ page }) => {
    await page.goto("/");

    const catalog = page.locator("#universities");
    await catalog.getByRole("button", { name: "Add to compare" }).first().click();
    await catalog.getByRole("button", { name: "Add to compare" }).first().click();

    const compare = page.locator("#compare");
    await expect(compare.getByRole("button", { name: "Generate AI comparison" })).toBeEnabled();
    await expect(compare.getByRole("article")).toHaveCount(2);
  });

  test("AI advisor returns a catalog-grounded answer without real OpenAI", async ({
    page,
  }) => {
    await page.goto("/");

    const advisor = page.locator("#ai-advisor");
    await advisor
      .getByLabel("Your question")
      .fill("Which computer science programs should I consider first?");
    await advisor.getByRole("button", { name: "Ask advisor" }).click();

    await expect(
      advisor.getByRole("heading", { name: "Advisor answer" }),
    ).toBeVisible({ timeout: 20_000 });
    await expect(advisor.getByText("Catalog-based answer")).toBeVisible();
    await expect(
      advisor.locator("p").filter({
        hasText:
          /^This guidance is based on available program data\. Always verify final requirements on official university pages\.$/,
      }),
    ).toBeVisible();
  });
});
