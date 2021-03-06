export class YezBotData {

    static getCheers(channel) {
        return YezBotData.get(`http://yezbot.local/api/${channel}/cheers`);
    }

    static setCheers(channel, data) {
        return YezBotData.post(`http://yezbot.local/api/${channel}/cheers`, data);
    }

    static get(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    resolve(request.response);
                } else {
                    reject(Error(request.statusText));
                }
            };

            request.onerror = () => {
                reject(Error("There was a network error."));
            };

            request.send();
        });
    }

    static post(url, data) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('POST', url, true);
            request.setRequestHeader("Content-Type", "application/json");

            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    resolve(request.response);
                } else {
                    reject(Error(request.statusText));
                }
            };

            request.onerror = () => {
                reject(Error("There was a network error."));
            };

            request.send(JSON.stringify(data));
        });
    }
}
