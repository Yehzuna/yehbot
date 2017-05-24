import {YezBotData} from "./YezBotData";

export class YezBotEmotes {
    constructor() {
        this.overlay = document.querySelector(".overlay");

        let regex = {};

        this.list = YezBotData.setData("Un test d'émote <3 <3 KappaRoss WutFace Kappa Kappa MrDestructoid").then(function (json) {

            const data = JSON.parse(json);
            console.log(data);
        });
    }

    user(params) {

    }
}
