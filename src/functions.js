const fs = require("fs")
const { promisify } = require("util")

const readdir = promisify(fs.readdir)

const shopItemSchema = require('./schemas/shopItemSchema.js')
const userSchema = require('./schemas/userSchema.js')

async function loadFiles(dirName) {
    // get base path of the current working directory + the custom folder (e.g. commands, events)
    const basePath = `${process.cwd().replace(/\\/g, "/")}/src/${dirName}`

    // empty files array, stores files found
    const files = []
    // finds every item within basePath
    const items = await readdir(basePath) 

    // cycle through each item in basePath and add it to files array if its .js (commands and events)
    for (const item of items) {
        const itemPath = `${basePath}/${item}`
        // if .js, add to files that need to be registered
        if (itemPath.endsWith(".js")) {
            files.push(itemPath)
            delete require.cache[require.resolve(itemPath)]
        }
    }

    // return files (everything that needs registering)
    return files
}

async function loadCommands(client) {
    // remove currently registered commands
    await client.commands.clear()

    const commandsArray = []

    // load all files in commands dir (helper method above)
    const Files = await loadFiles("commands")

    // for each file, register its name and command object as part of bot client
    Files.forEach((file) => {
        const command = require(file)
        client.commands.set(command.data.name, command)
        // push command JSON data to commandsArray to register with the bot application
        commandsArray.push(command.data.toJSON())

        console.log(`Command: ${command.data.name} registered! ✅`)
    })

    client.application.commands.set(commandsArray)
}

async function loadEvents(client) {
    await client.events.clear()

    const Files = await loadFiles("events")

    Files.forEach((file) => {
        const event = require(file)

        const execute = (...args) => event.execute(...args, client)
        client.events.set(event.name, execute) 

        if (event.once) {
            client.once(event.name, execute)
        } else {
            client.on(event.name, execute)
        }

        console.log(`Event: ${event.name} registered! ✅`)
    })
}

// formula to calculate XP needed to level up to the next level (dynamic scaling)
/*
Level	XP Needed
1 → 2	110 XP
2 → 3	180 XP
3 → 4	260 XP
4 → 5	350 XP
5 → 6	450 XP
etc.
*/
function calculateXPToLevelUp(level) {
    return 10;
    //return Math.floor(10 * (level ** 2) + 50 * level + 50);
}

// add more here to add to shop
const shopItems = [
    //Badges
    { name: 'Moon', price: 100, type: 'badge', value: '🌙'},
    { name: 'Skull', price: 100, type: 'badge', value: '💀'},
    { name: 'Cat', price: 100, type: 'badge', value: '😺'},
    { name: 'Cookie', price: 250, type: 'badge', value: '🍪'},
    { name: 'Penguin', price: 250, type: 'badge', value: '🐧'},
    { name: 'Alien', price: 250, type: 'badge', value: '👾'},
    { name: 'Heart', price: 500, type: 'badge', value: '💖'},
    { name: 'Rabbit', price: 500, type: 'badge', value: '🐇'},
    { name: 'Dove', price: 750, type: 'badge', value: '🕊️'},
    { name: 'Black Heart', price: 750, type: 'badge', value: '🖤'},
    { name: 'Poop', price: 1000, type: 'badge', value: '💩'},
    
    //Colours
    { name: 'Black', price: 100, type: 'color', value: '#000000'},
    { name: 'White', price: 100, type: 'color', value: '#ffffff'},
    { name: 'Red', price: 100, type: 'color', value: '#ff0000'},
    { name: 'Orange', price: 100, type: 'color', value: '#ffa500'},
    { name: 'Yellow', price: 100, type: 'color', value: '#ffff00'},
    { name: 'Green', price: 100, type: 'color', value: '#008000'},
    { name: 'Blue', price: 100, type: 'color', value: '#0000ff'},
    { name: 'Pink', price: 100, type: 'color', value: '#ffc0cb'},
    { name: 'Purple', price: 100, type: 'color', value: '#800080'},
    { name: 'Turquoise', price: 500, type: 'color', value: '#40e0d0'},
    { name: 'Maroon', price: 500, type: 'color', value: '#800000'},
    { name: 'Rose Gold', price: 750, type: 'color', value: '#B76E79'},
    
    //Test Items
    { name: 'Expensive', price: 10000, type: 'color', value: '#000000'}
];

async function loadShop() {
    try {
        const existingItems = await shopItemSchema.find({}, 'name');

        // compare these 2 mapped arrays and remove whatever doesn't match
        const existingNames = existingItems.map(item => item.name);
        const newNames = shopItems.map(item => item.name);

        const itemsToRemove = existingNames.filter(name => !newNames.includes(name));

        if (itemsToRemove.length > 0) {
            await shopItemSchema.deleteMany({ name: { $in: itemsToRemove } });
            console.log(`Removed old items ${itemsToRemove.join(', ')} from shop database.`);
        }

        // build shop in db based on structure above
        for (const item of shopItems) {
            const existingItem = await shopItemSchema.findOne({ name: item.name });
            if (!existingItem) {
                const newItem = new shopItemSchema(item);
                await newItem.save();
                console.log(`Added new item ${item.name} to shop database.`)
            }
        }
        console.log("Successfully loaded shop.");
    }
    catch(error) {
        console.error("Error loading shop: ", error);
    }
}

async function getUserRecord(id) {
    // global function to get user record based on id

    // find user in db matching with their ID
    let userRecord = await userSchema.findOne({ userId: id });

    // if it doesn't exist for the user, create it and save it
    if (!userRecord) {
        userRecord = new userSchema({ 
            userId: id
        })
        await userRecord.save();
    }

    return userRecord;
}

module.exports = {
    loadFiles,
    loadEvents,
    loadCommands,
    calculateXPToLevelUp,
    shopItems,
    loadShop,
    getUserRecord,
}

