import {YezBotBoss} from "./components/YezBotBoss";

const boss = new YezBotBoss();

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();

    let data = {};
    let formData = new FormData(this);
    for(let pair of formData.entries()) {
        //console.log(pair);
        if (pair[0] !== "name") {
            pair[1] = parseInt(pair[1]);
        }
        data[pair[0]] = pair[1];
    }

    console.log(data);
    boss.set(data);

    return false;
});
