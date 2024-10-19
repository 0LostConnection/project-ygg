import hexToDecimal from "./hexToDecimal.js"
import { EmbedBuilder } from "@discordjs/builders"
import { GuildMember } from "discord.js"

/**
 * @param {string} projectName
 * @param {GuildMember} author
 */
export function newProjectEmbedMessage(projectName, author) {
    return new EmbedBuilder()
        .setColor(hexToDecimal("5bff81"))
        .setTitle(`Novo Projeto: \`${projectName}\`! 😁`)
        .setFooter({
            text: `Por: ${author.displayName}`,
            iconURL: author.avatarURL(),
        })
}

/**
 * @param {string} projectName
 * @param {GuildMember} author
 */
export function finishedProjectEmbedMessage(projectName, author) {
    return new EmbedBuilder()
        .setColor(hexToDecimal("5bff81"))
        .setTitle(`Projeto: \`${projectName}\` concluído! 🎉`)
        .setFooter({
            text: `Por: ${author.displayName}`,
            iconURL: author.avatarURL(),
        })
}

/**
 * @param {string} projectName
 * @param {GuildMember} author
 */
export function openedProjectEmbedMessage(projectName, author) {
    return new EmbedBuilder()
        .setColor(hexToDecimal("5bff81"))
        .setTitle(`Projeto: \`${projectName}\` aberto novamente! 😁`)
        .setFooter({
            text: `Por: ${author.displayName}`,
            iconURL: author.avatarURL(),
        })
}

/**
 * @param {string} projectName
 * @param {GuildMember} author
 */
export function archivedProjectEmbedMessage(projectName, author) {
    return new EmbedBuilder()
        .setColor(hexToDecimal("ff815b"))
        .setTitle(`Projeto: \`${projectName}\` arquivado! 😕`)
        .setFooter({
            text: `Por: ${author.displayName}`,
            iconURL: author.avatarURL(),
        })
}
