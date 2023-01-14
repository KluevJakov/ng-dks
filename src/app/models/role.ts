export class Role {
  id!: number;
  displayName!:string;
  systemName!:string;

  constructor(user:any){
    this.id = user.id;
    this.displayName = user.displayName;
    this.systemName = user.systemName;
  }
}
