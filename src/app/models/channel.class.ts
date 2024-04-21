
export class channel {

    channelName: string;
    description: string;
    creator: string;
    id:string;
    chatId: string;
    channelMember: {
        userId: string
    }[];

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.channelName = obj ? obj.channelName : '';
        this.description = obj ? obj.description : '';
        this.chatId = obj ? obj.chatId : '';
        this.creator = obj ? obj.creator : ''; 
        this.channelMember = obj && obj.channelMember ? obj.channelMember : [{
            userId: ''
        }]
      

    }
}