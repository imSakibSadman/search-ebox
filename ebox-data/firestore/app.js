const admin = require('firebase-admin');
const serviceAccount = require('./ebox-17291-f801873162d0.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
const db = admin.firestore();
async function database (document) {
    var docRef = db.collection('main-data').doc(document)
   
    await docRef.get().then(function (doc) {
        let matchedTitles = []
        if(doc && doc.exists) {
          const myData = doc.data();
          console.log(myData)

    
}

async getMarker() {
    const snapshot = await firebase.firestore().collection('events').get()
    return snapshot.docs.map(doc => doc.data());
}

database()
// console.log(matchedTitles)
// console.log(matchedTitles)

// var myData;


// const data = JSON.parse(myData)

