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
}