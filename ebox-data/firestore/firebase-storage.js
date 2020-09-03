const admin = require('firebase-admin')
const {Storage} = require('@google-cloud/storage');

const serviceAccount = require("./ebox-17291-f801873162d0.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://ebox-17291.appspot.com'
});

const bucket = admin.storage().bucket();
// bucket.upload('./final-data/all-data.json').then(data => {
//     console.log('upload success');
// }).catch(err => {
//     console.log('error uploading to storage', err);
// });

