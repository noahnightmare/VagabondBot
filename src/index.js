// Import discord & dotenv dependencies from node_modules
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// Create the client instance for the discord bot (with relevant permissions)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.once("ready", () => {
    console.log("Hello world!"); // Log to console internally
    client.channels.cache.get('1339232487515099158').send("Hello world!"); // Log to discord channel
})

client.login(process.env.TOKEN);