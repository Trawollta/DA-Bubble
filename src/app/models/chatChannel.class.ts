export class ChatChannel {
    relatedChannelId: string;
    messages: [{
        answerto: string,
        message: string,
        timestamp: number,
        userID: string
    }]


    constructor(obj?: any) {
        this.relatedChannelId  = obj ? obj.relatedChannelId : '';
        this.messages = obj && obj.messages ? obj.messages : [{
            answerto: '',
            message: '',
            timestamp: 0,
            userId: ''
        }];
    }
}