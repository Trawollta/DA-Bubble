export class User {
    name: string;
    email: string;
    status: "Aktiv" | "Abwesend";
    img: string;

    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.status = obj ? obj.status : '';
        this.img = obj ? obj.img : '';

    }



}