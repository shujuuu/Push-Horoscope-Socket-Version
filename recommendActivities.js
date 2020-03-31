const puppeteer = require('puppeteer');

async function scrapeAct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    //what to scrape
    let auspicious = '//*[@id="bgaus"]';
    let inauspicious = '//*[@id="bgausbad"]';

    let hrRat = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[1]/div[3]';
    let hrOx = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[2]/div[3]';
    let hrTiger = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[3]/div[3]';
    let hrRabbit = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[4]/div[3]';
    let hrDragon = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[5]/div[3]';
    let hrSnake = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[6]/div[3]';
    let hrHorse = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[7]/div[3]';
    let hrGoat = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[8]/div[3]';
    let hrMonkey = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[9]/div[3]';
    let hrRooster = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[10]/div[3]';
    let hrDog = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[11]/div[3]';
    let hrPig = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[12]/div[3]';
    // let hrHai = '//*[@id="allwrappstart"]/div[4]/div[3]/div/div[2]/div[2]/div[3]/text()';
    //$x = puppeteer selector to select item on page with xpath
    //xpath = navigate to page, like jquery; works well with web scraper; prefix with slashes//
    //will return array
    //[elGood] = pulling out the first element of the array; destructuring
    const [elGood] = await page.$x(auspicious);
    const txtG = await elGood.getProperty('textContent');
    const rawTxtG = await txtG.jsonValue();

    const [elBad] = await page.$x(inauspicious);
    const txtB = await elBad.getProperty('textContent');
    const rawTxtB = await txtB.jsonValue();

    const [elRat] = await page.$x(hrRat);
    const txtRat = await elRat.getProperty('textContent');
    const rawTxtRat = await txtRat.jsonValue();

    const [elOx] = await page.$x(hrOx);
    const txtOx = await elOx.getProperty('textContent');
    const rawTxtOx = await txtOx.jsonValue();

    const [elTiger] = await page.$x(hrTiger);
    const txtTiger = await elTiger.getProperty('textContent');
    const rawTxtTiger = await txtTiger.jsonValue();

    const [elRabbit] = await page.$x(hrRabbit);
    const txtRabbit = await elRabbit.getProperty('textContent');
    const rawTxtRabbit = await txtRabbit.jsonValue();

    const [elDragon] = await page.$x(hrDragon);
    const txtDragon = await elDragon.getProperty('textContent');
    const rawTxtDragon = await txtDragon.jsonValue();

    const [elSnake] = await page.$x(hrSnake);
    const txtSnake = await elSnake.getProperty('textContent');
    const rawTxtSnake = await txtSnake.jsonValue();

    const [elHorse] = await page.$x(hrHorse);
    const txtHorse = await elHorse.getProperty('textContent');
    const rawTxtHorse = await txtHorse.jsonValue();

    const [elGoat] = await page.$x(hrGoat);
    const txtGoat = await elGoat.getProperty('textContent');
    const rawTxtGoat = await txtGoat.jsonValue();

    const [elMonkey] = await page.$x(hrMonkey);
    const txtMonkey = await elMonkey.getProperty('textContent');
    const rawTxtMonkey = await txtMonkey.jsonValue();

    const [elRooster] = await page.$x(hrRooster);
    const txtRooster = await elRooster.getProperty('textContent');
    const rawTxtRooster = await txtRooster.jsonValue();

    const [elDog] = await page.$x(hrDog);
    const txtDog = await elDog.getProperty('textContent');
    const rawTxtDog = await txtDog.jsonValue();

    const [elPig] = await page.$x(hrPig);
    const txtPig = await elPig.getProperty('textContent');
    const rawTxtPig = await txtPig.jsonValue();

    const result = {
        goodAct: rawTxtG,
        badAct: rawTxtB,
        hours: [
            rawTxtRat,
            rawTxtOx,
            rawTxtTiger,
            rawTxtRabbit,
            rawTxtDragon,
            rawTxtSnake,
            rawTxtHorse,
            rawTxtGoat,
            rawTxtMonkey,
            rawTxtRooster,
            rawTxtDog,
            rawTxtPig
        ]
    }
    browser.close();
    return result;
}

scrapeAct('http://www.dragon-gate.com/tool/almanac/').then(result => {
    console.log('sent with love from promise')
    // analyzeToday(response);
    let trimGood = result.goodAct.trim();
    let trimBad = result.badAct.trim();
    let hours = result.hours;
    let regExp = /\+\s\w+(\s\w+)*/g; //global regular expression
    let matchGood = trimGood.match(regExp);
    let matchBad = trimBad.match(regExp);
    console.log(matchGood, matchBad);

    let score = 0;
    let rank = [{
            fortune: "very good",
            score: 2
        }, {
            fortune: "good",
            score: 1
        },
        {
            fortune: "average",
            score: 0
        }, {
            fortune: "bad",
            score: -1
        },
        {
            fortune: "very bad",
            score: -2
        }
    ]

    hours.forEach(element => {
        // console.log(element);
        if (element.toLowerCase() == rank[0].fortune) {
            score += rank[0].score;
        }
        if (element.toLowerCase() == rank[1].fortune) {
            score += rank[1].score;
        }
        if (element.toLowerCase() == rank[2].fortune) {
            score += rank[2].score;
        }
        if (element.toLowerCase() == rank[3].fortune) {
            score += rank[3].score;
        }
        if (element.toLowerCase() == rank[4].fortune) {
            score += rank[4].score;
        }
        return score;
    });
    let finalResult = {
        matchGood,
        matchBad,
        score
    }
    console.log(finalResult);
    return finalResult
});

// let result = {
//     goodAct: '\n\t\t\t\t\t\t\t+ Worship+ engagement+ marriage+ business+ sign agreements+ travel+ move house+ open for business+ renovation+ house warming+ install equipment \t\t\t\t\t\t\t',
//     badAct: '\n\t\t\t\t\t\t\t+ Demolition+ burial+ assume office\t\t\t\t\t\t\t',
//     hours: ['Very Bad',
//         'Average ',
//         'Average',
//         'Good',
//         'Bad',
//         'Bad',
//         'Average',
//         'Average',
//         'Very Good',
//         'Good',
//         'Average',
//         'Very Bad'
//     ]
// }
// console.log(result.goodAct, result.badAct);


// let splitGood = trimGood.split('+ ');
// let splitBad = trimBad.split('+ ');
// console.log(trimGood, trimBad)

//using .filter ->>>> return same thing before alteration
// const cleanGood = splitGood.filter(act => {
//     return act != null;
// });
// const cleanBad = splitBad.filter(act => {
//     return act != null;
// });

//using .shift ->>>>> returns nothing
// const cleanGood = splitGood.shift();
// const cleanBad = splitBad.shift();

//using regular expression
// \s\w+\s?\w?\+
//\+\s\w+\s?\w+
// \+\s\w+\s?\w+\s?\w+\s?\w+
// \+\s\w+(\s\w+)* ->>>>>>>>>>>> final

// let cleanGood = matchGood.split('+ ');
// let cleanBad = matchBad.split('+ ');

// console.log(trimBad.match(regExp));

// console.log(splitGood.join(' '));
// console.log(splitBad.join(' '));


//average the hours

// result.hours.forEach(element => {
//     // console.log(element);
//     if (element.toLowerCase() == "very good") {
//         score += 2;
//     }
//     if (element.toLowerCase() == "good") {
//         score += 1;
//     }
//     if (element.toLowerCase() == "average") {
//         score += 0;
//     }
//     if (element.toLowerCase() == "bad") {
//         score -= 1;
//     }
//     if (element.toLowerCase() == "very bad") {
//         score -= 2;
//     }
//     console.log(score);
// });