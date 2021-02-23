/*    ___                  __                        _______ __
     /   | _________ _____/ /__  ____ ___  __  __   / ____(_) /___  __
    / /| |/ ___/ __ `/ __  / _ \/ __ `__ \/ / / /  / /   / / __/ / / /
   / ___ / /__/ /_/ / /_/ /  __/ / / / / / /_/ /  / /___/ / /_/ /_/ /
  /_/  |_\___/\__,_/\__,_/\___/_/ /_/ /_/\__, /   \____/_/\__/\__, /
                                        /____/               /____/
Developed at Academy City Research
"Developing a better automated future"
======================================================================================
Sequenzia Project - Ambient Extension (Data Refresh Services)
Copyright 2020
======================================================================================
This code is under a strict NON-DISCLOSURE AGREEMENT, If you have the rights
to access this project you understand that release, demonstration, or sharing
of this project or its content will result in legal consequences. All questions
about release, "snippets", or to report spillage are to be directed to:

- ACR Docutrol -----------------------------------------
(Academy City Research Document & Data Control Services)
docutrol@acr.moe - 484-362-9855 - docs.acr.moe/docutrol
====================================================================================== */

const baseURL = 'https://seq.moe'

function loadExtension() {
    chrome.storage.local.get(null, (data) => {
        if (data !== undefined) {
            const numFiles = Object.keys(data).filter((e) => { return e.includes('file-') }).length
            if (numFiles > 0) {
                console.log(`${numFiles} Images Found`);
            } else {
                console.log('No Images Found, Attempting to download data...');
                getImages();
            }
        } else {
            console.log('No Local Storage Found, Attempting to download data...');
            getImages();
        }
    })
}

function getImages() {
    let cookieString = ''
    chrome.cookies.getAll({domain: 'seq.moe' }, (cookie) => {
        if (cookie) {
            for (const item of cookie) {
                cookieString += `${item.name}=${item.value};`
            }
            chrome.storage.local.get(['settings'], function(sync) {
                let options = []
                if (sync.settings !== undefined) {
                    if (sync.settings.numberRequest !== undefined) {
                        options.push(`num=${sync.settings.numberRequest}`)
                    }
                    if (sync.settings.channelList !== undefined) {
                        options.push(`channel=${sync.settings.channelList}`)
                    }
                    if (sync.settings.resolutionMin !== undefined && sync.settings.resolutionMin !== 'NA') {
                        options.push(`minhres=${sync.settings.resolutionMin}`)
                    }
                    if (sync.settings.aspectMode !== undefined && sync.settings.aspectMode !== 'NA') {
                        options.push(`ratio=${sync.settings.aspectMode}`)
                    }
                    if (sync.settings.numDays !== undefined && sync.settings.numDays !== 'NA') {
                        options.push(`numdays=${sync.settings.numDays}`)
                    }
                    if (sync.settings.showNSFW !== undefined && sync.settings.showNSFW === true) {
                        options.push(`nsfw=true`)
                    } else {
                        options.push(`nsfw=false`)
                    }
                } else {
                    options.push(`num=5`)
                }

                const callURL = `${baseURL}/ambient-refresh?${options.join('&')}`
                console.log(callURL)
                fetch(callURL, {
                    method: 'GET',
                    mode: "no-cors",
                    cache: "no-cache",
                    headers: {
                        "Cookie": cookieString
                    }
                })
                    .then(response => response.text())
                    .then(function(response) {
                        if (response !== undefined && response.length > 10 && response.includes('randomImage')) {
                            const responseJSON = JSON.parse(response)
                            if (responseJSON && responseJSON.randomImage && responseJSON.randomImage.length && responseJSON.randomImage.length > 0) {
                                console.log(`Got Resonse from Seqienzia, got ${responseJSON.randomImage.length}`);
                                chrome.storage.local.set({userInfo: {
                                        user_id: responseJSON.user_id,
                                        user_image: responseJSON.user_image,
                                        user_username: responseJSON.user_username
                                    }}, () => {
                                    parseResponse(responseJSON, cookieString);
                                });
                            } else {
                                console.error('Did not get a valid response, no images were returned');
                            }
                        } else {
                            console.error(`Did not get a valid image list, you may need to login`);
                        }
                    })
                    .catch(function(error){
                        console.log(`Failed to send your content: ${error.message.toString()}`);
                    })
            });
        } else {
            //chrome.tabs.create({'url':`${baseURL}/`})
            console.error(`No Cookies exist for ${baseURL}, can not get any data from authorised server`);
        }
    });
}

function parseResponse(refreshResponse, cookieString) {
    chrome.storage.local.get(null, (data) => {
        Object.keys(data).filter((e) => { return e.includes('file-') }).forEach((key) => {
            chrome.storage.local.remove([`${key}`])
        })
        let parsedItems = 0;
        refreshResponse.randomImage.forEach((image, i, a) => {
            fetch(`${baseURL}${image[1]}`, {
                method: 'GET',
                mode: "no-cors",
                cache: "no-cache",
                headers: {
                    "Cookie": cookieString
                }
            })
                .then((response) => response.text())
                .then(function (response) {
                    parsedItems++;
                    if (response.length > 5) {
                        let _obj = {};
                        _obj[`file-${image[8]}`] = {
                            id: image[8],
                            date: image[3],
                            description: image[2],
                            location: image[4],
                            link: image[6],
                            linkPerm: image[9],
                            pinned: image[7],
                            image: response,
                        };
                        chrome.storage.local.set(_obj, () => {
                            console.log(`Saved ${image[8]}!`);
                            if (parsedItems === a.length) {
                                chrome.storage.local.getBytesInUse(null , (txt) => {
                                    chrome.storage.local.set({'activity-last': 0});
                                    console.log(`Total Usage: ${(txt / (1024 * 1024)).toFixed(2)} MB`)
                                });
                            }
                        });
                    }
                })
                .catch(function (error) {
                    console.log('Failed to get image');
                    console.log(error);
                })
        });
    })
}


// On Chrome Startup
chrome.runtime.onStartup.addListener(function() {
    loadExtension()
});
// On Install or Manual Reload
chrome.runtime.onInstalled.addListener(function() {
    loadExtension()
});