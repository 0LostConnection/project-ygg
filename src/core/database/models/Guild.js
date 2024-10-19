import { Schema, model } from "mongoose"

const guildSchema = new Schema({
    _id: String,
    setup: {
        roles: {
            staffRole: {
                id: Number,
            },
            adminRole: {
                id: Number,
            },
            modRole: {
                id: Number,
            },
            eventsModRole: {
                id: Number,
            },
            boostersRole: {
                id: Number,
            },
        },
    },
})

export default model("guilds", guildSchema)
