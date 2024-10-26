import { EmbedBuilder } from "@discordjs/builders";
import { RestOrArray } from "discord.js"
import { APIEmbedField } from "discord-api-types/v10"

/**
 * Classe para criar embeds de erro personalizados para mensagens no Discord.
 * Utiliza o EmbedBuilder para configurar uma mensagem de erro com cor e descrição.
 */
export class ErrorEmbed {
    /**
     * Construtor para a classe ErrorEmbed.
     * @param {string} message - A mensagem descritiva do erro.
     * @param {string} [error] - (Opcional) Detalhes específicos da mensagem de erro, que será exibida em um campo adicional.
     */
    constructor(message, error) {
        let embed = new EmbedBuilder()
            .setColor(4009202) // Define a cor do embed
            .setDescription(message) // Define a descrição principal do embed

        if (error) {
            // Adiciona um campo com detalhes do erro, se especificado
            embed.addFields({
                name: "Mensagem de Erro:",
                value: error
            })
            embed.setColor(15871037) // Altera a cor se um erro for fornecido
        }
        return embed;
    }
}

/**
 * Classe para criar embeds de sucesso personalizados para mensagens no Discord.
 * Utiliza o EmbedBuilder para configurar uma mensagem de sucesso com cor e descrição.
 */
export class SuccessEmbed {
    /**
     * Construtor para a classe SuccessEmbed.
     * @param {string} message - A mensagem de sucesso a ser exibida.
     */
    constructor(message) {
        let embed = new EmbedBuilder()
            .setColor(6218828) // Define a cor do embed
            .setDescription(message) // Define a descrição principal do embed

        return embed;
    }
}

/**
 * Classe para criar embeds de pergunta personalizados para mensagens no Discord.
 * Utiliza o EmbedBuilder para configurar uma mensagem de pergunta com cor e descrição.
 */
export class QuestionEmbed {
    /**
     * Construtor para a classe QuestionEmbed.
     * @param {string} message - A mensagem da pergunta a ser exibida.
     */
    constructor(message) {
        let embed = new EmbedBuilder()
            .setColor(11489267) // Define a cor do embed
            .setDescription(message) // Define a descrição principal do embed

        return embed;
    }
}

/**
 * Classe para criar embeds de estoque de produtos personalizados para mensagens no Discord.
 * Utiliza o EmbedBuilder para configurar uma mensagem de estoque com cor, descrição e campos personalizados.
 */
export class ProductStockEmbed {
    /**
     * Construtor para a classe ProductStockEmbed.
     * @param {string} message - A mensagem descritiva do estoque a ser exibida.
     * @param {RestOrArray<APIEmbedField>} fields - Um array de objetos representando os campos a serem adicionados ao embed. 
     *                                  Cada objeto deve ter `name` e `value` como propriedades.
     */
    constructor(message, fields) {
        let embed = new EmbedBuilder()
            .setColor(14581094) // Define a cor do embed
            .setDescription(message) // Define a descrição principal do embed
            .setFields(fields) // Adiciona os campos ao embed

        return embed;
    }
}