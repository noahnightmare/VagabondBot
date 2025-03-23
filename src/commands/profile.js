//imports
const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js")
const userSchema = require('../schemas/userSchema.js')
const { calculateXPToLevelUp } = require("../functions")

module.exports = {
    data: new SlashCommandBuilder()
      .setName("profile")
      .setDescription("Get information about a user.")
      .addUserOption((option) => option
        .setName("user")
        .setDescription("The user you want to get information about.")
        .setRequired(true)
      ),
    execute: async ({ interaction }) => {
        // delays the bot response a little by making it "think"
        await interaction.deferReply().catch(() => {})

        const member = interaction.options.getMember("user")
        let userRecord = await userSchema.findOne({ userId: member.id }) //the user's record, located in the database
        let requiredXP = calculateXPToLevelUp(userRecord.level) //the amount of xp the user needs to level up

        const embed = new EmbedBuilder()
          .setTitle(member.displayName)
          .setColor(member.displayColor)
          .setThumbnail(member.displayAvatarURL())
          .addFields(
            {
              name: "Level",
              value: `${userRecord.level}`,
              inline: true,
            },
            {
              name: "XP",
              value: `${userRecord.xp + " / " + calculateXPToLevelUp(userRecord.level)}`,
              inline: true
            },
            {
              name: "Number of coins",
              value: `${userRecord.coins}`,
              inline: true
            }
          )
          .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL() })
        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        interaction.editReply({ embeds: [embed] })
    },
}