export class ChatUsers {
    messages:[{
        message: string,
        timestamp: number,
        userId: string
    }];
    userId1: string;
    userId2: string;

    constructor(obj?: any) {
        this.messages = obj && obj.messages ? obj.messages : [{
            message: '',
            timestamp: 0,
            userId: ''
        }];
        this.userId1 = obj ? obj.userId1 : '';
        this.userId2 = obj ? obj.userId2 : '';
    }
}