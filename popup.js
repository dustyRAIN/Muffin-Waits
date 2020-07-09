var reloading = true;

const port = chrome.runtime.connect({
    name: "muffin"
});

port.onMessage.addListener(function(info) {
    reloading = info.reloading;
    updateUI();
})

function updateUI() {
    if (reloading) {
        document.getElementById("toggle").innerHTML = "Stop";
        document.getElementById("toggle").style.backgroundColor = "rgba(214, 44, 44, 0.76)";
        document.getElementById("state").innerHTML = "Relax, I am waiting for your faculty";
        document.getElementById("chillax").style.visibility = "visible";
    } else {
        document.getElementById("toggle").innerHTML = "Start";
        document.getElementById("toggle").style.backgroundColor = "rgba(44, 146, 31, 0.774)";
        document.getElementById("state").innerHTML = "Let me wait for your faculty.";
        document.getElementById("chillax").style.visibility = "hidden";
    }
}

document.getElementById("toggle").addEventListener("click", toggle);

function toggle() {
    if (reloading) {
        reloading = false;
        stopReload();
        updateUI();
    } else {
        reloading = true;
        startReload();
        updateUI();
    }
}

function startReload() {
    chrome.tabs.getSelected(null, function(tab) {
        let msg = {
            request: "start",
            tabID: tab.id
        };
        port.postMessage(msg);
    });
}

function stopReload() {
    let msg = {
        request: "stop"
    };
    port.postMessage(msg);
}



document.getElementById("muffin_name").addEventListener("click", goToMuffinTime);
document.getElementById("muffin_time").addEventListener("click", goToMuffinTime);

function goToMuffinTime() {
    chrome.tabs.create({ url: "https://www.youtube.com/watch?v=LACbVhgtx9I" }, function() {
        console.log("My best friend Mahir Tahmid introduced to me this song.");
    });
}