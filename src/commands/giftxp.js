const { SlashCommandBuilder, EmbedBuilder, time } = require("discord.js")

const { getUserRecord } = require("../functions");

const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName("giftxp")
      .setDescription("Gift a user XP.")
      .addIntegerOption(option => 
        option
          .setName("xp")
          .setDescription("The amount of XP to gift.")
          .setRequired(true)
      )
      .addUserOption((option) => 
        option
          .setName("user")
          .setDescription("The user to gift XP to.")
          .setRequired(true)
      ),
    execute: async ({ interaction }) => {
        // delays the bot response a little by making it "think"
        await interaction.deferReply().catch(() => {})

        

        //permission check to ensure user is a server admin
        let user = interaction.member; //the user that sent the command
        //if the user has the permision to manage messages
        if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
          //if the XP value is not negative
          if (Math.sign(interaction.options.getInteger("xp")) != -1) {
            //ensures the user does not try to gift themselves XP
            if (interaction.options.getMember("user") != user) {
              //assign user to gift the XP to
              let userToGift = interaction.options.getMember("user");

              //fetch the user's db record
              let userRecord = await getUserRecord(userToGift.id);

              //append gifted xp
              userRecord.xp += interaction.options.getInteger("xp")
              //save to db
              userRecord.save()
              
              //edit reply is used here because of the defer reply at the top (delaying msg) otherwise use reply
              interaction.editReply(`XP gifted.`)
            }
            else {
              interaction.editReply(`You cannot gift yourself XP.`)
            }
          }
          else {
            interaction.editReply(`You cannot gift negative XP.`)
          }
        }
        else { //send relevant message if the user does not have permission
            interaction.editReply(`You do not have permission to execute this command.`)
        }
    },
}