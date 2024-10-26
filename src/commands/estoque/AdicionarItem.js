import CommandStructure from "../../core/structures/CommandStructure"
import { CommandInteraction } from "discord.js"
import { ApplicationCommandOptionType } from "discord-api-types/v10"
import EstoqueDB from "../../core/database/EstoqueDB"
import { QuestionEmbed, ErrorEmbed, SuccessEmbed } from "../../core/utils/CustomEmbed"
import CustomSelectMenu from "../../core/utils/CustomSelectMenu"

export default class extends CommandStructure {
    constructor(interaction) {
        super(interaction, {
            name: "adicionar-item",
            description: "Adiciona um item em uma das categorias.",
            dm_permission: false,
            debug: true,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "item",
                    description: "Nome do item.",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "quantidade",
                    description: "Quantidade do item.",
                    required: true
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

        // Obtém o nome do item e a quantidade
        const nomeNovoItem = interaction.options.get("item").value
        const quantidadeNovoItem = interaction.options.get("quantidade").value

        // Instancia o banco de dados e conecta
        const estoqueDB = new EstoqueDB()
        await estoqueDB.connect()

        // Obtém as categorias
        const categorias = await estoqueDB.listarCategorias()

        // Valida se a operação ocorreu com sucesso
        if (!categorias.success) {
            // Desconecta do banco de dados
            estoqueDB.disconnect()

            return await interaction.editReply({
                embeds: [
                    new ErrorEmbed(categorias.message,
                        categorias.error ? `\`\`\`${categorias.error}\`\`\`` : null)
                ]
            })
        }

        /* 
        Inicio da seleção das categorias.
        Salva a interação em uma variável
        */
        const resposta = await interaction.editReply({
            embeds: [
                new QuestionEmbed("Escolha umas das categorias na lista abaixo para adicionar o item:")
            ],
            components: [
                new CustomSelectMenu(
                    "estoque:selecionar:categorias",
                    "escolha uma categoria",
                    categorias.data.map(obj => ({
                        label: obj.nome,
                        value: obj.id.toString()
                    }))
                )
            ]
        })

        // Filtro para ser utilizado para detectar a interação do StringSelectMenu
        const filtroObserver = i => i.user.id === interaction.user.id

        try {
            // Cria uma nova interação para poder ser utilizada no observer
            const confirmacao = await resposta.awaitMessageComponent({
                filter: filtroObserver,
                time: 60_000
            })

            // Verifica se a interação é um StringSelectMenu
            if (!confirmacao.isStringSelectMenu()) return

            // Obtém o id da categoria 
            const idCategoria = confirmacao.values[0]

            // Adiciona o novo item na categoria
            const novoItem = await estoqueDB.adicionarItem(
                idCategoria,
                {
                    nome: nomeNovoItem,
                    quantidade: quantidadeNovoItem
                }
            )

            // Desconecta do banco de dados
            estoqueDB.disconnect()

            // Valida se a operação ocorreu com sucesso
            if (!novoItem.success) {
                return await interaction.editReply({
                    embeds: [
                        new ErrorEmbed(novoItem.message,
                            categorias.error ? `\`\`\`${categorias.error}\`\`\`` : null)
                    ],
                    components: []
                })
            }

            // Atualiza a mensagem da interação com uma mensagem de sucesso
            await confirmacao.update({
                embeds: [
                    new SuccessEmbed(novoItem.message)
                ],
                components: []
            })

        } catch (error) {
            // Caso não haja confirmação no SelectMenu, a mensagem é atualizada
            await interaction.editReply({
                embeds: [
                    new ErrorEmbed("Nenhuma confirmação recebida após 1 minuto!")
                ],
                components: []
            })
        }

    }
}