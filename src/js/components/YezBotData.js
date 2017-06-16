export class YezBotData {
    constructor(channel) {
        //this.path = "http://yehzuna.byethost8.com";
        this.path = "http://yezbot.local";
    }

    static getBits(channel = "") {
        return YezBotData.get(`${this.path}/api/bits/${channel}`);
    }

    static setBits(channel = "", data) {
        return YezBotData.post(`${this.path}/api/bits/${channel}`, data);
    }

    static getEmotes(channel, data) {
        return YezBotData.post(`${this.path}/api/emotes/${channel}`, data);
    }

    static get(url) {
        return new Promise(function (resolve, reject) {
            const request = new XMLHttpRequest();
            request.open('GET', url, true);

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

    static post(url, data) {
        return new Promise(function (resolve, reject) {
            const request = new XMLHttpRequest();
            request.open('POST', url, true);
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
}
