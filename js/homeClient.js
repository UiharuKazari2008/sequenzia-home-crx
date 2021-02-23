/*    ___                  __                        _______ __
     /   | _________ _____/ /__  ____ ___  __  __   / ____(_) /___  __
    / /| |/ ___/ __ `/ __  / _ \/ __ `__ \/ / / /  / /   / / __/ / / /
   / ___ / /__/ /_/ / /_/ /  __/ / / / / / /_/ /  / /___/ / /_/ /_/ /
  /_/  |_\___/\__,_/\__,_/\___/_/ /_/ /_/\__, /   \____/_/\__/\__, /
                                        /____/               /____/
Developed at Academy City Research
Public Release by Academy City Research Public Software Release
"Developing a better automated future"
======================================================================================
Sequenzia Project - Ambient Extension (Display Services)
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

let init = true;
let aspectCorrect = true;
let ambientModeState = true;
let ambientToggle = true;
const inactiveTimeout = 60000;
let timeoutId;

// Time
function dc(){
    const refresh=1000; // Refresh rate in milli seconds
    setTimeout(dct, refresh)
}
// Date
function dd(){
    const refresh=5000; // Refresh rate in milli seconds
    setTimeout(ddt, refresh)
}
// Day
function ddw(){
    const refresh=5000; // Refresh rate in milli seconds
    setTimeout(ddwt, refresh)
}

const month = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
const days = ["Sun", "Mon", "Tues", "Wens", "Thurs", "Fri", "Satur"]


function dct() {
    const d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    if (h < 10) { h = `0${h}` };
    if (m < 10) { m = `0${m}` };
    document.getElementById('time').innerHTML = `${h}:${m}`;
    dc();
}
function ddt() {
    const d = new Date();
    let mth = month[d.getMonth()];
    let dy = d.getDate();
    document.getElementById('date').innerHTML = ` ${mth} ${dy}`;
    dd();
}
function ddwt() {
    const d = new Date();
    let dow = days[d.getDay()];
    document.getElementById('day').innerHTML = `${dow}day`;
    ddw();
}

async function changeImage(data) {
    function getImageDimensions(file) {
        return new Promise (function (resolved, rejected) {
            const i = new Image()
            i.onload = function(){
                resolved({w: i.width, h: i.height})
            };
            i.src = file
        })
    }
    const imageFile = data.image;
    const dimensions = await getImageDimensions(imageFile)
    const aspectRatio = dimensions.h / dimensions.w
    let element_to = '';
    let element_from = '';
    if (document.getElementById("bg2").style.opacity === '0') {
        element_to = 'bg2';
        element_from = 'bg1';
    } else {
        element_to = 'bg1';
        element_from = 'bg2';
    }
    if (aspectRatio > 0.97 && aspectCorrect) {
        document.getElementById(element_to + 'port').src = imageFile;
        document.getElementById(element_to).classList.add('blur-this');
    }
    document.getElementById(element_to).style.backgroundImage = "url('" + imageFile + "')";
    //TODO: Add Disable Data Place
        let disaplyTime = 700
        if (init) {
            disaplyTime = 0
        }
        setTimeout(function () {
            document.getElementById('data1').innerText = `${data.location[0]} / ${data.location[1]}`;
            document.getElementById('data1s').innerText = `${data.location[0]} / ${data.location[1]}`;
            document.getElementById('data2s').innerText = data.id.substr(0,7);
            document.getElementById('data3').innerText = data.date;
            document.getElementById('data3s').innerText = data.date;
            document.getElementById('seperator').classList.remove('d-none');
            document.getElementById('seperator').classList.add('d-inline-block');
            if (data.pinned) {
                document.getElementById('dataFav').classList.remove('d-none')
                document.getElementById('dataFavs').classList.remove('d-none')
                document.getElementById('dataIcons').classList.add('d-none')
            } else {
                document.getElementById('dataFav').classList.add('d-none')
                document.getElementById('dataFavs').classList.add('d-none')
                document.getElementById('dataIcons').classList.remove('d-none')
            }
        }, disaplyTime)
    document.getElementById('imageLink').href = data.link;
    document.getElementById('imageDownload').href = 'http://seq.moe' + data.linkPerm;
    let animateTime = 1500
    if (init) {
        animateTime = 250
        init = false;
    }
    if (element_to === 'bg1') {
        $('#' + element_to).animate({ opacity: 1 }, animateTime);
        if (aspectRatio > 0.97 && aspectCorrect) {
            $('#' + element_to + 'port').animate({opacity: 1}, animateTime);
        }
    } else {
        document.getElementById(element_to).style.opacity = '1';
        if (aspectRatio > 0.97 && aspectCorrect) {
            document.getElementById(element_to + 'port').style.opacity = '1';
        }
        $('#' + element_from).animate({ opacity: 0 }, animateTime);
        $('#' + element_from + 'port').animate({ opacity: 0 }, animateTime);
    }
    setTimeout(function () {
        document.getElementById(element_from).style.opacity = '0';
        document.getElementById(element_from).style.backgroundImage = '';
        document.getElementById(element_from).classList.remove('blur-this');
        document.getElementById(element_from + 'port').src = '';
        document.getElementById(element_from + 'port').style.opacity = '0';
    }, 1700);
}

function setupPage() {
    chrome.storage.sync.get(['settings'], function(items) {
        if (items.settings !== undefined && items.settings.aspectCorrect !== undefined) {
            aspectCorrect = items.settings.aspectCorrect
        }
        chrome.storage.local.get(null, (data) => {
            if (data !== undefined) {
                const keys = Object.keys(data);
                if (keys.indexOf('userInfo') !== -1) {
                    document.getElementById('userName').innerText = data['userInfo'].user_username;
                    document.getElementById('userImage').src = `https://cdn.discordapp.com/avatars/${data['userInfo'].user_id}/${data['userInfo'].user_image}.jpg`;
                }
                const files = keys.filter((e) => { return e.includes('file-') });
                if (keys.indexOf('activity-last') !== -1) {
                    const count = files.length;
                    let last = data['activity-last'];
                    if (last < count - 1) {
                        last++;
                    } else {
                        last = 0;

                        console.log('Getting more images...');
                        chrome.extension.getBackgroundPage().getImages();
                    }
                    chrome.storage.local.set({'activity-last': last});

                    console.log(`Displaying Image #${last}`)
                    changeImage(data[files[last]]);
                } else {
                    chrome.storage.local.set({'activity-last': 0});

                    changeImage(data[files[0]]);
                }
            } else {
                console.log('Cannot get a new image, Refreshing...')
                chrome.extension.getBackgroundPage().getImages();
            }
        })
    })
}

function ambientMode() {
    ambientModeState = true;
    $('#center-search').animate({opacity: 0}, 500, () => {
        $('#center-search').addClass('d-none');
        $('#center-search')[0].style.opacity = null;
    });
    $('#homeBg').animate({opacity: 0}, 500, () => {
        $('#homeBg').addClass('d-none');
        $('#homeBg')[0].style.opacity = null;
    });
    document.getElementById('bottom-info').classList.remove('d-none')
    document.getElementById('ambientBg').classList.remove('d-none')
}
function normalMode() {
    ambientModeState = false;
    $('#bottom-info').animate({opacity: 0}, 500, () => {
        $('#bottom-info').addClass('d-none');
        $('#bottom-info')[0].style.opacity = null;
    });
    $('#ambientBg').animate({opacity: 0}, 500, () => {
        $('#ambientBg').addClass('d-none');
        $('#ambientBg')[0].style.opacity = null;
    });
    document.getElementById('center-search').classList.remove('d-none')
    document.getElementById('homeBg').classList.remove('d-none')
}

function startTimer() {
    timeoutId = window.setTimeout(ambientMode, inactiveTimeout);
}
function resetTimer() {
    window.clearTimeout(timeoutId);
    if (ambientToggle)
        startTimer();
    if (ambientModeState && ambientToggle)
        normalMode();
}
function ambientTimeout () {
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);

    startTimer();
}
function ambientModeForce() {
    ambientMode();
    ambientToggle = false;
}

$(document).ready(function () {
    chrome.storage.local.get(null, (data) => {
        if (data !== undefined && Object.keys(data).filter((e) => {return e.includes('file-')}).length > 0) {
            chrome.storage.local.get(['settings'], (settings) => {
                let cycleTime = 5;
                if (settings && settings.settings) {
                    if (settings.settings.cycleTimer && !isNaN(parseInt(settings.settings.cycleTimer))) {
                        cycleTime = settings.settings.cycleTimer;
                    }
                    if (settings.settings.cycleTimer && !isNaN(parseInt(settings.settings.cycleTimer))) {
                        cycleTime = settings.settings.cycleTimer;
                    }

                }
                // Only Setup when
                setupPage(); ambientTimeout();
                setInterval(setupPage, cycleTime * 60000);
            })
        } else {
            document.getElementById('data1').innerText = "Login Required, Click Here"
        }
    })

    dct(); ddt(); ddwt();

    document.getElementById("btnSearch").addEventListener("click", () => { $("#srchfrm").submit(); });
    document.getElementById("nextImage").addEventListener("click", setupPage);
    document.getElementById("ambientModeToggle").addEventListener("click", ambientModeForce);
    document.getElementById("btnSearchGallery").addEventListener("click", () => {
        window.location.href = `https://seq.moe/gallery?channel=random&pageinator=true&search=${document.getElementById('q').value}`; });
    document.getElementById("btnSearchFiles").addEventListener("click", () => {
        window.location.href = `https://seq.moe/files?channel=random&pageinator=true&search=${document.getElementById('q').value}`; });
})