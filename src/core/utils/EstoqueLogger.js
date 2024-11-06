import { Embed, WebhookClient } from "discord.js";

export default class EstoqueLogger {
    constructor(webhookUrl) {
        this.webhookClient = new WebhookClient({ url: webhookUrl })
    }

    /**
     * 
     * @param {Embed} embed 
     */
    log(embed) {
        this.webhookClient.send({
            embeds: [embed]
        })
    }
}