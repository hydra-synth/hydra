const PatchBay = require('./src/pb-live.js')
const getUserMedia = require('getusermedia')
const enumerateDevices = require('enumerate-devices')


var vidInput
var vidDropdown

window.onload = function(){
  console.log("loaded")
  vidDropdown = document.getElementById("deviceSelect")
  var pb = new PatchBay()
  enumerateDevices(function(err, devices) {
    if(err) {
        console.log(err.message); //device enumeration not supported
    } else {
        console.log(devices);
        vidInput = devices.filter(device => device.kind == "videoinput")
        vidInput.forEach((device)=>{
          console.log("device", device)
          var option = document.createElement("option");
          option.text = device.label == null ? device.id : device.label;
          option.value = device.deviceId
          vidDropdown.add(option)
        })

        document.getElementById("init").onmousedown = function() {
          var deviceId = vidDropdown.value
          console.log(deviceId)
          getUserMedia({
            audio: false,
            video: {deviceId:deviceId}
          }, function(err, stream){
            if(err) alert(err)
            document.getElementById("vid").srcObject = stream
            console.log("got stream", stream)
           pb.init(stream,{
             server: window.location.origin,
             room: "iclc"
           })
            var name = document.getElementById("sourceName").value
              console.log(pb, name)
            pb.setName(name)


          //  pb.init(stream)
          })
        }
    }
});

}
