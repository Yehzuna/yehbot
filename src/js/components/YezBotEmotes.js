import {YezBotData} from "./YezBotData";

export class YezBotEmotes {
    constructor(channel) {
        this.channel = channel;
        this.overlay = document.querySelector(".overlay");
    }

    sendEmotes(message) {
        console.log(message)

        YezBotData.getEmotes(this.channel, message).then((json) => {
            const data = JSON.parse(json);
            console.log(data);

            data.forEach((id) => {
                this.add(id);
            })
        });
    }

    add(id) {
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
