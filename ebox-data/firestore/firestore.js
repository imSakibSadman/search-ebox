const admin = require('firebase-admin');
const serviceAccount = require('./ebox-17291-f801873162d0.json');
const fs = require('fs')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();
var docRef = db.collection('main-data').doc('all-data1')

filePath = './final-data/all-data1.json';
    var jsonData = fs.readFileSync(filePath, 'utf8', function(err, data) {
        if (err) throw err;
    });
data = JSON.parse(jsonData)


docRef.set({
  data
}).then(function() {
  console.log('data saved')
}).catch(function (error) {
  console.log("Got an error: ", error);
});


// var docRef = db.collection('main-data').doc('all-data')

// filePath = './datas/.json';
//     var jsonData = fs.readFileSync(filePath, 'utf8', function(err, data) {
//         if (err) throw err;
//     });
// data = JSON.parse(jsonData)


// docRef.update({
//   data
// }).then(function() {
//   console.log('data updated')
// }).catch(function (error) {
//   console.log("Got an error: ", error);
// });


// docRef.get().then(function (doc) {
//   if(doc && doc.exists) {
//     const myData = doc.data();
//     console.log(myData)
//   }
// })
