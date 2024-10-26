import CommandStructure from "../../core/structures/CommandStructure"
import { CommandInteraction } from "discord.js"
import EstoqueDB from "../../core/database/EstoqueDB"
import CustomSelectMenu from "../../core/utils/CustomSelectMenu"
import { ErrorEmbed, ProductStockEmbed, QuestionEmbed } from "../../core/utils/CustomEmbed"

export default class extends CommandStructure {
    constructor(interaction) {
        super(interaction, {
            name: "ver-estoque",
            description: "Ver estoque",
            dm_permission: false,
            debug: true,
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
                new QuestionEmbed("Escolha uma das categorias na lista abaixo:")
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

            /* 
            1. Pega o id da categoria na seleção
            2. Obtém o nome da categoria
            3. Obtém a lista de itens da categoria 
            */
            const idCategoria = confirmacao.values[0]
            const nomeCategoria = (await estoqueDB.obterNomeCategoria(idCategoria)).nomeCategoria
            const itens = await estoqueDB.listarItensPorCategoria(idCategoria)

            // Desconecta do banco de dados
            estoqueDB.disconnect()

            // Valida se a obtenção ocorreu com sucesso
            if (!itens.success) {
                return await confirmacao.update({
                    embeds: [
                        new ErrorEmbed(
                            itens.message,
                            itens.error ? `\`\`\`${itens.error}\`\`\`` : null
                        )
                    ]
                })
            }

            // Transforma os dados dos itens obtidos no formato que será utilizado nos Fields do Embed
            let estoqueArray = []
            itens.data.forEach(item => {
                estoqueArray.push({ name: item.nome, value: String(item.quantidade) })
            })

            // Atualiza a mensagem da interação com a lista dos itens
            await confirmacao.update({
                embeds: [
                    new ProductStockEmbed(
                        `## ${nomeCategoria}`,
                        estoqueArray
                    )
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