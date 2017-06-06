import {YezBotConnect} from "./components/YezBotConnect";

const path = window.location.pathname;
const parse = path.substr(1).split('/');

const yezbot = new YezBotConnect("yezbot", "oauth:4205clljyhax1at6e37bn80b954j80", parse[1]);
