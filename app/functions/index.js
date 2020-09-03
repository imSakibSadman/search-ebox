const functions = require("firebase-functions");
const admin = require('firebase-admin');

const express = require("express");
const fs = require("fs");
const path = require("path");
const { title } = require("process");
let { query } = require("express");

const app = express();
const moment = require('moment');
// app.listen(3000, () => console.log('listening at 3000...'))
// app.use(express.static('../public'));
var useragent = require('express-useragent');
app.use(useragent.express());

const serviceAccount = require('./ebox-gcp-sak.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


// route for query
app.post("/query", (request, response) => {
  let query = request.body;
  let name = query.name.toLowerCase();
  // let location = query.location;

  // getting user ip
  let ip = request.headers['x-forwarded-for']

  if (ip != undefined) {
    ip = ip.split(',')[0].toString()
    ip = ip.split('.')
    cuttedIp = ""
    for (let i = 0; i < ip.length - 1; i++) {
      cuttedIp += ip[i] + '.'
    }
  } else {
    cuttedIp = 'localhost'
  }

  // getting device info
  let device = request.useragent
  let userAgent = request.get('user-agent').match(/\(([^)]+)\)/)[1];


  if (device.isAndroid || device.isiPhone) {
    deviceInfo = {
      kernel: userAgent.split(';')[0],
      OS: userAgent.split(';')[1],
      device: userAgent.split(';')[2],
      browser: device.browser
    }

  } else {
    deviceInfo = {
      kernel: device.platform,
      OS: device.os,
      browser: device.browser

    }

  }

  // grabbing date & time
  let dateTime = moment().utcOffset('+0600').format('MMM, DD Y  HH:mm:ss')

  dataToPost = { query: query.name, location: query.coords, deviceInfo }

  // wrting user ip and query to firestore, ip as collection, dateTime as document
  // query, location and deviceInfo as field
  const docRef = db.collection(cuttedIp).doc(dateTime);

  async function postData() {
    await docRef.set(
      dataToPost
    );
  }

  postData()

  // reading main all-data file
  filePath = path.join(__dirname, "datas/all-data.json");
  const jsonAllData = fs.readFileSync(filePath, "utf8", function (err, data) {
    if (err) throw err;
  });

  // converting JSON file into object
  const data = JSON.parse(jsonAllData);

  // creating titles' array from data object
  const titles = Object.keys(data);


  // searching throung titles
  String.prototype.isMatch = function (s) {
    return this.match(s) !== null;
  };

  let matchedTitles = [];
  for (t in titles) {
    let match = titles[t].toLowerCase().isMatch(name);
    if (match == true) {
      matchedTitles.push(titles[t]);
    }
  }

  // retriving addresses from data with matched titles
  let matchedAdresses = [];
  for (t in matchedTitles) {
    addr = data[matchedTitles[t]];
    matchedAdresses.push(addr);
  }

  // creating result(final response) object with titiles and corosponding adresses
  let result = {};
  matchedTitles.forEach((key, i) => (result[key] = matchedAdresses[i]));

  response.json(result);
});

exports.app = functions.region('us-central1').https.onRequest(app);
