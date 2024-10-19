import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v10"

export default class RemoveCommands {
    constructor(TOKEN, clientId) {
        this.clientId = clientId
        this.rest = new REST({ version: "10" }).setToken(TOKEN)
    }

    removeGuildCommand(guildId, commandId) {
        console.log(guildId, commandId)
        this.rest
            .delete(
                Routes.applicationGuildCommand(
                    this.clientId,
                    guildId,
                    commandId
                )
            )
            .then(() => console.log("Successfully deleted guild command"))
            .catch(console.error)
    }

    removeClientCommand(commandId) {
        this.rest
            .delete(Routes.applicationCommand(this.clientId, commandId))
            .then(() => console.log("Successfully deleted client command"))
            .catch(console.error)
    }

    removeAllCommands(guildId) {
        rest.put(Routes.applicationGuildCommands(this.clientId, guildId), {
            body: [],
        })
            .then(() => console.log("Successfully deleted all guild commands."))
            .catch(console.error)

        rest.put(Routes.applicationCommands(thos.clientId), { body: [] })
            .then(() =>
                console.log("Successfully deleted all application commands.")
            )
            .catch(console.error)
    }
}
