//1st: Scrape dos and donts
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

scrapeAct('http://www.dragon-gate.com/tool/almanac/').then(response => {
    // console.log(response);
    let trimGood = response.goodAct.trim();
    let trimBad = response.badAct.trim();
    let hours = response.hours;

    let regExp = /\+\s\w+(\s\w+)*/g; //global regular expression
    let matchGood = trimGood.match(regExp);
    let matchBad = trimBad.match(regExp);
    // console.log(matchGood, matchBad);
    // console.log('sent with love from promise')
    const cleanResult = {
        matchGood,
        matchBad,
        hours
    }
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
    result.hours.forEach(element => {
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
        // console.log(score);
    });
    console.log(score);
    return cleanResult;
}).catch(error => {
    console.error(error)
});



//2nd: Get from Google Calendar
const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
    const calendar = google.calendar({
        version: 'v3',
        auth
    });
    calendar.events.list({
        //get calendar ID from settings and sharings
        // calendarId: 'primary',
        calendarId: 'tcf1gmsppbe877cfgvdplmtncs@group.calendar.google.com', //classes
        // calendarId: 'dqdua0iel2fhqcq67stkc1b72c@group.calendar.google.com', //fun
        // calendarId: 'sjl779@nyu.edu', //sjl - work
        // calendarId: 'en-gb.taiwan#holiday@group.v.calendar.google.com', //holidays in taiwan
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            console.log('get 10 event success:');
            events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                const eventsForToday = `${start} - ${event.summary}`
                // console.log(eventsForToday);
                return eventsForToday
            });
        } else {
            console.log('No upcoming events found.');
        }
    });
}

//analyze and send to front end
function analyzeFortune() {
    //check if event is same as today
    let today = (new Date()).toISOString();

}