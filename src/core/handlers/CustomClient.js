import { log } from "../utils/loggingUtils.js"
import { Client, Collection, REST, Routes } from "discord.js"
import { readdirSync } from "fs"
import EstoqueLogger from "../utils/EstoqueLogger.js"

/**
 * Classe personalizada que estende o Client do Discord.js para adicionar funcionalidades específicas.
 * 
 * @class CustomClient
 * @extends Client
 */
export default class CustomClient extends Client {
    /**
     * Cria uma nova instância do CustomClient, que estende a classe Client do Discord.js.
     * Este construtor inicializa as coleções de comandos e eventos, além de carregar comandos e eventos, e configurar o EstoqueLogger.
     * 
     * @param {Array} intents - A lista de intents que o bot irá usar para interagir com o Discord.
     * @extends Client
     */
    constructor(intents) {
        super(intents);

        /**
         * Coleção de comandos slash registrados para o bot.
         * @type {Collection}
         */
        this.slashCommands = new Collection();

        /**
         * Coleção de eventos registrados para o bot.
         * @type {Collection}
         */
        this.events = new Collection();

        // Carrega os comandos registrados
        this.loadCommands();

        // Carrega os eventos registrados
        this.loadEvents();

        /**
         * Instância do EstoqueLogger para registrar alterações no estoque.
         * @type {EstoqueLogger}
         */
        this.estoqueLogger = new EstoqueLogger(process.env.WEBHOOK_URL);
    }

    async loadCommands(commandsCategoriesPath = "./src/commands") {
        const categoriesFolders = readdirSync(commandsCategoriesPath)

        if (!categoriesFolders) return

        for (const categoryFolder of categoriesFolders) {
            const commandFiles = readdirSync(
                `${commandsCategoriesPath}/${categoryFolder}`
            ).filter((file) => file.endsWith(".js"))

            for (const commandFile of commandFiles) {
                const { default: commandClass } = await import(
                    `${process.cwd()}/${commandsCategoriesPath}/${categoryFolder}/${commandFile}`
                )

                try {
                    const command = new commandClass().toJSON()

                    if (command.disabled) continue

                    this.slashCommands.set(command.name, command)
                } catch (error) {
                    return log(
                        {
                            title: "Startup: loadCommands: An error occurred when loading the commands!",
                            message: error,
                        },
                        "ERROR"
                    )
                    console.log(error)
                }
            }
        }
    }

    async loadEvents(eventFilesPath = "./src/events") {
        const eventFiles = readdirSync(eventFilesPath).filter((file) =>
            file.endsWith(".js")
        )

        if (!eventFiles) return

        for (const eventFile of eventFiles) {
            const { default: eventClass } = await import(
                `${process.cwd()}/${eventFilesPath}/${eventFile}`
            )

            try {
                const event = new eventClass(this)

                if (event.disabled) continue

                this.events.set(event.name)
                this.on(event.name, event.run)
            } catch (error) {
                log(
                    {
                        title: "Startup: loadEvents: An error occurred when loading the events!",
                        message: error,
                    },
                    "ERROR"
                )
            }
        }
    }

    async deployCommands() {
        async function putCommands(commands, route) {
            const rest = new REST().setToken(process.env.BOT_TOKEN)

            const validRoutes = {
                GUILD: Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    process.env.DEBUG_GUILD_ID
                ),
                CLIENT: Routes.applicationCommands(process.env.CLIENT_ID),
            }

            try {
                await rest.put(validRoutes[route], {
                    body: commands,
                })

                log(
                    {
                        title: `Loaded Commands - ${route}`,
                        message: `${commands.map((obj) => obj.name).join(", ")}`,
                    },
                    "SUCCESS"
                )
            } catch (error) {
                log(
                    {
                        title: `Startup: deployCommands: putCommands: An error occurred when putting the commands on ${route} route!`,
                        message: error,
                    },
                    "ERROR"
                )
                console.log(error)
            }
        }

        const debugCommandsArray = this.slashCommands
            .filter((command) => command.debug)
            .toJSON()

        if (debugCommandsArray.length > 0) {
            let debugCommandsToDeploy = []

            for (let debugCommand of debugCommandsArray) {
                let { client, debug, disabled, run, ...debugCommandInfo } =
                    debugCommand
                debugCommandsToDeploy.push(debugCommandInfo)
            }

            await putCommands(debugCommandsToDeploy, "GUILD")
        }

        const commandsArray = this.slashCommands
            .filter((command) => command.debug === false)
            .toJSON()

        if (commandsArray.length > 0) {
            let commandsToDeploy = []

            for (let command of commandsArray) {
                let { client, debug, disabled, run, ...commandInfo } = command
                commandsToDeploy.push(commandInfo)
            }

            await putCommands(commandsToDeploy, "CLIENT")
        }
    }
}
