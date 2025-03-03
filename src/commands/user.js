const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
      .setName("user")
      .setDescription("Get information about a user.")
      .addUserOption((option) => option
        .setName("user")
        .setDescription("The user you want to get information about.")
        .setRequired(true)
      ),
    execute: async ({ interaction }) => {
        // delays the bot response a little by making it "thinking"
        await interaction.deferReply().catch(() => {})

        const member = interaction.options.getMember("user")

        const embed = new EmbedBuilder()
          .setTitle(member.displayName)
          .setColor(member.displayColor)
          .setThumbnail(member.displayAvatarURL())
          .addFields(
            {
                name: "When the user joined Discord",
                value: time(member.user.createdAt),
                inline: true,
            },
            {
                name: "When the user joined this server",
                value: time(member.joinedAt),
                inline: true,
            }
          )
          .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL() })
        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        interaction.editReply({ embeds: [embed] })
    },
}