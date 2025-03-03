// Import discord & dotenv dependencies from node_modules
const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config();

// import loading functions for commands & events
const { loadEvents, loadCommands } = require("./functions");

// Create the client instance for the discord bot (with relevant permissions)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.once("ready", () => {
    // load appropriate events and commands from the bot created in respective folders
    client.commands = new Collection()
    client.events = new Collection()

    loadEvents(client)
    loadCommands(client)

    console.log("Hello world!"); // Log to console internally
    client.channels.cache.get('1339232487515099158').send("Hello world!"); // Log to discord channel
})

client.login(process.env.TOKEN);