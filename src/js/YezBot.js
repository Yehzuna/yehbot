class YezBot {
    constructor(username, password, channel = false) {

        this.server = 'irc-ws.chat.twitch.tv';
        this.port = 443;

        this.username = username;
        this.password = password;
        this.channel = channel;

        this.commands = new YezBotCommands();

        this.open();
    }

    open() {
        this.webSocket = new WebSocket(`wss://${this.server}:${this.port}/`, 'irc');
        this.webSocket.onmessage = (event) => this.onMessage(event);
        this.webSocket.onerror = (event) => this.onError(event);
        this.webSocket.onclose = () => this.onClose();
        this.webSocket.onopen = () => this.onOpen();
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
            this.log("Error.");
        }
    };

    join(channel) {
        if (this.webSocket !== null && this.webSocket.readyState === 1) {
            if (channel !== false) {
                this.channel = channel;
                this.webSocket.send('JOIN ' + this.channel);

                this.log(`Connecting to ${this.channel}...`);
            }
        } else {
            this.log("Error.");
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

        this.webSocket.send(`PRIVMSG ${this.channel} :${message}\r\n`);
    };

    sendCommand(command, params) {
        if (typeof this.commands[command] === 'function') {
            this.commands[command](params);

            this.log(`Send PRIVMSG '${command}'`);
        }
    };

    sendPong(data) {
        this.log("Send PONG");

        this.webSocket.send(`PONG ${data}`);
    };

    decodeMessage(message) {
        let decode = message.trim().split(' ');
        console.log(decode);

        if (decode[0] === "PING") {
            this.sendPong(decode[1]);

            return false;
        }

        if (decode[1] === "JOIN") {
            this.log(`Connected to ${this.channel}.`);

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
                this.sendCommand(parsedMessage['command'], parsedMessage);
            }

            return false;
        }


        //> @badges=global_mod/1,turbo/1;color=#0D4200;display-name=dallas;emotes=25:0-4,12-16/1902:6-10;mod=0;room-id=1337;subscriber=0;turbo=1;user-id=1337;user-type=global_mod :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :Kappa Keepo Kappa
        //> @badges=staff/1,bits/1000;bits=100;color=;display-name=dallas;emotes=;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;turbo=1;user-id=1337;user-type=staff :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100
    };

    parsePrivateMessage(messageArray, messageStr) {

        if (messageArray[2] !== "PRIVMSG") {
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
        let str = messageStr.split(messageArray[3]);
        let message = str[1].trim().slice(1);

        // command
        let command = false;
        if (message[0] === '!') {
            command = message.slice(1).trim();
        }

        // user
        let userArray = messageArray[1].split('!');
        let user = userArray[0].slice(1).trim();

        return {
            channel: messageArray[3],
            message: message,
            command: command,
            tags: tags,
            user: user,
            original: messageArray
        };
    };

    log(log) {
        console.log(log);

        let date = new Date().toTimeString();

        if (typeof log === 'string') {
            let div = document.querySelector(".log");
            div.innerHTML = `${div.innerHTML} ${date.split(' ')[0]} - ${log}<br/>`;
        }
    }
}