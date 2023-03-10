import { Role } from "./role";

export class User {
  id!: number;
  token!:string;
  login!:string;
  roles!:Array<Role>;
  surname!:string;
  name!:string;
  patronymic!:string;
  contact!:string;
  email!:string;
  active!:boolean;
  password!:string;
  passwordAccept!:string;
  paymentStatus!:boolean;

  constructor(user:any){
    this.id = user.id;
    this.token = user.token;
    this.login = user.login;
    this.roles = user.roles;
    this.surname = user.surname;
    this.name = user.name;
    this.patronymic = user.patronymic;
    this.contact = user.contact;
    this.email = user.email;
    this.active = user.active;
    this.paymentStatus = user.paymentStatus;
  }

}
