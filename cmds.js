module.exports = async (Discord, client, message) => {

    const prefix = "§";
    const sender = message.author;

    const args = message.content.split(" ").slice(1);
    const cmd = message.content.split(" ")[0];

    const fs = require("fs");
    const Canvas = require("canvas");
    const snekfetch = require("snekfetch");

    const embed = new Discord.RichEmbed()
    .setColor("4B0082")
    .setFooter(`- ${client.user.username}`, client.user.displayAvatarURL)
    .setAuthor(sender.username, sender.displayAvatarURL);

    function post(text) {
        message.channel.send(text);
    };

    if (cmd == prefix + "avatar") {
        embed.setImage(sender.displayAvatarURL);
        post(embed);
    };

    if (cmd == prefix + "mute") {
        if (message.channel.type === "dm") {
            embed.setDescription("Cette commande est utilisable seulement dans un serveur.");
            return post(embed);
        };
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            embed.setDescription("Tu n'as pas la permission requise.");
            return post(embed);
        };
        if (!args[0]) {
            embed.setDescription("L'argument ``<utilisateur>`` est manquant.\n**§mute <utilisateur>**");
            return post(embed);
        };
        let user = message.mentions.users.first();
        if (args[0] == undefined || args[0] != user) {
            embed.setDescription("L'argument ``<utilisateur>`` est invalide.\n- Vérifier qu'il s'agit d'une personne mentionnée ;\n- La personne ne doit pas être dans le serveur ;\n- La mention doit être après la commande **§mute <utilisateur>**.");
            return post(embed);
        };
        let muterole = message.guild.roles.find(role => role.name === "muted");
        let mutemember = message.mentions.members.first();
        if (!muterole) {
            message.guild.createRole(data = {
                name : "muted",
                mentionable: "false",
                premissions: 0
            }).then(() => {
                let muterole = message.guild.roles.find(role => role.name === "muted");
                if (!mutemember.roles.find(r => r.name === "muted")) {
                    embed.setDescription(`Tu as décidé de mute **${user.username}**, il ne pourra plus parler dans les salons textuels jusqu'à nouvel ordre.`);
                    mutemember.addRole(muterole);
                    post(embed);
                } else {
                    embed.setDescription(`**${user.username}** est déjà mute. Si tu veux l'unmute, fait **§unmute**.`);
                    post(embed);
                };
            });
        } else {
            if (!mutemember.roles.find(r => r.name === "muted")) {
                embed.setDescription(`Tu as décidé de mute **${user.username}**, il ne pourra plus parler dans les salons textuels jusqu'à nouvel ordre.`);
                mutemember.addRole(muterole);
                post(embed);
            } else {
                embed.setDescription(`**${user.username}** est déjà mute. Si tu veux l'unmute, fait **§unmute**.`);
                post(embed);
            };
        };
    };

    if (cmd == prefix + "unmute") {
        if (message.channel.type === "dm") {
            embed.setDescription("Cette commande est utilisable seulement dans un serveur.");
            return post(embed);
        };
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            embed.setDescription("Tu n'as pas la permission requise.");
            return post(embed);
        };
        if (!args[0]) {
            embed.setDescription("L'argument ``<utilisateur>`` est manquant.\n**§unmute <utilisateur>**");
            return post(embed);
        };
        let user = message.mentions.users.first();
        let mutemember = message.mentions.members.first();
        if (args[0] == undefined || args[0] != user || !mutemember.roles.find(r => r.name === "muted")) {
            embed.setDescription("L'argument ``<utilisateur>`` est invalide.\n- Vérifier qu'il s'agit d'une personne mentionnée ;\n- La personne ne doit pas être dans le serveur ;\n- La mention doit être après la commande **§unmute <utilisateur>** ;\n- Vérifier que la personne est mute.");
            return post(embed);
        };
        let muterole = message.guild.roles.find(role => role.name === "muted");
        embed.setDescription(`Tu as décidé d'unmute **${user.username}**, il peut à nouveau parler dans les salons textuels. Du moins, si il reste sage.`);
        mutemember.removeRole(muterole);
        post(embed);
    };

    if (cmd == prefix + "leveltest") {
        let userdata = JSON.parse(fs.readFileSync("./data/rank.json", "utf8"));
        let udata = userdata[sender.id];
        embed.setDescription(`\\▪ Level : **${udata.level}**\n\\▪ XP : **${udata.xp}/${udata.next}**\n\\▪ XP total : **${udata.totalxp}**`);
        post(embed);
    };

    if (cmd == prefix + "level") {
        let userdata = JSON.parse(fs.readFileSync("./data/rank.json", "utf8"));
        let udata = userdata[sender.id];

        let color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);

        const canvas = Canvas.createCanvas(937, 286);
        const ctx = canvas.getContext("2d");

        //First - Drawing bakcground + cache
        let background = await Canvas.loadImage("./Images rank/backgrounds/background" + udata.back + ".png");
        let cache = await Canvas.loadImage("./Images rank/cache.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(cache, 0, 0, canvas.width, canvas.height);

        //Second - Get Avatar + xp
        const { body: buffer } = await snekfetch.get(sender.displayAvatarURL);
        const avatar = await Canvas.loadImage(buffer);
        ctx.drawImage(avatar, 25, 45, 195, 195);

        let pourcentage = udata.xp*100/udata.next;
        let bar = 645 * pourcentage / 100;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineCap = "butt";
        ctx.lineWidth = 48;
        ctx.moveTo(252, 204);
        ctx.lineTo(bar + 252, 204);
        ctx.stroke();

        //Third - Correction
        let correction = await Canvas.loadImage("./Images rank/corrections/correction" + udata.back + ".png");
        let correcache = await Canvas.loadImage("./Images rank/correcache.png");
        ctx.drawImage(correction, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(correcache, 0, 0, canvas.width, canvas.height);

        //Fourth - cadre avatar + XP bar
        let cadreA = await Canvas.loadImage("./Images rank/cadre avatar.png");
        let cadreXP = await Canvas.loadImage("./Images rank/cadre barre xp.png");
        ctx.drawImage(cadreA, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(cadreXP, 0, 0, canvas.width, canvas.height);

        //Fifth - Texts
        function Text (txt1, txt2) {
            const ctx = canvas.getContext("2d");
            let fontSize = 40;
            do {
                ctx.font = `bold ${fontSize -= 5}px DejaVu Sans`;
            } while (ctx.measureText(txt1).width > canvas.width - 547);
            ctx.fillText(txt1, canvas.width/2 - 175, canvas.height/2 + 10);
            ctx.font = "bold 20px DejaVu Sans";
            ctx.fillStyle = "#3F3F3F";
            ctx.fillText(txt2, ctx.measureText(txt1).width*(fontSize/20) + canvas.width/2 - 160, canvas.height/2 + 5);
        };

        Text(sender.username, `#${sender.discriminator}`);

        ctx.font = "25px DejaVu Sans";
        ctx.fillStyle = "black";
        ctx.fillText(`${udata.xp}/${udata.next}`, canvas.width/4*3+60, canvas.height/2 + 4);

        ctx.font = "bold 75px DejaVu Sans";
        ctx.fillText(udata.level, canvas.width/4*3+77.5, canvas.height/2 - 40);

        let rank = 1;

        for (var i in userdata) {
            if (udata.totalxp < userdata[i].totalxp) {
                rank += 1;
            };
        };

        ctx.fillText(`#${rank}`, canvas.width/2, canvas.height/2 - 40);

        const attachment = new Discord.Attachment(canvas.toBuffer(), `Carte de ${sender.username}.jpg`);
        post(attachment);
    };

    if (cmd == prefix + "background") {
        let userdata = JSON.parse(fs.readFileSync("./data/rank.json", "utf8"));
        let udata = userdata[sender.id];

        if (!args[0] || isNaN(args[0])) {

        } else if (args[0] == udata.back) {
            embed.setDescription("Tu possède déjà ce background.");
            return post(embed);
        } else {
            if (fs.existsSync(`./Images rank/backgrounds/background${args[0]}.png`)) {
                udata.back = args[0];
                const canvas = Canvas.createCanvas(937, 286);
                const ctx = canvas.getContext('2d');

                let background = await Canvas.loadImage(`./Images rank/backgrounds/background${args[0]}.png`)
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                const attachment = new Discord.Attachment(canvas.toBuffer(), `background${args[0]}.jpg`);
                message.channel.send("Tu as modifié ton background", attachment);
                fs.writeFileSync("./data/rank.json", JSON.stringify(userdata));
            } else {
                embed.setDescription("Le background demandé n'existe pas.");
                post(embed);
            };
        };
    };

    if (cmd == prefix + "rank") {
        let userdata = JSON.parse(fs.readFileSync("./data/rank.json", "utf8"));
        let data = [""];
        let user = "";
        let debug = 0;
        let limiter = 0;
        let ref = 0;

        while (limiter != 3) {
            for (var i in userdata) {
                if (limiter <= 0) {
                    if (userdata[i].totalxp > debug) {
                        user = userdata[i];
                        debug = userdata[i].totalxp;
                    };
                } else {
                    if (userdata[i].totalxp > debug && userdata[i].totalxp < ref) {
                        user = userdata[i];
                        debug = userdata[i].totalxp;
                    };
                };
            };
            debug = 0;
            ref = user.totalxp;
            data.push(`${limiter+1} - ${user.name} niveau ${user.level} avec ${user.totalxp}`);
            limiter += 1;
        };
        embed.setDescription(data);
        post(embed);
    };

    if (cmd == prefix + "annonce") {
        if (sender.id != 193772442173440000 || message.channel.type != "dm") { return undefined };
        if (!args[0]) {
            embed.setDescription("Pour faire une annonce, tu dois ajouter un texte : ``§annonce <text>``");
            return post(embed);
        };
        let annonceChannel = client.guilds.get("254715534883553281").channels.get("487936163433414666");
        embed.setDescription("L'annonce a bien été envoyée.");
        annonceChannel.send(args.join(" "));
        post(embed);


    };
    if (cmd == prefix + "test") {
        embed.setDescription("Message de test.");
        post(embed);
    };
};
