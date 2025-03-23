const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
      .setName("help")
      .setDescription("Lists and explains all the commands.")
      .addStringOption((option) => option
        .setName("command")
        .setDescription("A specific command you want to know.")
        .setRequired(false)
        // We can add other commands choices here
        .addChoices(
            { name: "profile", value: "profile" },
        )
      ),

      execute: async ({ interaction }) => {
        // delays the bot response a little by making it "think"
        await interaction.deferReply().catch(() => {})

        const option = interaction.options.get('command')

        const embed = new EmbedBuilder()
          .setTitle("Help")
          .setColor("Red") // can probably change this later
        
        if (option == null) { // If they didnt specify, it outputs the general list
            embed.addFields(
                {
                    name: "Commands",
                    value: `/help: Lists and explains commands
                            /profile: Gets information about a user`,
                }
            )
        } else { // If they specified a command, it explains that solely
            if (option.value == "profile") {
                embed.addFields(
                    {
                        name: "Profile Command",
                        value: `Gets information about a user`,
                    }
                )
            }
        }
        
        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        interaction.editReply({ embeds: [embed] })
    },
}