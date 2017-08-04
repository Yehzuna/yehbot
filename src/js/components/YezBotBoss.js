export class YezBotEmotes {
    constructor(channel) {
        this.channel = channel;
        this.overlay = document.querySelector(".overlay");
        this.boss = document.querySelector(".boss");


        const data = {
            name: "Un boss",
            hp: 900,
            hp_max: 1000,
            mp: 20,
            mp_max: 100,
        };

        this.set(data);
    }

    set(data) {
        this.boss.querySelector(".title").innerHTML = data.name;

        const hp = data.hp * 100 / data.hp_max;
        this.boss.querySelector(".bar.hp .progress").style.width = `${hp}%`;
        this.boss.querySelector(".status .hp").innerHTML= `HP: ${data.hp}/${data.hp_max}`;

        const mp = data.mp * 100 / data.mp_max;
        this.boss.querySelector(".bar.mp .progress").style.width = `${mp}%`;
        this.boss.querySelector(".status .mp").innerHTML= `MP: ${data.mp}/${data.mp_max}`;
    }
}
