import CommandStructure from "../../core/structures/CommandStructure"
import { CommandInteraction } from "discord.js"
import { ApplicationCommandOptionType } from "discord-api-types/v10"
import EstoqueDB from "../../core/database/EstoqueDB"
import { ErrorEmbed, SuccessEmbed } from "../../core/utils/customEmbed"

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
        
        const estoqueDB = new EstoqueDB()
        await estoqueDB.connect()

        const nomeNovaCategoria = interaction.options.get("nome").value
        const novaCategoria = await estoqueDB.criarCategoria(nomeNovaCategoria)

        await estoqueDB.disconnect()

        if (!novaCategoria.success) {
            return interaction.editReply({ embeds: [new ErrorEmbed(novaCategoria.message, novaCategoria.error ? `\`\`\`${novaCategoria.error}\`\`\`` : null)] })
        }

        interaction.editReply({ embeds: [new SuccessEmbed(novaCategoria.message)] })
    }
}