import CommandStructure from "../../core/structures/CommandStructure"
import { CommandInteraction } from "discord.js"

export default class extends CommandStructure {
    constructor() {
        super({
            name: "ver-estoque",
            description: "Ver estoque",
            debug: true,
            dm_permission: false
        })
    }
    /**
    * @param {CommandInteraction} interaction
    **/
    run = async (interaction) => {
        
    }
}