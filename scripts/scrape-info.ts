import puppeteer from 'puppeteer';

/**
 * Scrape information from a webpage
 * @param url - The URL to scrape
 * @param selector - CSS selector for elements to scrape
 * @returns Array of scraped text content
 */
async function scrapeInfo(url: string, selector?: string): Promise<any> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    let scrapedData: any;

    if (selector) {
      // Scrape specific elements
      await page.waitForSelector(selector);

      scrapedData = await page.evaluate((sel) => {
        const elements = Array.from(document.querySelectorAll(sel));
        return elements.map(el => ({
          text: el.textContent?.trim() || '',
          html: el.innerHTML,
          tagName: el.tagName.toLowerCase(),
          attributes: Array.from(el.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          }, {} as Record<string, string>)
        }));
      }, selector);

    } else {
      // Scrape general page information
      scrapedData = await page.evaluate(() => ({
        title: document.title,
        url: window.location.href,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        headings: {
          h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent?.trim()),
          h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent?.trim()),
        },
        links: Array.from(document.querySelectorAll('a[href]')).map(a => ({
          text: a.textContent?.trim(),
          href: a.getAttribute('href')
        })).slice(0, 20), // Limit to first 20 links
        images: Array.from(document.querySelectorAll('img[src]')).map(img => ({
          alt: img.getAttribute('alt'),
          src: img.getAttribute('src')
        })).slice(0, 10) // Limit to first 10 images
      }));
    }

    console.log('✓ Scraped data successfully');
    console.log(JSON.stringify(scrapedData, null, 2));

    return scrapedData;

  } catch (error) {
    console.error('Error scraping information:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Scrape and save information to a JSON file
 */
async function scrapeAndSave(
  url: string,
  outputPath: string = './scraped-data.json',
  selector?: string
): Promise<void> {
  const data = await scrapeInfo(url, selector);
  const fs = require('fs');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`✓ Data saved to: ${outputPath}`);
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: ts-node scripts/scrape-info.ts <url> [selector] [outputPath]');
    console.log('Example: ts-node scripts/scrape-info.ts https://example.com');
    console.log('Example: ts-node scripts/scrape-info.ts https://example.com ".product-card" ./products.json');
    process.exit(1);
  }

  const [url, selector, outputPath] = args;

  scrapeAndSave(url, outputPath || './scraped-data.json', selector)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { scrapeInfo, scrapeAndSave };
