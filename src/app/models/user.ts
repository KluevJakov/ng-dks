import { Role } from "./role";

export class User {
  id!: number;
  token!:string;
  login!:string;
  role!:Array<Role>;

  constructor(user:any){
    this.id = user.id;
    this.token = user.token;
    this.login = user.login;
    this.role = user.roles;
  }
}
