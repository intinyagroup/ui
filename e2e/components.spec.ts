import { expect, test } from "@playwright/test";

const harness = "/index.html";

test.describe("component browser smoke flows", () => {
  test("calendar date selection and event creation work", async ({ page }) => {
    await page.goto(harness);
    await page.getByRole("button", { name: "September 11, 2026" }).click();
    await expect(page.locator("#calendar-status")).toContainText(
      "Selected September 11, 2026",
    );
    await page.getByRole("button", { name: "Add Event" }).click();
    await page.getByLabel("Event title").fill("Planning");
    await page.getByRole("button", { name: "Save Event" }).click();
    await expect(page.locator("#calendar-status")).toContainText(
      "Created Planning",
    );
  });

  test("DataTable keeps default columns stable without resize affordances", async ({
    page,
  }) => {
    await page.goto(harness);
    await expect(
      page.getByRole("columnheader", { name: "Name" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Email" }),
    ).toBeVisible();
    await expect(
      page.locator(
        '[data-testid*="resize"], .resize-handle, [aria-label*="Resize"]',
      ),
    ).toHaveCount(0);
  });

  test("rich text editor accepts typing and exposes toolbar controls", async ({
    page,
  }) => {
    await page.goto(harness);
    const editor = page.getByRole("textbox", { name: "Editor" });
    await editor.fill("Browser smoke text");
    await expect(editor).toContainText("Browser smoke text");
    await expect(
      page.getByRole("toolbar", { name: "Rich text toolbar" }),
    ).toBeVisible();
  });

  test("Kanban card supports drag interaction", async ({ page }) => {
    await page.goto(harness);
    await page
      .locator("#card-a")
      .dragTo(page.getByRole("region", { name: "Done" }));
    await expect(page.locator("#kanban-status")).toHaveText("Card in Done");
  });

  test("theme state uses data-ui-theme and dark class selector", async ({
    page,
  }) => {
    await page.goto(harness);
    await page.getByRole("button", { name: "Toggle dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-ui-theme", "dark");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
