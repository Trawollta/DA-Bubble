import { User } from "./user.class";
export class channel {

    channelName: string;
    description: string;
    creator: User | null; 
    members: User[];

    constructor(obj?: any) {
        this.channelName = obj ? obj.channelName : '';
        this.description = obj ? obj.description : '';
        this.creator = obj && obj.creator ? new User(obj.creator) : null;
        this.members = obj && obj.members ? obj.members.map((member: any) => new User(member)) : [];

    }
}