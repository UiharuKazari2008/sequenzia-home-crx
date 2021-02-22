function save_options() {
    let channelList = document.getElementById('channelList').value;
    let resolutionMin = document.getElementById('resolutionMin').value;
    let aspectMode = document.getElementById('aspectMode').value;
    let numberRequest = parseInt(document.getElementById('numberRequest').value);
    if (isNaN(numberRequest))
        numberRequest = 15;
    let aspectCorrect = document.getElementById('aspectCorrect').checked;
    let showNSFW = document.getElementById('showNSFW').checked;

    chrome.storage.sync.set({
        settings: {
            channelList: channelList,
            resolutionMin: resolutionMin,
            aspectMode: aspectMode,
            aspectCorrect: aspectCorrect,
            showNSFW: showNSFW,
            numberRequest: numberRequest
        }
    }, function() {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved. Now Reloading...';
        chrome.extension.getBackgroundPage().getImages();
        setTimeout(function() {
            status.textContent = '';
            restore_options();
        }, 2000);
    })
}

function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get(['settings'], function(items) {
        if (items.settings !== undefined)
            document.getElementById('channelList').value = items.settings.channelList;
            document.getElementById('resolutionMin').value = items.settings.resolutionMin;
            document.getElementById('aspectMode').value = items.settings.aspectMode;
            document.getElementById('numberRequest').value = items.settings.numberRequest;
            document.getElementById('aspectCorrect').checked = items.settings.aspectCorrect;
            document.getElementById('showNSFW').checked = items.settings.showNSFW;
    });
}

function display_usage() {
    chrome.storage.local.getBytesInUse(null , (txt) => {
        document.getElementById('usage').innerText = (txt / (1024 * 1024)).toFixed(2)
    });
    chrome.storage.local.get(null , (data) => {
        document.getElementById('count').innerText = Object.keys(data).filter((e) => {return e.includes('file-')}).length
    });
}

setInterval(display_usage, 5000);
display_usage();

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);