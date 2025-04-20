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
            { name: "buy", value: "buy" },
            { name: "clear", value: "clear" },
            { name: "equip", value: "equip" },
            { name: "giftxp", value: "giftxp" },
            { name: "profile", value: "profile" },
            { name: "shop", value: "shop" },
            { name: "xp", value: "xp" },
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
                    value: `\`\`/buy\`\`: Purchase items from the shop
                            \`\`/clear\`\`: Remove your badge or color
                            \`\`/equip\`\`: Equip your badge or color
                            \`\`/giftxp\`\`: Gift a user xp
                            \`\`/help\`\`: Lists and explains commands
                            \`\`/profile\`\`: Displays information about a user
                            \`\`/shop\`\`: Shop with profile cosmetics
                            \`\`/xp\`\`: Displays the xp value of a user`,
                }
            )
        } else { // If they specified a command, it explains that solely
            if (option.value == "buy") {
                embed.addFields(
                    {
                        name: "Buy Command",
                        value: `Used to buy a cosmetic when using
                                the shop.`,
                    }
                )
            } else if (option.value == "clear") {
                embed.addFields(
                    {
                        name: "Clear Command",
                        value: `Removes either your badge or color
                                from your profile. This cosmetic
                                is not deleted, just stored in
                                your inventory.`,
                    }
                )
            } else if (option.value == "equip") {
                embed.addFields(
                    {
                        name: "Equip Command",
                        value: `Equip either your badge or color
                                and have it appear on your profile.
                                The cosmetic replaced is not deleted,
                                just stored in your inventory.`,
                    }
                )
            } else if (option.value == "giftxp") {
                embed.addFields(
                    {
                        name: "Gift XP Command",
                        value: `This is a command only administrators
                                can use. They can gift a user xp. This
                                is intended as a reward such as
                                server contests or giveaways.`,
                    }
                )
            } else if (option.value == "profile") {
                embed.addFields(
                    {
                        name: "Profile Command",
                        value: `Gets information about yourself or
                                another user. Any badges or colors
                                that they've equipped or in their
                                inventory appears here.`,
                    }
                )
            } else if (option.value == "shop") {
                embed.addFields(
                    {
                        name: "Shop Command",
                        value: `You can purchase cosmetics here
                                using coins. You can get coins from
                                leveling up your profile.`,
                    }
                )
            } else if (option.value == "xp") {
                embed.addFields(
                    {
                        name: "XP Command",
                        value: `Gets the experience value of yourself
                                or another user.`,
                    }
                )
            }
        }
        
        
        // edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
        interaction.editReply({ embeds: [embed] })
    },
}