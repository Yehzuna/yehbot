export class YezBotEmotes {
    constructor(channel) {
        this.channel = channel;
        this.overlay = document.querySelector(".overlay");
    }

    add(id, count, animation = "bounce") {
        for(let i = 0; i < count; i++) {
            this[animation](id);
        }
    }

    bounce(id) {
        let element = document.createElement('img');
        element.src = `http://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`;
        element.classList.add('emote');
        element.classList.add('bounce');

        this.overlay.appendChild(element);
    }

    bounceInOut(id) {
        let element = document.createElement('img');
        element.src = `http://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`;
        element.classList.add('emote');
        element.classList.add('bounce-in-out');

        const delay = Math.floor((Math.random() * 5));
        element.classList.add(`delay-${delay}`);

        const duration = Math.floor((Math.random() * 5));
        element.classList.add(`duration-${duration}`);

        element.style.top = Math.floor((Math.random() * 100) + 1) + '%';
        element.style.left = Math.floor((Math.random() * 100) + 1) + '%';

        this.overlay.appendChild(element);
    }
}
