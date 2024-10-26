import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "@discordjs/builders";


export default class CustomSelectMenu {
    /**
     * Construtor da classe CustomSelectMenu.
     * @param {string} customId - O ID personalizado que será usado para identificar o menu de seleção.
     * @param {string} placeholder - O texto exibido quando nenhuma opção está selecionada.
     * @param {Array<{ label: string, value: string }>} data - Um array de objetos contendo `label` e `value` para cada opção do menu.
     * @returns {ActionRowBuilder} Um objeto `ActionRowBuilder` configurado com o menu de seleção como componente.
     * 
     * @example
     * const selectMenu = new CustomSelectMenu('menu-id', 'Escolha uma opção', [
     *   { label: 'Opção 1', value: 'opcao1' },
     *   { label: 'Opção 2', value: 'opcao2' }
     * ]);
     * // Retorna um `ActionRowBuilder` configurado com um `StringSelectMenuBuilder` como componente.
     */
    constructor(customId, placeholder, data) {
        let selectMenu = new StringSelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder(placeholder)

        data.forEach(obj => {
            selectMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(obj.label)
                    .setValue(obj.value)
            )
        })

        return new ActionRowBuilder().addComponents(selectMenu)
    }
}