/*    ___                  __                        _______ __
     /   | _________ _____/ /__  ____ ___  __  __   / ____(_) /___  __
    / /| |/ ___/ __ `/ __  / _ \/ __ `__ \/ / / /  / /   / / __/ / / /
   / ___ / /__/ /_/ / /_/ /  __/ / / / / / /_/ /  / /___/ / /_/ /_/ /
  /_/  |_\___/\__,_/\__,_/\___/_/ /_/ /_/\__, /   \____/_/\__/\__, /
                                        /____/               /____/
Developed at Academy City Research
"Developing a better automated future"
======================================================================================
Kanmi Project - Chrome Sharing Extension
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

function loadExtension() {
    getImages();
}

function getImages() {
    let cookieString = ''
    chrome.cookies.getAll({domain: 'seq.moe' }, (cookie) => {
        if (cookie) {
            for (const item of cookie) {
                cookieString += `${item.name}=${item.value};`
            }
            console.log(cookie.value);
            fetch('https://seq.moe/ambient-refresh?num=15', {
                method: 'GET',
                mode: "no-cors",
                cache: "no-cache",
                headers: {
                    "Cookie": cookieString
                }
            })
                .then((response) => response.text())
                .then(function(response) {
                    console.log(response)
                })
                .catch(function(error){
                    console.log('Failed to send your content')
                    console.log(error)
                    alert("Failed to send your request\n" + error.message.toString())
                })
        } else {
            console.log('Can\'t get cookie! Check the name!');
        }
    });
}


// On Chrome Startup
chrome.runtime.onStartup.addListener(function() {
    loadExtension()
});
// On Install or Manual Reload
chrome.runtime.onInstalled.addListener(function() {
    loadExtension()
});