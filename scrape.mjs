import puppeteer from 'puppeteer';
import ObjectsToCsv from 'objects-to-csv';



const urlsToScrape = [
    "https://www.tripadvisor.com/Restaurant_Review-g60763-d8557227-Reviews-Jams_6th_Avenue_New_York_NY_USA-New_York_City_New_York.html",
    "https://www.tripadvisor.com/Restaurant_Review-g60763-d10145683-Reviews-Petite_Boucherie-New_York_City_New_York.html",
    "https://www.tripadvisor.com/Restaurant_Review-g60763-d3603515-Reviews-Spice_Symphony-New_York_City_New_York.html"
]

 // Launch a headless browser
const browser = await puppeteer.launch({headless: "new"});
const csvData = []


for(const url of urlsToScrape) {
    // Create a new page
    const page = await browser.newPage();

    // Set the user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36');

    await page.goto(url);
    // Wait for the website link element to appear
    await page.waitForSelector('a[data-encoded-url]');


// Extract product data
    const productData = await page.evaluate(()=> {

        const titleElement = document.querySelector('.HjBfq');
        const title = titleElement ? titleElement.textContent.trim() : '';



        const addressElement = document.querySelector('.yEWoV');
        const address = addressElement ? addressElement.textContent.trim() : '';


        const websiteElement = document.querySelector('a[data-encoded-url]');
        const website = websiteElement ? websiteElement.getAttribute('href') : '';


  
        const emailElement = document.querySelector('a[href^="mailto:"]');
        const emailValue = emailElement ? emailElement.getAttribute('href') : '';
        const email = emailValue ? emailValue.replace('mailto:', '').split('?')[0] : '';
        
        const phoneElement = document.querySelector('a[href^="tel:"]')
        const phoneValue = phoneElement ? phoneElement.getAttribute('href') : '';
        const phone = phoneValue ? phoneValue.replace('tel:', ''): '';
        return {
            title,
            website,
            address,
            email,
            phone
        }

            })

            csvData.push(productData)
            await page.close()

        }

// Close the browser
await browser.close();


// Save the data to a CSV file
const csv = new ObjectsToCsv(csvData);
await csv.toDisk('product_data.csv');

console.log('Product data has been scraped and saved to product_data.csv');
