export class YezBotData {

    static getData() {
        return new Promise(function (resolve, reject) {
            const request = new XMLHttpRequest();
            request.open('GET', "api.php", true);

            request.onload = function () {
                if (request.status === 200) {
                    resolve(request.response);
                } else {
                    reject(Error('Error' + request.statusText));
                }
            };
            request.onerror = function () {
                reject(Error('There was a network error.'));
            };

            request.send();
        });
    }

    static setData(data) {
        return new Promise(function (resolve, reject) {
            const request = new XMLHttpRequest();
            request.open('POST', "api.php", true);
            request.setRequestHeader("Content-Type", "application/json");

            request.onload = function () {
                if (request.status === 200) {
                    resolve(request.response);
                } else {
                    reject(Error('Error' + request.statusText));
                }
            };
            request.onerror = function () {
                reject(Error('There was a network error.'));
            };

            request.send(JSON.stringify(data));
        });
    }


    static getEmotes() {
        let index = 0;
        const timeout = 10000;
        const url = "https://api.twitch.tv/kraken/chat/emoticon_images?client_id=5enpkcr8pv8n4b84d60nm6tt2w07q4";

        return new Promise((resolve, reject) => {
            const callback = '__callback';
            const timeoutID = window.setTimeout(() => {
                reject(new Error('Request timeout.'));
            }, timeout);

            window[callback] = response => {
                window.clearTimeout(timeoutID);
                resolve(response.data);
            };

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + callback;
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }
}
