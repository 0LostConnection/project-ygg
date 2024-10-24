import { Schema, model } from "mongoose"

const CategoriaEstoqueSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    itens: [{
        type: Schema.Types.ObjectId,
        ref: "Item" // Referência ao modelo de Item
    }]
})

export default model("CategoriaEstoque", CategoriaEstoqueSchema)