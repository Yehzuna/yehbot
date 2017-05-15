class YehBotCommands {
    constructor() {
        this.overlay = document.querySelector('.overlay');
    }

    user(params) {

        let str = params.user;
        if (params.tags['display-name'] !== "") {
            str = params.tags['display-name'];
        }

        let color = "#fff";
        if (params.tags['color'] !== "") {
            color = params.tags['color'];
        }

        let element = document.createElement('div');
        element.classList.add('user');
        element.style.color = color;
        element.innerHTML = str;

        this.overlay.appendChild(element);
    }

    bits() {

        let ul = document.querySelector(".bits");
        if (ul === null) {
            ul = document.createElement('ul');
            ul.classList.add('bits');
            this.overlay.appendChild(ul);
        }

        let data = [
            {
                name: "personne 1",
                total: 200
            }, {
                name: "personne 2",
                total: 100
            }, {
                name: "personne 3",
                total: 100
            }, {
                name: "personne 4",
                total: 100
            },

        ];

        for (let i = 0; i < data.length; i++) {
            let span = document.createElement('span');
            span.innerHTML = data[i].name;

            let li = document.createElement('li');
            li.appendChild(span);

            setTimeout(function () {
                ul.appendChild(li);
            }, 1000*i);
        }
    }
}