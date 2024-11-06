import { EmbedBuilder } from "@discordjs/builders";
import { GuildMember } from "discord.js";

export default class LogEmbedBuilder {
    constructor() {
        this.embed = new EmbedBuilder()
            .setColor(0xE7DDFF);
    }

    /**
     * Define o autor do embed com base no membro fornecido.
     * @param {GuildMember} member - O membro do Discord que executou a ação.
     * @returns {LogEmbedBuilder} A instância atualizada do LogEmbedBuilder.
     */
    setAuthor(member) {
        this.embed.setAuthor({
            name: member.displayName,
            iconURL: member.displayAvatarURL()
        });
        return this;
    }

    /**
     * Define o conteúdo do embed com base na ação e dados fornecidos.
     * @param {String} acao - (Obrigatório) O comando que o bot executa.
     * @param {Object} [categoriaData] - Dados da categoria.
     * @param {String} categoriaData.nomeCategoria - Nome da categoria.
     * @param {String} categoriaData.idCategoria - ID da categoria.
     * @param {Object} [itemData] - Dados do item.
     * @param {String} itemData.nomeItem - Nome do item.
     * @param {String} itemData.idItem - ID do item.
     * @param {Number} itemData.quantidadeItemAntiga - A quantidade do item antiga, se aplicável.
     * @param {Number} itemData.quantidadeItem - A quantidade do item atual, se aplicável.
     * @param {String} [operacao=''] - A operação executada (usada apenas para 'atualizar-item').
     * @returns {LogEmbedBuilder} A instância atualizada do LogEmbedBuilder.
     */
    setAction(acao, categoriaData = {}, itemData = {}, operacao = '') {
        // Configura o título do embed com base na ação
        this.embed.setTitle(`Ação: ${acao}`);

        // Verifica qual ação foi executada e adiciona os campos apropriados ao embed
        switch (acao) {
            case 'adicionar-item':
                this.embed.addFields(
                    { name: 'Item', value: itemData.nomeItem || 'Desconhecido', inline: true },
                    { name: 'Quantidade', value: String(itemData.quantidadeItem), inline: true },
                    { name: 'Categoria', value: categoriaData.nomeCategoria || 'Desconhecida', inline: true }
                );
                break;

            case 'atualizar-item':
                this.embed.addFields(
                    { name: 'Categoria', value: categoriaData.nomeCategoria || 'Desconhecida', inline: true },
                    { name: 'Item', value: itemData.nomeItem || 'Desconhecido', inline: true },
                    { name: 'Quantidade Antiga', value: String(itemData.quantidadeItemAntiga), inline: true },
                    { name: 'Quantidade Atual', value: String(itemData.quantidadeItem), inline: true },
                    { name: 'Operação', value: operacao || 'Não especificada', inline: true }
                );
                break;

            case 'criar-categoria':
                this.embed.addFields(
                    { name: 'Nome da Categoria', value: categoriaData.nomeCategoria || 'Desconhecida', inline: true },
                    { name: 'Id da Categoria', value: categoriaData.idCategoria.toString() || 'Desconhecida', inline: true }
                );
                break;

            case 'remover-item':
                this.embed.addFields(
                    { name: 'Categoria', value: categoriaData.nomeCategoria || 'Desconhecida', inline: true },
                    { name: 'Item', value: itemData.nomeItem || 'Desconhecido', inline: true }
                );
                break;

            case 'ver-estoque':
                this.embed.addFields(
                    { name: 'Categoria', value: categoriaData.nomeCategoria || 'Desconhecida', inline: true }
                );
                break;

            default:
                this.embed.addFields(
                    { name: 'Erro', value: 'Ação inválida ou dados ausentes.' }
                );
                break;
        }
        return this;
    }

    /**
     * Retorna o embed finalizado.
     * @returns {EmbedBuilder} O embed configurado.
     */
    build() {
        return this.embed;
    }
}
