import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Screenshot a canvas element from a webpage
 * @param url - The URL of the page containing the canvas
 * @param canvasSelector - CSS selector for the canvas element (default: 'canvas')
 * @param outputPath - Path where the screenshot will be saved
 */
async function screenshotCanvas(
  url: string,
  canvasSelector: string = 'canvas',
  outputPath: string = './canvas-screenshot.png'
) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the canvas element to be present
    await page.waitForSelector(canvasSelector);

    // Get the canvas element
    const canvasElement = await page.$(canvasSelector);

    if (!canvasElement) {
      throw new Error(`Canvas element not found with selector: ${canvasSelector}`);
    }

    // Take screenshot of the canvas element
    await canvasElement.screenshot({ path: outputPath as `${string}.png` | `${string}.jpeg` | `${string}.webp` });

    console.log(`✓ Canvas screenshot saved to: ${outputPath}`);

  } catch (error) {
    console.error('Error taking canvas screenshot:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: ts-node scripts/screenshot-canvas.ts <url> [canvasSelector] [outputPath]');
    console.log('Example: ts-node scripts/screenshot-canvas.ts https://example.com canvas ./output.png');
    process.exit(1);
  }

  const [url, canvasSelector, outputPath] = args;

  screenshotCanvas(url, canvasSelector, outputPath)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { screenshotCanvas };
