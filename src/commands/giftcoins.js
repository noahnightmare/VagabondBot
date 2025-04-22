const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js")

const { getUserRecord } = require("../functions");

const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName("giftcoins")
      .setDescription("Gift a user coins.")
      .addIntegerOption(option => 
        option
          .setName("coins")
          .setDescription("The amount of coins to gift.")
          .setRequired(true)
      )
      .addUserOption((option) => 
        option
          .setName("user")
          .setDescription("The user to gift coins to.")
          .setRequired(true)
      ),
    execute: async ({ interaction }) => {
        // delays the bot response a little by making it "think"
        await interaction.deferReply().catch(() => {})

        //permission check to ensure user is a server admin
        let user = interaction.member; //the user that sent the command
        //if the user has the permision to manage messages
        if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
          //if the XP value is not negative
          if (Math.sign(interaction.options.getInteger("coins")) != -1) {
            //ensures the user does not try to gift themselves coins
            if (interaction.options.getMember("user") != user) {
              //assign user to gift the coins to
              let userToGift = interaction.options.getMember("user");

              //fetch the user's db record
              let userRecord = await getUserRecord(userToGift.id);

              //append gifted coins
              userRecord.coins += interaction.options.getInteger("coins")
              //save to db
              userRecord.save()
              
              //edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
              interaction.editReply(`Coins gifted.`)
            }
            else {
              interaction.editReply(`You cannot gift yourself coins.`)
            }
          }
          else {
            interaction.editReply(`You cannot gift negative coins.`)
          }
        }
        else { //send relevant message if the user does not have permission
            interaction.editReply(`You do not have permission to execute this command.`)
        }
    },
}