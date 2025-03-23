//listener that checks if a user sends a message

// import schemas relevant for db
const userSchema = require('../schemas/userSchema.js')
const { EmbedBuilder } = require("discord.js")
const { calculateXPToLevelUp } = require("../functions");

const DEBUG = process.env.DEBUG === 'true';

const cooldowns = new Map()
const COOLDOWN_TIME = 5000; // 5 seconds cooldown time to prevent spam

module.exports = {
    name: "messageCreate",
    once: false, //the event is listened out for continuously
    execute: async (message) => {
        if (message.author.bot) {
            return; //ends the event if the bot reads its own message
        }

        let user = message.author; //the user that sent the message
        let member = message.guild.members.cache.get(user.id); // get the user's member object to access guild info

        // track last time user gained xp and current time
        const lastXPTime = cooldowns.get(user.id);
        const currentTime = Date.now();

        // check cooldown based on current time and return if user isn't eligible for xp
        if (lastXPTime && currentTime - lastXPTime < COOLDOWN_TIME) {
            if (DEBUG) await message.reply(`You are on cooldown. Remaining time: ${Math.ceil((COOLDOWN_TIME - (currentTime - lastXPTime)) / 1000)} seconds.`)
            return;
        }
        
        // set cooldown once message sent
        cooldowns.set(user.id, currentTime)

        //find user in db matching with their ID
        let userRecord = await userSchema.findOne({ userId: user.id })

        //if it doesn't exist for the user, create it and save it
        if (!userRecord) {
            userRecord = new userSchema({ 
                userId: user.id, 
                xp: 0 ,
                level: 1
            })
            await userRecord.save()
        }

        //increases the user's xp by a random number between 1 and 10
        let gainedXP = Math.floor(Math.random() * 10) + 1;
        userRecord.xp += gainedXP;

        let requiredXP = calculateXPToLevelUp(userRecord.level);

        // if the user's XP exceeds threshold
        // LEVEL UP EVENT
        if (userRecord.xp >= requiredXP) {
            userRecord.level += 1; 
            userRecord.xp -= requiredXP; // remove old xp and carry remaining over

            // rng between 10 and 100 for coins gained on level up
            let coins = Math.floor(Math.random() * 100 - 10 + 1) + 10;

            userRecord.coins += coins;

            const embed = new EmbedBuilder()
                      .setTitle('🎉 Level Up!')
                      .setColor(userRecord.color) // change in the future(?)
                      .setDescription(`**${member.displayName}** advanced to level **${userRecord.level}**!`)
                      .setThumbnail(member.displayAvatarURL())
                      .setFooter({ text: `🪙 You gained ${coins} coins.` });

            await message.reply({embeds: [embed]});
        }

        //save to db
        await userRecord.save()

        //message user's current xp
        if (DEBUG) {
            await message.reply("XP Updated. Current XP: " + `${userRecord.xp}`);
        }
    },
}