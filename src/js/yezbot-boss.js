import {YezBotBoss} from "./components/YezBotBoss";

const boss = new YezBotBoss();

document.getElementById('attack100').addEventListener('click', function() {
    boss.attack(100);
});

document.getElementById('attack200').addEventListener('click', function() {
    boss.attack(200);
});