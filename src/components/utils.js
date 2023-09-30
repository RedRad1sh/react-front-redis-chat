import jwt from 'jwt-decode'

const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const stickerDict = {
    1: 'https://cdn140.picsart.com/279266365020211.png',
    2: 'https://cdn141.picsart.com/317144785180211.png',
    3: 'https://i.pinimg.com/originals/7a/04/20/7a0420e32946f4ee78c19da768e37892.png'
};


export function checkIfBase64(msg) {
    return base64regex.test(msg);
}

export function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function decodeJwt(token) {
    const user = jwt(token);
    return JSON.parse(user.user);
}

export function checkIfImgUrl(url) {
    return (url != null && url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null ? url : null);
}

export function stickerChooser(num) {
    return stickerDict[num];
}