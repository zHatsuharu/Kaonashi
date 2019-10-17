module.exports = async (Discord, client, message) => {

    //Additionnal modules
    const fs = require("fs");

    const sender = message.author;
    const embed = new Discord.RichEmbed()
    .setColor("4B0082")
    .setAuthor(sender.username, sender.displayAvatarURL)
    .setFooter(`- ${client.user.username}`, client.user.displayAvatarURL);

    function post(text) {
        message.channel.send(text);
    };

    function write(path, let) {
        fs.writeFileSync(path, JSON.stringify(let));
    };

    let userdata = JSON.parse(fs.readFileSync("./data/rank.json", "utf8"));
    if (!userdata[sender.id]) userdata[sender.id] = {
        xp : 0,
        level: 0,
        next: 100,
        totalxp: 0,
        money: 50,
        back: 1,
        name : sender.username
    };
    let udata = userdata[sender.id];
    if (udata.name != sender.username) { udata.name = sender.usename };
    function RandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var x = RandomInt(1, 15);
    udata.xp += x;
    udata.totalxp += x;
    if (udata.xp >= udata.next) {
        udata.xp -= udata.next;
        udata.level += 1;
        udata.next += 20*udata.level;
        embed.setDescription(`**${sender.username}** tu viens de passer au niveau **${udata.level}**`);
        post(embed);
    };

    write("./data/rank.json", userdata);

};