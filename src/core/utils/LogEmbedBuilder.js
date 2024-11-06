import { EmbedBuilder } from "@discordjs/builders"
import { GuildMember } from "discord.js"

export default class LogEmbedBuilder {
    static embed = new EmbedBuilder()
        .setColor(0xE7DDFF)

    constructor() { }

    /**
     * 
     * @param {GuildMember} member 
     */
    setAuthor(member) {
        LogEmbedBuilder.embed.setAuthor({
            name: member.displayName,
            iconURL: member.displayAvatarURL()
        })
        return this
    }

    /**
     * Define o conteúdo do embed com base na ação e dados fornecidos.
     * @param {String!} acao - (Obrigatório) O comando que o bot executa.
     * @param {String} [categoria] - A categoria do item, se aplicável.
     * @param {String} [item] - O nome do item, se aplicável.
     * @param {Number} [quantidade] - A quantidade do item, se aplicável.
     * @param {String} [operacao] - A operação executada (usada apenas para 'atualizar-item').
     */
    setAction(comando, categoria = '', item = '', quantidade = 0, opercomando = '') {
        // Configura o título do embed com base na ação
        LogEmbedBuilder.embed.setTitle(`Ação: ${comando}`)

        // Verifica qual ação foi executada e adiciona os campos apropriados ao embed
        switch (comando) {
            case 'adicionar-item':
                LogEmbedBuilder.embed.addFields(
                    { name: 'Item', value: item, inline: true },
                    { name: 'Quantidade', value: String(quantidade), inline: true },
                    { name: 'Categoria', value: categoria, inline: true }
                )
                break

            case 'atualizar-item':
                LogEmbedBuilder.embed.addFields(
                    { name: 'Categoria', value: categoria, inline: true },
                    { name: 'Item', value: item, inline: true },
                    { name: 'Quantidade', value: String(quantidade), inline: true },
                    { name: 'Operação', value: opercomando, inline: true }
                )
                break

            case 'criar-categoria':
                LogEmbedBuilder.embed.addFields(
                    { name: 'Nome da Categoria', value: categoria, inline: true }
                )
                break

            case 'remover-item':
                LogEmbedBuilder.embed.addFields(
                    { name: 'Categoria', value: categoria, inline: true },
                    { name: 'Item', value: item, inline: true }
                )
                break

            case 'ver-estoque':
                LogEmbedBuilder.embed.addFields(
                    { name: 'Categoria', value: categoria, inline: true }
                )
                break

            default:
                LogEmbedBuilder.embed.addFields(
                    { name: 'Erro', value: 'Ação inválida ou dados ausentes.' }
                )
                break
        }
        return this
    }


    /**
     * Retorna o embed finalizado.
     * 
     * @returns {EmbedBuilder} O embed configurado.
     */
    build() {
        return LogEmbedBuilder.embed
    }
}