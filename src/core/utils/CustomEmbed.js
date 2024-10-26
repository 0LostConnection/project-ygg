import { EmbedBuilder } from "@discordjs/builders";

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
            embed.setColor(15871037)
        }
        return embed
    }
}

export class SuccessEmbed {
    constructor(message) {
        let embed = new EmbedBuilder()
            .setColor(6218828) // Define a cor do embed
            .setDescription(message) // Define a descrição principal do embed

        return embed
    }
}

export class QuestionEmebed {
    constructor(message) {
        let embed = new EmbedBuilder()
            .setColor(11489267) // Define a cor do embed
            .setDescription(message) // Define a descrição principal do embed

        return embed
    }
}

export class ProductStockEmbed {
    constructor(message, fields) {
        let embed = new EmbedBuilder()
            .setColor(11489267) // Define a cor do embed
            .setDescription(message) // Define a descrição principal do embed
            .setFields(fields)

        return embed
    }
}