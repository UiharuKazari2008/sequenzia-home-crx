let init = true;
let aspectCorrect = true;

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
            //document.getElementById('data2').innerText = data.id;
            document.getElementById('data3').innerText = data.date;
            document.getElementById('seperator').classList.remove('d-none');
            document.getElementById('seperator').classList.add('d-inline-block');
            if (data.pinned) {
                document.getElementById('dataFav').classList.remove('d-none')
            } else {
                document.getElementById('dataFav').classList.add('d-none')
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

async function setupPage() {
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

$(document).ready(function () {
    chrome.storage.local.get(null, (data) => {
        if (data !== undefined && Object.keys(data).filter((e) => {return e.includes('file-')}).length > 0) {
            setupPage();
            setInterval(setupPage, 300000);
        } else {
            document.getElementById('data1').innerText = "Login Required, Click Here"
        }
    })

    document.getElementById("btnSearch").addEventListener("click", () => { $("#srchfrm").submit(); });
    document.getElementById("nextImage").addEventListener("click", setupPage);
    document.getElementById("btnSearchGallery").addEventListener("click", () => {
        window.location.href = `https://seq.moe/gallery?channel=random&pageinator=true&search=${document.getElementById('q').value}`; });
    document.getElementById("btnSearchFiles").addEventListener("click", () => {
        window.location.href = `https://seq.moe/files?channel=random&pageinator=true&search=${document.getElementById('q').value}`; });
})
