module.exports = {
    init: (bot) => {
    const json = {
        "name": "level",
            "description": "Create a rank card",
            "options": [
                {
                    "name": "user",
                    "description": "Mention of the user",
                    "type": 6,
                    "required": false
                }
            ]
        }
    
    bot.api.applications(bot.user.id).guilds("790148428612370442").commands.post({
        data: json
    });
    },
    run: (bot, client, interaction) => {
        if(!interaction.data.options){
        require("../scripts/levelGenerator.ts").generateLevel(interaction.guild_id, interaction.channel_id, interaction.member, bot, client, false);
        }else{
            console.log(interaction.data.options)
            var member = bot.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.data.options[0].value);
            console.log(member);
            require("../scripts/levelGenerator.ts").generateLevel(interaction.guild_id, interaction.channel_id, member, bot, client, false);
            };
    },
};