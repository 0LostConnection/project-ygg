import Database from "./Database"
import CategoriaEstoque from "./models/CategoriaEstoque"
import Item from "./models/Item"

/**
 * Classe que gerencia operações de estoque, incluindo categorias e itens.
 * Estende a classe Database para conexão com o banco de dados MongoDB.
 * @extends Database
 */
export default class extends Database {
    /**
     * Construtor da classe de estoque que inicializa a conexão com o banco de dados.
     */
    constructor() {
        super(process.env.MONGODB_URI)
    }

    // Categorias
    /**
     * Cria uma nova categoria de estoque.
     * @param {string} nome - O nome da categoria a ser criada.
     * @returns {Promise<{ success: boolean, message: string, error?: string }>} 
     * Retorna um objeto com `success` indicando o status da operação e `message` com mensagem de sucesso ou erro.
     */
    async criarCategoria(nome) {
        try {
            // Verifica a existência da categoria
            if (await CategoriaEstoque.findOne({ nome: nome })) {
                return { success: false, message: `A categoria **${nome}** já existe!` }
            }

            // Instancia uma nova categoria e a salva
            const categoria = new CategoriaEstoque({ nome: nome })
            await categoria.save()

            return { success: true, message: `Categoria **${nome}** criada com sucesso!` }
        } catch (err) {
            return { success: false, message: `Erro ao criar a categoria **${nome}**.`, error: err.message }
        }
    }

    /**
     * Lista todas as categorias disponíveis no estoque.
     * @returns {Promise<{ success: boolean, message: string, data?: Array<{ nome: string, id: string }>, error?: string }>} 
     * Retorna um objeto com `success`, `message`, `data` (opcional) e `error` (opcional).
     */
    async listarCategorias() {
        try {
            // Procura todas as categorias
            const categorias = await CategoriaEstoque.find()

            // Se não existir, retorna
            if (categorias.length === 0) {
                return { success: false, message: "Nenhuma categoria encontrada." }
            }

            // Se existir, retorna todas as categorias criadas
            return {
                success: true,
                message: "Categorias listadas com sucesso!",
                data: categorias.map(categoria => ({ nome: categoria.nome, id: categoria._id }))
            }
        } catch (err) {
            return { success: false, message: "Erro ao listar categorias.", error: err.message }
        }
    }

    /**
    * Obtém o nome de uma categoria de estoque com base em seu ID.
    * @param {string} idCategoria - O ID da categoria a ser buscada.
    * @returns {Promise<{ success: boolean, message: string, nomeCategoria?: string, error?: string }>} 
    * Retorna um objeto com:
    * - `success`: booleano indicando o sucesso da operação,
    * - `message`: uma mensagem de sucesso ou erro,
    * - `nomeCategoria` (opcional): nome da categoria encontrada,
    * - `error` (opcional): mensagem de erro, caso ocorra uma falha.
    */
    async obterNomeCategoria(idCategoria) {
        try {
            // Procura a categoria por id
            const categoria = await CategoriaEstoque.findById(idCategoria)

            // Verifica a existência da categoria
            if (!categoria) {
                return { success: false, message: "Categoria não encontrada!" }
            }

            // Se existir, retorna o nome da categoria
            return {
                success: true,
                message: "Categoria encontrada com sucesso!",
                nomeCategoria: categoria.nome
            }

        } catch (err) {
            return { success: false, message: "Erro ao buscar categoria.", error: err.message }
        }
    }

    // Itens
    /**
     * Lista todos os itens de uma categoria específica.
     * @param {string} idCategoria - O nome da categoria para listar os itens.
     * @returns {Promise<{ success: boolean, message: string, data?: Array<{ nome: string, descricao: string, quantidade: number }>, error?: string }>} 
     * Retorna um objeto com `success`, `message`, `data` (opcional) e `error` (opcional).
     */
    async listarItensPorCategoria(idCategoria) {
        try {
            // Busca uma categoria pelo ID e popula o campo "itens" com os dados completos dos itens associados
            const categoria = await CategoriaEstoque.findById(idCategoria).populate('itens')

            // Verifica a existência da categoria
            if (!categoria) {
                return { success: false, message: "Categoria não encontrada!" }
            }

            // Retorna uma mensagem de sucesso, incluindo os dados dos itens da categoria com cada item contendo o nome, descrição e quantidade
            return {
                success: true,
                message: "Itens listados com sucesso!",
                data: categoria.itens.map(item => ({
                    nome: item.nome,
                    descricao: item.descricao,
                    quantidade: item.quantidade
                }))
            }
        } catch (err) {
            return { success: false, message: "Erro ao listar itens por categoria.", error: err.message }
        }
    }

    /**
     * Adiciona um item a uma categoria existente.
     * @param {string} idCategoria - O id da categoria à qual o item será adicionado.
     * @param {Object} itemData - Dados do item a ser adicionado.
     * @param {string} itemData.nome - Nome do item.
     * @param {number} itemData.quantidade - Quantidade do item.
     * @param {string} itemData.descricao - Descrição do item.
     * @returns {Promise<{ success: boolean, message: string, error?: string }>} 
     * Retorna um objeto com `success`, `message` e `error` (opcional).
     */
    async adicionarItem(idCategoria, { nome, quantidade, descricao }) {
        try {
            // Procura a categoria por id
            const categoria = await CategoriaEstoque.findById(idCategoria)

            // Verifica a existência da categoria
            if (!categoria) {
                return { success: false, message: "Categoria não encontrada!" }
            }

            // Verifica a existência do item pelo nome e pelo id da categoria
            if (await Item.findOne({ nome: nome, idCategoria: categoria._id })) {
                return { success: false, message: `O item **${nome}** já existe na categoria **${categoria.nome}**!` }
            }

            // Instancia um novo item e o salva
            const novoItem = new Item({
                nome: nome,
                quantidade: quantidade,
                descricao: descricao,
                idCategoria: categoria._id
            })
            await novoItem.save()

            // Adiciona a referência do novo item à categoria respectiva e a salva
            categoria.itens.push(novoItem._id)
            await categoria.save()

            return { success: true, message: `Item **${nome}** adicionado à categoria **${categoria.nome}** com sucesso!` }
        } catch (err) {
            return { success: false, message: `Erro ao adicionar item à categoria!`, error: err.message }
        }
    }

    /**
     * Remove um item do estoque.
     * @param {string} idCategoria - O id da categoria à qual o item será removido.
     * @param {string} nomeItem - O nome do item a ser removido.
     * @returns {Promise<{ success: boolean, message: string, error?: string }>} 
     * Retorna um objeto com `success`, `message` e `error` (opcional).
     */
    async removerItem(idCategoria, nomeItem) {
        try {
            // Procura a categoria por id
            const categoria = await CategoriaEstoque.findById(idCategoria)

            // Verifica a existência da categoria
            if (!categoria) {
                return { success: false, message: "Categoria não encontrada!" }
            }

            // Procura o item pelo nome e pelo id da categoria
            const item = await Item.findOne({ nome: nomeItem, idCategoria: categoria._id })

            // Verifica a existência do item
            if (!item) {
                return { success: false, message: "Item não encontrado!" }
            }

            // Remove o item das referências da categoria no documento de Categorias
            categoria.itens.pull(item._id)
            await categoria.save()

            // Remove o item do documento de Itens
            await Item.findByIdAndDelete(item._id)

            return { success: true, message: `Item **${item.nome}** removido com sucesso!` }
        } catch (err) {
            return { success: false, message: "Erro ao remover item.", error: err.message }
        }
    }

    /**
     * Atualiza a quantidade de um item no estoque.
     * @param {string} idCategoria - O id da categoria à qual o item será atualizado.
     * @param {string} nomeItem - O nome do item a ser atualizado.
     * @param {number} quantidade - A nova quantidade do item.
     * @returns {Promise<{ success: boolean, message: string, error?: string }>} 
     * Retorna um objeto com `success`, `message` e `error` (opcional).
     */
    async atualizarQuantidadeItem(idCategoria, nomeItem, quantidade) {
        try {
            // Procura a categoria por id
            const categoria = await CategoriaEstoque.findById(idCategoria)

            // Verifica a existência da categoria
            if (!categoria) {
                return { success: false, message: "Categoria não encontrada!" }
            }

            // Procura o item pelo nome e pelo id da categoria
            const item = await Item.findOne({ nome: nomeItem, idCategoria: categoria._id })

            // Verifica a existência do item
            if (!item) {
                return { success: false, message: "Item não encontrado!" }
            }

            // Atualiza a quantidade e salva
            item.quantidade = quantidade
            await item.save()

            return { success: true, message: `Item **${nomeItem}** atualizado com sucesso!` }
        } catch (err) {
            return { success: false, message: "Erro ao atualizar item.", error: err.message }
        }
    }
}