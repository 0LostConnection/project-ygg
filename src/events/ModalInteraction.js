import EstoqueDB from "../core/database/EstoqueDB.js"
import EventStructure from "../core/structures/EventStructure.js"
import { ErrorEmbed, SuccessEmbed } from "../core/utils/CustomEmbed.js"
import { log } from "../core/utils/loggingUtils.js"
import { BaseInteraction, ModalSubmitInteraction } from "discord.js"

export default class extends EventStructure {
    constructor(client) {
        super(client, {
            name: "interactionCreate",
        })
    }

    /**
     * @param { ModalSubmitInteraction | BaseInteraction} interaction
     */
    run = async (interaction) => {
        if (!interaction.isModalSubmit()) return
        const partes = interaction.customId.split(":")
        const acao = `${partes[0]}:${partes[1]}`


        switch (acao) {
            case "estoque:atualizar":

                const idCategoria = partes[2]
                const nomeItem = partes[3]
                const quantidade = Number(interaction.fields.getTextInputValue("quantidade"))
                const operacao = partes[4]

                if (!Number.isInteger(quantidade)) {
                    return interaction.reply({
                        embeds: [new ErrorEmbed("A quantidade precisa ser um número inteiro!")]
                    })
                }

                const estoqueDB = new EstoqueDB(process.env.MONGODB_URI)
                await estoqueDB.connect()

                const itemAtualizado = await estoqueDB.atualizarQuantidadeItem(idCategoria, nomeItem, Number(quantidade), operacao)
                console.log(idCategoria, nomeItem, quantidade, operacao)
                await estoqueDB.disconnect()

                if (itemAtualizado.success) {
                    return interaction.reply({
                        embeds: [new SuccessEmbed(itemAtualizado.message)]
                    })
                } else {
                    return interaction.reply({
                        embeds: [new ErrorEmbed(itemAtualizado.message, itemAtualizado.error)]
                    })
                }
        }
    }
}
