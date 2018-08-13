const request = require('superagent')

const sketches = []


class Gallery {
  constructor (callback) {
    this.sketches = []
    this.examples = []
    this.current = null
    this.code = null

    request.get('/sketches').end((err, res) => {
      console.log('got sketches', res.text, err)
      if(err) {
        console.log('err getting sketches', err)
      } else {
        this.sketches = JSON.parse(res.text)
      }
      //callback()
      request.get('/examples').end((err, res) => {
        console.log('got examples', res.text, err)
        if(err) {
          console.log('err getting examples', err)
        } else {
          this.examples = JSON.parse(res.text)
        }
        //callback()
        this.setSketchFromURL()

        callback(this.code)
      })


    })


  }

  setSketchFromURL() {
    let searchParams = new URLSearchParams(window.location.search)
    let base64Code = searchParams.get('id')
    let sketch_id = searchParams.get('sketch_id')
    let code = ''
    // if contains a sketch id, set sketch from id
    if(sketch_id) {
      var sketch = this.getSketchById(sketch_id)
      console.log('found ', sketch)
      if(sketch) {
        this.setSketch(sketch)
      } else {
        console.log('id not found', sketch_id)
        this.setRandomSketch()
      }
    // backwards combaitbility with earlier shareable URLS
    } else if (base64Code) {
      this.code = this.decodeBase64(base64Code)
    } else {
      this.setRandomSketch()
    }
  }

  setToURL(label, entry){
    //       console.log(base64)
    let newurl = window.location.protocol + '//' +
    window.location.host + window.location.pathname + `?${label}=${entry}`
    window.history.pushState({ path: newurl }, '', newurl)
  }

  encodeBase64(text) {
    return btoa(encodeURIComponent(text))
  }
  decodeBase64(base64Code) {
    return decodeURIComponent(atob(base64Code))
  }

  setSketch(sketch) {
    this.code = this.decodeBase64(sketch.code)
    this.current = sketch
    this.setToURL('sketch_id', sketch._id)
  }

  setRandomSketch() {
    // if there are sketches, set code from sketch, otherwise generate random
    console.log("examples length", this.examples)
    if(this.examples.length > 0) {
      let rand = Math.floor(Math.random() * this.examples.length)
      console.log('rand index is', rand)
      this.setSketch(this.examples[rand])
    } else {
      var startString = 'osc(' + 2 + Math.floor(Math.pow(10, Math.random() * 2)) + ')'
      startString += '.color(' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2)+ ')'
      startString += '.rotate(' + Math.random().toFixed(2) + ')'
      startString += '.out(o0)'
      this.code = startString
    }
  }

  saveExample(code) {
    let self = this
    //console.log('saving in gallery', code)
    let base64 = this.encodeBase64(code)
  //  console.log('code is', base64)

    let query = {
      code: base64,
      parent: this.current ? this.current._id : null
    }
  //  if(this.current) query['parent'] = this.current._id

    console.log('saving in gallery', query)
    request
      .post('/example')
      // .send({
      //   code: base64
      // })
      .query(query)
      .end((err, res) => {
        if(err) {
          console.log('error posting sketch', err)
        } else {
          console.log('response', res.text)
          self.setToURL('sketch_id', res.text)
        }
      })
   //       console.log(base64)
   //       let newurl = window.location.protocol + '//' +
   //       window.location.host + window.location.pathname + `?id=${base64}`
   //       window.history.pushState({ path: newurl }, '', newurl)
   //       self.log(jsString)
  }

  saveSketch(code) {
    let self = this
    //console.log('saving in gallery', code)
    let base64 = this.encodeBase64(code)
  //  console.log('code is', base64)

    let query = {
      code: base64,
      parent: this.current ? this.current._id : null
    }
  //  if(this.current) query['parent'] = this.current._id

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
        } else {
          console.log('response', res.text)
          self.setToURL('sketch_id', res.text)
        }
      })
   //       console.log(base64)
   //       let newurl = window.location.protocol + '//' +
   //       window.location.host + window.location.pathname + `?id=${base64}`
   //       window.history.pushState({ path: newurl }, '', newurl)
   //       self.log(jsString)
  }

  getSketchById(id) {
    console.log('looking for', id)
    var sketch = this.sketches.filter((sketch) => sketch._id === id)
    return sketch[0]
  }
}

module.exports = Gallery
