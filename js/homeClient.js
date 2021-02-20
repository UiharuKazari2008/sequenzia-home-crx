// Time
function dc(){
    const refresh=1000; // Refresh rate in milli seconds
    setTimeout('dct()',refresh)
}
// Date
function dd(){
    const refresh=5000; // Refresh rate in milli seconds
    setTimeout('ddt()',refresh)
}
// Day
function ddw(){
    const refresh=5000; // Refresh rate in milli seconds
    setTimeout('ddwt()',refresh)
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

const requestURL = 'https://seq.moe/ambient-refresh'
//const requestURL = window.location.href.replace('/ambient', '/ambient-refresh');
let lastURL = '';

function getNextImage() {
    let imageURL = ''
    $.ajax({
        url: requestURL,
        type: "GET",
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.randomImage !== undefined) {
                if (response.randomImage[1] !== lastURL) {
                    //pullImage(response);
                    console.log(response);
                }
                console.log('getImage OK');
            } else {
                console.log(response);
                //window.location.href = '/ambient';
            }
        },
        error: function (response) {
            console.log('getImage Failed');
            if (response.status >= 500) {
                //location.reload();
            }
            console.log(response);
        }
    });
}
function checkLogin() {
    $.ajax({
        url: '/device-login?checklogin=true',
        type: "GET",
        processData: false,
        contentType: false,
        success: function (response) {
            if (response === 'true') {
                location.reload();
            }
        },
        error: function (response) {
        }
    });
}
function pullImage(data) {
    $.ajax({
        url: data.randomImage[1],
        type: "GET",
        processData: false,
        contentType: false,
        responseType: "arraybuffer",
        success: async function (response,  textStatus, xhr) {
            console.log('setImage OK')
            if (xhr.status === 200) {
                const dimensions = await getImageDimensions(response)
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
                if (aspectRatio > 0.97 && aspectMode === true) {
                    document.getElementById(element_to + 'port').src = response;
                    document.getElementById(element_to).classList.add('blur-this');
                }
                document.getElementById(element_to).style.backgroundImage = "url('" + response + "')";
                if (displayMode[1] !== '0') {
                    setTimeout(function () {
                        document.getElementById('data1').innerText = `${data.randomImage[4][0]} / ${data.randomImage[4][1]}`;
                        document.getElementById('data2').innerText = data.randomImage[5];
                        document.getElementById('data3').innerText = data.randomImage[3];
                        if (data.randomImage[7]) {
                            document.getElementById('dataFav').classList.remove('d-none')
                            document.getElementById('dataIcon').classList.add('d-none')
                        } else {
                            document.getElementById('dataFav').classList.add('d-none')
                            document.getElementById('dataIcon').classList.remove('d-none')
                        }
                    }, 700)
                }
                document.getElementById('imageLink').src = data.randomImage[6];
                if (element_to === 'bg1') {
                    $('#' + element_to).animate({ opacity: 1 }, 1500);
                    if (aspectRatio > 0.97 && aspectMode === true) {
                        $('#' + element_to + 'port').animate({opacity: 1}, 1500);
                    }
                } else {
                    document.getElementById(element_to).style.opacity = '1';
                    if (aspectRatio > 0.97 && aspectMode === true) {
                        document.getElementById(element_to + 'port').style.opacity = '1';
                    }
                    $('#' + element_from).animate({ opacity: 0 }, 1500);
                    $('#' + element_from + 'port').animate({ opacity: 0 }, 1500);
                }
                setTimeout(function () {
                    document.getElementById(element_from).style.opacity = '0';
                    document.getElementById(element_from).style.backgroundImage = '';
                    document.getElementById(element_from).classList.remove('blur-this');
                    document.getElementById(element_from + 'port').src = '';
                    document.getElementById(element_from + 'port').style.opacity = '0';
                }, 1700);
                lastURL = data.randomImage[1];
            } else {
                console.log(response);
            }
        },
        error: function (response) {
            console.log('setImage Failed')
            getNextImage();
            console.log(response);
        }
    });
}

getNextImage();