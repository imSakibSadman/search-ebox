const path = require('path');
const {Storage} = require('@google-cloud/storage');


async function test() {

const serviceKey = path.join(__dirname, './ebox-storage-gc.json')


const storageConf = {keyFilename:serviceKey}

const storage = new Storage(storageConf)

const downlaodOptions = {
      destination: __dirname+'/all-data.json'
    };

    try {
    let res = await storage
      .bucket('all-data')
      .file('all-data.json')
      .download(downlaodOptions); 
   }
   catch(err){
    console.log(err)
   }

}

test()