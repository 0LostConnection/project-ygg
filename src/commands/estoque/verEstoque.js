import CommandStructure from "../../core/structures/CommandStructure"
import { CommandInteraction } from "discord.js"
import EstoqueDB from "../../core/database/EstoqueDB"
import CustomSelectMenu from "../../core/utils/customSelectMenu"

export default class extends CommandStructure {
    constructor(interaction) {
        super(interaction, {
            name: "ver-estoque",
            description: "Ver estoque",
            dm_permission: false,
            debug: true,
        })
    }
    /**
    * @param {CommandInteraction} interaction
    **/
    run = async (interaction) => {
        await interaction.deferReply()

        const db = new EstoqueDB(process.env.MONGODB_URI)
        await db.connect()

        const categorias = await db.listarCategorias()
            
        if (!categorias.success) {
            return interaction.editReply(`${categorias.message}`)
        }

        const selectMenu = new CustomSelectMenu("estoque:categorias", "Escolha uma categoria.", categorias.data?.map(obj => ({ label: obj.nome, value: obj.id.toString() })))
        
        interaction.editReply({ content: "Escolha uma categoria:", components: [selectMenu] })

        await db.disconnect()

    }
}