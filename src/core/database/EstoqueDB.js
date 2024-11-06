import Database from "./Database"
import CategoriaEstoque from "./models/CategoriaEstoque"
import Item from "./models/Item"

/**
 * Classe que gerencia operações de estoque, incluindo categorias e itens.
 * Estende a classe Database para conexão com o banco de dados MongoDB.
 * @extends Database
 */
export default class EstoqueDB extends Database {
    constructor() {
        super(process.env.MONGODB_URI)
    }

    /**
     * Cria uma nova categoria de estoque.
     * @param {string} nomeCategoria - O nome da categoria a ser criada.
     * @returns {Promise<{ success: boolean, message: string, categoriaData: { nomeCategoria: string, idCategoria?: string }, error?: string }>} 
     * Retorna um objeto com:
     * - `success`: boolean indicando o sucesso ou falha da operação,
     * - `message`: mensagem informativa,
     * - `categoriaData`: dados da categoria, contendo `nomeCategoria` e `idCategoria` (opcional),
     * - `error` (opcional): mensagem de erro em caso de falha.
     */
    async criarCategoria(nomeCategoria) {
        try {
            // Verifica a existência da categoria
            if (await CategoriaEstoque.findOne({ nome: nomeCategoria })) {
                return {
                    success: false,
                    message: `A categoria **${nomeCategoria}** já existe!`,
                    categoriaData: {
                        nomeCategoria
                    }
                }
            }

            // Instancia uma nova categoria e a salva
            const categoria = new CategoriaEstoque({ nome: nomeCategoria })
            await categoria.save()

            return {
                success: true,
                message: `Categoria **${nomeCategoria}** criada com sucesso!`,
                categoriaData: {
                    nomeCategoria,
                    idCategoria: categoria._id
                }
            }
        } catch (err) {
            return {
                success: false,
                message: `Erro ao criar a categoria **${nomeCategoria}**.`,
                error: err.message,
                categoriaData: {
                    nomeCategoria
                }
            }
        }
    }

    /**
     * Lista todas as categorias disponíveis no estoque.
     * @returns {Promise<{ success: boolean, message: string, data?: Array<{ nomeCategoria: string, idCategoria: string }>, error?: string }>} 
     * Retorna um objeto com:
     * - `success`: boolean indicando o sucesso ou falha da operação,
     * - `message`: mensagem informativa,
     * - `data` (opcional): array de categorias, cada uma contendo `nomeCategoria` e `idCategoria`,
     * - `error` (opcional): mensagem de erro em caso de falha.
     */
    async listarCategorias() {
        try {
            // Procura todas as categorias
            const categorias = await CategoriaEstoque.find()

            // Se não existir, retorna
            if (categorias.length === 0) {
                return {
                    success: false,
                    message: "Nenhuma categoria encontrada."
                }
            }

            // Se existir, retorna todas as categorias criadas
            return {
                success: true,
                message: "Categorias listadas com sucesso!",
                data: categorias.map(categoria => ({ nomeCategoria: categoria.nome, idCategoria: categoria._id })),
            }
        } catch (err) {
            return {
                success: false,
                message: "Erro ao listar categorias.",
                error: err.message
            }
        }
    }

    /**
     * Obtém o nome de uma categoria de estoque com base em seu ID.
     * @param {string} idCategoria - O ID da categoria a ser buscada.
     * @returns {Promise<{ success: boolean, message: string, categoriaData: { nomeCategoria?: string, idCategoria: string }, error?: string }>} 
     * Retorna um objeto com:
     * - `success`: boolean indicando o sucesso ou falha da operação,
     * - `message`: mensagem informativa,
     * - `categoriaData`: dados da categoria, contendo `idCategoria` e `nomeCategoria` (opcional),
     * - `error` (opcional): mensagem de erro em caso de falha.
     */
    async obterNomeCategoria(idCategoria) {
        try {
            // Procura a categoria por id
            const categoria = await CategoriaEstoque.findById(idCategoria)

            // Verifica a existência da categoria
            if (!categoria) {
                return {
                    success: false,
                    message: "Categoria não encontrada!",
                    categoriaData: {
                        idCategoria
                    }
                }
            }

            // Se existir, retorna o nome da categoria
            return {
                success: true,
                message: "Categoria encontrada com sucesso!",
                categoriaData: {
                    nomeCategoria: categoria.nome,
                    idCategoria,
                }
            }
        } catch (err) {
            return {
                success: false,
                message: "Erro ao buscar categoria.",
                error: err.message,
                categoriaData: {
                    idCategoria
                }
            }
        }
    }

    /**
     * Lista todos os itens de uma categoria específica.
     * @param {string} idCategoria - O ID da categoria para listar os itens.
     * @returns {Promise<{ success: boolean, message: string, data?: Array<{ nomeItem: string, descricaoItem: string, quantidadeItem: number }>, categoriaData: { nomeCategoria: string, idCategoria: string }, error?: string }>} 
     * Retorna um objeto com:
     * - `success`: boolean indicando o sucesso ou falha da operação,
     * - `message`: mensagem informativa,
     * - `data` (opcional): array de itens com `nomeItem`, `descricaoItem` e `quantidadeItem`,
     * - `categoriaData`: dados da categoria, contendo `nomeCategoria` e `idCategoria`,
     * - `error` (opcional): mensagem de erro em caso de falha.
     */
    async listarItensPorCategoria(idCategoria) {
        try {
            // Busca uma categoria pelo ID e popula o campo "itens" com os dados completos dos itens associados
            const categoria = await CategoriaEstoque.findById(idCategoria).populate('itens')

            // Verifica a existência da categoria
            if (!categoria) {
                return {
                    success: false,
                    message: "Categoria não encontrada!",
                    categoriaData: {
                        idCategoria
                    }
                }
            }

            // Retorna uma mensagem de sucesso, incluindo os dados dos itens da categoria com cada item contendo o nome, descrição e quantidade
            return {
                success: true,
                message: "Itens listados com sucesso!",
                data: categoria.itens.map(item => ({
                    nomeItem: item.nome,
                    descricaoItem: item.descricao,
                    quantidadeItem: item.quantidade,
                })),
                categoriaData: {
                    nomeCategoria: categoria.nome,
                    idCategoria,
                }
            }
        } catch (err) {
            return {
                success: false,
                message: "Erro ao listar itens por categoria.",
                error: err.message,
                categoriaData: {
                    idCategoria,
                }
            }
        }
    }

    /**
     * Adiciona um item a uma categoria existente.
     * @param {string} idCategoria - O ID da categoria à qual o item será adicionado.
     * @param {Object} itemData - Dados do item a ser adicionado.
     * @param {string} itemData.nomeItem - Nome do item.
     * @param {number} itemData.quantidadeItem - Quantidade do item.
     * @param {string} itemData.descricaoItem - Descrição do item.
     * @returns {Promise<{ success: boolean, message: string, categoriaData: { nomeCategoria: string, idCategoria: string }, itemData: { nomeItem: string, quantidadeItem: number, descricaoItem: string }, error?: string }>} 
     * Retorna um objeto com:
     * - `success`: boolean indicando o sucesso ou falha da operação,
     * - `message`: mensagem informativa,
     * - `categoriaData`: dados da categoria, contendo `nomeCategoria` e `idCategoria`,
     * - `itemData`: dados do item, contendo `nomeItem`, `quantidadeItem`, `descricaoItem`,
     * - `error` (opcional): mensagem de erro em caso de falha.
     */
    async adicionarItem(idCategoria, { nomeItem, quantidadeItem, descricaoItem }) {
        try {
            // Procura a categoria por id
            const categoria = await CategoriaEstoque.findById(idCategoria)

            // Verifica a existência da categoria
            if (!categoria) {
                return {
                    success: false,
                    message: "Categoria não encontrada!",
                    categoriaData: {
                        idCategoria
                    },
                }
            }

            // Verifica a existência do item pelo nome e pelo id da categoria
            if (await Item.findOne({ nome: nomeItem, idCategoria: categoria._id })) {
                return {
                    success: false,
                    message: `O item **${nomeItem}** já existe na categoria **${categoria.nome}**!`,
                    categoriaData: {
                        nomeCategoria: categoria.nome,
                        idCategoria
                    },
                    itemData: {
                        nomeItem,
                        quantidadeItem,
                        descricaoItem
                    }
                }
            }

            // Instancia um novo item e o salva
            const novoItem = new Item({
                nome: nomeItem,
                quantidade: quantidadeItem,
                descricao: descricaoItem,
                idCategoria: categoria._id
            })
            await novoItem.save()

            // Adiciona a referência do novo item à categoria respectiva e a salva
            categoria.itens.push(novoItem._id)
            await categoria.save()

            return {
                success: true,
                message: `Item **${nomeItem}** adicionado à categoria **${categoria.nome}** com sucesso!`,
                categoriaData: {
                    idCategoria
                },
                itemData: {
                    nomeItem,
                    quantidadeItem,
                    descricaoItem
                }
            }
        } catch (err) {
            return {
                success: false,
                message: `Erro ao adicionar item à categoria!`,
                error: err.message,
                categoriaData: {
                    idCategoria
                },
                itemData: {
                    nomeItem,
                    quantidadeItem,
                    descricaoItem
                }
            }
        }
    }

    /**
     * Remove um item do estoque.
     * @param {string} idCategoria - O ID da categoria à qual o item pertence.
     * @param {string} nomeItem - O nome do item a ser removido.
     * @returns {Promise<{ success: boolean, message: string, categoriaData: { nomeCategoria: string, idCategoria: string }, itemData: { nomeItem: string }, error?: string }>} 
     * Retorna um objeto com:
     * - `success`: boolean indicando o sucesso ou falha da operação,
     * - `message`: mensagem informativa,
     * - `categoriaData`: dados da categoria, contendo `nomeCategoria` e `idCategoria`,
     * - `itemData`: dados do item, contendo `nomeItem`,
     * - `error` (opcional): mensagem de erro em caso de falha.
     */
    async removerItem(idCategoria, nomeItem) {
        try {
            // Procura a categoria por id
            const categoria = await CategoriaEstoque.findById(idCategoria)

            // Verifica a existência da categoria
            if (!categoria) {
                return {
                    success: false,
                    message: "Categoria não encontrada!",
                    categoriaData: {
                        idCategoria,
                    },
                    itemData: {
                        nomeItem
                    }
                }
            }

            // Procura o item pelo nome e pelo id da categoria
            const item = await Item.findOne({ nome: nomeItem, idCategoria: categoria._id })

            // Verifica a existência do item
            if (!item) {
                return {
                    success: false,
                    message: "Item não encontrado!",
                    categoriaData: {
                        idCategoria,
                    },
                    itemData: {
                        nomeItem
                    }
                }
            }

            // Remove o item das referências da categoria no documento de Categorias
            categoria.itens.pull(item._id)
            await categoria.save()

            // Remove o item do documento de Itens
            await Item.findByIdAndDelete(item._id)

            return {
                success: true,
                message: `Item **${nomeItem}** removido com sucesso!`,
                categoriaData: {
                    nomeCategoria: categoria.nome,
                    idCategoria,
                },
                itemData: {
                    nomeItem
                }
            }
        } catch (err) {
            return {
                success: false,
                message: "Erro ao remover item.",
                error: err.message,
                categoriaData: {
                    idCategoria
                },
                itemData: {
                    nomeItem
                }
            }
        }
    }

    /**
     * Atualiza a quantidade de um item no estoque.
     * @param {string} idCategoria - O ID da categoria à qual o item pertence.
     * @param {string} nomeItem - O nome do item a ser atualizado.
     * @param {number} quantidade - A quantidade a ser adicionada ou removida.
     * @param {"adicionar" | "remover"} operacao - A operação a ser realizada (adicionar ou remover).
     * @returns {Promise<{ success: boolean, message: string, categoriaData: { nomeCategoria: string, idCategoria: string }, itemData: { nomeItem: string, quantidadeItem: number, descricaoItem: string }, atualizar: { nomeItem: string, quantidade: number, operacao: string }, error?: string }>} 
     * Retorna um objeto com:
     * - `success`: boolean indicando o sucesso ou falha da operação,
     * - `message`: mensagem informativa,
     * - `categoriaData`: dados da categoria, contendo `nomeCategoria` e `idCategoria`,
     * - `itemData`: dados do item, contendo `nomeItem`, `quantidadeItem`, `descricaoItem`,
     * - `atualizar`: dados da atualização, contendo `nomeItem`, `quantidade`, e `operacao`,
     * - `error` (opcional): mensagem de erro em caso de falha.
     */
    async atualizarQuantidadeItem(idCategoria, nomeItem, quantidade, operacao) {
        try {
            // Verifica se a operação foi fornecida
            if (!operacao) {
                return {
                    success: false,
                    message: "Operação não especificada. Forneça 'adicionar' ou 'remover'.",
                    categoriaData: {
                        idCategoria
                    },
                    atualizar: {
                        nomeItem,
                        quantidade,
                        operacao
                    }
                }
            }

            // Procura a categoria por ID
            const categoria = await CategoriaEstoque.findById(idCategoria)

            // Verifica a existência da categoria
            if (!categoria) {
                return {
                    success: false,
                    message: "Categoria não encontrada!",
                    categoriaData: {
                        idCategoria
                    }
                }
            }

            // Procura o item pelo nome e pelo ID da categoria
            const item = await Item.findOne({ nome: nomeItem, idCategoria: categoria._id })

            // Verifica a existência do item
            if (!item) {
                return {
                    success: false,
                    message: "Item não encontrado!",
                    categoriaData: {
                        nomeCategoria: categoria.nome,
                        idCategoria
                    },
                    itemData: {
                        nomeItem
                    }
                }
            }

            // Executa a operação de atualização de quantidade
            switch (operacao) {
                case "adicionar":
                    item.quantidade += quantidade
                    break
                case "remover":
                    item.quantidade -= quantidade
                    break
                default:
                    return {
                        success: false,
                        message: `Operação inválida: '${operacao}'. Use 'adicionar' ou 'remover'.`,
                        categoriaData: {
                            nomeCategoria: categoria.nome,
                            idCategoria
                        },
                        itemData: {
                            nomeItem,
                            quantidadeItem: item.quantidade,
                            descricaoItem: item.descricao
                        },
                        atualizar: {
                            nomeItem,
                            quantidade,
                            operacao
                        }
                    }
            }

            // Salva a quantidade atualizada
            await item.save()

            return {
                success: true,
                message: `Item **${nomeItem}** atualizado com sucesso!`,
                categoriaData: {
                    nomeCategoria: categoria.nome,
                    idCategoria
                },
                itemData: {
                    nomeItem,
                    quantidadeItem: item.quantidade,
                    descricaoItem: item.descricao
                },
                atualizar: {
                    nomeItem,
                    quantidade,
                    operacao
                }
            }
        } catch (err) {
            return {
                success: false,
                message: "Erro ao atualizar item.",
                error: err.message,
                categoriaData: {
                    idCategoria
                },
                atualizar: {
                    nomeItem,
                    quantidade,
                    operacao
                }
            }
        }
    }
}