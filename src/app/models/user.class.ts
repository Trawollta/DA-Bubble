export class User {
    name: string;
    email: string;
    isActive: boolean;//"Aktiv" | "Abwesend";
    img: string;
    relatedChats:string[];
    checked?: boolean;

    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.isActive = obj ? obj.isActive : '';
        this.img = obj?.img || 'assets/img/avatars/default.svg'; 
        this.relatedChats = obj && obj.relatedChats ? obj.relatedChats:[];
        this.checked = obj?.checked || false;

    }
}