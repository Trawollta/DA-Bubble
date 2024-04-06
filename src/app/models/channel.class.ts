import { User } from "./user.class";

//import { User } from "./user.class";
export class channel {

    channelName: string;
    description: string;
    creator: string;
    id:string;
    chatId: string;
    /* members: User[]; */
    channelMember: {
        userId: string
    }[];

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.channelName = obj ? obj.channelName : '';
        this.description = obj ? obj.description : '';
        this.chatId = obj ? obj.chatId : '';
        this.creator = obj ? obj.creator : ''; // hier kommt die active UserId rein
        this.channelMember = obj && obj.channelMember ? obj.channelMember : [{
            userId: ''
        }]
      /*   this.members = obj && obj.members ? obj.members.map((member: any) => new User(member)) : []; */

    }
}