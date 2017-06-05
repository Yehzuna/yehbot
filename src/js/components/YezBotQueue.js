export class YezBotQueue {
    constructor() {
        this.queue = [];
    }

    addToQueue(fn, delay = 0, push = true) {
        if (push) {
            this.queue.push({
                fn: fn,
                delay: delay
            });
        } else {
            this.queue.unshift({
                fn: fn,
                delay: delay
            });
        }
    }

    loop() {
        const _self = this;

        if (_self.queue.length > 0) {
            let fn = _self.queue.shift();
            console.log(fn);

            setTimeout(function () {
                fn['fn'].apply();

                _self.loop();
            }, fn['delay']);
        } else {
            let loop = setInterval(function () {
                console.log("loop");

                if (_self.queue.length > 0) {
                    clearInterval(loop);
                    _self.loop();
                }
            }, 2000);
        }
    }
}
