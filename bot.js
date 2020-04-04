const Discord = require("discord.js");
const client = new Discord.Client();
const cooldown = new Set();
const cdtime = 10;
const SQLite = require("better-sqlite3");
const sql = new SQLite("./data/rank.sqlite");

client.on("message", message => {
    let rank = client.getRank.get(message.author.id);

    if (message.author.bot) return undefined;
    if (!message.guild) {
        require("./cmds.js")(Discord, client, message, rank, sql);
    } else {
        let muterole = message.guild.roles.find(role => role.name === "muted");
        if (message.guild && muterole && message.member.roles.find(r => r.name === "muted")) {
            return message.delete();
        } else {
            if (cooldown.has(message.author.id)) {
                require("./cmds.js")(Discord, client, message, rank, sql);
                return;
            } else {
                require("./rank.js")(Discord, client, message, rank, sql);
                require("./cmds.js")(Discord, client, message, rank, sql);
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
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='rank'").get();
    // Generate data for XP (rank) mode.
    if (!table["count(*)"]) {
        sql.prepare("CREATE TABLE rank (id TEXT PRIMARY KEY, user TEXT, guild TEXT, exp INTEGER, level INTEGER, next INTEGER, exptotal INTEGER, rank INTEGER, back INTEGER);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_rank_id on rank (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mod = wal");
    };
    // Generate constance to easly get info
    client.getRank = sql.prepare("SELECT * FROM rank WHERE id = ?");
    client.setRank = sql.prepare("INSERT OR REPLACE INTO rank (id, user, guild, exp, level, next, exptotal, rank, back) VALUES (@id, @user, @guild, @exp, @level, @next, @exptotal, @rank, @back)");

    console.log("Bot on.")
});

client.login(process.env.BOT_TOKEN);
