export class channel {

    channelName: string;
    memberId: [];

    constructor(obj?: any) {
        this.channelName = obj ? obj.channelName : '';
        this.memberId = []; 

    }
}