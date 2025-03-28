const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js")

const { getUserRecord, shopItems } = require("../functions");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("equip")
      .setDescription("Equips an item from your inventory.")
      .addStringOption(option => 
        option
          .setName("item")
          .setDescription("The item you would like to equip from your inventory.")
          .setRequired(true)
      ),
    execute: async ({ interaction }) => {
        // delays the bot response a little by making it "thinking"
        await interaction.deferReply().catch(() => {})

        let user = interaction.member;
        let userRecord = await getUserRecord(user.id);
        let inputItem = interaction.options.getString("item");

        // find item in the shop structure
        let itemToEquip = shopItems.find(item => item.name.toLowerCase() === inputItem.toLowerCase());

        // if item wasnt found
        if (!itemToEquip) {
          return interaction.editReply(`❌ Item **${inputItem}** does not exist.`);
        }

        // if user doesnt own the item (not in user inventory)
        if (!userRecord.inventory.includes(itemToEquip.name)) {
          return interaction.editReply(`❌ You do not own the item **${itemToEquip.name}**.`);
        }

        // equip to relevant slot
        if (itemToEquip.type === "badge") {
          userRecord.badge = itemToEquip.value;
        } else if (itemToEquip.type === "color") {
          userRecord.color = itemToEquip.value;
        } else {
          return interaction.editReply(`❌ Error in equipping item: type was not expected`);
        }

        // save to db
        userRecord.save()
        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        interaction.editReply(`Reset your ${interaction.options.getString("type")} to default.`)
    },
}