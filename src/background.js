let port = null;
let interval = undefined;

function connectToNativeHost() {
    if (port !== null) {
        return;
    }
    port = chrome.runtime.connectNative("ytmh.keyboard");

    port.onMessage.addListener((message) => {
        if (message.command === "play-pause") {
            doAction(playPause);
        }

        if (message.command === "next") {
            doAction(goNext);
        }

        if (message.command === "previous") {
            doAction(goPrev);
        }

        if (message.action === "restart") {
            port.disconnect();
            port = null;
            setTimeout(connectToNativeHost, 3000);
        }
    });

    port.onDisconnect.addListener(() => {
        console.warn("Native host disconnected, trying to reconnect.");
        port = null;
        setTimeout(connectToNativeHost, 3000);
    });
}

function doAction(action) {
    chrome.tabs.query({url: "*://music.youtube.com/*"}, (tabs) => {
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: action
            });
        } else {
            console.warn("no YouTube Music tab found !");
        }
    });
}

function playPause() {
    const button = document.querySelector("ytmusic-player-bar #left-controls #play-pause-button button");
    if (button) {
        button.click();
        loopCheckDevice();
    } else {
        window.alert("no play button found !");
    }
}

function goNext() {
    const button = document.querySelector("ytmusic-player-bar #left-controls .next-button button");
    if (button) {
        button.click();
        loopCheckDevice();
    } else {
        window.alert("no next button found !");
    }
}

function goPrev() {
    const button = document.querySelector("ytmusic-player-bar #left-controls .previous-button button");
    if (button) {
        button.click();
        loopCheckDevice();
    } else {
        window.alert("no previous button found !");
    }
}

function switchDevice() {
    const button = document.querySelector("ytmusic-popup-container yt-confirm-dialog-renderer #main #confirm-button button");
    if (button) {
        button.click();
    }
}

function loopCheckDevice() {
    clearInterval(interval);
    let times = 10;
     interval = setInterval(() => {
        switchDevice();
        times -= 1;
        if (times <= 0) {
            clearInterval(interval);
        }
    }, 500);
}

chrome.action.onClicked.addListener(() => {
    console.log("Restarting hotkeys")
    if (port !== null) {
        port.disconnect();
    }
    port = null;
    setTimeout(connectToNativeHost, 3000);
});

chrome.webNavigation.onCompleted.addListener(() => {
        console.log("Checking hotkeys because navigation happened to music.youtube.com");
        connectToNativeHost();
    },
    {url: [{hostContains: 'music.youtube.com'}]}
);

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('justInCaseMusicHotkeys', {periodInMinutes: 5});
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'justInCaseMusicHotkeys') {
        console.log("Checking hotkeys just in case");
        connectToNativeHost();
    }
});

console.log("Checking hotkeys because extension was launched");
connectToNativeHost();