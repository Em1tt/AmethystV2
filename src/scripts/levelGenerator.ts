const Canvas = require("canvas"),
  { MessageAttachment } = require("discord.js");
  var { readdir } = require("fs");

module.exports = {
  generateLevel: generateLevel
};

async function generateLevel(guild_id, channel_id, user, bot, client, isLvlUp) {
  client
    .db(guild_id)
    .collection("Levels")
    .findOne({ member: user.user.id }, (err, member) => {
      if(!member){
        return 
      }
      client
        .db(guild_id)
        .collection("Levels")
        .findOne({ type: "settings" }, (err, settings) => {
          if (!settings.enabled) return;
          if (settings.forceColor) {
            member.color = settings.color;
          }

          readdir("./assets", async (err, files) => {
            var background = await Canvas.loadImage(
              `./assets/${Math.floor(
                Math.random() * (files.length - 1 - 1 + 1) + 1
              )}.jpg`
            );
            var prefab = await Canvas.loadImage(
              `./assets/Pre-Rendered/LevelPrefab.png`
            );
            const avatar = await Canvas.loadImage(
              bot.users.cache
                .get(user.user.id)
                .displayAvatarURL({ format: "jpg" })
            );
            const canvas = Canvas.createCanvas(1000, 350);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(prefab, 0, 0, canvas.width, canvas.height);
            const progress = member.xp;
            const needed = Math.pow(member.level, 2) * 20;
            const guildRank = "#100000";
            const level = member.level;
            //Blue Circle
            ctx.beginPath();
            ctx.arc(
              (820 / needed) * progress + 90,
              261,
              56,
              0,
              Math.PI * 2,
              false
            );
            ctx.closePath();
            ctx.save();
            ctx.clip();
            ctx.fillStyle = member.color;
            ctx.fillRect((820 / needed) * progress + 90, 204, 112, 112);

            ctx.restore();

            //Blue Rectangle
            ctx.fillStyle = member.color;
            ctx.fillRect(90, 205, (820 / needed) * progress + 1, 111);

            //White Border on PFP
            ctx.beginPath();
            ctx.arc(91, 261, 56, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.save();
            ctx.clip();
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(35, 204, 200, 200);
            ctx.restore();

            //PFP
            ctx.beginPath();
            ctx.arc(91, 261, 52, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.save();
            ctx.clip();
            ctx.drawImage(avatar, 39, 209, 104, 104);

            ctx.restore();
            ctx.font = "50px sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(`${progress}/${needed}`, 500, 280);

            ctx.textAlign = "left";
            ctx.fillStyle = member.color;
            ctx.fillText(guildRank, 360, 80);

            ctx.textAlign = "left";
            ctx.fillStyle = member.color;
            ctx.fillText(level, 855, 80);

            const attachment = new MessageAttachment(
              canvas.toBuffer(),
              `${user.user.id}.jpg`
            );
            if(isLvlUp){
            return bot.guilds.cache
              .get(guild_id)
              .channels.cache.get(channel_id)
              .send(`Congratulations ${user}, you just levelled up!`, attachment);
            }else{
            return bot.guilds.cache
              .get(guild_id)
              .channels.cache.get(channel_id)
              .send(attachment);
            }
          });
        });
    });
}
