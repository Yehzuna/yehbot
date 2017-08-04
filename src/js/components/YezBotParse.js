export class YezBotParse {

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
}