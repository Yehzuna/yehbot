import {YezBotQueue} from "./YezBotQueue";
import {YezBotData} from "./YezBotData";

export class YezBotCheers extends YezBotQueue {
    constructor(channel) {
        super();

        this.data = [];
        this.channel = channel;
        this.overlay = document.querySelector(".overlay");

        let ul = document.querySelector(".cheers");
        if (ul === null) {
            ul = document.createElement('ul');
            ul.classList.add('cheers');
            this.overlay.appendChild(ul);
        }

        this.parent = ul;

        this.loop();

        this.refresh();
    }

    refresh() {
        console.log(this.channel);
        YezBotData.getCheers(this.channel).then((data) => {
            this.data = JSON.parse(data);
            this.list();
        });
    }

    clean() {
        const _self = this;

        _self.addToQueue(function () {
            let els = document.querySelectorAll(".cheers li");
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

    add(user) {
        const _self = this;
        const ul = this.parent;

        YezBotData.setCheers(this.channel, user);

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