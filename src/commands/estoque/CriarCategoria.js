import CustomSlashCommandBuilder from "../../core/builders/CustomSlashCommandBuilder"
import { CommandInteraction, InteractionContextType, SlashCommandStringOption } from "discord.js"
import EstoqueDB from "../../core/database/EstoqueDB"
import { ErrorEmbed, SuccessEmbed } from "../../core/utils/CustomEmbed"
import CustomClient from "../../core/handlers/CustomClient"
import LogEmbedBuilder from "../../core/utils/LogEmbedBuilder"

export default class extends CustomSlashCommandBuilder {
    constructor(interaction) {
        super()
        this.setName("criar-categoria")
        this.setDescription("Cria uma categoria")
        this.setContexts(InteractionContextType.Guild)
        this.setDebug(true)
        this.addStringOption(
            new SlashCommandStringOption()
                .setName("nome")
                .setDescription("Nome da categoria")
                .setRequired(true)
        )
    }

    /**
    * @param {CommandInteraction & { client: CustomClient }} interaction - A interação do comando, cujo cliente é do tipo CustomClient.
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
            return interaction.editReply({
                embeds: [
                    new ErrorEmbed(
                        novaCategoria.message,
                        novaCategoria.error ? `\`\`\`${novaCategoria.error}\`\`\`` : null
                    )
                ]
            })
        }

        // Confirma a criação da nova categoria
        interaction.editReply({ embeds: [new SuccessEmbed(novaCategoria.message)] })

        interaction.client.estoqueLogger.log(
            new LogEmbedBuilder()
                .setAuthor(interaction.member)
                .setAction("criar-categoria", novaCategoria.categoriaData)
                .build()

        )
    }
}