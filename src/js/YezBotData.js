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
}
