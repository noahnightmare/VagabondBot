const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js")

// import schemas relevant for db
const userSchema = require('../schemas/userSchema.js')

module.exports = {
    data: new SlashCommandBuilder()
      .setName("xp")
      .setDescription("Get a user's XP.")
      .addUserOption((option) => option
        .setName("user")
        .setDescription("The user you want to get information about (can be blank for yourself)")
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
        let userRecord = await userSchema.findOne({ userId: user.id })

        // if it doesn't exist for the user, create it and save it
        if (!userRecord) {
            userRecord = new userSchema({ 
                userId: user.id, 
                xp: 0,
                level: 1
            })
            await userRecord.save();
        }

        const embed = new EmbedBuilder()
          .setTitle(user.displayName)
          .setColor(user.displayColor)
          .setThumbnail(user.displayAvatarURL())
          .addFields(
            {
                name: "XP",
                value: `${userRecord.xp}` // parse as string
            }
          )
          .setFooter({ text: user.user.tag, iconURL: user.displayAvatarURL() })
        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        interaction.editReply({ embeds: [embed] })
    },
}