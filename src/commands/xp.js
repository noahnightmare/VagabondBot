const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js")

// import schemas relevant for db
const userSchema = require('../schemas/userSchema.js')

const { getUserRecord, calculateXPToLevelUp } = require("../functions");

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
        let userRecord = await getUserRecord(user.id);

        const embed = new EmbedBuilder()
        .setTitle(`${user.displayName} ${userRecord.badge}`)
          .setColor(userRecord.color)
          .setThumbnail(user.displayAvatarURL())
          .addFields(
            {
                name: "🍀 XP",
                value: `${userRecord.xp} / ${calculateXPToLevelUp(userRecord.level)}` // parse as string
            }
          )
          .setFooter({ text: `${user.user.tag}'s experience`, iconURL: user.displayAvatarURL() })
        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        interaction.editReply({ embeds: [embed] })
    },
}