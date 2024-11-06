import DiscordClientHandler from "./src/core/handlers/DiscordClientHandler.js"
import { GatewayIntentBits } from "discord.js"
import "dotenv/config"

const botInstance = new DiscordClientHandler({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        
    ],
})

botInstance.login(process.env.BOT_TOKEN)