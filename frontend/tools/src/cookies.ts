/**
 * This file contains functions to set and get cookies.
 * Code is taken from the W3Schools website: https://www.w3schools.com/js/js_cookies.asp
 */

/**
 * The parameters of the function above are the name of the cookie (cname), the value of the cookie (cvalue), and the number of days until the cookie should expire (exdays).
 * 
 * The function sets a cookie by adding together the cookiename, the cookie value, and the expires string.
 * 
 * @param {string} cname cookie name
 * @param {string?} cvalue set to undefined to delete cookie
 * @param {number} exdays default 1 day
 */
export function setCookie(cname: string, cvalue: string = "", exdays: number = 1) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + (!cvalue ? "Thu, 01 Jan 1970 00:00:00 UTC" : d.toUTCString());
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=None; Secure";
}

/**
 * Take the cookiename as parameter (cname).
 * 
 * Create a variable (name) with the text to search for (cname + "=").
 * 
 * Decode the cookie string, to handle cookies with special characters, e.g. '$'
 * 
 * Split document.cookie on semicolons into an array called ca (ca = decodedCookie.split(';')).
 * 
 * Loop through the ca array (i = 0; i < ca.length; i++), and read out each value c = ca[i]).  
 *   
 * If the cookie is found (c.indexOf(name) == 0), return the value of the cookie (c.substring(name.length, c.length).
 * 
 * If the cookie is not found, return "".
 * @param {string} cname 
 * @returns cookie value or empty string
 */
export function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}