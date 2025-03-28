const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js")

const { getUserRecord } = require("../functions");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("clear")
      .setDescription("Clear your currently equipped badge or profile color.")
      .addStringOption(option => 
        option
          .setName("type")
          .setDescription("Whether you would like to remove your badge or color.")
          .setRequired(true)
          .addChoices([
            { name: "badge", value: "badge" },
            { name: "color", value: "color" }
          ])
      ),
    execute: async ({ interaction }) => {
        // delays the bot response a little by making it "thinking"
        await interaction.deferReply().catch(() => {})

        let user = interaction.member;

        let userRecord = await getUserRecord(user.id);

        // clear badge or color based on what user chose
        if (interaction.options.getString("type") == "badge") {
            userRecord.badge = " ";
        }
        else {
            userRecord.color = "#808080";
        }

        // save to db
        userRecord.save()
        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        interaction.editReply(`Reset your ${interaction.options.getString("type")} to default.`)
    },
}