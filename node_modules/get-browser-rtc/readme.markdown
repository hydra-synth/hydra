# get-browser-rtc

get webrtc methods unprefixed

This module has the same interface as the [wrtc](https://npmjs.com/package/wrtc)
package for easy swapability between node and browsers.

# example output

``` js
console.log(require('get-browser-rtc')())
```

If you're in a browser that supports webrtc you'll get:

```
{ RTCIceCandidate: [Function: RTCIceCandidate],
  RTCPeerConnection: [Function: RTCPeerConnection],
  RTCSessionDescription: [Function: RTCSessionDescription] }
```

otherwise you'll get

```
null
```

# install

```
npm install get-browser-rtc
```

# license

MIT
