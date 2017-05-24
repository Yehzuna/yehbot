import {YezBotData} from "./YezBotData";

export class YezBotEmotes {
    constructor() {
        this.overlay = document.querySelector(".overlay");

        let regex = [];
        let images = {};

        this.list = YezBotData.getEmotes().then(function (data) {
            console.log(data);

            /*
            let data = JSON.parse(json);

            data.emoticons.forEach(function (emote) {
                regex.push(emote.regex);
                images[emote.regex] = emote.images[0].url;
            });

            console.log(regex.length);
            console.log(images.length);
            */
        });
    }

    user(params) {

    }
}
