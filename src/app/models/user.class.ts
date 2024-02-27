export class User {
    id?:string;
    name: string;
    email: string;
    active: boolean;//"Aktiv" | "Abwesend";
    img: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.active = obj ? obj.active : ''; //Alex 27.2.24--changed from status to active because it is only a boolean
        this.img = obj ? obj.img : '';

    }



}