class YezBotCommands {
    constructor() {
        this.overlay = document.querySelector(".overlay");

        this.data = [
            {
                name: "Lorem",
                total: 200
            }, {
                name: "Ipsum",
                total: 100
            }, {
                name: "Praesent",
                total: 100
            }, {
                name: "Sollicitudin",
                total: 100
            },

        ];

        let ul = document.querySelector(".bits");
        if (ul === null) {
            ul = document.createElement('ul');
            ul.classList.add('bits');
            this.overlay.appendChild(ul);
        }
        this.parent = ul;

        this.queue = [];
    }

    addToQueue(fn, delay = 0) {
        this.queue.push({
            fn: fn,
            delay: delay
        });
    }

    playQueue() {
        const _self = this;

        console.log(_self.queue.length);
        console.log("playQueue");

        if (_self.queue.length > 0) {
            let fn = _self.queue.shift();

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

        let els = document.querySelectorAll(".bits li");
        els = Array.prototype.slice.apply(els).reverse();

        els.forEach(function (li) {
            _self.addToQueue(function () {
                li.classList.add('clean');
            }, 500);
        });

        els.forEach(function (li) {
            _self.addToQueue(function () {
                li.remove();
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
    }
}