const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js")

// import schemas relevant for db
const xpSchema = require('../schemas/userSchema.js')

module.exports = {
    data: new SlashCommandBuilder()
      .setName("editxp")
      .setDescription("Edit a user's XP.")
      .addIntegerOption(option => 
        option
          .setName("xp")
          .setDescription("The amount of XP to edit")
          .setRequired(true)
      )
      .addUserOption((option) => 
        option
          .setName("user")
          .setDescription("The user to edit XP for. (can be blank for yourself)")
          .setRequired(false)
      ),
    execute: async ({ interaction }) => {
        // delays the bot response a little by making it "thinking"
        await interaction.deferReply().catch(() => {})

        // assign user if specified, otherwise use user that sent cmd
        let user;
        if (interaction.options.getMember("user") != null) {
            user = interaction.options.getMember("user")
        }
        else {
             user = interaction.member;
        }

        // find user in db matching with their ID
        let userRecord = await xpSchema.findOne({ userId: user.id })

        // if it doesn't exist for the user, create it and save it
        if (!userRecord) {
            userRecord = new xpSchema({ 
                userId: user.id, 
                xp: 0 
            })
            await userRecord.save()
        }

        // append edited xp
        userRecord.xp += interaction.options.getInteger("xp")
        // save to db
        userRecord.save()
        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        interaction.editReply(`XP edited.`)
    },
}