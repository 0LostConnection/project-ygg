import CommandStructure from "../../core/structures/CommandStructure"
import { CommandInteraction } from "discord.js"
import { ApplicationCommandOptionType } from "discord-api-types/v10"
import EstoqueDB from "../../core/database/EstoqueDB"

export default class extends CommandStructure {
    constructor(interaction) {
        super(interaction, {
            name: "criar-categoria",
            description: "Criar uma categoria",
            dm_permission: false,
            debug: true,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "nome",
                    description: "Nome da categoria.",
                    required: true,
                }
            ]
        })
    }
    /**
    * @param {CommandInteraction} interaction
    **/
    run = async (interaction) => {
        await interaction.deferReply()

        const nomeCategoria = interaction.options.get("nome").value

        const db = new EstoqueDB(process.env.MONGODB_URI)
        await db.connect()

        const categoria = await db.criarCategoria(nomeCategoria)

        if (!categoria.success) {
            return interaction.editReply(`${categoria.message}`)
        }

        interaction.editReply({ content: categoria.message })

        await db.disconnect()

    }
}