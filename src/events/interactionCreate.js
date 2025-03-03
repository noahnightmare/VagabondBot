// slash command handler

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        // if the interaction is part of the chat
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName)

            // pass relevant information to command that was called
            command.execute({
                interaction,
                client,
                member: interaction.member,
                guild: interaction.guild,
                user: interaction.user,
                channel: interaction.channel,
            })
        }
    }
}