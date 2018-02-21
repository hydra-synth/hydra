####What
This is a simple module for normalizing the differences in enumerating media devices in webkit (Chrome/Opera) and Mozilla (Firefox).

####Why
Because the usages and results of the two implementations differ, and it's nice to normalize the behavior and results.

####How

```javascript
//promises!
const enumerateDevices = require('enumerate-devices');

enumerateDevices().then((devices) => console.log(devices)).catch(console.log.bind(console));

//or callbacks!

var enumerateDevices = require('enumerate-devices');

enumerateDevices(function(err, devices) {
    if(err) {
        console.log(err.message); //device enumeration not supported
    } else {
        console.log(devices);
    }
});
```

Test by running `npm start` and visiting [http://localhost:8880/test](http://localhost:8880/test/)

####Demo

View a demo of the module in use on [the test page](https://xdumaine.github.io/enumerateDevices/test/).

####Who

[@xanderdumaine](https://twitter.com/xanderdumaine)
