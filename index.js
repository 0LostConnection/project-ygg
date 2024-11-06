import CustomClient from "./src/core/handlers/CustomClient.js"
import { GatewayIntentBits } from "discord.js"
import "dotenv/config"

const botInstance = new CustomClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        
    ],
})

botInstance.login(process.env.BOT_TOKEN)