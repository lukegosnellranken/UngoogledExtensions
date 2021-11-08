let url1 = "https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&prodversion=";
let url2 = "&x=id%3D"
let url3 = "%26installsource%3Dondemand%26uc"
let version = document.forms[0].versionDropdown.value;
let extensionID;
let userURL = document.getElementById("extensionURL").value;
let finalURL;
let flag1 = false;
let flag2 = false;
let checkValidFlag = false;
let downloadBtn = document.getElementById("downloadBtn");
let addToTextboxText;

function onPageLoad() {
    userURL.value="";
}

function versionSelect() {
    version = document.forms[0].versionDropdown.value;
    console.log(version);
    flag1 = true;
    checkflags();
}

function extensionEntered() {
    console.log("extendionEntered Hit");
    userURL = document.getElementById("extensionURL").value;
    console.log(userURL);
    if (userURL.length > 10) {
        flag2 = true;
        console.log("length check");
        checkflags();
    } else {
        flag2 = false;
        checkflags();
    }
}

function addToTextbox(url) {
    console.log(url);
    addToTextboxText = "https://" + url;
    console.log(addToTextboxText);
    document.getElementById("extensionURL").value = addToTextboxText;
    flag2 = true;
    checkflags();
}

function checkflags() {
    console.log("check");
    if (flag1 == true && flag2 == true){
        downloadBtn.disabled = false;
    } else {
        downloadBtn.disabled = true;
    }
}

/* function onDownload() {
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
 */


/* function checkValid(fu) {
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
} */

function onDownload() {
    userURL = document.getElementById("extensionURL").value;
    extensionID = userURL;
    console.log(extensionID);
    extensionID = extensionID.split("/").pop();
    console.log(extensionID);
    finalURL = url1 + version + url2 + extensionID + url3;
    console.log(finalURL);
    urlExists(finalURL, function(exists) {
        if (exists) {
            checkValidFlag = true;
            console.log("checkValidFlag true");
        } else {
            checkValidFlag = false;
            console.log("checkValidFlag false");
        }
    });
    if (checkValidFlag = true) {
        window.location.href = finalURL;
    } else {
        console.log("FALSE!!!");
    }
}

function urlExists(finalURL, callback) {
    fetch(finalURL, { method: 'head' })
    .then(function(status) {
      callback(status.ok)
    });
}