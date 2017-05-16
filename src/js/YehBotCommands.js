class YehBotCommands {
    constructor() {
        this.overlay = document.querySelector('.overlay');

        this.data = [
            {
                name: "Lorem",
                total: 200
            }, {
                name: "Ipsum",
                total: 100
            }, {
                name: "Praesent",
                total: 100
            }, {
                name: "Sollicitudin",
                total: 100
            },

        ];
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

    clean() {
        const data = this.data;

        let li = document.querySelectorAll(".bits li");
        console.log(li);

        li.forEach(function (li , index) {
            setTimeout(function () {
               li.classList.add('clean');
            }, 1000 * index);
        });
    }


    bits() {

        let ul = document.querySelector(".bits");
        if (ul === null) {
            ul = document.createElement('ul');
            ul.classList.add('bits');
            this.overlay.appendChild(ul);
        }

        const data = this.data;

        data.forEach(function (user, index) {

            let span = document.createElement('span');
            span.innerHTML = `${index + 1} - ${user.name} (${user.total})`;

            let li = document.createElement('li');
            li.appendChild(span);

            setTimeout(function () {
                ul.appendChild(li);

                setTimeout(function () {
                    li.classList.add('opacity-' + index);
                }, 1000);
            }, 1000 * index);
        });
    }
}