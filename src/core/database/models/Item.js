import { Schema, model } from "mongoose"

const itemSchema = new Schema({
    nome: {
        type: String,
        required: true,
    },
    quantidade: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        required: false
    },
    idCategoria: {
        type: Schema.Types.ObjectId,
        ref: 'CategoriaEstoque' // Referência ao modelo de CategoriaEstoque
    }
})

export default model('Item', itemSchema)