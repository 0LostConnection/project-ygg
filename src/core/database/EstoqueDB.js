import Database from "./Database"
import CategoriaEstoque from "./models/CategoriaEstoque"
import Item from "./models/Item"

export default class extends Database {
    constructor() {
        super(process.env.MONGODB_URI)
    }

    async listarItensPorCategoria(nomeCategoria) {
        try {
            const categoria = await CategoriaEstoque.findOne({ nome: nomeCategoria }).populate('itens')
            return categoria.itens.map(item => ({
                nome: item.nome,
                descricao: item.descricao,
                quantidade: item.quantidade
            }))
        } catch (err) {
            console.error("Erro ao listar itens por categoria:", err);
        }
    }

    async criarCategoria(nome) {
        try {
            const categoria = new CategoriaEstoque({ nome: nome })
            await categoria.save();

            console.log(`Categoria ${nome} criada com sucesso!`)
        } catch (err) {
            console.error("Erro ao criar a categoria!", err)
        }
    }

    async adicionarItem(nomeCategoria, { nome, quantidade, descricao }) {
        try {
            const categoria = await CategoriaEstoque.findOne({ nome: nomeCategoria })

            if (!categoria) {
                console.log("Categoria não encontrada!")
                return
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

            console.log(`Item "${nome}" adicionado à categoria "${categoria.nome}" com sucesso!`);
        } catch (err) {
            console.error("Erro ao adicionar item à categoria:", err);
        }
    }

    async removerItem(nomeItem) {
        try {
            const item = await Item.findOne({ nome: nomeItem })

            if (!item) {
                console.log("Item não encontrado!")
                return
            }

            const categoria = await CategoriaEstoque.findById(item.categoria)

            if (categoria) {
                // Remover o item da lista de itens da categoria
                categoria.itens.pull(item._id)
                await categoria.save()
            }

            // Remove item do banco de dados
            await Item.findByIdAndDelete(item._id)

            console.log(`Item "${item.nome}" removido com sucesso!`);
        } catch (err) {
            console.error("Erro ao remover item!", err)
        }
    }

    async atualizarQuantidadeItem(nomeItem, quantidade) {
        try {
            const item = await Item.findOne({ nome: nomeItem })

            if (!item) {
                console.log("Item não encontrado!")
                return
            }

            item.quantidade = quantidade
            item.save()

            console.log(`Item "${nomeItem}" atualizado com sucesso!`);

        } catch (err) {
            console.error("Erro ao atualizar item!", err)
        }
    }
}