import {YezBotConnect} from "./components/YezBotConnect";

let yezbot = new YezBotConnect("yezbot", "oauth:4205clljyhax1at6e37bn80b954j80", false, true);

document.querySelector("#join").addEventListener('click', function () {
    const channel = document.querySelector("#channel").value;

    yezbot.join(channel);
    document.querySelector("#iframe").src = `http://www.twitch.tv/${channel}/chat`;
});

document.querySelector("#add").addEventListener('click', function () {
    yezbot.sendCheers({
        id: 123,
        user: "Lorem",
        cheer: 100
    });
});

document.querySelector("#refresh").addEventListener('click', function () {
    yezbot.cheers.refresh();
});
