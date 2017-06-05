import {YezBotData} from "./YezBotData";

export class YezBotEmotes {
    constructor() {
        this.overlay = document.querySelector(".overlay");

        this.list = YezBotData.setData("Un test d'émote <3 <3 KappaRoss WutFace Kappa Kappa MrDestructoid").then((json) => {

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

        element.style.top = Math.floor((Math.random() * 200) + 1) + 'px';
        element.style.left = Math.floor((Math.random() * 200) + 1) + 'px';

        this.overlay.appendChild(element);
    }
}
