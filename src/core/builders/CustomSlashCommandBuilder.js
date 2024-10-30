import { SlashCommandBuilder } from "discord.js";

/**
 * Classe que estende o SlashCommandBuilder para incluir propriedades adicionais,
 * como debug e disabled, específicas para comandos personalizados no Discord.
 * 
 * @class CustomCommandBuilder
 * @extends SlashCommandBuilder
 */
export default class CustomSlashCommandBuilder extends SlashCommandBuilder {
    /**
     * Cria uma nova instância de CustomCommandBuilder.
     */
    constructor() {
        super();
        /**
         * Indica se o comando está em modo de debug.
         * @type {boolean}
         */
        this.debug = false;

        /**
         * Indica se o comando está desabilitado.
         * @type {boolean}
         */
        this.disabled = false;
    }

    /**
     * Define o status de debug do comando.
     * 
     * @param {boolean} booleanFlag - Define se o modo debug está ativado.
     * @returns {CustomCommandBuilder} A própria instância para encadeamento de chamadas.
     */
    setDebug(booleanFlag) {
        this.debug = Boolean(booleanFlag);
        return this;
    }

    /**
     * Verifica se o modo de debug está ativado para o comando.
     * 
     * @returns {boolean} O estado do modo debug.
     */
    isDebugEnabled() {
        return this.debug;
    }

    /**
     * Define o comando como desabilitado ou habilitado.
     * 
     * @param {boolean} booleanFlag - Define se o comando está desabilitado.
     * @returns {CustomCommandBuilder} A própria instância para encadeamento de chamadas.
     */
    setDisabled(booleanFlag) {
        this.disabled = Boolean(booleanFlag);
        return this;
    }

    /**
     * Retorna uma representação JSON do comando, incluindo as propriedades adicionais
     * de debug e disabled.
     * 
     * @override
     * @returns {Object} O objeto JSON com as propriedades do comando.
     */
    toJSON() {
        const baseJson = super.toJSON();

        return {
            ...baseJson,
            debug: this.debug,
            disabled: this.disabled
        };
    }
}
