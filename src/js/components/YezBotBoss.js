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

    reset() {
        this.boss.classList.remove('damage');
        this.boss.classList.remove('healing');

        console.log(this.boss.querySelectorAll(".message"));
        this.boss.querySelectorAll(".message").forEach((message) => {
            console.log(message);
            message.remove();
        })
    }

    set(data) {
        data = this.format(data);

        const message = document.createElement('div');
        message.classList.add('message');

        // Boss name
        this.boss.querySelector(".title").innerHTML = data.name;

        // HP
        const hp = data.hp * 100 / data.hpMax;
        this.boss.querySelector(".bar.hp .progress").style.width = `${hp}%`;
        this.boss.querySelector(".bar.hp .count").innerHTML = `${hp}%`;
        this.boss.querySelector(".status .hp").innerHTML = `HP: ${data.hp}/${data.hpMax}`;

        let diff = data.hp - this.data.hp;
        if (diff !== 0) {
            if (diff < 0) {
                message.classList.add('minus');
                message.innerHTML = `HP${diff}`;
            } else {
                message.classList.add('plus');
                message.innerHTML = `HP+${diff}`;
            }
            this.boss.appendChild(message);
        }

        // MP
        const mp = data.mp * 100 / data.mpMax;
        this.boss.querySelector(".bar.mp .progress").style.width = `${mp}%`;
        this.boss.querySelector(".bar.mp .count").innerHTML = `${mp}%`;
        this.boss.querySelector(".status .mp").innerHTML = `MP: ${data.mp}/${data.mpMax}`;

        // HP color
        this.boss.querySelector(".bar.hp").classList.remove('danger');
        this.boss.querySelector(".bar.hp").classList.remove('critical');
        if (hp <= 50) {
            this.boss.querySelector(".bar.hp").classList.add('danger');
        }
        if (hp <= 20) {
            this.boss.querySelector(".bar.hp").classList.add('critical');
        }

        // Animation
        if (this.data.hp > data.hp) {
            this.boss.classList.add('damage');
        } else if (this.data.hp < data.hp) {
            this.boss.classList.add('healing');
        }

        // Animation reset
        setTimeout(() => this.reset(), 1500);

        // Save data
        this.data = data;

    }
}