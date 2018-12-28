var config = {
    /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    Twit = require('twit'),
    T = new Twit(config.twitter);

const { BitlyClient } = require('bitly');
const bitly = new BitlyClient(process.env.BITLY_ACCESS_TOKEN, {});

module.exports = {
  hello_world: function() {
    T.post('statuses/update', {
      status: 'hello world!'
    }, (err, data, response) => {
      if (err) {
        console.log(err)
      } else {
        console.log(`${data.text} tweeted!`)
      }
    })
  },
  post_chunked: function(descriptionText, filePath) {
    //const filePath = path.join(__dirname, `../${fileName}`)
    console.log(`file PATH ${filePath}`)
    T.postMediaChunked({
      file_path: filePath
    }, (err, data, respone) => {
      if (err) {
        console.log(err)
      } else {
        console.log(data)
        const params = {
          status: descriptionText,
          media_ids: data.media_id_string
        }
        T.post('statuses/update', params, (err, data, respone) => {
          if (err) {
            console.log(err)
          } else {
            console.log('Status posted!')
          }
        })
      }
    })
  },
  post_image: function(text, image_binary, cb) {
    console.log("uploading")
   T.post('media/upload', { media: image_binary }, function (err, data, response) {
     console.log("received response", err, data, response)
      if (err){
        console.log('ERROR:\n', err);
        if (cb){
          cb(err);
        }
      }
      else{
        console.log('tweeting the image...');
        T.post('statuses/update', {
          status: text,
          media_ids: new Array(data.media_id_string)
        },
        function(err, data, response) {
          if (err){
            console.log('ERROR:\n', err);
            if (cb){
              cb(err);
            }
          }
          else{
            console.log('tweeted!');
            if (cb){
              cb(null);
            }
          }
        });
      }
    });
  }
};
