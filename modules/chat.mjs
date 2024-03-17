import DBManager from "./storageManager.mjs";

class Chat {

    constructor() {

        this.sender;
        this.receiver;
        this.text;
        this.id
    }
    
    async save() {


        if (this.id == null) {
            return await DBManager.createChat(this);
        } else {
            return await DBManager.updateChat(this);
        }
    }

    async delete() {

        await DBManager.deleteChat(this);
    }
}

export default Chat;
