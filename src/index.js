// Import dependencies from node_modules
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const mongoose = require('mongoose')
require("dotenv").config();

const DEBUG = process.env.DEBUG === 'true';

// import loading functions for commands & events
const { loadEvents, loadCommands, loadShop } = require("./functions");

// Create the client instance for the discord bot (with relevant permissions)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.once("ready", async () => {

    // await the connection to the database before starting up
    await mongoose.connect(process.env.MONGO_DB, 
        {} // options
    )
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch(err => console.error('MongoDB connection error:', err));

    // add new items to shop in db if they don't exist already
    loadShop();

    // load appropriate events and commands from the bot created in respective folders
    client.commands = new Collection()
    client.events = new Collection()

    loadEvents(client)
    loadCommands(client)

    console.log("Bot is online."); // Log to console internally
    client.channels.cache.get(process.env.CHANNEL).send("Bot is online!"); // Log to discord channel

    if (DEBUG) {
        console.log("⚠️ Debug mode is enabled. If you wish to disable this, change the value to false in your .env file. ⚠️"); // Log to console internally
        client.channels.cache.get(process.env.CHANNEL).send("⚠️ Debug mode is enabled. If you wish to disable this, change the value to false in your .env file. ⚠️"); // Log to discord channel
    }
})

client.login(process.env.TOKEN);