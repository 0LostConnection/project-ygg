import CommandStructure from "../../core/structures/CommandStructure"
import { CommandInteraction } from "discord.js"
import { ApplicationCommandOptionType } from "discord-api-types/v10"
import EstoqueDB from "../../core/database/EstoqueDB"
import { ErrorEmbed, SuccessEmbed } from "../../core/utils/CustomEmbed"

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
        // Deferindo a resposta para indicar que o bot está processando a solicitação
        await interaction.deferReply()

        // Instancia o banco de dados e conecta
        const estoqueDB = new EstoqueDB()
        await estoqueDB.connect()

        // Obtém o nome da nova categoria
        const nomeNovaCategoria = interaction.options.get("nome").value

        // Cria a nova categoria
        const novaCategoria = await estoqueDB.criarCategoria(nomeNovaCategoria)

        // Desconecta do banco de dados
        await estoqueDB.disconnect()

        // Valida se o processo ocorreu com erro
        if (!novaCategoria.success) {
            return interaction.editReply({ embeds: [new ErrorEmbed(novaCategoria.message, novaCategoria.error ? `\`\`\`${novaCategoria.error}\`\`\`` : null)] })
        }

        // Confirma a criação da nova categoria
        interaction.editReply({ embeds: [new SuccessEmbed(novaCategoria.message)] })
    }
}