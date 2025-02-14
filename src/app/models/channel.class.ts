export class Channel {
    id: string;
    name: string;  
    description: string;
    chatId: string;
    creator: { id: string; username: string }; 
    participants: { id: string; username: string }[];

    constructor(obj?: any) {
        this.id = obj?.id || '';
        this.name = obj?.name || '';  
        this.description = obj?.description || '';
        this.chatId = obj?.chatId || '';
        this.creator = obj?.creator || { id: '', username: '' };
        this.participants = obj?.participants || [];
    }
}
