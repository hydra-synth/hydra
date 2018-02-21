# Quick-local-ip

quick-local-ip is a utility module which provides straight-forward access to local network addresses. it provides 2 functions to get local ip addresses.

### Installation

    npm install --save quick-local-ip

- If System is connected to multiple internet connections like wifi and ethernet and usb internet, following methods will return any active internet address in string format.
- If System is connected with one internet connection, methods will return ip address in string format.
- If system is not connected with internet default local address will be returned by all methods.
- These method will never return null or undefined.



## Quick Examples

var myip = require('quick-local-ip');

### getting ip4 network address of local system.

    myip.getLocalIP4();


### getting ip6 network address of local system

    myip.getLocalIP6();

