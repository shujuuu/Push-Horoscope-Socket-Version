const puppeteer = require('puppeteer')

async function scrape() {
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage()

    await page.goto('http://www.dragon-gate.com/tool/almanac/index.php?offset=240')

    const xx = '/html/body/div[6]/div/a[1]'
    await page.click(xx)
    await page.waitFor(1000)

    const result = await page.evaluate(() => {
        ///#content_inner > article > div.row > div.col-sm-6.product_main > h1/
        // let title = document.querySelector('h1').innerText

        const anigood = document.querySelector('.anigood').innerTxt;
        // let price = document.querySelector('.price_color').innerText
        console.log(anigood);
        return {
            anigood
        }
    })

    // browser.close()
    return result
}

scrape().then(value => {
    console.log(value) // Success!
})