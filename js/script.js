/* 
THINGS TO IMPROVE ON
1. Find CORS workaround for checking that extension URL exists before taking user away from page
2. Check for if version number for extension exists and show error (API probably needed)
*/


let url1 = "https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&prodversion=";
let url2 = "&x=id%3D"
let url3 = "%26installsource%3Dondemand%26uc"
let versionDropdown = document.getElementById("versionDropdown");
let versionArray = [];
let version = document.forms[0].versionDropdown.value;
let browser;
let extensionID;
let userURL = document.getElementById("extensionURL").value;
let finalURL;
let flag1 = false;
let flag2 = false;
let checkValidFlag = false;
let downloadBtn = document.getElementById("downloadBtn");
let copyBtn = document.getElementById("copyBtn");
let addToTextboxText;
let error = document.getElementById("errorMessage");
let currentVersion;
let versionJSON;
let versionResponse;
let versionNumber;
let checkVersion100Flag = false;
let lastAvailableVer = 0;

console.log(window.innerWidth);
if (window.innerWidth < 600) {
    let bannerText = document.getElementById('bannerText');
    bannerText.innerHTML = 'Please consider <a href="https://buymeacoffee.com/lukegosnell" target="_blank">☕ buying me a coffee</a>! Thanks! \\(｀▽´)/';
}

// Programatically get current Chrome version number (flag checks for chromium version 100+).
// If first digit is 1, account for three digits. Otherwise account for two.
// Chrome version surpasses two digits as of 02/02/22.
function onPageLoad() {
    userURL.value="";
    $.getJSON('https://versionhistory.googleapis.com/v1/chrome/platforms/all/channels/stable/versions', function(data) {
        //console.log(`${JSON.stringify(data)}`);
        versionJSON = `${JSON.stringify(data)}`;
        let strPos1 = versionJSON.indexOf('"version":"') + 11;
        let strPos2 = versionJSON.indexOf('"version":') + 12;
        let strPos3 = versionJSON.indexOf('"version":') + 13;
        if (versionJSON[strPos1] == 1) {
            checkVersion100Flag = true;
        }
        if (checkVersion100Flag = true) {
            versionNumber = versionJSON[strPos1] + versionJSON[strPos2] + versionJSON[strPos3];
        } else {
            versionNumber = versionJSON[strPos1] + versionJSON[strPos2];
        }
        versionNumber = Number(versionNumber);
        console.log("Current Chrome version: " + versionNumber);
        populateArray();
    });
}

function populateArray() {
    // Populate array
    for (let i = 0; i < versionNumber; i++) {
        let addition = versionNumber - i;
        versionArray.push(addition);
    }

    // Populate version dropdown
    for(let i = 0; i < versionArray.length; i++) {
        let opt = versionArray[i];
        versionDropdown.innerHTML += "<option value=\"" + opt + "\">" + opt + "</option>";
    }
}

// Set flag1 to true when version number is selected
function versionSelect() {
    version = document.forms[0].versionDropdown.value;
    console.log(version);
    flag1 = true;
    checkflags();
}

// No need for browser name check. Don't want to check browser onload for sake of user privacy.

function autoDetect() {
    browser=get_browser();
    console.log(browser);
    if (browser.name == "Chrome") {
        if (browser.version <= lastAvailableVer) {
            console.log("invalid browser version");
            error.style = "display:flex";
            errorDiv.style = "display:flex";
            error.innerHTML = "Version " + browser.version +  " Incompatible";
            setTimeout(showError, 3000);
        } else {
            let detectedVersion = browser.version;
            console.log(detectedVersion);
            document.forms[0].versionDropdown.value = detectedVersion;
            version = detectedVersion;
            flag1 = true;
            checkflags();
        }
    } else {
        console.log("invalid browser");
        error.style = "display:flex";
        errorDiv.style = "display:flex";
        error.innerHTML = browser.name + " incompatible. Auto-detect failed.";
        setTimeout(showError, 3000);
    }
}

function showError() {
    console.log("showError trigger");
    error.style = "display:flex";
    errorDiv.style = "display:none";
    error.innerHTML = "";
}

// Set flag2 to true when extension URL is entered and matches length check.
function extensionEntered() {
    console.log("extendionEntered Hit");
    userURL = document.getElementById("extensionURL").value;
    console.log(userURL);
    if (userURL.length > 30) {
        flag2 = true;
        checkflags();
    } else {
        flag2 = false;
        checkflags();
    }
}

// Add suggested extension to textbox when clicked.
function addToTextbox(url) {
    console.log(url);
    addToTextboxText = "https://" + url;
    console.log(addToTextboxText);
    document.getElementById("extensionURL").value = addToTextboxText;
    flag2 = true;
    checkflags();
}

// Enable download and copy buttons when both flags are set to true.
function checkflags() {
    if (flag1 == true && flag2 == true){
        downloadBtn.disabled = false;
        copyBtn.disabled = false;
    } else {
        downloadBtn.disabled = true;
        copyBtn.disabled = true;
    }
}

// Generate URL for downloading with given extension and browser version.
function onDownload() {
    userURL = document.getElementById("extensionURL").value;
    extensionID = userURL;
    console.log(extensionID);
    extensionID = extensionID.split("/").pop();
    extensionID = extensionID.split('?')[0];
    console.log(extensionID);
    finalURL = url1 + version + url2 + extensionID + url3;
    console.log(finalURL);
    urlExists(finalURL);
    if (checkValidFlag = true) {
        window.location.href = finalURL;
    }
}

// Generate URL for copying to clipboard with given extension and browser version.
function onCopy() {
    userURL = document.getElementById("extensionURL").value;
    extensionID = userURL;
    console.log(extensionID);
    extensionID = extensionID.split("/").pop();
    extensionID = extensionID.split('?')[0];
    console.log(extensionID);
    finalURL = url1 + version + url2 + extensionID + url3;
    console.log(finalURL);
    urlExists(finalURL);
    if (checkValidFlag = true) {
        navigator.clipboard.writeText(finalURL);
        alert("Download URL copied to clipboard");
    }
}

// urlExists check function fails due to CORS security measure. Thus, it is bypassed (download is allowed anyway).

async function urlExists(furl) {
    const resp = await fetch(furl, { method: 'head' })
    .then(function(response) {
        if (response.ok) {
            // Tested by replacing 'furl' with endpoint from https://resttesttest.com/
            console.log("Extension URL exists");
            checkValidFlag = true;
        } else {
            console.log(response.status);
            console.log("Extension URL does not exist");
            error.style = "display:flex";
            errorDiv.style = "display:flex";
            error.innerHTML = "Extension URL does not exist";
            setTimeout(showError, 3000);
            checkValidFlag = false;
        }
    })
    .catch((err) => {
        // Allow download despite CORS error.
        console.log("A CORS error has occured: ", err);
        checkValidFlag = true;
    });
}


// Function (for getting user's browser) below taken from user Murb: https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
function get_browser() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
        }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
 }

function adblockScript() {
    const script = `
        youtube.com##+js(set, yt.config_.openPopupConfig.supportedPopups.adBlockMessageViewModel, false)

        youtube.com##+js(set, Object.prototype.adBlocksFound, 0)

        youtube.com##+js(set, ytplayer.config.args.raw_player_response.adPlacements, [])

        youtube.com##+js(set, Object.prototype.hasAllowedInstreamAd, true)

        ! Youtube

        !#if (!adguard_app_windows && !adguard_app_mac && !adguard_app_android)

        www.youtube.com#%#//scriptlet(‘abort-on-stack-trace’, ‘btoa’, ‘/[A-Za-z]lb \S+polymer/‘)

        ! For the closable popup

        youtube.com#?#ytd-enforcement-message-view-model:has(> div.ytd-enforcement-message-view-model)

        youtube.com#$#tp-yt-iron-overlay-backdrop { display: none !important; }

        youtube.com#$?#tp-yt-paper-dialog:has(> ytd-enforcement-message-view-model > div.ytd-enforcement-message-view-model) { remove: true; }

        ! For the overlay

        youtube.com#$#ytd-watch-flexy[player-unavailable] #player-container-outer.ytd-watch-flexy { visibility: visible !important; }

        youtube.com#$?#yt-playability-error-supported-renderers:has(yt-button-view-model[dialog-dismiss]) { display: none !important; }

        !#endif
    `
    navigator.clipboard.writeText(script);
}


 /* Outdated functions based on deprecated XMLHttpRequest() functionality.
 
 function onDownload() {
    userURL = document.getElementById("extensionURL").value;
    extensionID = userURL;
    console.log(extensionID);
    extensionID = extensionID.split("/").pop();
    console.log(extensionID);
    finalURL = url1 + version + url2 + extensionID + url3;
    console.log(finalURL);
    checkValid(finalURL);
    if (checkValidFlag = true) {
        window.location.href = finalURL;
    } else {
        console.log("FALSE!!!");
    }
}

function checkValid(fu) {
    var http = new XMLHttpRequest();
    http.open('HEAD', fu, false);
    http.send();
    if (http.status != 404) {
        checkValidFlag = true;
        console.log("checkValidFlag true");
    } else {
        checkValidFlag = false;
        console.log("checkValidFlag false");
    }
}

*/