module.exports = async (Discord, client, message, rank, sql) => {

    const sender = message.author;
    const embed = new Discord.RichEmbed()
    .setColor("4B0082")
    .setAuthor(sender.username, sender.displayAvatarURL)
    .setFooter(`- ${client.user.username}`, client.user.displayAvatarURL);

    function post(text) {
        message.channel.send(text);
    };

    if (!rank) {
        rank = {
            id: sender.id,
            user: sender.username,
            guild: message.guild.id,
            exp: 0,
            level: 0,
            next: 100,
            exptotal: 0,
            rank: 0,
            back: 1
        };
        client.setRank.run(rank);
    } else {
        if (rank.user != sender.username) {
            sql.prepare(`UPDATE rank SET user = "${sender.username}" WHERE id = "${sender.id}"`).run();
        };
    };

    const top = sql.prepare(`SELECT * FROM rank WHERE guild = ? ORDER BY exptotal DESC;`).all(message.guild.id);

    var i = 1;
    for (const data of top) {
        if (data.id == sender.id) {
            rank.rank = i;
            client.setRank.run(rank);
        } else {
            i += 1;
        };
    };

    function RandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var x = RandomInt(1, 15);
    rank.exp += x;
    rank.exptotal += x;
    client.setRank.run(rank);
    if (rank.exp >= rank.next) {
        rank.exp -= rank.next;
        rank.level += 1;
        rank.next += 20*rank.level;
        client.setRank.run(rank);
        embed.setDescription(`**${sender.username}** tu viens de passer au niveau **${rank.level}**`);
        const channel = client.channels.get(696367297505394728);
        channel.send(embed);
    };

};
