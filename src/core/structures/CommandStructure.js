import { PermissionFlagsBits } from "discord.js"

/**
 * @typedef {Object} CommandOptions
 * @property {string} name - The name of the command.
 * @property {string} description - The description of the command.
 * @property {Object} options - The options for the command.
 * @property {PermissionFlagsBits | Array} permissions - The permissions for the command.
 * @property {boolean} debug - Whether the command can only be used in a guild.
 * @property {boolean} dm_permission - Whether the command can be used on DMs
 * @property {boolean} disabled - Whether the command is disabled.
 */

/**
 * @class
 */
export default class CommandStructure {
    /**
     * @param {Object} client - The client object.
     * @param {CommandOptions} options - The options for the command.
     */
    constructor(client, options) {
        this.client = client
        this.debug = options.debug
        this.disabled = options.disabled
        this.name = options.name
        this.description = options.description
        this.options = options.options
        this.default_member_permissions = options.permissions
        this.dm_permission = options.dm_permission
        this.contexts = options.contexts
    }
}
