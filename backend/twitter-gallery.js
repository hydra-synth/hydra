const multer = require('multer')
var path = require('path')
var fs = require('fs')
const request = require('request')
const superagent = require('superagent')
const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE
);

var tweet
module.exports = (app) => {
  // server-side code related to saving and storing images
  // if has twitter key, enamble uploading
  if(process.env.CONSUMER_KEY) {
    tweet = require('./tweet.js')
  }


  const Datastore = require('nedb')
   var db = new Datastore({ filename: path.join(__dirname, '/db/saved_sketches'), autoload: true})

 //console.log('dir is', __dirname)
    var sketches = []

    db.count({}, function (err, count) {
      console.log("There are " + count + " entries in the database");
      if(err) console.log("There's a problem with the database: ", err);
      else if(count<=0){ // empty database so needs populating
        // default users inserted in the database
        db.insert(sketches, function (err, testAdded) {
          if(err) console.log("There's a problem with the database: ", err);
          else if(testAdded) console.log("Default users inserted in the database");
        });
      }
    });

    app.get('/sketches', function (request, response) {
      db.find({}, function (err, entries){
        if (err) {
          console.log('problem with db', err)
        } else {
          var res = entries.map((entry) => {
            entry.sketch_id = entry._id
            return entry
          })
          response.send(entries)
        }
      })
    })

    app.get('/sketchById', function (request, response) {
      db.find({_id: request.query.sketch_id}, function (err, entries){
        if (err) {
          console.log('problem with db', err)
        } else {
          var res = entries.map((entry) => {
            entry.sketch_id = entry._id
            return entry
          })
          response.send(entries)
        }
      })
    })

    app.post('/sketch', function (request, response) {
    //  console.log('post sketch', request.query)
      db.insert({
        "code": request.query.code,
        "parent": request.query.parent,
        "date": new Date()
      }, function (err, sketchAdded) {
        if (err) {
          console.log('error adding', err)
          response.sendStatus(500)
        } else {
        //  console.log('ADDED', sketchAdded)
          response.send(sketchAdded._id)
        }
      })
    })

    // app.post('/image', function (request, response) {
    //   console.log('post sketch', request.query)
    // })


    //const storage = multer.memoryStorage();

    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
       cb(null, path.join(__dirname + '/uploads/'))
       },
       filename: function (req, file, cb) {
         cb(null, file.originalname + '.png')
       }
    })

  //  console.log('envv', process.env)
     const upload = multer({ storage: storage });
     app.post("/image", upload.single('previewImage'), (req, res) => {

      if(process.env.CHEVERETO_API_KEY && process.env.CHEVERETO_API_URL) {
        console.log('UPLOADING TO CHEVERETO');
        superagent
          .post(process.env.CHEVERETO_API_URL)
          .field('key', process.env.CHEVERETO_API_KEY)
          .attach('source', req.file.path, {filename: `${req.query.name}: ${req.query.sketch_id}`})
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              console.log('Media uploaded!')
              // console.log(res.body.image)

              if(process.env.NOCODB_API_KEY && process.env.NOCODB_API_URL) {
                db.find({_id: req.query.sketch_id}, function (err, entries){
                  if (err) {
                    console.log('problem with db', err)
                  } else {
                    if (entries.length > 0) {
                      const code = decodeURIComponent(Buffer.from(entries[0].code, 'base64').toString('binary'));
                      const image = JSON.stringify([
                        {
                          url: res.body.image.url,
                          title: res.body.image.filename,
                          mimetype: res.body.image.mime,
                          size: res.body.image.size,
                        }
                      ])
                      superagent
                      .post(process.env.NOCODB_API_URL)
                      .set('xc-auth', process.env.NOCODB_API_KEY)
                      .send({
                        title: `${req.query.name}`,
                        image,
                        url: `https://hydra.glitches.me/?sketch_id=${req.query.sketch_id}`,
                        code,
                      })
                      .end((err, res) => {
                        if (err) {
                          console.log(err)
                        } else {
                          console.log('NOCODB uploaded!')
                        }
                      })
                    }
                  }
                })
              }
              if (base) {
                base('Table 1').create([
                  {
                    "fields": {
                      "Name": `${req.query.name}`,
                      "Notes": `https://hydra.glitches.me/?sketch_id=${req.query.sketch_id}`,
                      "Attachments": [
                        {
                          "url": res.body.image.url
                        }
                      ],
                      "tag": [
                        "sketch"
                      ],
                      "featured": false,
                    }
                  },
                ], function(err, records) {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  records.forEach(function (record) {
                    console.log(record.getId());
                  });
                });
              }
            }
          });
      }

      if(process.env.CONSUMER_KEY) {
      //  console.log('UPLOADING');
      //  findParentTweet(req.query.sketch_id, function(err, tweet_id){
      //    if(err) console.log(err)
      //    console.log('posting image');
      //    if(tweet_id !== null) console.log("FOUND PARENT", tweet_id)
      //   tweet.post_chunked({
      //      imagePath: req.file.path,
      //      url: req.query.url,
      //      name: req.query.name,
      //      parent_tweet: tweet_id
      //    }, function(err, data){
      //      if(err){
      //        console.log('ERROR POSTING IMAGE', err)
      //      } else {
      //        console.log('tweet id is ', data.id_str)
      //        res.status(200).send( 'https://twitter.com/hydra_patterns/status/' + data.id_str );
      //        db.update(
      //          { _id: req.query.sketch_id },
      //          { $set: { tweet_id: data.id_str,  bitly_hash: data.bitly_hash }
      //        }, function (err, numReplaced) {});
      //      }
      //    })
      //  })
       // find out whether sketch has a parent, and if the parent has a corresponding tweet

      // console.log('FOUND TWEET', tweet_id)
       // tweet.post_image('testing', req.file.buffer, function (err) {
       //   console.log('UPLOADED', err)
       // })
      // saveFile(req.file, "test.png")
      //
      //  req.query.url


      // res.end();
      }
     });

    function findParentTweet(sketch_id, callback) {
      db.find({_id: sketch_id}, function (err, entries){
       if(err){
         callback(err, null)
       } else {
         if(entries.length > 0){
           if(entries[0].parent) {
               db.find({_id: entries[0].parent}, function (err, entries){
                 if(err){
                   callback(err)
                 } else {
                   if(entries.length > 0){
                     if(entries[0].tweet_id) {
                       callback(null, entries[0].tweet_id)
                     } else {
                       callback(null, null)
                     }
                   } else {
                     callback(null, null)
                   }
                 }
               })
           } else {
             callback(null, null)
           }
         } else {
           callback(null, null)
         }
       }
     })
    }

     function saveFile(body, fileName) {
       const file = fs.createWriteStream(fileName)
       request(body).pipe(file).on('close', err => {
         if (err) {
           console.log(err)
         } else {
           console.log('Media saved!')
           const descriptionText = body.title
          // uploadMedia(descriptionText, fileName)
         }
       })
     }
}
