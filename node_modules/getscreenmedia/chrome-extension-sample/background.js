/* background page, responsible for actually choosing media */
chrome.runtime.onMessageExternal.addListener(function (message, sender, callback) {
    switch(message.type) {
        case 'getScreen':
            var pending = chrome.desktopCapture.chooseDesktopMedia(message.options || ['screen', 'window'],
                                                                   sender.tab, function (streamid) {
                // communicate this string to the app so it can call getUserMedia with it
                message.type = 'gotScreen';
                message.sourceId = streamid;
                callback(message);
                return false;
            });
            return true; // retain callback for chooseDesktopMedia result
        case 'cancelGetScreen':
            chrome.desktopCapture.cancelChooseDesktopMedia(message.request);
            message.type = 'canceledGetScreen';
            callback(message);
            return false; //dispose callback
    }
});
