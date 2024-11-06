import EstoqueDB from "../core/database/EstoqueDB.js"
import EventStructure from "../core/structures/EventStructure.js"
import { ErrorEmbed, SuccessEmbed } from "../core/utils/CustomEmbed.js"
import { BaseInteraction, ModalSubmitInteraction } from "discord.js"
import DiscordClientHandler from "../core/handlers/DiscordClientHandler.js"
import LogEmbedBuilder from "../core/utils/LogEmbedBuilder.js"

/**
 * Evento que manipula a interação do tipo "interactionCreate".
 * Trata especificamente de interações de formulário modal para atualizar a quantidade de itens no estoque.
 * 
 * @class
 * @extends EventStructure
 */
export default class extends EventStructure {
    /**
     * Cria uma nova instância do evento "interactionCreate".
     * 
     * @param {DiscordClientHandler} client - A instância do DiscordClientHandler.
     */
    constructor(client) {
        super(client, {
            name: "interactionCreate",
        })

        /**
         * A instância do DiscordClientHandler.
         * @type {DiscordClientHandler}
         */
        this.client = client
    }

    /**
     * Executa o evento quando uma interação é criada.
     * Verifica se é uma submissão de formulário modal e processa a atualização do estoque.
     * 
     * @param {ModalSubmitInteraction | BaseInteraction} interaction - A interação recebida.
     */
    run = async (interaction) => {
        // Verifica se a interação é uma submissão de modal
        if (!interaction.isModalSubmit()) return

        // Divide o customId para extrair informações de ação, categoria e item
        const partes = interaction.customId.split(":")
        const acao = `${partes[0]}:${partes[1]}`

        // Identifica a ação a ser executada com base no customId
        switch (acao) {
            case "estoque:atualizar":
                // Extrai o ID da categoria, nome do item, quantidade e operação
                const idCategoria = partes[2]
                const nomeItem = partes[3]
                const quantidade = Number(interaction.fields.getTextInputValue("quantidade"))
                const operacao = partes[4]

                // Valida se a quantidade é um número inteiro
                if (!Number.isInteger(quantidade)) {
                    return interaction.reply({
                        embeds: [new ErrorEmbed("A quantidade precisa ser um número inteiro!")],
                    })
                }

                // Conecta ao banco de dados para realizar a atualização de quantidade
                const estoqueDB = new EstoqueDB(process.env.MONGODB_URI)
                await estoqueDB.connect()

                // Realiza a atualização do item no estoque com base nos parâmetros extraídos
                const itemAtualizado = await estoqueDB.atualizarQuantidadeItem(idCategoria, nomeItem, quantidade, operacao)

                // Desconecta do banco de dados
                await estoqueDB.disconnect()

                // Envia uma resposta ao usuário indicando o sucesso ou erro da operação
                if (!itemAtualizado.success) {
                    return interaction.reply({
                        embeds: [new ErrorEmbed(itemAtualizado.message, itemAtualizado.error ? `\`\`\`${itemAtualizado.error}\`\`\`` : null)],
                    })
                }

                interaction.reply({
                    embeds: [new SuccessEmbed(itemAtualizado.message)],
                })

                this.client.estoqueLogger.log(
                    new LogEmbedBuilder()
                        .setAuthor(interaction.member)
                        .setAction("atualizar-item", idCategoria, nomeItem, quantidade, operacao)
                        .build()
                )
        }
    }
}
