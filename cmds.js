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
    
    function RandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
    
    if (cmd == prefix + "sexemachine") {
        if (!args[0]) {
            embed.setDescription("Il manque un argument : ``§sexemachine <argument>``");
            return post(embed);
        };
        let love = RandomInt(0, 100);
        let user = message.mentions.users.first();
        let object = "";
        let sentence = "";

        if (args[0] == undefined || args[0] != user) {
            object = args.join(" ");
        } else {
            object = user.username;
        };

        if  (love < 5) {
            sentence = "Même avec une protection, n'insère rien dedans.";
        };
        if (love >= 5 && love < 10) {
            sentence = "Alors franchement, à part chopper des MST je vois pas.";
        };
        if (love >= 10 && love < 15) {
            sentence = "Oula, qu'est-ce que tu vas faire malheureux.";
        };
        if (love >= 15 && love < 20) {
            sentence = "Bon ok, je vois que tu t'en fous, mais bon, je vais te donner un conseil... Fais gaffe.";
        };
        if (love >= 20 && love < 25) {
            sentence = "Vas y, protège toi, protège toi bien même."
        };
        if (love >= 25 && love < 30) {
            sentence = "Tu peux y aller mais fais pas de gosses avec. Je ne veux surtout pas voir leurs gueules."
        };
        if (love >= 30 && love < 35) {
            sentence = "Tu as fait des efforts, mais pas assez..."
        };
        if (love >= 35 && love < 40) {
            sentence = "Écoute, tu t'approches du potable, mais c'est pas clair comme de l'eau de roche (T'as capté ;) )."
        };
        if (love >= 40 && love < 45) {
            sentence = "Encore un peu d'acharnement et c'est bon.";
        };
        if (love >= 45 && love < 50) {
            sentence = "Tu pourras bientôt y aller sans protections.";
        };
        if (love >= 50 && love < 55) {
            sentence = "Bien jouer sans \"armure\".";
        };
        if (love >= 55 && love < 60) {
            sentence = "Alors tu adores ?";
        };
        if (love >= 60 && love < 65) {
            sentence = "Hmm you touch my tralala.";
        };
        if (love >= 65 && love < 70) {
            sentence = "Bon je vois que tu te débrouille sans moi.";
        };
        if (love >= 70 && love < 75) {
            sentence = "Au putain, c'est quoi ce truc tellement SEXE ?!";
        };
        if (love >= 75 && love < 80) {
            sentence = "Rentre sans hésiter.";
        };
        if (love >= 80 && love < 85) {
            sentence = "Plonge même dedans tellement que c'est bien.";
        };
        if (love >= 85 && love < 90) {
            sentence = "Salut salut, Oh oups pardon c'est très hot ici.";
        };
        if (love >= 90 && love < 95) {
            sentence = "En fait, fais le kamasutra.";
        };
        if (love >= 95 && love < 100) {
            sentence = "Plonge, nage, mange, bois, lèche tout de cette chose.";
        };
        if (love >= 100) {
            var ahegao = [
                "https://cdn.discordapp.com/attachments/635205251187867648/635214033322246144/296268007073201.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214032412082177/283385900031201.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214044764307477/avatars-000307252135-gkulsa-t500x500.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214051139649546/foto_244717.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214055124238346/hqdefault.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214059930779649/m8KBJAIs_400x400.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214064724738079/old_did_kurwo9221968487.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214069460238360/original_1.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214075600699413/original.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214079841140757/superthumb.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214086422003746/unknown_10.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214091350179851/unnamed_1.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214097872584745/2c0.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214101324365846/2fba712.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214103987748876/5eea10f2fc372d53f72fec174557cf9d.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214107888320512/8ccf13fe001d0b25ae9aa0540f318edd.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214111885623306/91b0949c1ec68aebf93d7b219bdb07ed.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214115027288087/256fx256f.jfif",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214120609775617/2196_ahegao.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214122497081344/4855_aqua_ahegao.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214126473281536/3174437c26ded18165af7e687236b91a.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214128453255208/57952108_134237447725352_8148113747382657492_n.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214132697628742/67974455_1606819619455381_4051605962153263104_n.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214135226925066/1506326659_preview_aoNP1x0_700b.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214139568029725/1506326659_preview_f2223d5805f727d8326c0e5da5245f91.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214141769908227/1506326659_preview_new-ahegao-face-drawing-meme-40-best-ahegao-images-on-pinterest.jpg",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214149307203614/1521312748_Space_Ahegao_1.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214150552780820/1521312863_Space_Ahegao_10.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214163521830934/1521312863_Space_Ahegao_12.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214173252485180/282929576021211.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214353699962922/3119610EF57879D9E5D5F8FBB336D9C16EA00B0C.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214386419466270/14603F8AE10EF9940EB5A790ECE88746A2CBA20F.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214469512953872/294916132097211.png",
                "https://cdn.discordapp.com/attachments/635205251187867648/635214676543930388/b58d96f773e74d676fd012b1cb12ac29.png"
              ];
              let img = ahegao[Math.floor(Math.random() * ahegao.length)];
            sentence = "";
            embed.setImage(img);
        };

        embed.setDescription(`La Sexe Machine à mesurer le sexe appeal de **${object}**.\nLes résultats montrent qu'il est de **${love}%**.\n${sentence}`);
        post(embed);
    };
    
};
