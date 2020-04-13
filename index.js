//1st: via express only
// const express = require('express');
// const app = express();
// app.listen(3000, () => {
//     console.log("listening to port 3000");
// });
// // express.static = method to host static files
// app.use(express.static('public'));
// // express.json = method to parse
// app.use(express.json({
//     limit: "1mb"
// })); 

// app.post('/date', (req, res) => {
//     console.log('i got a request');
//     console.log(req.body.date);
//     res.json({
//         status: 'success',
//         date: req.body.date
//     })
// })

//EOF


//2nd: via express with socket
// var app = require('express')();
// var server = require('http').Server(app);
// var io = require('socket.io')(server);
// server.listen(80);
// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/index.html');
// });
// io.on('connection', function (socket) {
//     socket.on('activities', function (list) {
//         console.log(list);
//     });
//     socket.on('disconnect', function () {
//         io.emit('user disconnected');
//     });
// }); //EOF via socket

//3rd: via live web
var http = require('http');
// var fs = require('fs');
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8000);

// var options = {
//     key: fs.readFileSync('my-key.pem'),
//     cert: fs.readFileSync('my-cert.pem')
// };

function requestHandler(req, res) {
    var parsedUrl = url.parse(req.url);
    console.log("The Request is: " + parsedUrl.pathname);
    fs.readFile(__dirname + parsedUrl.pathname,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + parsedUrl.pathname);
            }
            res.writeHead(200);
            res.end(data);
        }
    );
}
console.log('fortune analysis running on 8000');
var io = require('socket.io').listen(httpServer);
//Google Calendar API
const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');
const allEvents = [];

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const puppeteer = require('puppeteer');
io.sockets.on('connection',
    function (socket) {
        console.log("We have a new client: " + socket.id);


        //all the things you want here
        // socket.on('activites', function (list) {
        //analysis
        // Load client secrets from a local file.
        console.log('yayyyyy reached here');
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Calendar API.
            authorize(JSON.parse(content), listEvents);
            // authorize(JSON.parse(content), listEventsClass);
            // authorize(JSON.parse(content), listEventsWork);
            // authorize(JSON.parse(content), listEventsPrime);
            // authorize(JSON.parse(content), listEventsFun);
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

        /**å
         * Lists the next 10 events on the user's primary calendar.
         * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
         */
        const classEvents = [];
        //timezone incorrect
        let today = new Date();
        //correct timezone
        let todayIso = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString();
        let regExp = /\d{4}-\d{2}-\d{2}/g;
        let cleanToday = todayIso.match(regExp)[0];


        function listEvents(auth) {
            const calendar = google.calendar({
                version: 'v3',
                auth
            });
            calendar.events.list({
                //get calendar ID from settings and sharings
                calendarId: 'primary',
                // calendarId: 't611euv4j1ql0vheqejtumrl4k@group.calendar.google.com', //trial
                // calendarId: 'tcf1gmsppbe877cfgvdplmtncs@group.calendar.google.com', //classes
                // calendarId: 'dqdua0iel2fhqcq67stkc1b72c@group.calendar.google.com', //fun
                // calendarId: 'sjl779@nyu.edu', //sjl - work
                timeMin: (new Date()).toISOString(),
                maxResults: 5,
                singleEvents: true,
                orderBy: 'startTime',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const events = res.data.items;
                if (events.length) {
                    console.log('Upcoming events for primary calendar');
                    events.map((event, i) => {
                        const start = event.start.dateTime || event.start.date;
                        //if event will happen today
                        if (start.match(regExp)[0] == todayIso.match(regExp)[0]) {
                            console.log(`${start} - ${event.summary}`);
                            classEvents.push(`${start} - ${event.summary}`);
                        }
                    });
                } else {
                    console.log('No upcoming events found for class calendar.');
                }
            });
        }

        // let comboEvents = {
        //     funEvents: funEvents,
        //     workEvents: workEvents,
        //     primaryEvents: primaryEvents,
        //     classEvents: classEvents
        // }

        //scrape from web
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
        scrapeAct('http://www.dragon-gate.com/tool/almanac/')
            .then(result => {
                // console.log('sent with love from promise')
                let trimGood = result.goodAct.trim();
                let trimBad = result.badAct.trim();
                let hours = result.hours;
                let regExp = /\+\s\w+(\s\w+)*/g; //global regular expression
                let matchGood = trimGood.match(regExp);
                let matchBad = trimBad.match(regExp);

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
                    cleanToday,
                    classEvents,
                    matchGood,
                    matchBad,
                    hours,
                    score
                }
                io.sockets.emit('activities', finalResult);
                // console.log(finalResult);
                // return finalResult

                //send to arduino
                if (result.score < "0") {
                    console.log('bad result');
                    // serialPort.write(52);
                }
            })

        socket.on('recordFile', file => {
            console.log("receive file from front end " + file);
            fs.writeFileSync(__dirname + '/recordings' + '.wav', file);

        })

        socket.on('disconnect', function () {
            console.log("Client has disconnected " + socket.id);
        });
    }
);


// .then(
//     app.get('/', (req, res) => {
//         console.log('getting from list backend');
//         res.json({
//             finalResult
//         })
//     })
// )