import { Role } from "./role";

export class User {
  id!: number;
  token!:string;
  login!:string;
  roles!:Array<Role>;
  surname!:string;
  name!:string;
  patronymic!:string;
  active!:boolean;
  password!:string;
  passwordAccept!:string;
  paymentStatus!:boolean;

  childBirthday!:Date;
  childSerialId!:string;
  childNumberId!:string;
  childDepId!:string;
  childDateId!:Date;
  childSerialCert!:string;
  childNumberCert!:string;
  childDateCert!:Date;

  parentContact!:string;
  parentFio!:string;
  parentBirthday!:Date;
  parentAddress!:string;
  parentSerialId!:string;
  parentNumberId!:string;
  parentDepId!:string;
  parentDateId!:Date;

  constructor(user:any){
    this.id = user.id;
    this.token = user.token;
    this.login = user.login;
    this.roles = user.roles;
    this.surname = user.surname;
    this.name = user.name;
    this.patronymic = user.patronymic;
    this.active = user.active;
    this.paymentStatus = user.paymentStatus;

    this.parentContact = user.parentContact;
    this.parentFio = user.parentFio;
    this.parentBirthday = user.parentBirthday;
    this.parentAddress = user.parentAddress;
    this.parentSerialId = user.parentSerialId;
    this.parentNumberId = user.parentNumberId;
    this.parentDepId = user.parentDepId;
    this.parentDateId = user.parentDateId;

    this.childBirthday = user.childBirthday;
    this.childSerialId = user.childSerialId;
    this.childNumberId = user.childNumberId;
    this.childDepId = user.childDepId;
    this.childDateId = user.childDateId;
    this.childSerialCert = user.childSerialCert;
    this.childNumberCert = user.childNumberCert;
    this.childDateCert = user.childDateCert;
  }

}
