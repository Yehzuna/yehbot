class YehBot {
    constructor(options) {

        this.server = 'irc-ws.chat.twitch.tv';
        this.port = 443;

        this.username = options.username;
        this.password = options.password;
        this.channel = options.channel;

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
            console.log('Connecting and authenticating...');

            socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
            socket.send('PASS ' + this.password);
            socket.send('NICK ' + this.username);
            socket.send('JOIN ' + this.channel);
        }
    };

    onClose() {
        console.log('Disconnected from the chat server.');

        this.webSocket.close();
    };

    onError(event) {
        console.log('Error: ' + event);
    };

    onMessage(event) {
        if (event !== null) {
            console.log(event);

            this.decodeMessage(event.data);
        }
    };

    sendMessage(message) {
        console.log('Send PRIVMSG');

        this.webSocket.send(`PRIVMSG ${this.channel} :${message}\r\n`);
    }

    sendNotice(user, message) {
        console.log('Send NOTICE');

        this.webSocket.send(`@msg-id=${user}:tmi.twitch.tv NOTICE ${user} :${message}\r\n`);
    }

    sendPong(data) {
        console.log('Send PONG');

        this.webSocket.send(`PONG ${data}`);
    }

    decodeMessage(message) {
        let decode = message.split(' ');
        //console.log(message);
        //console.log(decode);

        if (message[0] === '@') {
            let parse = this.parseMessage(decode);
            console.log(parse);
        }

        if (decode[0] === 'PING') {
            this.sendPong(decode[1]);
        }
    }

    parseMessage(messageArray) {

        if (messageArray[2] !== 'PRIVMSG') {
            return null;
        }

        // tags
        let tagsArray = messageArray[0].split(";");
        let tags = {};
        tagsArray.forEach(function (data) {
            let split = data.split('=');

            if(split[1].split(',').length === 1) {
                tags[split[0]] = split[1];
            } else {
                tags[split[0]] = split[1].split(',');
            }
        });

        // message
        let message = messageArray[4].slice(1);

        // command
        let command = false;
        if (message[0] === '!') {
            command = message.slice(1);
        }

        // user
        let userArray = messageArray[1].split('!');
        let user = userArray[0].slice(1);

        return {
            message: message,
            command: command,
            tags: tags,
            user: user,
            original: messageArray
        };
    }
}