/**
 * Created by alokguha on 25/09/15.
 */
'use strict'
var ni = require('os').networkInterfaces();
module.exports = {
    getLocalIP4: function() {
        var ipAddress = [];
        for(var key in ni){
            for(var index in ni[key]){
                if(ni[key][index].family === 'IPv4' && !ni[key][index].internal){
                    ipAddress.push(ni[key][index].address);
                }
            }
        }
        if(ipAddress.length > 1){
            return ipAddress[Math.floor(Math.random() * ((ipAddress.length - 1) - 0 + 1)) + 0];
        }else if(ipAddress.length == 1){
            return ipAddress[0];
        }else{
            return '127.0.0.1';
        }

    },
    getLocalIP6: function() {
        var ipAddress = [];
        for(var key in ni){
            for(var index in ni[key]){
                if(ni[key][index].family === 'IPv6' && !ni[key][index].internal){
                    ipAddress.push(ni[key][index].address);
                }
            }
        }
        if(ipAddress.length > 1){
            return ipAddress[Math.floor(Math.random() * ((ipAddress.length - 1) - 0 + 1)) + 0];
        }else if(ipAddress.length == 1){
            return ipAddress[0];
        }else{
            return 'fc00::/7';
        }

    }
};
