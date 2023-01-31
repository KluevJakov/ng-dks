import { Role } from "./role";

export class User {
  id!: number;
  token!:string;
  login!:string;
  role!:Array<Role>;
  surname!:string;
  name!:string;
  patronymic!:string;
  parentPhone!:string;

  constructor(user:any){
    this.id = user.id;
    this.token = user.token;
    this.login = user.login;
    this.role = user.roles;
    this.surname = user.surname;
    this.name = user.name;
    this.patronymic = user.patronymic;
    this.parentPhone = user.parentPhone;
  }
}
