import {
  test,
  expect,
  type Page,
  type Locator,
  type BrowserContext,
} from "@playwright/test";

// Generate unique test data
const timestamp = Date.now();
const validCourseData = {
  title: `Test Course Title ${timestamp}`, // Min 3, max 100 chars
  description: "This is a detailed description of the test course that meets the minimum length requirement", // Min 10, max 500 chars
  category: "Marketing" // From seeded categories
};

const validLessonData = {
  title: `Test Lesson Title ${timestamp}`, // Min 3, max 100 chars
  preAmble: "This is a lesson introduction that meets the minimum length requirement", // Min 10, max 200 chars
  text: "This is the main content of the lesson that needs to be at least 10 characters long" // Min 10 chars
};

// Backend API URL
const API_URL = "http://localhost:3999/api/v1";

// Increased timeouts to match API_CONFIG
const VALIDATION_TIMEOUT = 30000;
const API_TIMEOUT = 30000;

test.describe("Oppgave 1 Create", () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test.beforeEach(async () => {
    // Using baseURL from playwright.config.ts
    await page.goto("/ny");
    
    // Wait for categories to load with better error handling
    try {
      // First wait for the API response
      await page.waitForResponse(
        response => 
          response.url().includes(`${API_URL}/categories`) && 
          response.status() === 200,
        { timeout: API_TIMEOUT }
      );

      // Then wait for the select to be populated and enabled
      await page.waitForSelector('select[data-testid="form_category"]:not([disabled])', {
        state: 'attached',
        timeout: API_TIMEOUT
      });

      // Wait for at least one option besides the default to be present
      await page.waitForSelector('select[data-testid="form_category"] option:not([value=""]):not(:disabled)', {
        state: 'attached',
        timeout: API_TIMEOUT
      });
    } catch (error) {
      console.error('Category loading error:', error);
      throw error;
    }
  });

  test.describe("When showing create page", () => {
    test("Should show loading state while fetching categories", async () => {
      await page.goto("/ny"); // Fresh load to see loading state
      const categorySelect = await page.getByTestId('form_category');
      await expect(categorySelect).toBeDisabled();
      
      // Wait for categories with better error handling
      await page.waitForResponse(
        response => 
          response.url().includes(`${API_URL}/categories`) && 
          response.status() === 200,
        { timeout: API_TIMEOUT }
      );

      // Wait for select to be enabled
      await expect(categorySelect).toBeEnabled({ timeout: API_TIMEOUT });
    });

    test("Should show error message if categories fail to load", async () => {
      // Mock failed API response
      await page.route(`${API_URL}/categories`, route => route.abort());
      await page.goto("/ny");
      const error = await page.getByText(/Kunne ikke laste kategorier/);
      await expect(error).toBeVisible();
    });

    test("Should disable form fields when form is disabled", async () => {
      await page.getByTestId('form_title').fill(validCourseData.title);
      await page.getByTestId('form_description').fill(validCourseData.description);
      await page.getByTestId('form_category').selectOption({ label: validCourseData.category });
      await page.getByRole('button', { name: 'Neste steg' }).click();
      await page.getByRole('button', { name: 'Publiser kurs' }).click();
      
      // Fields should be disabled during submission
      await expect(page.getByTestId('form_title')).toBeDisabled();
      await expect(page.getByTestId('form_description')).toBeDisabled();
      await expect(page.getByTestId('form_category')).toBeDisabled();
    });

    test("Should have test-id steps", async () => {
      const steps = await page.getByText("Kursdetaljer");
      await expect(steps).toBeVisible();
    });

    test("Should have test-id form", async () => {
      const form = await page.getByTestId('form');
      await expect(form).toBeVisible();
    });

    test("Should have test-id title", async () => {
      const title = await page.getByTestId('title');
      await expect(title).toBeVisible();
      await expect(title).toHaveText('Lag nytt kurs');
    });

    test("Should have test-id course_step", async () => {
      const courseStep = await page.getByTestId('course_step');
      await expect(courseStep).toBeVisible();
    });

    test("Should have test-id form_title", async () => {
      const titleInput = await page.getByTestId('form_title');
      await expect(titleInput).toBeVisible();
    });

    test("Should have test-id form_description", async () => {
      const descriptionInput = await page.getByTestId('form_description');
      await expect(descriptionInput).toBeVisible();
    });

    test("Should have test-id form_category", async () => {
      const categoryInput = await page.getByTestId('form_category');
      await expect(categoryInput).toBeVisible();
    });

    test("Should populate category select with options", async () => {
      // Wait for the select element to be enabled
      const categorySelect = await page.getByTestId('form_category');
      await expect(categorySelect).toBeEnabled({ timeout: API_TIMEOUT });

      // Wait for the API response
      await page.waitForResponse(
        response => 
          response.url().includes(`${API_URL}/categories`) && 
          response.status() === 200,
        { timeout: API_TIMEOUT }
      );

      // Wait for at least one option besides the default to be present
      await page.waitForSelector('select[data-testid="form_category"] option:not([value=""]):not(:disabled)', {
        state: 'attached',
        timeout: API_TIMEOUT
      });

      // Get all options
      const options = await categorySelect.locator('option').all();
      
      // Verify we have more than just the default option
      expect(options.length).toBeGreaterThan(1);

      // Get all option texts
      const optionTexts = await Promise.all(options.map(option => option.textContent()));
      
      // Verify the marketing category exists
      expect(optionTexts).toContain(validCourseData.category);
    });
  });

  test.describe("When stepping from first to second step", () => {
    test("Should show error if any required field are missing", async () => {
      await page.getByRole('button', { name: 'Neste steg' }).click();
      const titleError = await page.getByText('Tittel er påkrevd');
      const descriptionError = await page.getByText('Beskrivelse er påkrevd');
      const categoryError = await page.getByText('Kategori er påkrevd');
      await expect(titleError).toBeVisible();
      await expect(descriptionError).toBeVisible();
      await expect(categoryError).toBeVisible();
    });

    test("Should show error if title is too short", async () => {
      await page.getByTestId('form_title').fill('Ab'); // Less than min 3 chars
      await page.getByTestId('form_description').fill(validCourseData.description);
      await page.getByTestId('form_category').selectOption({ label: validCourseData.category });
      await page.getByRole('button', { name: 'Neste steg' }).click();
      const error = await page.getByText('Tittel må være minst 3 tegn');
      await expect(error).toBeVisible();
    });

    test("Should show error if description is too short", async () => {
      await page.getByTestId('form_title').fill(validCourseData.title);
      await page.getByTestId('form_description').fill('Too short'); // Less than min 10 chars
      await page.getByTestId('form_category').selectOption({ label: validCourseData.category });
      await page.getByRole('button', { name: 'Neste steg' }).click();
      const error = await page.getByText('Beskrivelse må være minst 10 tegn');
      await expect(error).toBeVisible();
    });

    test("Should show error if category is missing", async () => {
      await page.getByTestId('form_title').fill(validCourseData.title);
      await page.getByTestId('form_description').fill(validCourseData.description);
      await page.getByRole('button', { name: 'Neste steg' }).click();
      const error = await page.getByText('Kategori er påkrevd');
      await expect(error).toBeVisible();
    });

    test("Should not show error if all fields are valid", async () => {
      // Wait for the category select to be enabled
      const categorySelect = await page.getByTestId('form_category');
      await expect(categorySelect).toBeEnabled({ timeout: API_TIMEOUT });

      // Fill in the form
      await page.getByTestId('form_title').fill(validCourseData.title);
      await page.getByTestId('form_description').fill(validCourseData.description);
      await page.getByTestId('form_category').selectOption({ label: validCourseData.category });
      
      // Click next step
      await page.getByRole('button', { name: 'Neste steg' }).click();
      
      // Verify no validation errors are shown
      const error = await page.getByText(/er påkrevd|må være minst|kan ikke være mer enn/);
      await expect(error).not.toBeVisible();
    });
  });

  test.describe("When at step two", () => {
    test.beforeEach(async () => {
      // Wait for the category select to be enabled
      const categorySelect = await page.getByTestId('form_category');
      await expect(categorySelect).toBeEnabled({ timeout: API_TIMEOUT });

      await page.getByTestId('form_title').fill(validCourseData.title);
      await page.getByTestId('form_description').fill(validCourseData.description);
      await page.getByTestId('form_category').selectOption({ label: validCourseData.category });
      await page.getByRole('button', { name: 'Neste steg' }).click();
    });

    test("Should show error if no lessons are added", async () => {
      // Wait for the error message to be added to the DOM
      await page.waitForSelector('text=Minst én leksjon er påkrevd', { state: 'visible', timeout: VALIDATION_TIMEOUT });
      const error = await page.getByText('Minst én leksjon er påkrevd');
      await expect(error).toBeVisible();
    });

    test("Should have disabled submit btn", async () => {
      const submitButton = await page.getByRole('button', { name: 'Publiser kurs' });
      await expect(submitButton).toBeDisabled();
    });

    test("Should have test-id lessons", async () => {
      const lessons = await page.getByTestId('lessons');
      await expect(lessons).toBeVisible();
    });

    test("Should have test-id form_lesson_add", async () => {
      const addButton = await page.getByRole('button', { name: 'Legg til leksjon' });
      await expect(addButton).toBeVisible();
    });
  });

  test.describe("When added new lesson", () => {
    test.beforeEach(async () => {
      // Wait for the category select to be enabled
      const categorySelect = await page.getByTestId('form_category');
      await expect(categorySelect).toBeEnabled({ timeout: API_TIMEOUT });

      await page.getByTestId('form_title').fill(validCourseData.title);
      await page.getByTestId('form_description').fill(validCourseData.description);
      await page.getByTestId('form_category').selectOption({ label: validCourseData.category });
      await page.getByRole('button', { name: 'Neste steg' }).click();
      await page.getByRole('button', { name: 'Legg til leksjon' }).click();
    });

    test("Should show error if lesson title is too short", async () => {
      await page.getByTestId('form_lesson_title').fill('Ab'); // Less than min 3 chars
      await page.getByTestId('form_lesson_preamble').fill(validLessonData.preAmble);
      await page.locator('.ProseMirror').fill(validLessonData.text);
      // Wait for validation to complete
      await page.waitForSelector('text=Leksjonstittel må være minst 3 tegn', { state: 'visible', timeout: VALIDATION_TIMEOUT });
      const error = await page.getByText('Leksjonstittel må være minst 3 tegn');
      await expect(error).toBeVisible();
    });

    test("Should show error if lesson preAmble is too short", async () => {
      await page.getByTestId('form_lesson_title').fill(validLessonData.title);
      await page.getByTestId('form_lesson_preamble').fill('Too short'); // Less than min 10 chars
      await page.locator('.ProseMirror').fill(validLessonData.text);
      // Wait for validation to complete
      await page.waitForSelector('text=Ingress må være minst 10 tegn', { state: 'visible', timeout: VALIDATION_TIMEOUT });
      const error = await page.getByText('Ingress må være minst 10 tegn');
      await expect(error).toBeVisible();
    });

    test("Should show error if lesson text is too short", async () => {
      await page.getByTestId('form_lesson_title').fill(validLessonData.title);
      await page.getByTestId('form_lesson_preamble').fill(validLessonData.preAmble);
      
      // Wait for editor to be ready
      await page.waitForSelector('.ProseMirror', { state: 'visible', timeout: API_TIMEOUT });
      await page.locator('.ProseMirror').fill('Short'); // Less than min 10 chars
      
      // Wait for validation to complete
      await page.waitForSelector('text=Innhold må være minst 10 tegn', { state: 'visible', timeout: VALIDATION_TIMEOUT });
      const error = await page.getByText('Innhold må være minst 10 tegn');
      await expect(error).toBeVisible();
    });

    test("Should not show error if all lesson fields are valid", async () => {
      await page.getByTestId('form_lesson_title').fill(validLessonData.title);
      await page.getByTestId('form_lesson_preamble').fill(validLessonData.preAmble);
      await page.locator('.ProseMirror').fill(validLessonData.text);
      const error = await page.getByText(/er påkrevd|må være minst|kan ikke være mer enn/);
      await expect(error).not.toBeVisible();
    });
  });

  test.describe("When using lesson editor", () => {
    test.beforeEach(async () => {
      // Wait for the category select to be enabled
      const categorySelect = await page.getByTestId('form_category');
      await expect(categorySelect).toBeEnabled({ timeout: API_TIMEOUT });

      await page.getByTestId('form_title').fill(validCourseData.title);
      await page.getByTestId('form_description').fill(validCourseData.description);
      await page.getByTestId('form_category').selectOption({ label: validCourseData.category });
      await page.getByRole('button', { name: 'Neste steg' }).click();
      await page.getByRole('button', { name: 'Legg til leksjon' }).click();
      
      // Wait for editor to be ready
      await page.waitForSelector('.ProseMirror', { state: 'visible', timeout: API_TIMEOUT });
    });

    test("Should switch between editor types", async () => {
      // Default is TipTap editor
      await expect(page.locator('.ProseMirror')).toBeVisible();

      // Switch to textarea
      await page.selectOption('select', 'textarea');
      await expect(page.locator('textarea')).toBeVisible();
      await expect(page.locator('.ProseMirror')).not.toBeVisible();

      // Switch back to TipTap
      await page.selectOption('select', 'tiptap');
      await expect(page.locator('.ProseMirror')).toBeVisible();
      await expect(page.locator('textarea')).not.toBeVisible();
    });

    test("Should disable editor when form is disabled", async () => {
      await page.getByTestId('form_lesson_title').fill(validLessonData.title);
      await page.getByTestId('form_lesson_preamble').fill(validLessonData.preAmble);
      await page.locator('.ProseMirror').fill(validLessonData.text);
      await page.getByRole('button', { name: 'Publiser kurs' }).click();

      // Editor should be disabled during submission
      const editor = page.locator('.ProseMirror');
      await expect(editor).toHaveAttribute('contenteditable', 'false', { timeout: VALIDATION_TIMEOUT });
    });

    test("Should handle editor value changes", async () => {
      const testText = "This is a test content";
      await page.locator('.ProseMirror').fill(testText);
      
      // Value should be updated in the editor
      const editor = page.locator('.ProseMirror');
      await expect(editor).toContainText(testText);

      // Submit button should be enabled when all fields are valid
      const submitButton = await page.getByRole('button', { name: 'Publiser kurs' });
      await page.getByTestId('form_lesson_title').fill(validLessonData.title);
      await page.getByTestId('form_lesson_preamble').fill(validLessonData.preAmble);
      await expect(submitButton).not.toBeDisabled();
    });

    test("Should show error for invalid editor content", async () => {
      await page.getByTestId('form_lesson_title').fill(validLessonData.title);
      await page.getByTestId('form_lesson_preamble').fill(validLessonData.preAmble);
      
      // Wait for editor to be ready
      await page.waitForSelector('.ProseMirror', { state: 'visible', timeout: API_TIMEOUT });
      await page.locator('.ProseMirror').fill('Short'); // Less than min 10 chars
      
      // Wait for validation to complete
      await page.waitForSelector('text=Innhold må være minst 10 tegn', { state: 'visible', timeout: VALIDATION_TIMEOUT });
      const error = await page.getByText('Innhold må være minst 10 tegn');
      await expect(error).toBeVisible();
    });

    test("Should preserve editor content when switching types", async () => {
      const testText = "This is a test content that should be preserved";
      
      // Wait for editor to be ready
      await page.waitForSelector('.ProseMirror', { state: 'visible', timeout: API_TIMEOUT });
      await page.locator('.ProseMirror').fill(testText);

      // Switch to textarea
      await page.selectOption('select', 'textarea');
      const textarea = page.locator('textarea');
      await expect(textarea).toHaveValue(testText);

      // Switch back to TipTap
      await page.selectOption('select', 'tiptap');
      const editor = page.locator('.ProseMirror');
      await expect(editor).toContainText(testText);
    });
  });

  test.describe("When created new course", () => {
    test.beforeEach(async () => {
      // Wait for the category select to be enabled
      const categorySelect = await page.getByTestId('form_category');
      await expect(categorySelect).toBeEnabled({ timeout: API_TIMEOUT });

      await page.getByTestId('form_title').fill(validCourseData.title);
      await page.getByTestId('form_description').fill(validCourseData.description);
      await page.getByTestId('form_category').selectOption({ label: validCourseData.category });
      await page.getByRole('button', { name: 'Neste steg' }).click();
      await page.getByRole('button', { name: 'Legg til leksjon' }).click();
      await page.getByTestId('form_lesson_title').fill(validLessonData.title);
      await page.getByTestId('form_lesson_preamble').fill(validLessonData.preAmble);
      await page.locator('.ProseMirror').fill(validLessonData.text);
    });

    test("Should show success message when submitted", async () => {
      await page.getByRole('button', { name: 'Publiser kurs' }).click();
      // Wait for success message
      await page.waitForSelector('text=Kurset er opprettet!', { state: 'visible', timeout: VALIDATION_TIMEOUT });
      const success = await page.getByText('Kurset er opprettet!');
      await expect(success).toBeVisible();
    });

    test("Should redirect to courses page when submitted", async () => {
      await page.getByRole('button', { name: 'Publiser kurs' }).click();
      // Wait for success message first
      await page.waitForSelector('text=Kurset er opprettet!', { state: 'visible', timeout: VALIDATION_TIMEOUT });
      // Then wait for redirect
      await page.waitForURL(/\/kurs$/, { timeout: API_TIMEOUT });
      await expect(page).toHaveURL(/\/kurs$/);
    });

    test("Should get success response from server", async () => {
      const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes(`${API_URL}/courses`) && response.status() === 201),
        page.getByRole('button', { name: 'Publiser kurs' }).click()
      ]);
      expect(response.status()).toBe(201);
    });

    test("Should get correct data from server", async () => {
      const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes(`${API_URL}/courses`)),
        page.getByRole('button', { name: 'Publiser kurs' }).click()
      ]);
      const data = await response.json();
      expect(data.data).toHaveProperty('id');
      expect(data.data.title).toBe(validCourseData.title);
      expect(data.data.description).toBe(validCourseData.description);
      expect(data.data.lessons[0].title).toBe(validLessonData.title);
    });
  });
});
