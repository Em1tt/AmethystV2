const timeout = new Set();
module.exports = async (bot, client) => {
  //#region Levels
  bot.on("message", async (message) => {
    client
      .db(message.guild.id)
      .collection("Levels")
      .findOne({ type: "settings" }, (err, settings) => {
        if (!settings.enabled) return;
        if (message.author.bot || message.system) return;

        if (timeout.has(message.author.id)) {
          return;
        } else {
          var xpGain = Math.floor(Math.random() * (settings.levelling.maxXP - settings.levelling.minXP + 1) + settings.levelling.minXP);
          client
          .db(message.guild.id)
          .collection("Levels")
          .findOne({ member: message.author.id }, (err, member) => {
            var xp;
            if(!member){
              xp = xpGain;
              var levelReq = Math.pow(1, 2) * 20
              if(xp >= levelReq){
                xp = xpGain - levelReq;
                client.db(message.guild.id).collection("Levels").insertOne({ member: message.author.id, color: "#ff9df6", xp: xp, level: 2});
                require("./level.ts").generateLevel(message.guild.id, message.channel.id, message.member, bot, client, true);
              }else{
                client.db(message.guild.id).collection("Levels").insertOne({ member: message.author.id, color: "#ff9df6", xp: xp, level: 1});
              }
            }else{
              xp = member.xp + xpGain;
            var levelReq = Math.pow(member.level, 2) * 20;
            if(xp >= levelReq){
              xp = member.xp + xpGain - levelReq;
              client.db(message.guild.id).collection("Levels").updateOne({ member: message.author.id }, {$set: { xp: xp, level: member.level + 1 }});
              require("./level.ts").generateLevel(message.guild.id, message.channel.id, message.member, bot, client, true);
            }else{
              client.db(message.guild.id).collection("Levels").updateOne({ member: message.author.id }, {$set: { xp: xp }});
            }
          }
          });
          timeout.add(message.author.id);
          setTimeout(() => {
            timeout.delete(message.author.id);
          }, settings.time);
        
        }
      });
    
  });
  //#endregion
};
