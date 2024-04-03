export class User {
    name: string;
    email: string;
    isActive: boolean;//"Aktiv" | "Abwesend";
    img: string;
    relatedChats:string[];

    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.isActive = obj ? obj.isActive : '';
        this.img = obj ? obj.img : '';
        this.relatedChats = obj && obj.relatedChats ? obj.relatedChats:[];

    }
}