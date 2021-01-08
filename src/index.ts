const { Client } = require("discord.js"),
  { config } = require("dotenv"),
  bot = new Client(),
  { MongoClient } = require("mongodb");
config({ path: "./.env" });
const client = new MongoClient(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var { readdir } = require("fs");
const moment = require("moment");
function startUp(bot, client) {
  readdir("./src/events", async (err, files) => {
    files.forEach(file => {
      require(`./events/${file}`)(bot, client);
    });
  });
  readdir("./src/commands", async (err, files) => {
    files.forEach(file => {
      require(`./commands/${file}`).init(bot);
    });
  });
  require("./scripts/command_parser.ts")(bot, client);
}

bot.on("ready", () => {
  client.connect((err) => {
    if (err) return console.log(err);
    startUp(bot, client);
  });
});

bot.on("invalidated", () => {
  client.close();
  bot.destroy();
});

bot.on("error", (error) => {
  client.close();
  console.log(error);
});

bot.on("disconnect", () => {
  client.close();
});

bot.login(process.env.TOKEN);
