import { Events } from "discord.js"
import DiscordClientHandler from "../handlers/DiscordClientHandler";

export default class EventBuilder {
    /**
     * Cria uma nova instância de EventBuilder para construir eventos do Discord.js.
     * 
     * @param {DiscordClientHandler} client - A instância do cliente do Discord.
     */
    constructor(client) {
        this.client = client
        this.name = ""
        this.disabled = false
    }

    /**
     * Define o nome do evento.
     * 
     * @param {Events} name - O nome do evento do Discord (ex. `Events.MessageCreate`).
     * @returns {EventBuilder} Retorna a própria instância para encadeamento de métodos.
     */
    setName(name) {
        this.name = name
        return this
    }

    /**
     * Define se o evento está desativado.
     * 
     * @param {boolean} boolean - Um valor booleano que define se o evento estará desativado (`true`) ou ativo (`false`).
     * @returns {EventBuilder} Retorna a própria instância para encadeamento de métodos.
     */
    setDisabled(boolean) {
        this.disabled = boolean
        return this
    }
}
