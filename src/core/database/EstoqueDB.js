import Database from "./Database"
import CategoriaEstoque from "./models/CategoriaEstoque"
import Item from "./models/Item"

export default class extends Database {
    constructor() {
        super(process.env.MONGODB_URI)
    }

    async criarCategoria(nome) {
        try {
            const categoria = new CategoriaEstoque({ nome: nome })
            await categoria.save()

            return { success: true, message: `Categoria ${nome} criada com sucesso!` }
        } catch (err) {
            return { success: false, message: `Erro ao criar a categoria ${nome}:\n` + err.message }
        }
    }

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
