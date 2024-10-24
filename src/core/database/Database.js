import mongoose from "mongoose"

export default class Database {
    constructor(uri) {
        this.uri = uri
    }

    async connect() {
        try {
            mongoose.set("strictQuery", true)
            await mongoose.connect(this.uri)
            console.log("Conexão bem-sucedida ao banco de dados!")
        } catch (error) {
            console.error("Erro ao conectar ao banco de dados:", error)
        }
    }

    async disconnect() {
        try {
            await mongoose.connection.close()
            console.log("Desconectado do banco de dados.");
        } catch (error) {
            console.error("Erro ao desconectar do banco de dados:", error)
        }
    }
}