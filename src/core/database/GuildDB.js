import Database from "./Database.js"
import Guilds from "./models/Guild.js"

export default class extends Database {
    constructor() {
        super(process.env.MONGODB_URI)
    }

    async guild(guildId) {
        return (await Guilds.findById(guildId)) || new Guilds({ _id: guildId })
    }

    async disconnect() {
        await super.disconnect()
    }
}
