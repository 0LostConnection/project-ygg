import CustomSlashCommandBuilder from '../../core/builders/CustomSlashCommandBuilder'
import { CommandInteraction } from 'discord.js'

export default class extends CustomSlashCommandBuilder {
    constructor() {
        super()
        this.setName("new-hello")
        this.setDescription("[DEBUG] Hello world usando a nova classe de comando")
        this.setDebug(true)
    }

    /**
     * @param {CommandInteraction} interaction 
     */
    run = (interaction) => {
        if (this.isDebugEnabled()) {
            interaction.reply("Olá Mundo! :)")
        } else {
            interaction.reply("Hello World :)")
        }
    }
}