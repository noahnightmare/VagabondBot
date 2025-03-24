const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js");
const { shopItems, getUserRecord } = require("../functions");

// import schemas relevant for db
const userSchema = require('../schemas/userSchema.js')

module.exports = {
    data: new SlashCommandBuilder()
      .setName("buy")
      .setDescription("Allows a user to buy an item from the shop. They can equip this from their inventory."),
    execute: async ({ interaction }) => {
        // delays the bot response a little by making it "think"
        await interaction.deferReply().catch(() => {})

        const member = interaction.options.getMember("user")

        const embed = new EmbedBuilder()
          .setTitle("Purchase")
          .setColor('#87CEEB')
          .setThumbnail(member.displayAvatarURL())

        /*

        WIP


        shopItems.forEach(item => {
            shopDetails += `**${item.name}** - ${item.price} coins\nType: ${item.type}\n\n`;
        });
        
        */

        let userRecord = await getUserRecord(member.id);

        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        await interaction.editReply({ embeds: [embed] })
    },
}