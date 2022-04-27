const request = require('superagent')
const examples = require('./examples.json')
const sketches = []

const license = `// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/`

class Gallery {
  constructor (callback) {
    this.sketches = []
    this.examples = []
    this.current = null
    this.code = null
    this.exampleIndex = null

    // request.get('/sketches').end((err, res) => {
    //   console.log('got sketches', res.text, err)
    //   if(err) {
    //     console.log('err getting sketches', err)
    //   } else {
    //     this.sketches = JSON.parse(res.text)
    //   }

      this.examples = examples
     this.setSketchFromURL(callback)
    //  callback(this.code, this.foundSketch)
    // })
    window.addEventListener('popstate', (event) => {
      this.setSketchFromURL(callback)
   // console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
  });
    this.setRandomSketch = this.setRandomSketch.bind(this)
  }

  clear() {
    this.current = null
    this.code = null
    //this.exampleIndex = null
    let newurl = window.location.protocol + '//' + window.location.host + window.location.pathname
    window.history.pushState({ path: newurl }, '', newurl)
    this.url = newurl
  }

  setSketchFromURL(callback) {
    hush()
    render(o0)
    
    let searchParams = new URLSearchParams(window.location.search)
    this.searchParams = searchParams
    let base64Code = searchParams.get('code')
  //  if(!base64Code) base64Code = searchParams.get('id') // backwards compatibility with earlier form of naming. id is now called code
    let sketch_id = searchParams.get('sketch_id')
    let code = ''
    //console.log("id", sketch_id, "code", base64Code)

    // boolean to determine whether a sketch was found based on the URL, either through looking through the database or rendering the code
    this.foundSketch = false
    // if contains a sketch id, set sketch from id
    if(sketch_id) {
      var sketch = this.getExampleById(sketch_id)
      if(sketch) {
       // console.log('found', sketch)
          this.setSketch(sketch)
          callback(this.code, false)
      } else {
        request
          .get('/sketchById')
          .query({sketch_id: sketch_id})
          .end((err, res) => {
           // console.log('got sketches', res.text, err)
            if(err) {
              console.log('err getting sketches', err)
              this.setSketchFromCode(base64Code, callback)
            } else {
              this.sketches = JSON.parse(res.text)
              if(this.sketches.length > 0) {
                this.setSketch(this.sketches[0])
                //this.code = this.decodeBase64(this.sketches[0].code)
                this.foundSketch = true
                callback(this.code, this.foundSketch)
              } else {
                this.setSketchFromCode(base64Code, callback)
              }
            }
          })
        }

      } else {
        this.setSketchFromCode(base64Code, callback)
      }
    //
    //   // console.log('found ', sketch)
    //   // if(sketch) {
    //   //   this.setSketch(sketch)
    //   //   this. = true0
    //   // } else if (base64Code){
    //   //   this.code = this.decodeBase64(base64Code)
    //   //   this.foundSketch = true
    //   // } else {
    //   //   console.log('id not found', sketch_id)
    //   //   this.setRandomSketch()
    //   // }
    //
    // // // backwards combaitbility with earlier shareable URLS
    // } else {
    //
    //   if (base64Code) {
    //     this.code = this.decodeBase64(base64Code)
    //     this.foundSketch = true
    //   } else {
    //     this.setRandomSketch()
    //   }
    // }
  }

  setSketchFromCode(base64Code, callback){
    if (base64Code) {
      this.code = this.decodeBase64(base64Code)
      this.foundSketch = true
    } else {
      this.setRandomSketch()
    }
    callback(this.code, this.foundSketch)
  }

  saveImage() {

  }

  setToURL(params){
    //       console.log(base64)
   // console.log('params', params)
    // keep code in url for backwards compatibility / compatibility between local and public versions
    this.searchParams.delete('sketch_id')
    this.searchParams.delete('code')
    let url_params
    if(params.sketch_id) {
       url_params = `sketch_id=${params.sketch_id}`
       this.searchParams.append('sketch_id', params.sketch_id)
    } else {
      url_params = `sketch_id=${params.sketch_id}&code=${params.code}`
      this.searchParams.append('sketch_id', params.sketch_id)
      this.searchParams.append('code', params.code)
    }
  
    let newurl = window.location.protocol + '//' +
    window.location.host + window.location.pathname + '?' + this.searchParams.toString()
    window.history.replaceState({ path: newurl }, '', newurl)
    this.url = newurl
  }

  encodeBase64(text) {
    return btoa(encodeURIComponent(text))
  }
  decodeBase64(base64Code) {
    return decodeURIComponent(atob(base64Code))
  }

  setSketch(sketch) {
    let code = this.decodeBase64(sketch.code)
    if(code.indexOf(license) < 0)
    code = 
`${license}
${code}
`
    this.code = code
    this.current = sketch
  //  this.setToURL('sketch_id', sketch._id)
    // let params = Object.keys(sketch).map( (key) => {
    //   return {label: key, value: sketch[key]}
    // })
    this.setToURL(sketch)
  }

  setRandomSketch() {
    // if there are sketches, set code from sketch, otherwise generate random
    //console.log("examples length", this.examples, this.exampleIndex)
    if(this.examples.length > 0) {
      let index
      // if(this.exampleIndex === null) {
        index = Math.floor(Math.random() * this.examples.length)
        while (index === this.exampleIndex) {
          index = Math.floor(Math.random() * this.examples.length)
        }
      // } else {
      //   index = this.exampleIndex +1
      //   if(index >= this.examples.length) index = 0
      // }
      this.exampleIndex = index
    //  console.log('example is', this.examples[rand])
      this.setSketch(this.examples[index])
    } else {
      var startString = 'osc(' + 2 + Math.floor(Math.pow(10, Math.random() * 2)) + ')'
      startString += '.color(' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2)+ ')'
      startString += '.rotate(' + Math.random().toFixed(2) + ')'
      startString += '.out(o0)'
      this.code = startString
    }
  }

  // shares via twitter
  shareSketch(code, hydra, name) {
    this.saveSketch(code, () => {
      console.log("URL is", this.url, 'sketch is', this.current)
      hydra.getScreenImage((img) => {
        request
          .post('/image')
          .attach('previewImage', img)
          .query({
            url: this.url,
            sketch_id: this.current.sketch_id,
            name: name
          })
          // .send({
          //   code: base64
          // })
        //  .query(query)
          .end((err, res) => {
            if(err) {
              console.log('error postingimage', err)
            } else {
              console.log('image response', res.text)
            //  self.setToURL([ { label: 'sketch_id', value: res.text}, {label: 'code', value: base64} ])

            }
          })
        // var oReq = new XMLHttpRequest();
        // oReq.open("POST", "https://localhost:8000/image", true);
        // oReq.onload = function (oEvent) {
        //   // Uploaded.
        //   console.log("uploaded", oEvent)
        // };
        // oReq.send(img);
      //  console.log('got image', img)
      })
    })
  }

  saveSketch(code, callback) {
    let self = this
    //console.log('saving in gallery', code)
    let base64 = this.encodeBase64(code)
  //  console.log('code is', base64)

    let query = {
      code: base64,
      parent: this.current ? this.current.sketch_id : null
    }

    console.log('saving in gallery', query)
    request
      .post('/sketch')
      // .send({
      //   code: base64
      // })
      .query(query)
      .end((err, res) => {
        if(err) {
          console.log('error posting sketch', err)
          if(callback) callback(err)
        } else {
          console.log('response', res.text)
        //  self.setToURL([ { label: 'sketch_id', value: res.text}, {label: 'code', value: base64} ])
          self.setSketch({
            sketch_id: res.text,
            code: base64
          })
          if(callback) callback(null)
        }
      })
  }

  saveLocally(code) {
    let base64 = this.encodeBase64(code)

    this.searchParams.delete('sketch_id')
    this.searchParams.delete('code')
   
    this.searchParams.append('code', base64)
    // keep code in url for backwards compatibility / compatibility between local and public versions
    var url_params = this.searchParams.toString()

    let newurl = window.location.protocol + '//' +
    window.location.host + window.location.pathname + '?' + url_params
    window.history.pushState({ path: newurl }, '', newurl)
    this.url = newurl
  }

  getExampleById(id) {
    //console.log('looking for', id, this.examples, this.sketches)
    var sketches =  this.examples.filter((sketch) => sketch.sketch_id === id)
    if(sketches.length <= 0) sketches = this.sketches.filter((sketch) => sketch.sketch_id === id)
    return sketches[0]
  }
}

module.exports = Gallery
