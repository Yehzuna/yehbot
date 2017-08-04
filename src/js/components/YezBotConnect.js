import {YezBotCommands} from "./YezBotCommands";
import {YezBotCheers} from "./YezBotCheers";
import {YezBotEmotes} from "./YezBotEmotes";

export class YezBotConnect {
    constructor(username, password, channel = false, debug = false) {

        this.server = 'irc-ws.chat.twitch.tv';
        this.port = 443;

        this.username = username;
        this.password = password;
        this.channel = channel;
        this.debug = debug;

        if (channel) {
            this.services();
        }

        this.open();
    }

    open() {
        this.webSocket = new WebSocket(`wss://${this.server}:${this.port}/`, 'irc');
        this.webSocket.onmessage = (event) => this.onMessage(event);
        this.webSocket.onerror = (event) => this.onError(event);
        this.webSocket.onclose = () => this.onClose();
        this.webSocket.onopen = () => this.onOpen();
    };

    services() {
        this.commands = new YezBotCommands();
        this.cheers = new YezBotCheers(this.channel);
        this.emotes = new YezBotEmotes(this.channel);
    }

    join(channel) {
        if (this.webSocket !== null && this.webSocket.readyState === 1) {
            if (channel !== false) {
                this.channel = channel;
                this.webSocket.send('JOIN #' + this.channel);

                this.services();

                this.log(`Connecting to #${this.channel}...`);
            }
        } else {
            this.log("Socket error.");
        }
    };

    onOpen() {
        let socket = this.webSocket;

        if (socket !== null && socket.readyState === 1) {
            this.log("Authenticating...");

            socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
            socket.send('PASS ' + this.password);
            socket.send('NICK ' + this.username);

            this.join(this.channel);
        } else {
            this.log("Socket error.");
        }
    };

    onClose() {
        this.log("Disconnected from the server.");

        this.webSocket.close();
    };

    onError(event) {
        this.log("Error: " + event);
    };

    onMessage(event) {
        console.log(event);

        if (event !== null) {
            this.decodeMessage(event.data);
        }
    };

    sendMessage(message) {
        this.log(`Send PRIVMSG '${message}'`);

        this.webSocket.send(`PRIVMSG #${this.channel} :${message}\r\n`);
    };

    sendCommand(command, params) {
        if (typeof this.commands[command] === 'function') {
            this.commands[command](params);

            this.log(`Send PRIVMSG '${command}'`);
        }
    };

    sendCheers(params) {
        this.cheers.add({
            id: params.id,
            name: params.user,
            total: params.cheer
        });

        this.cheers.refresh();

        this.log(`Send Cheers (${params.user}/${params.cheer})`);
    };

    sendEmotes(params) {
        params['emotes'].forEach((emote) => {
            this.emotes.add(emote.id, emote.count);

            this.log(`Send Emote #${emote.id} (${emote.count})`);
        });
    };

    sendPong(data) {
        this.log("Send PONG");

        this.webSocket.send(`PONG ${data}`);
    };

    decodeMessage(message) {
        let decode = message.trim().split(' ');

        if (decode[0] === "PING") {
            this.sendPong(decode[1]);

            return false;
        }

        if (decode[1] === "JOIN") {
            this.log(`Connected to #${this.channel}.`);

            return false;
        }

        if (decode[2] === "GLOBALUSERSTATE") {
            this.log(`Connected to ${this.server}.`);

            return false;
        }

        if (message[0] === "@") {
            let parsedMessage = this.parsePrivateMessage(decode, message);

            if (!parsedMessage) {
                return false;
            }

            this.log(parsedMessage);

            if (parsedMessage['command']) {
                //this.sendCommand(parsedMessage['command'], parsedMessage);
            }

            if (parsedMessage['cheer'] > 0) {
                this.sendCheers(parsedMessage);
            }

            if (parsedMessage['emotes'].length > 0) {
                this.sendEmotes(parsedMessage);
            }

            return false;
        }
    };

    parsePrivateMessage(messageArray, messageStr) {

        if (messageArray[2] !== "PRIVMSG") {
            return null;
        }

        // tags
        let tagsArray = messageArray[0].slice(1).split(";");
        let tags = {};
        tagsArray.forEach((data) => {
            let split = data.split('=');

            if (split[1].split(',').length === 1) {
                tags[split[0]] = split[1];
            } else {
                if (split[0] === "emotes") {
                    tags[split[0]] = split[1];

                } else {
                    tags[split[0]] = split[1].split(',');

                }
            }
        });

        // message
        let str = messageStr.split(messageArray[3]);
        let message = str[1].trim().slice(1);

        // command
        let command = false;
        if (message[0] === '!') {
            command = message.slice(1).trim();
        }

        // cheer
        let cheer = 0;
        let match;
        const pattern = /cheer(\d+)/g;
        while (match = pattern.exec(message)) {
            cheer += parseInt(match[1]);
        }

        // user
        let user = "Anonymous";
        if (tags['display-name'] !== "") {
            user = tags['display-name'];
        } else {
            let userArray = messageArray[1].split('!');
            user = userArray[0].slice(1).trim();
        }

        // emotes
        let emotes = [];
        if (tags['emotes'] !== "") {
            let split = tags['emotes'].split('/');
            split.forEach((data) => {
                let emote = data.split(':');

                emotes.push({
                    id: emote[0],
                    count: emote[1].match(/\d+-\d/g).length
                });
            });
        }

        return {
            channel: messageArray[3],
            message: message,
            command: command,
            cheer: cheer,
            tags: tags,
            emotes: emotes,
            user: user,
            id: tags['user-id'] ,
            original: messageArray
        };
    };

    log(log) {
        console.log(log);

        if(this.debug) {
            let date = new Date().toTimeString();

            if (typeof log === 'string') {
                let div = document.querySelector(".log");
                div.innerHTML = `${div.innerHTML} ${date.split(' ')[0]} - ${log}<br/>`;
            }
        }
    }
}