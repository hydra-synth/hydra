const multer = require('multer')


module.exports = (app) => {
  // server-side code related to saving and storing images
  // if has twitter key, enamble uploading
  if(process.env.CONSUMER_KEY) {
    const tweet = require('./tweet.js')
  }


  const Datastore = require('nedb')
    db = new Datastore({ filename: './hydra-server/db/saved_sketches', autoload: true})

    var sketches = []

    db.count({}, function (err, count) {
      console.log("There are " + count + " users in the database");
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
      console.log('post sketch', request.query)
      db.insert({
        "code": request.query.code,
        "parent": request.query.parent,
        "date": new Date()
      }, function (err, sketchAdded) {
        if (err) {
          console.log('error adding', err)
          response.sendStatus(500)
        } else {
          console.log('ADDED', sketchAdded)
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

    if(process.env.CONSUMER_KEY) {
     const upload = multer({ storage: storage });
     app.post("/image", upload.single('previewImage'), (req, res) => {
       console.log('UPLOADING');
       findParentTweet(req.query.sketch_id, function(err, tweet_id){
         if(err) console.log(err)
         console.log('posting image');
         if(tweet_id !== null) console.log("FOUND PARENT", tweet_id)
        tweet.post_chunked({
           imagePath: req.file.path,
           url: req.query.url,
           name: req.query.name,
           parent_tweet: tweet_id
         }, function(err, data){
           if(err){
             console.log('ERROR POSTING IMAGE', err)
           } else {
             console.log('tweet id is ', data.id_str)
             res.status(200).send( 'https://twitter.com/hydra_patterns/status/' + data.id_str );
             db.update(
               { _id: req.query.sketch_id },
               { $set: { tweet_id: data.id_str,  bitly_hash: data.bitly_hash }
             }, function (err, numReplaced) {});
           }
         })
       })
       // find out whether sketch has a parent, and if the parent has a corresponding tweet

      // console.log('FOUND TWEET', tweet_id)
       // tweet.post_image('testing', req.file.buffer, function (err) {
       //   console.log('UPLOADED', err)
       // })
      // saveFile(req.file, "test.png")
      //
      //  req.query.url


      // res.end();
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
