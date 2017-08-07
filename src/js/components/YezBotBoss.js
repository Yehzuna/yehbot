export class YezBotBoss {
    constructor(channel) {
        this.channel = channel;
        this.overlay = document.querySelector(".overlay");
        this.boss = document.querySelector(".boss");

        this.data = {
            name: "Un boss",
            hp: 900,
            hpMax: 1000,
            mp: 20,
            mpMax: 100,
        };

        this.set(this.data);
    }

    format(data) {
        if (data.hp > data.hpMax) {
            data.hp = data.hpMax
        }

        if (data.hp < 0) {
            data.hp = 0
        }

        if (data.mp > data.mpMax) {
            data.mp = data.mpMax
        }

        if (data.mp < 0) {
            data.mp = 0
        }

        return data;
    }

    set(data) {
        data = this.format(data);

        // Boss name
        this.boss.querySelector(".title").innerHTML = data.name;

        // HP
        const hp = data.hp * 100 / data.hpMax;
        this.boss.querySelector(".bar.hp .progress").style.width = `${hp}%`;
        this.boss.querySelector(".status .hp").innerHTML= `HP: ${data.hp}/${data.hpMax}`;

        // HP color
        this.boss.querySelector(".bar.hp").classList.remove('med');
        this.boss.querySelector(".bar.hp").classList.remove('min');
        if (hp <= 50) {
            this.boss.querySelector(".bar.hp").classList.add('med');
        }
        if (hp <= 20) {
            this.boss.querySelector(".bar.hp").classList.add('min');
        }

        // test
        this.boss.classList.add('damage');

        // MP
        const mp = data.mp * 100 / data.mpMax;
        this.boss.querySelector(".bar.mp .progress").style.width = `${mp}%`;
        this.boss.querySelector(".status .mp").innerHTML= `MP: ${data.mp}/${data.mpMax}`;

        // Save data
        this.data = data;
    }
}
