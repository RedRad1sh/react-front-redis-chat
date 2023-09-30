import { getCookie, decodeJwt } from './utils';
import { server_host } from './global-config';

export function sendMessageSticker(img){
    var url = `${server_host}/post`;
    const token = getCookie("Authorization");
    const user = decodeJwt(token);
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `${img}`,
            name: `${user.userName}`,
            pfpUrl: `${user.pfpUrl}`
        })
    })
}

export function sendMessage (messageField) {
    var url = `${server_host}/post`;
    const token = getCookie("Authorization");
    const user = decodeJwt(token);
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `${messageField().value}`,
            name: `${user.userName}`,
            pfpUrl: `${user.pfpUrl}`
        })
    })
}