import DiscordClientHandler from "./src/core/handlers/DiscordClientHandler.js"
import { GatewayIntentBits } from "discord.js"
import "dotenv/config"

const botInstance = new DiscordClientHandler({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
})

botInstance.login(process.env.BOT_TOKEN)


/* import EstoqueDB from "./src/core/database/EstoqueDB.js"

async function test() {
    const connection = new EstoqueDB(process.env.MONGODB_URI)
    await connection.connect()
    
    await connection.criarCategoria("Minerios")
    
    await connection.adicionarItem("Minerios", { nome: "Diamante", quantidade: 10, descricao: "DIAMANTE!" })
    
    await connection.atualizarQuantidadeItem("Diamante", 64)
    
    await connection.removerItem("Diamante")
}

//test()

async function test1() {
    const connection = new EstoqueDB(process.env.MONGODB_URI)
    await connection.connect()

    await connection.adicionarItem("Minerios", { nome: "Diamante", quantidade: 10, descricao: "DIAMANTE!" })
    await connection.adicionarItem("Minerios", { nome: "Ferro", quantidade: 54, descricao: "FERRO!" })
    await connection.adicionarItem("Minerios", { nome: "Cobre", quantidade: 256, descricao: "Cobre..." })
    
    console.log("")
    await connection.listarItensPorCategoria("Minerios")
    console.log("")
    
    await connection.atualizarQuantidadeItem("Diamante", 64)
    await connection.listarItensPorCategoria("Minerios")
    console.log("")
    
    await connection.removerItem("Diamante")
    await connection.listarItensPorCategoria("Minerios")
    console.log("")
}

test1() */