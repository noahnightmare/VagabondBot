const fs = require("fs")
const { promisify } = require("util")

const readdir = promisify(fs.readdir)

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

module.exports = {
    loadFiles,
    loadEvents,
    loadCommands,
}