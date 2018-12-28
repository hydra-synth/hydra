const request = require('superagent')
const examples = require('./examples.json')

const sketches = []


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
      this.setSketchFromURL()
      callback(this.code, this.foundSketch)
    // })
  }

  setSketchFromURL() {
    let searchParams = new URLSearchParams(window.location.search)
    let base64Code = searchParams.get('code')
    if(!base64Code) base64Code = searchParams.get('id') // backwards compatibility with earlier form of naming. id is now called code
    let sketch_id = searchParams.get('sketch_id')
    let code = ''
    console.log("id", sketch_id, "code", base64Code)

    // boolean to determine whether a sketch was found based on the URL, either through looking through the database or rendering the code
    this.foundSketch = false
    // if contains a sketch id, set sketch from id
    // if(sketch_id) {
    //   var sketch = this.getSketchById(sketch_id)
    //   console.log('found ', sketch)
    //   if(sketch) {
    //     this.setSketch(sketch)
    //     this.foundSketch = true0
    //   } else if (base64Code){
    //     this.code = this.decodeBase64(base64Code)
    //     this.foundSketch = true
    //   } else {
    //     console.log('id not found', sketch_id)
    //     this.setRandomSketch()
    //   }
    // // backwards combaitbility with earlier shareable URLS
    // } else

    if (base64Code) {
      this.code = this.decodeBase64(base64Code)
      this.foundSketch = true
    } else {
      this.setRandomSketch()
    }
  }

  saveImage() {

  }
  
  setToURL(params){
    //       console.log(base64)
    let newurl = window.location.protocol + '//' +
    window.location.host + window.location.pathname + `?${params.map( (param, index) => `${param.label}=${param.value}`).join('&')}`
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
  //  this.setToURL('sketch_id', sketch._id)
    let params = Object.keys(sketch).map( (key) => {
      return {label: key, value: sketch[key]}
    })
    this.setToURL(params)
  }

  setRandomSketch() {
    // if there are sketches, set code from sketch, otherwise generate random
    console.log("examples length", this.examples)
    if(this.examples.length > 0) {
      let rand = Math.floor(Math.random() * this.examples.length)
      while (rand === this.exampleIndex) {
        rand = Math.floor(Math.random() * this.examples.length)
      }
      this.exampleIndex = rand
      console.log('example is', this.examples[rand])
      this.setSketch(this.examples[rand])
    } else {
      var startString = 'osc(' + 2 + Math.floor(Math.pow(10, Math.random() * 2)) + ')'
      startString += '.color(' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2)+ ')'
      startString += '.rotate(' + Math.random().toFixed(2) + ')'
      startString += '.out(o0)'
      this.code = startString
    }
  }

  saveSketch(code) {
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
        } else {
          console.log('response', res.text)
        //  self.setToURL([ { label: 'sketch_id', value: res.text}, {label: 'code', value: base64} ])
          self.setSketch({
            sketch_id: res.text,
            code: base64
          })
        }
      })
  }

  // getSketchById(id) {
  //   console.log('looking for', id)
  //   var sketch = this.sketches.filter((sketch) => sketch.sketch_id === id)
  //   return sketch[0]
  // }
}

module.exports = Gallery
