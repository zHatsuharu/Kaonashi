const Discord = require("discord.js");
const client = new Discord.Client();
const cooldown = new Set();
const cdtime = 10;

client.on("message", message => {
    if (message.author.bot) return undefined;
    if (!message.guild) {
        require("./cmds.js")(Discord, client, message);
    } else {
        let muterole = message.guild.roles.find(role => role.name === "muted");
        if (message.guild && muterole && message.member.roles.find(r => r.name === "muted")) {
            return message.delete();
        } else {
            if (cooldown.has(message.author.id)) {
                require("./cmds.js")(Discord, client, message);
                return;
            } else {
                require("./rank.js")(Discord, client, message);
                require("./cmds.js")(Discord, client, message);
                cooldown.add(message.author.id);
                setTimeout(() => {
                    cooldown.delete(message.author.id);
                }, cdtime*1000);
            };
        };
    };
});

//client.on("message", message  => require("./cmds.js")(Discord, client, message));

client.on("ready", () => {
    console.log("Bot on.")
});

client.login("process.env.BOT_TOKEN");
