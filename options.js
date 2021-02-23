const status = document.getElementById('status');

function save_options() {
    const channelList = document.getElementById('channelList').value;
    const resolutionMin = document.getElementById('resolutionMin').value;
    const aspectMode = document.getElementById('aspectMode').value;
    const numDays = document.getElementById('numDays').value;
    let numberRequest = parseInt(document.getElementById('numberRequest').value);
    if (isNaN(numberRequest))
        numberRequest = 15;
    let cycleTimer = parseInt(document.getElementById('cycleTimer').value);
    if (isNaN(cycleTimer))
        cycleTimer = 5;
    const aspectCorrect = document.getElementById('aspectCorrect').checked;
    const showNSFW = document.getElementById('showNSFW').checked;

    const syncChannelList = document.getElementById('syncChannelList').checked;
    const syncResolutionMin = document.getElementById('syncResolutionMin').checked;
    const syncAspectMode = document.getElementById('syncAspectMode').checked;
    const syncAspectCorrect = document.getElementById('syncAspectCorrect').checked;
    const syncNumDays = document.getElementById('syncNumDays').checked;
    const syncCycleTimer = document.getElementById('syncCycleTimer').checked;
    const syncNumberRequest = document.getElementById('syncNumberRequest').checked;
    const syncShowNSFW = document.getElementById('syncShowNSFW').checked;

    chrome.storage.sync.get(['settings'], function(oldSettings) {
    chrome.storage.sync.set({
        settings: {
            channelList: ((syncChannelList) ? channelList : oldSettings.settings.channelList),
            resolutionMin: ((syncResolutionMin) ? resolutionMin : oldSettings.settings.resolutionMin),
            aspectMode: (( syncAspectMode) ? aspectMode : oldSettings.settings.aspectMode),
            aspectCorrect: ((syncAspectMode) ? aspectCorrect : oldSettings.settings.aspectCorrect),
            showNSFW: ((syncShowNSFW) ? showNSFW : oldSettings.settings.showNSFW),
            numberRequest: ((syncNumberRequest) ? numberRequest : oldSettings.settings.numberRequest),
            cycleTimer: ((syncCycleTimer) ? cycleTimer : oldSettings.settings.cycleTimer),
            numDays: (( syncNumDays) ? numDays : oldSettings.settings.numDays)
        }
    }, function() {
    chrome.storage.local.set({
        settings: {
            channelList: channelList,
            resolutionMin: resolutionMin,
            aspectMode: aspectMode,
            aspectCorrect: aspectCorrect,
            showNSFW: showNSFW,
            numberRequest: numberRequest,
            cycleTimer: cycleTimer,
            numDays: numDays
        }
    }, function() {
    chrome.storage.sync.set({
        syncSettings: {
            channelList: syncChannelList,
            resolutionMin: syncResolutionMin,
            aspectMode: syncAspectMode,
            aspectCorrect: syncAspectCorrect,
            showNSFW: syncShowNSFW,
            numberRequest: syncNumberRequest,
            cycleTimer: syncCycleTimer,
            numDays: syncNumDays
        }
    }, function() {
        // Update status to let user know options were saved.
        status.textContent = 'Options saved. Now Reloading...';
        restore_options();
        setTimeout(function () {
            status.textContent = '';
        }, 2000);
        chrome.extension.getBackgroundPage().getImages();
    })
    })
    })
    })
}

function restore_options() {
    chrome.storage.sync.get(['syncSettings'], function(sync) {
        if (sync.syncSettings !== undefined)
            document.getElementById('syncChannelList').checked = sync.syncSettings.channelList;
            document.getElementById('syncResolutionMin').checked = sync.syncSettings.resolutionMin;
            document.getElementById('syncAspectMode').checked = sync.syncSettings.aspectMode;
            document.getElementById('syncAspectCorrect').checked = sync.syncSettings.aspectCorrect;
            document.getElementById('syncNumberRequest').checked = sync.syncSettings.numberRequest;
            document.getElementById('syncNumDays').checked = sync.syncSettings.numDays;
            document.getElementById('syncCycleTimer').checked = sync.syncSettings.cycleTimer;
            document.getElementById('syncShowNSFW').checked = sync.syncSettings.showNSFW;
    chrome.storage.local.get(['settings'], function(local) {
    chrome.storage.sync.get(['settings'], function(cloud) {
        if (sync.syncSettings.channelList){
            if (cloud.settings !== undefined)
                document.getElementById('channelList').value = cloud.settings.channelList;
        } else {
            if (local.settings !== undefined)
                document.getElementById('channelList').value = local.settings.channelList;
        }
        if (sync.syncSettings.resolutionMin) {
            if (cloud.settings !== undefined)
                document.getElementById('resolutionMin').value = cloud.settings.resolutionMin;
        } else {
            if (local.settings !== undefined)
                document.getElementById('resolutionMin').value = local.settings.resolutionMin;
        }
        if (sync.syncSettings.aspectMode){
            if (cloud.settings !== undefined)
                document.getElementById('aspectMode').value = cloud.settings.aspectMode;
        } else {
            if (local.settings !== undefined)
                document.getElementById('aspectMode').value = local.settings.aspectMode;
        }
        if (sync.syncSettings.aspectCorrect) {
            if (cloud.settings !== undefined)
                document.getElementById('aspectCorrect').checked = cloud.settings.aspectCorrect;
        } else {
            if (local.settings !== undefined)
                document.getElementById('aspectCorrect').checked = local.settings.aspectCorrect;
        }
        if (sync.syncSettings.numberRequest) {
            if (cloud.settings !== undefined)
                document.getElementById('numberRequest').value = cloud.settings.numberRequest;
        } else {
            if (local.settings !== undefined)
                document.getElementById('numberRequest').value = local.settings.numberRequest;
        }
        if (sync.syncSettings.numDays) {
            if (cloud.settings !== undefined)
                document.getElementById('numDays').value = cloud.settings.numDays;
        } else {
            if (local.settings !== undefined)
                document.getElementById('numDays').value = local.settings.numDays;
        }
        if (sync.syncSettings.cycleTimer) {
            if (cloud.settings !== undefined)
                document.getElementById('cycleTimer').value = cloud.settings.cycleTimer;
        } else {
            if (local.settings !== undefined)
                document.getElementById('cycleTimer').value = local.settings.cycleTimer;
        }
        if (sync.syncSettings.showNSFW) {
            if (cloud.settings !== undefined)
                document.getElementById('showNSFW').checked = cloud.settings.showNSFW;
        } else {
            if (local.settings !== undefined)
                document.getElementById('showNSFW').checked = local.settings.showNSFW;
        }
    });
    });
    });
}

function upload_options() {
    const channelList = document.getElementById('channelList').value;
    const resolutionMin = document.getElementById('resolutionMin').value;
    const aspectMode = document.getElementById('aspectMode').value;
    const numDays = document.getElementById('numDays').value;
    let numberRequest = parseInt(document.getElementById('numberRequest').value);
    if (isNaN(numberRequest))
        numberRequest = 15;
    let cycleTimer = parseInt(document.getElementById('cycleTimer').value);
    if (isNaN(cycleTimer))
        cycleTimer = 5;
    const aspectCorrect = document.getElementById('aspectCorrect').checked;
    const showNSFW = document.getElementById('showNSFW').checked;

    chrome.storage.sync.set({
        settings: {
            channelList: channelList,
            resolutionMin: resolutionMin,
            aspectMode: aspectMode,
            aspectCorrect: aspectCorrect,
            showNSFW: showNSFW,
            numberRequest: numberRequest,
            cycleTimer: cycleTimer,
            numDays: numDays
        }
    }, function () {
        status.textContent = 'Setting Pushed to the cloud';
        setTimeout(function () {
            status.textContent = '';
        }, 2000);
    })
}

function download_options() {
    chrome.storage.sync.get(['settings'], function(cloud) {
        document.getElementById('channelList').value = cloud.settings.channelList;
        document.getElementById('resolutionMin').value = cloud.settings.resolutionMin;
        document.getElementById('aspectMode').value = cloud.settings.aspectMode;
        document.getElementById('aspectCorrect').checked = cloud.settings.aspectCorrect;
        document.getElementById('numberRequest').value = cloud.settings.numberRequest;
        document.getElementById('numDays').value = cloud.settings.numDays;
        document.getElementById('cycleTimer').value = cloud.settings.cycleTimer;
        document.getElementById('showNSFW').checked = cloud.settings.showNSFW;
        status.textContent = 'Setting Pulled from the cloud';
        setTimeout(function () {
            status.textContent = '';
        }, 2000);
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

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['syncSettings'], function(sync) {
    chrome.storage.local.get(['settings'], function(local) {
    chrome.storage.sync.get(['settings'], function(cloud) {
        if (sync.syncSettings && local.settings && cloud.settings)
            restore_options();
    })
    })
    })
});
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset').addEventListener('click', restore_options);
document.getElementById('download').addEventListener('click', download_options);
document.getElementById('upload').addEventListener('click', upload_options);