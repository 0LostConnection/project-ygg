import { CommandInteraction } from "discord.js";
import CommandStructure from "../../core/structures/CommandStructure";
import EstoqueDB from "../../core/database/EstoqueDB";
import { QuestionEmbed, ErrorEmbed, SuccessEmbed } from "../../core/utils/CustomEmbed";
import CustomSelectMenu from "../../core/utils/CustomSelectMenu";

export default class extends CommandStructure {
    constructor(interaction) {
        super(interaction, {
            name: "remover-item",
            description: "Remove um item de uma categoria específica.",
            dm_permission: false,
            debug: true
        })
    }

    /**
     * @param {CommandInteraction} interaction 
     */
    run = async (interaction) => {
        // Deferindo a resposta para indicar que o bot está processando a solicitação
        await interaction.deferReply()

        // Instancia o banco de dados e conecta
        const estoqueDB = new EstoqueDB()
        await estoqueDB.connect()

        // Filtro para ser utilizado para detectar a interação do StringSelectMenu
        const filtroObserver = i => i.user.id === interaction.user.id

        /* 
        Inicio da seleção das categorias.
        */

        // Obtém as categorias
        const categorias = await estoqueDB.listarCategorias()

        // Valida se a operação ocorreu com sucesso
        if (!categorias.success) {
            // Desconecta do banco de dados
            await estoqueDB.disconnect()

            return await interaction.editReply({
                embeds: [
                    new ErrorEmbed(categorias.message,
                        categorias.error ? `\`\`\`${categorias.error}\`\`\`` : null)
                ]
            })
        }

        const respostaCategoriaSelectMenu = await interaction.editReply({
            embeds: [
                new QuestionEmbed("Escolha umas das categorias na lista abaixo para remover o item:")
            ],
            components: [
                new CustomSelectMenu(
                    "estoque:selecionar:categorias",
                    "Escolha uma categoria",
                    categorias.data.map(obj => ({
                        label: obj.nome,
                        value: obj.id.toString()
                    }))
                )
            ]
        })

        let idCategoria

        try {
            // Cria uma nova interação para poder ser utilizada no observer
            const confirmacaoCategoriaSelectMenu = await respostaCategoriaSelectMenu.awaitMessageComponent({
                filter: filtroObserver,
                time: 60_000
            })

            // Verifica se a interação é um StringSelectMenu
            if (!confirmacaoCategoriaSelectMenu.isStringSelectMenu()) return

            // Obtém o id da categoria 
            idCategoria = confirmacaoCategoriaSelectMenu.values[0]

            // Reconhece a interação e redefine o estado da interação
            await confirmacaoCategoriaSelectMenu.deferUpdate()

        } catch (error) {
            // Desconecta do banco de dados
            await estoqueDB.disconnect()

            // Caso não haja confirmação no SelectMenu, a mensagem é atualizada
            return await interaction.editReply({
                embeds: [
                    new ErrorEmbed("Nenhuma confirmação recebida após 1 minuto!")
                ],
                components: []
            })
        }

        /* 
        Inicio da seleção dos itens.
        */

        // Obtém os itens da categoria selecionada
        const itens = await estoqueDB.listarItensPorCategoria(idCategoria)

        // Valida se a operação ocorreu com sucesso
        if (!itens.success) {
            // Desconecta do banco de dados
            await estoqueDB.disconnect()

            return await interaction.editReply({
                embeds: [
                    new ErrorEmbed("Nenhuma confirmação recebida após 1 minuto!")
                ],
                components: []
            })
        }
        
        const respostaItemSelectMenu = await interaction.editReply({
            embeds: [
                new QuestionEmbed("Escolha um dos itens abaixo para remover:")
            ],
            components: [
                new CustomSelectMenu(
                    "estoque:selecionar:itens",
                    "Escolha um item",
                    itens.data.map(obj => ({
                        label: obj.nome,
                        value: obj.nome
                    }))
                )
            ]
        })

        let nomeItem

        try {
            // Cria uma nova interação para poder ser utilizada no observer
            const confirmacaoItemSelectMenu = await respostaItemSelectMenu.awaitMessageComponent({
                filter: filtroObserver,
                time: 60_000
            })

            // Verifica se a interação é um StringSelectMenu
            if (!confirmacaoItemSelectMenu.isStringSelectMenu()) return

            // Obtém o nome do item
            nomeItem = confirmacaoItemSelectMenu.values[0]

            // Reconhece a interação e redefine o estado da interação
            await confirmacaoItemSelectMenu.deferUpdate()
        } catch (error) {
            // Desconecta do banco de dados
            await estoqueDB.disconnect()

            // Caso não haja confirmação no SelectMenu, a mensagem é atualizada
            return await interaction.editReply({
                embeds: [
                    new ErrorEmbed("Nenhuma confirmação recebida após 1 minuto!")
                ],
                components: []
            })
        }

        const itemRemovido = await estoqueDB.removerItem(idCategoria, nomeItem)

        // Valida se a operação ocorreu com sucesso
        if (!itemRemovido.success) {
            // Desconecta do banco de dados
            await estoqueDB.disconnect()

            return await interaction.editReply({
                embeds: [
                    new ErrorEmbed(
                        itemRemovido.message,
                        categorias.error ? `\`\`\`${categorias.error}\`\`\`` : null)
                ]
            })
        }

        // Desconecta do banco de dados
        await estoqueDB.disconnect()

        await interaction.editReply({
            embeds: [
                new SuccessEmbed(itemRemovido.message)
            ],
            components: []
        })
    }
}