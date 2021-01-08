module.exports = (bot, client) => {
  bot.ws.on("INTERACTION_CREATE", async (interaction) => {
    var command = interaction.data.name;
    try{
        require(`../commands/${command}.ts`).run(bot, client, interaction);
    }catch(e){
        e;
    }
  });
};
