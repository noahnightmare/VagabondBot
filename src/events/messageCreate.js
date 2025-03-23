//listener that checks if a user sends a message

// import schemas relevant for db
const userSchema = require('../schemas/userSchema.js')

module.exports = {
    name: "messageCreate",
    once: false, //the event is listened out for continuously
    execute: async (message) => {
        if (message.author.bot) {
            return; //ends the event if the bot reads its own message
        }

        user = message.author; //the user that sent the message

        //find user in db matching with their ID
        let userRecord = await userSchema.findOne({ userId: user.id })

        //if it doesn't exist for the user, create it and save it
        if (!userRecord) {
            userRecord = new userSchema({ 
                userId: user.id, 
                xp: 0 
            })
            await userRecord.save()
        }

        //increases the user's xp by 1
        userRecord.xp += 1

        //message user's current xp
        message.reply("Current XP: " + `${userRecord.xp}`);

        //save to db
        await userRecord.save()
    },
}