//listener that checks if a user sends a message

module.exports = {
    name: "messageCreate",
    once: false, //the event is listened out for continuously
    execute(message) {
        if (message.author.bot) {
            return; //ends the event if the bot reads its own message
        }

        console.log(`${message.content}`);
        message.reply(`${message.content}`); //replies to the user with their own message
    },
}