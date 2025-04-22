const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js");
const { shopItems } = require("../functions");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("shop")
      .setDescription("Displays the shop where users can buy items."),
    execute: async ({ interaction }) => {
        // delays the bot response a little by making it "think"
        await interaction.deferReply().catch(() => {})

        const member = interaction.options.getMember("user")

        const embed = new EmbedBuilder()
          .setTitle("Vagabond Shop")
          .setColor('#87CEEB')
          .setImage("https://i.pinimg.com/736x/3b/fc/f5/3bfcf54c2e078f662254a7abcfd43939.jpg");

        let shopDetails = '';

        shopItems.forEach(item => {
            shopDetails += `**${item.name}** ${item.type} - ${item.value}\n🪙 ${item.price}\n\n`;
        });

        embed.addFields({
            name: 'Shop Items',
            value: shopDetails || 'No items available.',
            inline: false,
        });
        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        await interaction.editReply({ embeds: [embed] })
    },
}