class YezBotBits {
    constructor() {
        this.overlay = document.querySelector(".overlay");

        this.data = [
            {
                name: "Lorem",
                total: 500
            }, {
                name: "Ipsum",
                total: 400
            }, {
                name: "Praesent",
                total: 200
            }, {
                name: "Sollicitudin",
                total: 200
            }, {
                name: "Pminsfeen",
                total: 100
            }
        ].reverse();

        let ul = document.querySelector(".bits");
        if (ul === null) {
            ul = document.createElement('ul');
            ul.classList.add('bits');
            this.overlay.appendChild(ul);
        }
        this.parent = ul;

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

    playQueue() {
        const _self = this;

        if (_self.queue.length > 0) {
            let fn = _self.queue.shift();

            console.log(fn);

            setTimeout(function () {
                fn['fn'].apply();

                _self.playQueue();
            }, fn['delay']);
        } else {
            _self.loop();
        }
    }

    loop() {
        const _self = this;

        let loop = setInterval(function () {
            console.log("loop");

            if (_self.queue.length > 0) {
                clearInterval(loop);
                _self.playQueue();
            }
        }, 2000);
    }

    clean() {
        const _self = this;

        _self.addToQueue(function () {
            let els = document.querySelectorAll(".bits li");
            els = Array.prototype.slice.apply(els);
            console.log(els);

            els.forEach(function (li) {
                _self.addToQueue(function () {
                    li.remove();
                }, 300, false);

                _self.addToQueue(function () {
                    li.classList.add('clean');
                }, 0, false);
            });

        });
    }

    bits() {
        const _self = this;
        const ul = this.parent;
        const user = {
            name: "Sollicitudin",
            total: 100
        };

        let span = `<span>${user.name} a donné ${user.total} bits !</span>`;
        let li = document.createElement('li');
        li.insertAdjacentHTML('afterbegin', span);

        _self.clean();

        _self.addToQueue(function () {
            ul.insertBefore(li, ul.firstChild);
        }, 1000);

        _self.addToQueue(function () {
            console.log('delay');
        }, 3000);
    }

    list() {
        const _self = this;
        const ul = this.parent;
        const data = this.data;

        _self.clean();

        data.forEach(function (user, index) {
            let span = `<span>${data.length - index} - ${user.name} (${user.total})</span>`;
            let li = document.createElement('li');
            li.insertAdjacentHTML('afterbegin', span);

            _self.addToQueue(function () {
                ul.insertBefore(li, ul.firstChild);
            }, 1000);
        });

        _self.addToQueue(function () {
            console.log('delay');
        }, 3000);
    }
}