class YehBot {
    constructor(options) {

        this.server = 'irc-ws.chat.twitch.tv';
        this.port = 443;

        this.username = options.username;
        this.password = options.password;
        this.channel = options.channel;

        this.commands = new YehBotCommands();

        this.open();
    }

    open() {
        this.webSocket = new WebSocket('wss://' + this.server + ':' + this.port + '/', 'irc');

        this.webSocket.onmessage = (event) => this.onMessage(event);
        this.webSocket.onerror = (event) => this.onError(event);
        this.webSocket.onclose = () => this.onClose();
        this.webSocket.onopen = () => this.onOpen();
    };

    onOpen() {
        let socket = this.webSocket;

        if (socket !== null && socket.readyState === 1) {
            this.log("Connecting and authenticating...");

            socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
            socket.send('PASS ' + this.password);
            socket.send('NICK ' + this.username);
            socket.send('JOIN ' + this.channel);
        }
    };

    onClose() {
        this.log("Disconnected from the chat server.");

        this.webSocket.close();
    };

    onError(event) {
        this.log("Error: " + event);
    };

    onMessage(event) {
        if (event !== null) {
            this.decodeMessage(event.data);
        }
    };

    sendMessage(message) {
        this.log("Send PRIVMSG " + message);

        this.webSocket.send(`PRIVMSG ${this.channel} :${message}\r\n`);
    };

    sendCommand(command, params) {
        if (typeof this.commands[command] === 'function'){
            this.commands[command](params);

            this.log("Send COMMAND " + command);
        }
    };

    sendPong(data) {
        this.log("Send PONG");

        this.webSocket.send(`PONG ${data}`);
    };

    decodeMessage(message) {
        let decode = message.split(' ');

        if (message[0] === '@') {
            let parsedMessage = this.parseMessage(decode);

            this.log(parsedMessage);

            if (!parsedMessage) {
                return false;
            }

            if (parsedMessage['command']) {
                this.sendCommand(parsedMessage['command'], parsedMessage);
            }
        }

        if (decode[0] === 'PING') {
            this.sendPong(decode[1]);
        }
    };

    parseMessage(messageArray) {

        if (messageArray[2] !== 'PRIVMSG') {
            return null;
        }

        // tags
        let tagsArray = messageArray[0].slice(1).split(";");
        let tags = {};
        tagsArray.forEach(function (data) {
            let split = data.split('=');

            if (split[1].split(',').length === 1) {
                tags[split[0]] = split[1];
            } else {
                tags[split[0]] = split[1].split(',');
            }
        });

        // message
        let message = messageArray[4].slice(1).trim();

        // command
        let command = false;
        if (message[0] === '!') {
            command = message.slice(1).trim();
        }

        // user
        let userArray = messageArray[1].split('!');
        let user = userArray[0].slice(1).trim();

        return {
            message: message,
            command: command,
            tags: tags,
            user: user,
            original: messageArray
        };
    };

    log(log) {
        console.log(log);

        let date = new Date();

        if (typeof log === 'string') {
            let div = document.querySelector('.log');
            div.innerHTML = `${div.innerHTML} ${date.toTimeString()} - ${log} \t\n`;
        }
    }
}


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