let reloading;
let tabID;

let currentPort;
var timeOut;
var connected;

chrome.runtime.onInstalled.addListener(function() {
    console.log("kotobar");
    reloading = false;
    tabID = -1;
    connected = false;
});

chrome.runtime.onConnect.addListener(function(port) {
    connected = true;
    currentPort = port;

    currentPort.postMessage({
        reloading: reloading
    });

    currentPort.onMessage.addListener(function(info) {
        if (info.request === 'start') {
            reloading = true;
            tabID = info.tabID;
            startReload();
        } else if (info.request === 'stop') {
            reloading = false;
            stopReload();
        }
    });
});


function startReload() {
    chrome.tabs.reload(tabID);
    timeOut = setTimeout(startReload, 10000);
}

function stopReload() {
    clearTimeout(timeOut);
    tabID = -1;
}

if (currentPort != null) {
    currentPort.onDisconnect.addListener(function() {
        connected = false;
    });
}


chrome.tabs.onRemoved.addListener(function(tab_id, info) {
    if (tabID == tab_id) {
        reloading = false;
        stopReload();
        alert('You have closed the tab where I was waiting for the faculty. So, I\'ve stopped waiting.');
    }
});


chrome.tabs.onUpdated.addListener(function(tab_id, changeInfo, tab) {
    if (reloading && tabID == tab_id) {
        chrome.tabs.get(tabID, function(tab) {
            processUrl(tab.url);
        })
    }
});

function processUrl(url) {

    var pat3 = new RegExp(/^(https:\/\/www\.|https:\/\/|http:\/\/www\.|http:\/\/)?(meet[\.]{1}google[\.]{1}com){1}(\/)?_meet(\/)?whoops[a-z\-\?0-9\=\&]*(\/)?/gi);
    var pat2 = new RegExp(/^(https:\/\/www\.|https:\/\/|http:\/\/www\.|http:\/\/)?(meet[\.]{1}google[\.]{1}com){1}\/lookup(\/)?[a-z\-\?0-9\=\&]*(\/)?/gi);
    var pat1 = new RegExp(/^(https:\/\/www\.|https:\/\/|http:\/\/www\.|http:\/\/)?(meet[\.]{1}google[\.]{1}com){1}\/[a-z]{3}\-[a-z]{4}\-[a-z]{3}(\/)?/gi);
    var pat0 = new RegExp(/^(https:\/\/www\.|https:\/\/|http:\/\/www\.|http:\/\/)?(meet[\.]{1}google[\.]{1}com){1}(\/)?_meet(\/)?[a-z]{3}\-[a-z]{4}\-[a-z]{3}[a-z\-\?0-9\=\&]*(\/)?/gi);
    if (url.match(pat1) || url.match(pat0)) {
        reloading = false;
        stopReload();
        notifyUser();
    } else if (!url.match(pat2) && !url.match(pat3)) {
        reloading = false;
        stopReload();
        alert('Faculty will never come to this place. Enter URL correctly!!!');
    }
}

function notifyUser() {
    var shout = {
        type: 'basic',
        iconUrl: 'muffin48.png',
        title: 'Waiting is over!',
        message: 'The faculty has arrived!!!'
    }
    chrome.notifications.create("arrival", shout);
}