const { SlashCommandBuilder, EmbedBuilder, time, InteractionResponse } = require("discord.js");
const { shopItems, getUserRecord } = require("../functions");

// import schemas relevant for db
const userSchema = require('../schemas/userSchema.js')

module.exports = {
    data: new SlashCommandBuilder()
      .setName("buy")
      .setDescription("Allows a user to buy an item from the shop. They can equip this from their inventory.")
      .addStringOption(option => 
        option
          .setName("item")
          .setDescription("The name of the item you would like to buy from the shop.")
          .setRequired(true)
      ),
    execute: async ({ interaction }) => {
        // delays the bot response a little by making it "think"
        await interaction.deferReply().catch(() => {})

        let user = interaction.member;
        let userRecord = await getUserRecord(user.id);
        let inputItem = interaction.options.getString("item");

        // find item within item array
        let itemToBuy = shopItems.find(item => item.name.toLowerCase() === inputItem.toLowerCase());

        // if item wasnt found
        if (!itemToBuy) {
          return interaction.editReply(`❌ Item **${inputItem}** does not exist.`);
        }

        // if user already owns item
        if (userRecord.inventory.includes(itemToBuy.name)) {
          return interaction.editReply(`❌ You already own **${itemToBuy.name}**.`)
        }

        // check if user has enough coins
        if (userRecord.coins < itemToBuy.price) {
          return interaction.editReply(`❌ You don't have enough coins to buy "${itemToBuy.name}". Price: 🪙 ${itemToBuy.price}`);
        }

        // minus amount of coins from user and add to their inventory
        userRecord.coins -= itemToBuy.price;
        userRecord.inventory.push(itemToBuy.name);

        await userRecord.save();

        const embed = new EmbedBuilder()
          .setTitle("🛒 Purchase")
          .setColor('#87CEEB')
          .setThumbnail(user.displayAvatarURL())
          .setDescription(`**${user.displayName}** has purchased ${itemToBuy.name} ${itemToBuy.value} for 🪙 ${itemToBuy.price}!`)
          .addFields(
            { 
              name: "Item Type", 
              value: itemToBuy.type, 
              inline: true 
            },
            { 
              name: "Remaining Coins", 
              value: `🪙 ${userRecord.coins}`, 
              inline: true 
            }
        );

        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        await interaction.editReply({ embeds: [embed] })
    },
}