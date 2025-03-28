//imports
const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js")
const userSchema = require('../schemas/userSchema.js')
const { calculateXPToLevelUp } = require("../functions")

const { getUserRecord, shopItems } = require("../functions");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("profile")
      .setDescription("Get information about a user.")
      .addUserOption((option) => option
        .setName("user")
        .setDescription("The user you want to get information about.")
        .setRequired(false)
      ),
    execute: async ({ interaction }) => {
        // delays the bot response a little by making it "think"
        await interaction.deferReply().catch(() => {})

        // assign user if specified, otherwise use user that sent cmd
        let user;
        if (interaction.options.getMember("user") != null) {
            user = interaction.options.getMember("user")
        }
        else {
             user = interaction.member;
        }

        let userRecord = await getUserRecord(user.id); //the user's record, located in the database
        let requiredXP = calculateXPToLevelUp(userRecord.level) //the amount of xp the user needs to level up

        // build inventory by cross referencing to shop items to get values
        let inventory = userRecord.inventory.map(itemName => {
          let item = shopItems.find(shopItem => shopItem.name === itemName);
          return item ? `**${item.name}** - ${item.value}` : `**${itemName}**`; // fallback incase value isn't accessible (won't ever happen)
        }).join(', ') || "Empty";

        const embed = new EmbedBuilder()
          .setTitle(`${user.displayName} ${userRecord.badge}`)
          .setColor(userRecord.color)
          .setThumbnail(user.displayAvatarURL())
          .addFields(
            {
              name: "⏫ Level",
              value: `${userRecord.level}`,
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            {
              name: "🪙 Coins",
              value: `${userRecord.coins}`,
              inline: true
            },
            {
              name: "🍀 XP",
              value: `${userRecord.xp + " / " + calculateXPToLevelUp(userRecord.level)}`,
              inline: false
            },
            {
              name: "🎒 Inventory",
              value: `${inventory}`,
              inline: false
            }
          )
          .setFooter({ text: `${user.user.tag}'s profile`, iconURL: user.displayAvatarURL() })
        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        interaction.editReply({ embeds: [embed] })
    },
}