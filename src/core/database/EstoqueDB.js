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
     * @returns {Promise<{ success: boolean, message: string }>} 
     * Retorna um objeto com `success` indicando o status da operação e `message` com mensagem de sucesso ou erro.
     */
    async criarCategoria(nome) {
        try {
            const categoria = new CategoriaEstoque({ nome: nome })
            await categoria.save()

            return { success: true, message: `Categoria ${nome} criada com sucesso!` }
        } catch (err) {
            return { success: false, message: `Erro ao criar a categoria ${nome}:\n` + err.message }
        }
    }

    /**
     * Lista todas as categorias disponíveis no estoque.
     * @returns {Promise<{ success: boolean, message: string, data?: Array<{ nome: string, id: string }> }>} 
     * Retorna um objeto com:
     * - `success`: booleano indicando o sucesso da operação,
     * - `message`: uma mensagem de sucesso ou erro,
     * - `data` (opcional): array de objetos representando as categorias, com `nome` e `id` de cada categoria.
     */
    async listarCategorias() {
        try {
            const categorias = await CategoriaEstoque.find();

            if (categorias.length === 0) {
                return { success: false, message: "Nenhuma categoria encontrada." }
            }

            return {
                success: true,
                message: "Categorias listadas com sucesso!",
                data: categorias.map(categoria => ({ nome: categoria.nome, id: categoria._id }))
            }
        } catch (err) {
            return { success: false, message: "Erro ao listar categorias: " + err.message }
        }
    }

    // Itens
    /**
     * Lista todos os itens de uma categoria específica.
     * @param {string} nomeCategoria - O nome da categoria para listar os itens.
     * @returns {Promise<{ success: boolean, message: string, data?: Array<{ nome: string, descricao: string, quantidade: number }> }>} 
     * Retorna um objeto com:
     * - `success`: booleano indicando o sucesso da operação,
     * - `message`: uma mensagem de sucesso ou erro,
     * - `data` (opcional): array de objetos representando os itens da categoria, com `nome`, `descricao`, e `quantidade`.
     */
    async listarItensPorCategoria(nomeCategoria) {
        try {
            const categoria = await CategoriaEstoque.findOne({ nome: nomeCategoria }).populate('itens')
            if (!categoria) {
                return { success: false, message: "Categoria não encontrada!" }
            }
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
            return { success: false, message: "Erro ao listar itens por categoria: " + err.message }
        }
    }

    /**
     * Adiciona um item a uma categoria existente.
     * @param {string} nomeCategoria - O nome da categoria à qual o item será adicionado.
     * @param {Object} itemData - Dados do item a ser adicionado.
     * @param {string} itemData.nome - Nome do item.
     * @param {number} itemData.quantidade - Quantidade do item.
     * @param {string} itemData.descricao - Descrição do item.
     * @returns {Promise<{ success: boolean, message: string }>} 
     * Retorna um objeto com `success` indicando o status da operação e `message` com mensagem de sucesso ou erro.
     */
    async adicionarItem(nomeCategoria, { nome, quantidade, descricao }) {
        try {
            const categoria = await CategoriaEstoque.findOne({ nome: nomeCategoria })

            if (!categoria) {
                return { success: false, message: "Categoria não encontrada!" }
            }

            const novoItem = new Item({
                nome: nome,
                quantidade: quantidade,
                descricao: descricao,
                categoria: categoria._id
            })

            await novoItem.save()

            categoria.itens.push(novoItem._id)
            await categoria.save()

            return { success: true, message: `Item "${nome}" adicionado à categoria "${categoria.nome}" com sucesso!` }
        } catch (err) {
            return { success: false, message: "Erro ao adicionar item à categoria: " + err.message }
        }
    }

    /**
     * Remove um item do estoque.
     * @param {string} nomeItem - O nome do item a ser removido.
     * @returns {Promise<{ success: boolean, message: string }>} 
     * Retorna um objeto com `success` indicando o status da operação e `message` com mensagem de sucesso ou erro.
     */
    async removerItem(nomeItem) {
        try {
            const item = await Item.findOne({ nome: nomeItem })

            if (!item) {
                return { success: false, message: "Item não encontrado!" }
            }

            const categoria = await CategoriaEstoque.findById(item.categoria)

            if (categoria) {
                categoria.itens.pull(item._id)
                await categoria.save()
            }

            await Item.findByIdAndDelete(item._id)

            return { success: true, message: `Item "${item.nome}" removido com sucesso!` }
        } catch (err) {
            return { success: false, message: "Erro ao remover item: " + err.message }
        }
    }

    /**
     * Atualiza a quantidade de um item no estoque.
     * @param {string} nomeItem - O nome do item a ser atualizado.
     * @param {number} quantidade - A nova quantidade do item.
     * @returns {Promise<{ success: boolean, message: string }>} 
     * Retorna um objeto com `success` indicando o status da operação e `message` com mensagem de sucesso ou erro.
     */
    async atualizarQuantidadeItem(nomeItem, quantidade) {
        try {
            const item = await Item.findOne({ nome: nomeItem })

            if (!item) {
                return { success: false, message: "Item não encontrado!" }
            }

            item.quantidade = quantidade
            await item.save()

            return { success: true, message: `Item "${nomeItem}" atualizado com sucesso!` }
        } catch (err) {
            return { success: false, message: "Erro ao atualizar item: " + err.message }
        }
    }
}
