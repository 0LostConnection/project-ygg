export default class EventStructure {
    constructor(client, options) {
        this.client = client
        this.name = options.name
        this.disabled = options.disabled
    }
}
